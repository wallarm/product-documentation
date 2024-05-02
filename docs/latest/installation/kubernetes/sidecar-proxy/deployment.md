# Deploying Wallarm Sidecar

To secure an application deployed as a Pod in a Kubernetes cluster, you can run the NGINX-based Wallarm node in front of the application as a sidecar controller. Wallarm sidecar controller will filter incoming traffic to the application Pod by allowing only legitimate requests and mitigating malicious ones.

The **key features** of the Wallarm Sidecar solution:

* Simplifies protection of discrete microservices and their replicas and shards by providing the deployment format that is similar to applications
* Fully compatible with any Ingress controller
* Works stable under high loads that is usually common for the service mesh approach
* Requires minimum service configuration to secure your apps; just add some annotations and labels for the application pod to protect it
* Supports two modes of the Wallarm container deployment: for medium loads with the Wallarm services running in one container and for high loads with the Wallarm services split into several containers
* Provides a dedicated entity for the postanalytics module that is the local data analytics backend for the Wallarm sidecar solution consuming most of the memory

!!! info "If you are using the earlier Wallarm Sidecar solution"
    If you are using the previous version of the Wallarm Sidecar solution, we recommend you migrate to the new one. With this release, we updated our Sidecar solution to leverage new Kubernetes capabilities and a wealth of customer feedback. The new solution does not require significant Kubernetes manifest changes, to protect an application, just deploy the chart and add labels and annotations to the pod.

    For assistance in migrating to the Wallarm Sidecar solution v2.0, please contact [Wallarm technical support](mailto:support@wallarm.com).

## Use cases

Among all supported [Wallarm deployment options][deployment-platform-docs], this solution is the recommended one for the following **use cases**:

* You are looking for the security solution to be deployed to the infrastructure with the existing Ingress controller (e.g. AWS ALB Ingress Controller) preventing you from deployment of either [Wallarm NGINX-based][nginx-ing-controller-docs] or [Wallarm Kong-based Ingress controller][kong-ing-controller-docs]
* Zero-trust environment that requires each microservice (including internal APIs) to be protected by the security solution

## Traffic flow

Traffic flow with Wallarm Sidecar:

![Traffic flow with Wallarm Sidecar][traffic-flow-with-wallarm-sidecar-img]

## Solution architecture

The Wallarm Sidecar solution is arranged by the following Deployment objects:

* **Sidecar controller** (`wallarm-sidecar-controller`) is the [mutating admission webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) that injects Wallarm sidecar resources into the Pod configuring it based on the Helm chart values and pod annotations and connecting the node components to the Wallarm Cloud.

    Once a new pod with the `wallarm-sidecar: enabled` label in Kubernetes starts, the controller automatically injects the additional container filtering incoming traffic into the pod.
* **Postanalytics module** (`wallarm-sidecar-postanalytics`) is the local data analytics backend for the Wallarm sidecar solution. The module uses the in-memory storage Tarantool and the set of some helper containers (like the collectd, attack export services).

![Wallarm deployment objects][sidecar-deployment-objects-img]

The Wallarm Sidecar has 2 standard stages in its lifecycle:

1. At the **initial** stage, the controller injects Wallarm sidecar resources into the Pod configuring it based on the Helm chart values and pod annotations and connecting the node components to the Wallarm Cloud.
1. At the **runtime** stage, the solution analyzes and proxies/forwards requests involving the postanalytics module.

## Requirements

--8<-- "../include/waf/installation/sidecar-proxy-reqs.md"

## Deployment

To deploy the Wallarm Sidecar solution:

1. Generate a filtering node token.
1. Deploy the Wallarm Helm chart.
1. Attach the Wallarm Sidecar to the application Pod.
1. Test the Wallarm Sidecar operation.

### Step 1: Generate a filtering node token

Generate a filtering node token of the [appropriate type][node-token-types] to connect the sidecar pods to the Wallarm Cloud:

