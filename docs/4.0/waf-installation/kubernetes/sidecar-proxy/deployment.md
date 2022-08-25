# Deploying Wallarm Sidecar proxy

To secure an application deployed as a Pod in a Kubernetes cluster, you can run Wallarm in front of the application as a sidecar controller. Wallarm sidecar controller will filter incoming traffic to the application Pod by allowing only legitimate requests and mitigating malicious ones.

The **key features** of the Wallarm Sidecar proxy solution:

* This security solution has the closest to the application deployment format that makes discrete microservices and their replicas and shards protection easy
* Wallarm sidecar proxy is fully compatible with any Ingress controller
* Works stable under high loads that is usually common for the service mesh approach
* Minimum service configuration required, just add some annotations and labels for the application pod to secure it
* Two supported modes of the Wallarm container deployment: for medium loads with the Wallarm services running in one container and for high loads with the Wallarm services split into several containers
* Dedicated entity for the postanalytics module that is the local data analytics backend for the Wallarm sidecar proxy solution consuming most of the CPU

!!! info "If you use the earlier Wallarm Sidecar solution"
    If you use the earlier Wallarm Sidecar solution, you are highly recommended to replace it with a new one. The new solution re-invents the previous one providing the separate easily integrated security component that does not require significant K8s manifest changes.

    For assistance during migration to the upgraded Wallarm Sidecar proxy solution, please contact the [Wallarm technical support](mailto:support@wallarm.com).

## Use cases

This solution is the recommended one for the following **use cases**:

* You are looking for the security solution to be deployed to the infrastructure with the existing Ingress controller (e.g. AWS ALB Ingress Controller) preventing you from the [Wallarm Ingress controller](../../../admin-en/installation-kubernetes-en.md) deployment
* Zero-trust environment that requires each microservice (including internal APIs) to be protected by the security solution
* The security solution should allow pods to reach VPCs to access your APIs
* The security solution should be compatible with third-party services routing your traffic like AWS API Gateway

## Traffic flow

Traffic flow without Wallarm Sidecar proxy:

![!Traffic flow without Wallarm Sidecar proxy](../../../images/waf-installation/kubernetes/sidecar-controller/traffic-flow-without-wallarm.png)

Traffic flow with Wallarm Sidecar proxy:

![!Traffic flow with Wallarm Sidecar proxy](../../../images/waf-installation/kubernetes/sidecar-controller/traffic-flow-with-wallarm.png)

## Solution acrhitecture

The Wallarm Sidecar proxy solution is arranged by the following Deployment objects:

* **Sidecar controller** (`wallarm-sidecar-controller`) is the [mutating webhook admission controller](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/) that:

    1. At the **initial** stage, injects Wallarm sidecar proxy resources into the Pod configuring it based on the Helm chart values and pod annotations and connecting the node components to the Wallarm Cloud.
    1. At the **runtime** stage, proxies/forwards requests and communicates with postanalytics module.

    Once a new pod (workload) in Kubernetes starts, the controller automatically injects the additional container into the pod. To start traffic analysis going to the pod, just add labels and annotations to the pod.
* **Postanalytics module** (`wallarm-sidecar-postanalytics`) is the local data analytics backend for the Wallarm sidecar proxy solution. The module uses the in-memory storage Tarantool and the set of some helper containers (like the collectd, attack export services).

![!Wallarm deployment objects](../../../images/waf-installation/kubernetes/sidecar-controller/deployment-objects.png)

## Requirements

