[new-ic]:                                 https://github.com/nginx/kubernetes-ingress
[IC-config-options]:                      ../admin-en/configure-kubernetes-en-new.md
[IC-existingsecret]:                      ../admin-en/configure-kubernetes-en-new.md#configwallarmapiexistingsecretenabled
[applications]:                           ../user-guides/settings/applications.md
[ptrav-attack]:                           ../attacks-vulns-list.md#path-traversal
[best-practices-for-public-ip]:           ../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md
[ip-lists-docs]:                          ../user-guides/ip-lists/overview.md
[best-practices-for-high-availability]:   ../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md
[best-practices-for-ingress-monitoring]:  ../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md
[deployment-platform-docs]:               ../../6.x/installation/supported-deployment-options.md
[chaining-doc]:                           ../admin-en/chaining-wallarm-and-other-ingress-controllers.md
[node-token-types]:                       ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-ing-image]:                        ../images/waf-installation/kubernetes/nginx-ingress-controller.png
[nginx-ing-create-node-img]:              ../images/user-guides/nodes/create-wallarm-node-name-specified.png
[attacks-in-ui-image]:                    ../images/admin-guides/test-attacks-quickstart.png


# Deploying F5 NGINX Ingress Controller with Integrated Wallarm Services

These instructions provide you with the steps to deploy the Wallarm NGINX-based Ingress controller to your K8s cluster. The solution is deployed from the Wallarm Helm chart.

The solution is based on the [F5 NGINX Ingress Controller][new-ic] with integrated Wallarm services. It uses the NGINX Ingress Controller image version 5.3.3. The Wallarm controller image is built on NGINX stable 1.29.x and uses Alpine Linux 3.22.0 as the base image.

## Traffic flow

Traffic flow with Wallarm Ingress Controller:

![Solution architecture][nginx-ing-image]

## Use cases

Among all supported [Wallarm deployment options][deployment-platform-docs], this solution is the recommended one for the following **use cases**:

* There is no Ingress controller and security layer routing traffic to Ingress resources compatible with [F5 NGINX Ingress Controller][new-ic]
* You are currently using F5 NGINX Ingress Controller and are in search of a security solution that offers both the standard controller functionality and enhanced security features. In this case, you can effortlessly switch to the Wallarm-NGINX Ingress Controller detailed in these instructions. Simply migrate your existing configuration to a new deployment to complete the replacement.

    For simultaneous use of both the existing Ingress controller and the Wallarm controller, refer to the [Ingress Controller chaining guide][chaining-doc] for configuration details.

## Requirements

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest-7.x.md"