=== "API token"
    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Deploy` source role.
    1. Copy this token.
=== "Node token"
    1. Open Wallarm Console → **Nodes** in either the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Create a filtering node with the **Wallarm node** type and copy the generated token.
        
      ![Creation of a Wallarm node][create-wallarm-node-img]

### Step 2: Deploy the Wallarm Helm chart

1. Add the [Wallarm chart repository](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. Create the `values.yaml` file with the [Wallarm Sidecar configuration](customization.md). Example of the file with the minimum configuration is below.

    When using an API token, specify a node group name in the `nodeGroup` parameter. Your nodes created for the sidecar pods will be assigned to this group, shown in the Wallarm Console's **Nodes** section. The default group name is `defaultSidecarGroup`. If required, you can later set filtering node group names individually for the pods of the applications they protect, using the [`sidecar.wallarm.io/wallarm-node-group`](pod-annotations.md#wallarm-node-group) annotation.

    === "US Cloud"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              host: "us1.api.wallarm.com"
              # nodeGroup: "defaultSidecarGroup"
        ```
    === "EU Cloud"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              # nodeGroup: "defaultSidecarGroup"
        ```    
    
    `<NODE_TOKEN>` is the token of the Wallarm node to be run in Kubernetes.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Deploy the Wallarm Helm chart:

    ``` bash
    helm install --version 4.10.5 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` is the name for the Helm release of the Wallarm Sidecar chart
    * `wallarm-sidecar` is the new namespace to deploy the Helm release with the Wallarm Sidecar chart, it is recommended to deploy it to a separate namespace
    * `<PATH_TO_VALUES>` is the path to the `values.yaml` file

### Step 3: Attach the Wallarm Sidecar to the application Pod

For Wallarm to filter application traffic, add the `wallarm-sidecar: enabled` label to the corresponding application Pod:

```bash
kubectl edit deployment -n <APPLICATION_NAMESPACE> <APP_LABEL_VALUE>
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

* If the `wallarm-sidecar` application Pod label is either set to `disabled` or not explicitly specified, the Wallarm Sidecar container is not injected into a pod and therefore Wallarm does not filter traffic.
* If the `wallarm-sidecar` application Pod label is set to `enabled`, the Wallarm Sidecar container is injected into a pod and therefore Wallarm filters incoming traffic.

### Step 4: Test the Wallarm Sidecar operation

To test that the Wallarm Sidecar operates correctly:

1. Get the Wallarm control plane details to check it has been successfully started:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Each pod should display the following: **READY: N/N** and **STATUS: Running**, e.g.:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Get the application pod details to check the Wallarm sidecar container has been successfully injected:

    ```bash
    kubectl get pods -n <APPLICATION_NAMESPACE> --selector app=<APP_LABEL_VALUE>
    ```

    The output should display **READY: 2/2** pointing to successful sidecar container injection and **STATUS: Running** pointing to successful connection to the Wallarm Cloud:

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    myapp-5c48c97b66-lzkwf   2/2     Running   0          3h4m
    ```
1. Send the test  [Path Traversal][ptrav-attack-docs] attack to the application cluster address Wallarm is enabled to filter traffic:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    Since the Wallarm proxy operates in the **monitoring** [filtration mode][filtration-mode-docs] by default, the Wallarm node will not block the attack but will register it.

    To check that the attack has been registered, proceed to Wallarm Console → **Attacks**:

    ![Attacks in the interface][attacks-in-ui-image]

## ARM64 deployment

With the Sidecar proxy's Helm chart version 4.10.2, ARM64 processor compatibility is introduced. Initially set for x86 architectures, deploying on ARM64 nodes involves modifying the Helm chart parameters.

In ARM64 settings, Kubernetes nodes often carry an `arm64` label. To assist the Kubernetes scheduler in allocating the Wallarm workload to the appropriate node type, reference this label using `nodeSelector`, `tolerations`, or affinity rules in the Wallarm Helm chart configuration.

Below is the Wallarm Helm chart example for Google Kubernetes Engine (GKE), which uses the `kubernetes.io/arch: arm64` label for relevant nodes. This template is modifiable for compatibility with other cloud setups, respecting their ARM64 labeling conventions.

=== "nodeSelector"
    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          # If using an API token, uncomment the following line and specify your node group name
          # nodeGroup: "defaultSidecarGroup"
      postanalytics:
        nodeSelector:
          kubernetes.io/arch: arm64
      controller:
        nodeSelector:
          kubernetes.io/arch: arm64
    ```
