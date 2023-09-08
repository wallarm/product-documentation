# Chaining of the Wallarm and additional Ingress Controllers in the same Kubernetes cluster

These instructions provide you with the steps to deploy the Wallarm Ingress controller to your K8s cluster using Helm when there are other non-Ingress controllers deployed (e.g. AWS ALB Ingress Controller which is not supported by Wallarm).

## The issue addressed by the solution

Wallarm offers its node software in different form-factors, including a [Kubernetes Ingress Controller built on top of the Community Ingress NGINX Controller](installation-kubernetes-en.md).

If you already use a non-NGINX Ingress controller, it might be challenging to replace the existing Ingress controller with the Wallarm controller. Fortunately, it is possible to chain several Ingress controllers that enable you to utilize an existing controller to get end-user requests to a cluster, and deploy an additional Wallarm Ingress controller to provide necessary application protection.

## Requirements

* Kubernetes platform version 1.21 and lower
* [Helm](https://helm.sh/) package manager
* Access to the account with the **Administrator** role in Wallarm Console for the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* Access to `https://api.wallarm.com:444` for working with EU Wallarm Cloud or to `https://us1.api.wallarm.com:444` for working with US Wallarm Cloud
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts. Ensure the access is not blocked by a firewall
* Deployed Kubernetes cluster running an Ingress controller

## Deploying the Wallarm Ingress controller and chaining it with an additional Ingress Controller

To deploy the Wallarm Ingress controller and chain it with additional controllers:

1. Deploy the official Wallarm controller Helm chart using an Ingress class value different from the existing Ingress controller.
1. Create the Wallarm-specific Ingress object with:

    * The Ingress class similar to the value in the Wallarm Ingress controller configuration.
    * External ELB/ALB load balancers disabled, so the Wallarm Ingress controller will be not exposed to the Internet.
    * Ingress controller requests routing rules configured in the same way as the existing Ingress controller.
1. Reconfigure the existing Ingress controller to forward incoming requests to the new Wallarm Ingress controller instead of application services.
1. Test the Wallarm Ingress controller operation.

### Step 1: Deploy the Wallarm Ingress controller

1. Go to Wallarm Console → **Nodes** via the link below:
    * https://my.wallarm.com/nodes for the EU Cloud
    * https://us1.my.wallarm.com/nodes for the US Cloud
1. Create a filtering node with the **Wallarm node** type and copy the generated token.
    
    ![Creation of a Wallarm node](../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. Clone the repository of Wallarm Helm chart:
    ```
    git clone https://github.com/wallarm/ingress-chart --branch 2.18.1-8 --single-branch
    ```
1. Create the new K8s namespace, e.g. `wallarm-ingress`:

    ```bash
    kubectl create namespace wallarm-ingress
    ```
1. Install the Wallarm packages:

    === "EU Cloud"
        ```bash
        helm install <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress \
        -n wallarm-ingress \
        --set controller.wallarm.enabled=true \
        --set controller.wallarm.token=<NODE_TOKEN> \
        --set controller.electionID=wallarm-ingress-controller-leader \
        --set controller.ingressClass=wallarm-ingress \
        --set controller.service.type=ClusterIP \
        --set nameOverride=wallarm-ingress
        ``` 
    === "US Cloud"
        ```bash
        helm install <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress \
        -n wallarm-ingress \
        --set controller.wallarm.enabled=true \
        --set controller.wallarm.token=<NODE_TOKEN> \
        --set controller.wallarm.apiHost=us1.api.wallarm.com \
        --set controller.electionID=wallarm-ingress-controller-leader \
        --set controller.ingressClass=wallarm-ingress \
        --set controller.service.type=ClusterIP \
        --set nameOverride=wallarm-ingress
        ```
    
    * `<INGRESS_CONTROLLER_NAME>` is the name for the Wallarm Ingress controller.
    * `<NODE_TOKEN>` is the Wallarm node token.

    To learn more configuration options, please use the [link](configure-kubernetes-en.md).
1. Verify that the Wallarm ingress controller is up and running: 

    ```bash
    kubectl get pods -A|grep wallarm
    ```

    Each pod status should be **STATUS: Running** or **READY: N/N**. For example:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   8/8       Running   0          5m
    ingress-controller-nginx-ingress-default-backend-584ffc6c7xj5xx   1/1       Running   0          5m
    ```

### Step 2: Create the Wallarm-specific Ingress object

Create the Wallarm-specific Ingress object, e.g.:

```bash
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/wallarm-instance: "1"
    nginx.ingress.kubernetes.io/wallarm-mode: monitoring
    kubernetes.io/ingress.class: "wallarm-ingress"
  name: wallarm-ingress
  namespace: default
spec:
  rules:
  - host: www.example.com
    http:
      paths:
      - backend:
          serviceName: myapp
          servicePort: 80
        path: /
```

### Step 3: Reconfigure the existing Ingress controller to forward requests to Wallarm

Reconfigure the existing Ingress controller to forward incoming requests to the new Wallarm Ingress controller instead of application services, e.g.:

```bash
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
  name: nginx-ingress
  namespace: wallarm-ingress
spec:
  rules:
    - host: www.example.com
      http:
        paths:
          - backend:
              serviceName: wallarm-ingress-controller
              servicePort: 80
            path: /
```

### Step 4: Test the Wallarm Ingress controller operation

Send a test request to the existing Ingress controller address and verify that the system is working as expected:

```bash
curl http://<INGRESS_CONTROLLER_IP>/?id='or+1=1--a-<script>prompt(1)</script>'
```