!!! info "See also"
    * [What is Ingress?](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Installation of Helm](https://helm.sh/docs/intro/install/)

## Known restrictions

* Operation without the Postanalytics module is not supported. 
* Scaling down the Postanalytics module may result in a partial loss of attack data.

## Deployment

1. [Prerequisites](#prerequisites).
1. [Generate](#step-1-generate-a-filtering-node-token) a filtering node token.
1. [Install](#step-2-install-the-wallarm-ingress-controller) the Wallarm Ingress Controller.
1. [Enable](#step-3-enable-traffic-analysis-for-your-ingress) traffic analysis for your Ingress.
1. [Test](#step-4-test-the-wallarm-ingress-controller-operation) the Wallarm Ingress Controller operation.

### Prerequisites

The deployment procedure assumes you already have an application deployed with an Ingress resource. If no Ingress exists for your application, create one before [Step 3](#step-3-enable-traffic-analysis-for-your-ingress).

### Step 1: Generate a filtering node token

Generate a filtering node token of the [appropriate type][node-token-types]:

=== "API token"
    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Node deployment/Deployment` usage type.
    1. Copy this token.
=== "Node token"
    1. Open Wallarm Console → **Nodes** in either the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Create a filtering node with the **Wallarm node** type and copy the generated token.
        
![Creation of a Wallarm node][nginx-ing-create-node-img]

### Step 2: Install the Wallarm Ingress Controller

1. Create a Kubernetes namespace to deploy the Helm chart with the Wallarm Ingress Controller:

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```

1. Add the [Wallarm chart repository](https://charts.wallarm.com/):
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

1. Create the `values.yaml` file with the [Wallarm configuration][IC-config-options]. Example of the file with the minimum configuration is below.

    When using an API token, specify a node group name in the `nodeGroup` parameter. Your node will be assigned to this group, shown in the Wallarm Console's **Nodes** section. The default group name is `defaultIngressGroup`.

    === "US Cloud"
        ```yaml
        config:
          wallarm:
            enabled: true
            api:
              host: "us1.api.wallarm.com"
              token: "<NODE_TOKEN>"
              # nodeGroup: defaultIngressGroup
        ```
    === "EU Cloud"
        ```yaml
        config:
          wallarm:
            enabled: true
            api:
              host: "api.wallarm.com" 
              token: "<NODE_TOKEN>"
              # nodeGroup: defaultIngressGroup
        ```

    `<NODE_TOKEN>` is the token of the Wallarm node to be run in Kubernetes.
   
    You can also store the Wallarm node token in [Kubernetes secrets][IC-existingsecret] and pull it to the Helm chart.

    !!! info "Deployment from your own registries"    
        You can overwrite elements of the `values.yaml` file to install the Wallarm Ingress Controller from the images stored [in your own registries](#deployment-from-your-own-registries).

1. Install the Wallarm packages:

    ```bash
    helm install --version 7.0.0-rc1 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` is the name for the Helm release of the Ingress controller chart
    * `<KUBERNETES_NAMESPACE>` is the Kubernetes namespace you have created for the Helm chart with the Wallarm Ingress Controller
    * `<PATH_TO_VALUES>` is the path to the `values.yaml` file

### Step 3: Enable traffic analysis for your Ingress

```bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.org/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.org/wallarm-application="<APPLICATION_ID>"
```
* `<YOUR_INGRESS_NAME>` is the name of your Ingress
* `<YOUR_INGRESS_NAMESPACE>` is the namespace of your Ingress
* `<APPLICATION_ID>` is a positive number that is unique to each of [your applications or application groups][applications]. This will allow you to obtain separate statistics and to distinguish between attacks aimed at the corresponding applications

### Step 4: Test the Wallarm Ingress Controller operation

1. Verify that the Wallarm Ingress Controller pods are running:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    The Wallarm pod status should be **STATUS: Running** and **READY: N/N**:

    ```
    NAME                                                                  READY   STATUS    RESTARTS   AGE
    <RELEASE_NAME>-wallarm-ingress-controller-<POD_SUFFIX>             3/3     Running   0          8m7s
    <RELEASE_NAME>-wallarm-ingress-wallarm-postanalytics-<POD_SUFFIX>  3/3     Running   0          8m7s
    ```
2. Send the test [Path Traversal][ptrav-attack] attack to the Ingress Controller Service:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    If the filtering node is working in the `block` mode, the code `403 Forbidden` will be returned in the response to the request and the attack will be displayed in Wallarm Console → **Attacks**.

    ![Attacks in the interface][attacks-in-ui-image]

## ARM64 deployment

With the NGINX Ingress controller's Helm chart version 4.8.2, ARM64 processor compatibility is introduced. Initially set for x86 architectures, deploying on ARM64 nodes involves modifying the Helm chart parameters.

In ARM64 settings, Kubernetes nodes often carry an `arm64` label. To assist the Kubernetes scheduler in allocating the Wallarm workload to the appropriate node type, reference this label using `nodeSelector`, `tolerations`, or affinity rules in the Wallarm Helm chart configuration.

Below is the Wallarm Helm chart example for Google Kubernetes Engine (GKE), which uses the `kubernetes.io/arch: arm64` label for relevant nodes. This template is modifiable for compatibility with other cloud setups, respecting their ARM64 labeling conventions.

=== "nodeSelector"
    ```yaml
    # Set `nodeSelector` for both the controller and Postanalytics components:
    controller:
      nodeSelector:
        kubernetes.io/arch: arm64

    postanalytics:
      nodeSelector:
        kubernetes.io/arch: arm64
    ```
=== "tolerations"
    ```yaml
    # Set `tolerations` for both the controller and Postanalytics components:
    controller:
      tolerations:
        - key: kubernetes.io/arch
          operator: Equal
          value: arm64
          effect: NoSchedule

    postanalytics:
      tolerations:
        - key: kubernetes.io/arch
          operator: Equal
          value: arm64
          effect: NoSchedule
    ```

## Deployment from your own registries

If you cannot pull Docker images from the Wallarm public repository (e.g., due to company security policies restricting external resources), you can instead:

1. Clone these images to your private registry.
1. Install Wallarm NGINX-based Ingress controller using them.

The following Docker images are used by the Helm chart for NGINX-based Ingress Controller deployment:

* [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
* [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)

To install Wallarm NGINX-based Ingress controller using images stored in your registry, overwrite the `values.yaml` file of Wallarm Ingress Controller Helm chart:

```yaml
config:
  images:
    controller:
      repository: <YOUR_REGISTRY>
      tag: <IMAGE_TAG>
      pullPolicy: IfNotPresent
    helper:
      repository: <YOUR_REGISTRY>
      tag: <IMAGE_TAG>
      pullPolicy: IfNotPresent
```

Then run installation using your modified `values.yaml`.

## Security Context Constraints (SCC) in OpenShift

When deploying the F5 NGINX Ingress Controller on OpenShift, it is necessary to define a custom Security Context Constraint (SCC) to suit the security requirements of the platform. The default constraints may be insufficient for the Wallarm solution, potentially leading to errors.

Below is the recommended custom SCC for the Wallarm NGINX Ingress Controller.

!!! warning "Important"
    Apply the SCC **before** deploying the controller.

1. Create the `wallarm-scc.yaml` file with the following SCC:

    ```yaml
    ---
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
      name: wallarm-ingress-controller
      annotations:
        kubernetes.io/description: wallarm-ingress-controller provides features similar to restricted-v2 SCC but pins user id to 101 and is a little more restrictive for volumes
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
      - secret
      - emptyDir
      - projected
    ```

1. Apply this policy to a cluster:

    ```
    kubectl apply -f wallarm-scc.yaml
    ```
1. Create a Kubernetes namespace where the NGINX Ingress controller will be deployed:

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. Deploy the Wallarm Ingress Controller Helm chart into `wallarm-ingress` namespace.
1. Determine the ServiceAccount name used by the controller workloads:

    * If the controller is deployed as a `Deployment`:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> get deployment -l app.kubernetes.io/component=controller \
      -o jsonpath='{.items[0].spec.template.spec.serviceAccountName}{"\n"}'
    ```

    * If the controller is deployed as a `DaemonSet`:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> get daemonset -l app.kubernetes.io/component=controller \
      -o jsonpath='{.items[0].spec.template.spec.serviceAccountName}{"\n"}'
    ```
1. Grant the SCC to that `ServiceAccount`, e.g.:

    ```bash
    oc adm policy add-scc-to-user wallarm-ingress-controller \
      -z <SERVICE_ACCOUNT_NAME> -n <KUBERNETES_NAMESPACE>
    ```

1. Verify the SCC is applied by checking the SCC annotation on a controller pod:

    ```bash
    POD=$(kubectl -n <KUBERNETES_NAMESPACE> get pods -l app.kubernetes.io/component=controller -o name | head -n 1 | cut -d/ -f2)
    kubectl -n <KUBERNETES_NAMESPACE> get pod "${POD}" -o jsonpath='{.metadata.annotations.openshift\.io\/scc}{"\n"}'
    ```

The expected output is `wallarm-ingress-controller`.

## Configuration

After installing and verifying the Wallarm Ingress Controller, you can apply advanced configurations, such as:

* [Proper reporting of end user public IP address][best-practices-for-public-ip]
* [Managing IP address blocking][ip-lists-docs]
* [High availability considerations][best-practices-for-high-availability]
* [Ingress Controller monitoring][best-practices-for-ingress-monitoring]

For a full list of advanced configuration parameters and step-by-step instructions, see the [configuration guide][IC-config-options].