=== "tolerations"
    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          # If using an API token, uncomment the following line and specify your node group name
          # nodeGroup: "defaultSidecarGroup"
      postanalytics:
        tolerations:
          - key: kubernetes.io/arch
            operator: Equal
            value: arm64
            effect: NoSchedule
      controller:
        tolerations:
          - key: kubernetes.io/arch
            operator: Equal
            value: arm64
            effect: NoSchedule
    ```

## Security Context Constraints (SCC) in OpenShift

When installing the Sidecar solution into an OpenShift platform, it is necessary to define a custom Security Context Constraint (SCC) to suit the security requirements of the platform. The default constraints may be insufficient for the Wallarm solution, potentially leading to errors. Below is the recommended custom SCC for the Wallarm Sidecar solution tailored for OpenShift.

!!! warning "Apply the SCC before deploying the solution"
    Ensure the SCC is applied prior to deploying the Wallarm Sidecar solution.

1. Define the custom SCC in the `wallarm-scc.yaml` file as follows:

    ```yaml
    allowHostDirVolumePlugin: false
    allowHostIPC: false
    allowHostNetwork: false
    allowHostPID: false
    allowHostPorts: false
    allowPrivilegeEscalation: false
    allowPrivilegedContainer: false
    allowedCapabilities:
    - NET_BIND_SERVICE
    apiVersion: security.openshift.io/v1
    defaultAddCapabilities: null
    fsGroup:
      type: MustRunAs
    groups: []
    kind: SecurityContextConstraints
    metadata:
      annotations:
        kubernetes.io/description: wallarm-sidecar-deployment
      name: wallarm-sidecar-deployment
    priority: null
    readOnlyRootFilesystem: false
    requiredDropCapabilities:
    - ALL
    runAsUser:
      type: MustRunAs
      uid: 101
    seLinuxContext:
      type: MustRunAs
    seccompProfiles:
    - runtime/default
    supplementalGroups:
      type: RunAsAny
    users: []
    volumes:
    - configMap
    - emptyDir
    - secret
    ```
1. Apply this policy to a cluster:

    ```
    kubectl apply -f wallarm-scc.yaml
    ```
1. Allow the Wallarm Sidecar solution to use this SCC policy:
    
    ```
    oc adm policy add-scc-to-user wallarm-sidecar-deployment system:serviceaccount:<NAMESPACE>:<POSTANALYTICS_POD_SERVICE_ACCOUNT_NAME>
    ```

    * `<NAMESPACE>` is a namespace where the Wallarm Sidecar solution will be deployed.
    * `<POSTANALYTICS_POD_SERVICE_ACCOUNT_NAME>` is auto-generated and usually follows the format `<RELEASE_NAME>-wallarm-sidecar-postanalytics`, where `<RELEASE_NAME>` is the Helm release name you will assign during `helm install`.

    For example, assuming the namespace name is `wallarm-sidecar` and the Helm release name is `wlrm-sidecar`, the command would look like this:
    
    ```
    oc adm policy add-scc-to-user wallarm-sidecar-deployment system:serviceaccount:wallarm-sidecar:wlrm-sidecar-wallarm-sidecar-postanalytics
    ```
1. [Proceed with the Sidecar solution deployment](#deployment), ensuring you use the same namespace and Helm release name for the Sidecar solution as previously mentioned.
1. [Disable the usage of iptables](customization.md/#capturing-incoming-traffic-port-forwarding) to eliminate the need for a privileged iptables container. This can be accomplished either globally by modifying the `values.yaml` file or on a per-pod basis.
    
    === "Disabling iptables via the `values.yaml`"
        1. In the `values.yaml`, set `config.injectionStrategy.iptablesEnable` to `false`.

            ```yaml
            config:
              injectionStrategy:
                iptablesEnable: false
              wallarm:
                api:
                  ...
            ```
        1. Update the `spec.ports.targetPort` setting in your Service manifest to point to the `proxy` port. If iptables-based traffic capture is disabled, the Wallarm sidecar container will publish a port with the name `proxy`.

            ```yaml hl_lines="9"
            apiVersion: v1
            kind: Service
            metadata:
              name: myapp-svc
              namespace: default
            spec:
              ports:
                - port: 80
                  targetPort: proxy
                  protocol: TCP
                  name: http
              selector:
                app: myapp
            ```
    === "Disabling iptables via the pod annotation"
        1. Disable iptables on a per-pod basis by setting the Pod's annotation `sidecar.wallarm.io/sidecar-injection-iptables-enable` to `"false"`.
        1. Update the `spec.ports.targetPort` setting in your Service manifest to point to the `proxy` port. If iptables-based traffic capture is disabled, the Wallarm sidecar container will publish a port with the name `proxy`.

        ```yaml hl_lines="16-17 34"
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
              annotations:
                sidecar.wallarm.io/sidecar-injection-iptables-enable: "false"
            spec:
              containers:
                - name: application
                  image: kennethreitz/httpbin
                  ports:
                    - name: http
                      containerPort: 80
        ---
        apiVersion: v1
        kind: Service
        metadata:
          name: myapp-svc
          namespace: default
        spec:
          ports:
            - port: 80
              targetPort: proxy
              protocol: TCP
              name: http
          selector:
            app: myapp
        ```
1. To verify the correct SCC application to the postanalytics pod from the previous step, execute the following commands:

    ```
    NAMESPACE="wallarm-sidecar"
    POD=$(kubectl -n ${NAMESPACE} get pods -o name -l "app.kubernetes.io/component=postanalytics" | cut -d '/' -f 2)
    kubectl -n ${NAMESPACE}  get pod ${POD} -o jsonpath='{.metadata.annotations.openshift\.io\/scc}{"\n"}'
    ```

    The expected output should be `wallarm-sidecar-deployment`.

## Customization

Wallarm pods have been injected based on the [default `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) and the custom configuration you specified on the 2nd deployment step.

You can customize the Wallarm proxy behavior even more on both the global and per-pod levels and get the most out of the Wallarm solution for your company.

Just proceed to the [Wallarm proxy solution customization guide](customization.md).