* Kubernetes platform version 1.19-1.24
* [Helm v3](https://helm.sh/) package manager
* An application deployed as a Pod in a Kubernetes cluster
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. Make sure the access is not blocked by a firewall
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts. Make sure the access is not blocked by a firewall
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`. Make sure the access is not blocked by a firewall
* Access to [GCP storage addresses](https://www.gstatic.com/ipranges/goog.json) to download an actual list of IP addresses registered in [whitelisted, blacklisted, or greylisted](../../../user-guides/ip-lists/overview.md) countries, regions or data centers. Make sure the access is not blocked by a firewall
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or the [EU Cloud](https://my.wallarm.com/)

## Deployment

To deploy the Wallarm Sidecar proxy solution:

1. Create the Wallarm node.
1. Deploy the Wallarm Helm chart.
1. Attach the Wallarm Sidecar proxy to the application Pod.
1. Test the Wallarm Sidecar proxy operation.

### Step 1: Create the Wallarm node

1. Open Wallarm Console → **Nodes** via the link below:

    * https://us1.my.wallarm.com/nodes for the US Cloud
    * https://my.wallarm.com/nodes for the EU Cloud
1. Create a filtering node with the **Wallarm node** type and copy the generated token.
    
    ![!Creation of a Wallarm node](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### Step 2: Deploy the Wallarm Helm chart

1. Add the [Wallarm chart repository](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. Create the `values.yaml` file with the [Wallarm Sidecar proxy configuration](customization.md).

    Example of the file with the minimum configuration:

    === "US Cloud"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              host: "us1.api.wallarm.com"
        ```
    === "EU Cloud"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
        ```    
    
    `<NODE_TOKEN>` is the token of the Wallarm node to be run in Kubernetes.
1. Deploy the Wallarm Helm chart:

    ``` bash
    helm install --version 1.0.1 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` is the name for the Wallarm Sidecar proxy release
    * `wallarm-sidecar` is the new namespace to deploy the Wallarm Sidecar proxy to, it is recommended to deploy it to a separate namespace
    * `<PATH_TO_VALUES>` is the path to the `values.yaml` file

### Step 3: Attach the Wallarm Sidecar proxy to the application Pod

For Wallarm to filter application traffic, add the `wallarm-sidecar: enabled` label to the corresponding application Pod:

```bash
kubectl edit deployment -n <KUBERNETES_NAMESPACE> <APP_DEPLOYMENT_NAME>
```

```yaml hl_lines="15"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

* If the `wallarm-sidecar` application Pod label is either set to `disabled` or not explicitly specified, Wallarm does not filter traffic.
* If the `wallarm-sidecar` application Pod label is set to `enabled`, Wallarm filters incoming traffic.

### Step 4: Test the Wallarm Sidecar proxy operation

To test that the Wallarm Sidecar proxy operates correctly:

1. Get the Wallarm pod details to check they have been successfully started:

    ```bash
    kubectl get pods -n wallarm-sidecar
    ```

    As for the `wallarm-*` pods, each pod should display the following: **READY: N/N** and **STATUS: Running**, e.g.:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-f7jtb      1/1     Running   0          91m
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Get the application pod details to check the Wallarm sidecar controller has been successfully injected:

    ```bash
    kubectl get pods --selector app=<APP_DEPLOYMENT_NAME>
    ```

    The output should display **READY: 2/2** pointing to successful sidecar container injection and **STATUS: Running** pointing to successful connection to the Wallarm Cloud:

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    myapp-5c48c97b66-lzkwf   2/2     Running   0          3h4m
    ```
1. Send the test [SQLI](../../../attacks-vulns-list.md#sql-injection) and [XSS](../../../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the application cluster address Wallarm is enabled to filter traffic:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    Since the Wallarm proxy operates in the **monitoring** [filtration mode](../../../admin-en/configure-wallarm-mode.md) by default, the Wallarm node will not block attacks but will register them.

    To check that attacks have been registered, proceed to Wallarm Console → **Events**:

    ![!Attacks in the interface](../../../images/admin-guides/test-attacks-quickstart.png)

## Customization

Wallarm pods have been injected based on the [default `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) and the custom configuration you specified on the 2nd deployment step.

You can customize the Wallarm proxy behavior even more on both the global and per-pod levels and get the most out of Wallarm API Security for your company.

Just proceed to the [Wallarm proxy solution customization guide](customization.md).
