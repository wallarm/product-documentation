# Deploying Wallarm Sidecar proxy 2.0

To secure an application deployed as a Pod in a Kubernetes cluster, you can run Wallarm in front of the application as a sidecar controller. Wallarm sidecar controller will filter incoming traffic to the application Pod by allowing only legitimate requests and mitigating malicious ones.

<!-- ## Traffic flow -->
<!-- schemes -->

## Solution acrhitecture

The Wallarm Sidecar proxy solution runs the following components in a Kubernetes pod:

* **Sidecar controller** is the [mutating webhook admission controller](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/) that injects Wallarm sidecar proxy resources into the Pod, provides configuration based on the Helm chart values and pod annotations and performs the initial traffic processing.
* **Postanalytics module** is the local data analytics backend for the Wallarm sidecar proxy solution. The module uses the in-memory storage Tarantool and the set of some helper containers.

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
1. Deploy the Wallarm Sidecar proxy to Kubernetes Pod.
1. Attach the Wallarm Sidecar proxy to the application Pod.
1. Test the Wallarm Sidecar proxy operation.

### Step 1: Create the Wallarm node

1. Open Wallarm Console → **Nodes** via the link below:

    * https://us1.my.wallarm.com/nodes for the US Cloud
    * https://my.wallarm.com/nodes for the EU Cloud
1. Create a filtering node with the **Wallarm node** type and copy the generated token.
    
    ![!Creation of a Wallarm node](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### Step 2: Deploy the Wallarm Sidecar proxy to Kubernetes Pod

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
1. Deploy the Wallarm Sidecar proxy to a Kubernetes pod:

    ``` bash
    helm install --version 1.0.1 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` is the name for the Wallarm Sidecar proxy release
    * `<KUBERNETES_NAMESPACE>` is the namespace to deploy the Wallarm Sidecar proxy to
    * `<PATH_TO_VALUES>` is the path to the `values.yaml` file

### Step 3: Attach the Wallarm Sidecar proxy to the application Pod

For Wallarm to filter application traffic, add the `wallarm-sidecar: enabled` label to the corresponding application Pod, e.g.:
    
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

1. Get the list of Kubernetes pods:

    ```bash
    kubectl get pods
    ```

    As for the `wallarm-*` pods, each pod should display the following: **READY: N/N** and **STATUS: Running**, e.g.:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar1-controller-54cf88b989-f7jtb      1/1     Running   0          91m
    wallarm-sidecar1-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar1-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
2. Send the test [SQLI](../../../attacks-vulns-list.md#sql-injection) and [XSS](../../../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the application cluster address Wallarm is enabled to filter traffic:

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
