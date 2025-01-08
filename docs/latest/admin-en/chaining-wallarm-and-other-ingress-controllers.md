[node-token-types]:                      ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-ing-create-node-img]:             ../images/user-guides/nodes/create-wallarm-node-name-specified.png

# Chaining of the Wallarm and additional Ingress Controllers in the same Kubernetes cluster

These instructions provide you with the steps to deploy the Wallarm Ingress controller to your K8s cluster and chain it with other Controllers that are already running in your environment.

## The issue addressed by the solution

Wallarm offers its node software in different form-factors, including [Ingress Controller built on top of the Community Ingress NGINX Controller](installation-kubernetes-en.md).

If you already use an Ingress controller, it might be challenging to replace the existing Ingress controller with the Wallarm controller (e.g. if using AWS ALB Ingress Controller). In this case, you can explore the [Wallarm Sidecar solution](../installation/kubernetes/sidecar-proxy/deployment.md) but if it also does not fit your infrastructure, it is possible to chain several Ingress controllers.

Ingress controller chaining enables you to utilize an existing controller to get end-user requests to a cluster, and deploy an additional Wallarm Ingress controller to provide necessary application protection.

## Requirements

* Kubernetes platform version 1.24-1.30
* [Helm](https://helm.sh/) package manager
* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts. Ensure the access is not blocked by a firewall
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`. Make sure the access is not blocked by a firewall
* Access to the IP addresses below for downloading updates to attack detection rules and [API specifications](../api-specification-enforcement/overview.md), as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted](../user-guides/ip-lists/overview.md) countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* Deployed Kubernetes cluster running an Ingress controller

## Deploying the Wallarm Ingress controller and chaining it with an additional Ingress Controller

To deploy the Wallarm Ingress controller and chain it with additional controllers:

1. Deploy the official Wallarm controller Helm chart using an Ingress class value different from the existing Ingress controller.
1. Create the Wallarm-specific Ingress object with:

    * The same `ingressClass` as specified in `values.yaml` of Wallarm Ingress Helm chart.
    * Ingress controller requests routing rules configured in the same way as the existing Ingress controller.

    !!! info "Wallarm Ingress controller will not be exposed outside the cluster"
        Please note that the Wallarm Ingress controller uses `ClusterIP` for its service, which means it will not be exposed outside the cluster.
1. Reconfigure the existing Ingress controller to forward incoming requests to the new Wallarm Ingress controller instead of application services.
1. Test the Wallarm Ingress controller operation.

### Step 1: Deploy the Wallarm Ingress controller

1. Generate a filtering node token of the [appropriate type][node-token-types]:

    === "API token (Helm chart 4.6.8 and above)"
        1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
        1. Find or create API token with the `Deploy` source role.
        1. Copy this token.
    === "Node token"
        1. Open Wallarm Console → **Nodes** in either the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
        1. Create a filtering node with the **Wallarm node** type and copy the generated token.
            
            ![Creation of a Wallarm node][nginx-ing-create-node-img]
1. Add the [Wallarm Helm charts repository](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update
    ```
1. Create the `values.yaml` file with the following Wallarm configuration:

    === "US Cloud"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            apiHost: us1.api.wallarm.com
            # nodeGroup: defaultIngressGroup
          config:
            use-forwarded-headers: "true"  
          ingressClass: wallarm-ingress
          ingressClassResource:
            name: wallarm-ingress
            controllerValue: "k8s.io/wallarm-ingress"
          service:
            type: ClusterIP
        nameOverride: wallarm-ingress
        ```
    === "EU Cloud"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
          config:
            use-forwarded-headers: "true"
          ingressClass: wallarm-ingress
          ingressClassResource:
            name: wallarm-ingress
            controllerValue: "k8s.io/wallarm-ingress"
          service:
            type: "ClusterIP"
        nameOverride: wallarm-ingress
        ```    
    
    * `<NODE_TOKEN>` is the Wallarm node token.
    * When using an API token, specify a node group name in the `nodeGroup` parameter. Your node will be assigned to this group, shown in the Wallarm Console's **Nodes** section. The default group name is `defaultIngressGroup`.

    To learn more configuration options, please use the [link](configure-kubernetes-en.md).
1. Install the Wallarm Ingress Helm chart:
    ``` bash
    helm install --version 5.2.12 internal-ingress wallarm/wallarm-ingress -n wallarm-ingress -f values.yaml --create-namespace
    ```

    * `internal-ingress` is the name of Helm release
    * `values.yaml` is the YAML file with Helm values created in the previous step
    * `wallarm-ingress` is the namespace where to install Helm chart (it will be created)
1. Verify that the Wallarm ingress controller is up and running: 

    ```bash
    kubectl get pods -n wallarm-ingress
    ```

    Each pod status should be **STATUS: Running** or **READY: N/N**. For example:

    ```
    NAME                                                             READY   STATUS    RESTARTS   AGE
    internal-ingress-wallarm-ingress-controller-6d659bd79b-952gl      3/3     Running   0          8m7s
    internal-ingress-wallarm-ingress-controller-wallarm-tarant64m44   4/4     Running   0          8m7s
    ```

### Step 2: Create Ingress object with Wallarm-specific `ingressClassName`

Create the Ingress object with the same `ingressClass` name as configured in `values.yaml` in the previous step.

Ingress object must be in the same namespace where your application is deployed, e.g.:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/wallarm-application: "1"
    nginx.ingress.kubernetes.io/wallarm-mode: monitoring
  name: myapp-internal
  namespace: myapp
spec:
  ingressClassName: wallarm-ingress
  rules:
  - host: www.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp
            port:
              number: 80
```

### Step 3: Reconfigure the existing Ingress controller to forward requests to Wallarm

Reconfigure the existing Ingress controller to forward incoming requests to the new Wallarm Ingress controller instead of application services as follows:

* Create the Ingress object with the `ingressClass` name to be `nginx`. Please note it is the default value, you can replace it by your own value if it differs. 
* Ingress object must be in the same namespace as Wallarm Ingress Chart, which is `wallarm-ingress` in our example.
* The value of `spec.rules[0].http.paths[0].backend.service.name` must be the name of the Wallarm Ingress controller service that is made up of the Helm release name and `.Values.nameOverride`.

    To get the name, you can use the following command:
   
    ```bash
    kubectl get svc -l "app.kubernetes.io/component=controller" -n wallarm-ingress -o=jsonpath='{.items[0].metadata.name}'
    ```

    In our example the name is `internal-ingress-wallarm-ingress-controller`.

The resulting configuration example:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-external
  namespace: wallarm-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: www.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: internal-ingress-wallarm-ingress-controller
                port:
                  number: 80
```

### Step 4: Test the Wallarm Ingress controller operation

Get Load Balancer public IP of existing external Ingress controller, e.g. let us consider it is deployed in the `ingress-nginx` namespace:

```bash
LB_IP=$(kubectl get svc -l "app.kubernetes.io/component=controller" -n ingress-nginx -o=jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

Send a test request to the existing Ingress controller address and verify that the system is working as expected:

```bash
curl -H "Host: www.example.com" ${LB_IP}/etc/passwd
```
