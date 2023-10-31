# Deploying NGINX Ingress Controller with Integrated Wallarm Services

These instructions provide you with the steps to deploy the Wallarm NGINX-based Ingress controller to your K8s cluster. The solution involves the default functionality of [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) with integrated Wallarm services.

The solution has the following architecture:

![Solution architecture][nginx-ing-image]

The solution is deployed from the Wallarm Helm chart.

## Use cases

Among all supported [Wallarm deployment options][deployment-platform-docs], this solution is the recommended one for the following **use cases**:

* There is no Ingress controller and security layer routing traffic to Ingress resources compatible with [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx).
* You are using [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) and looking for a security solution compatible with your technology stack.

    You can seamlessly replace the deployed NGINX Ingress Controller with the one these instructions describe by only moving your configuration to a new deployment.

## Requirements

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "See also"
    * [What is Ingress?](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Installation of Helm](https://helm.sh/docs/intro/install/)

## Known restrictions

* Operation without the postanalytics module is not supported. 
* Scaling down postanalytics module may result in a partial loss of attack data.

## Installation

1. [Install](#step-1-installing-the-wallarm-ingress-controller) the Wallarm Ingress controller.
2. [Enable](#step-2-enabling-traffic-analysis-for-your-ingress) traffic analysis for your Ingress.
3. [Check](#step-3-checking-the-wallarm-ingress-controller-operation) the Wallarm Ingress controller operation. 

### Step 1: Installing the Wallarm Ingress Controller

To install the Wallarm Ingress Controller:

1. Generate a filtering node token of the [appropriate type][node-token-types]:

    === "API token (Helm chart 4.6.8 and above)"
        1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
        1. Find or create API token with the `Deploy` source role.
        1. Copy this token.
    === "Node token"
        1. Open Wallarm Console → **Nodes** in either the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
        1. Create a filtering node with the **Wallarm node** type and copy the generated token.
            
            ![Creation of a Wallarm node][nginx-ing-create-node-img]
1. Create a Kubernetes namespace to deploy the Helm chart with the Wallarm Ingress controller:

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. Add the [Wallarm chart repository](https://charts.wallarm.com/):
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```

    !!! info "Deployment from your own registries"    
        Alternatively, you can install the Wallarm Ingress controller from the images stored [in your own registries](#deployment-from-your-own-registries).

1. Create the `values.yaml` file with the [Wallarm configuration][configure-nginx-ing-controller-docs]. Example of the file with the minimum configuration is below.

    When using an API token, specify a node group name in the `nodeGroup` parameter. Your node will be assigned to this group, shown in the Wallarm Console's **Nodes** section. The default group name is `defaultIngressGroup`.

    === "US Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            apiHost: "us1.api.wallarm.com"
            # nodeGroup: defaultIngressGroup
        ```
    === "EU Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
        ```
    
    You can also store the Wallarm node token in Kubernetes secrets and pull it to the Helm chart. [Read more][controllerwallarmexistingsecret-docs]
1. Install the Wallarm packages:

    ``` bash
    helm install --version 4.8.3 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` is the name for the Helm release of the Ingress controller chart
    * `<KUBERNETES_NAMESPACE>` is the Kubernetes namespace you have created for the Helm chart with the Wallarm Ingress controller
    * `<PATH_TO_VALUES>` is the path to the `values.yaml` file

### Step 2: Enabling traffic analysis for your Ingress

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-application=<APPLICATION>
```
* `<YOUR_INGRESS_NAME>` is the name of your Ingress
* `<YOUR_INGRESS_NAMESPACE>` is the namespace of your Ingress
* `<APPLICATION>` is a positive number that is unique to each of [your applications or application groups][application-docs]. This will allow you to obtain separate statistics and to distinguish between attacks aimed at the corresponding applications

### Step 3: Checking the Wallarm Ingress Controller operation

1. Get the list of pods:
    ```
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Each pod should display the following: **STATUS: Running** and **READY: N/N**. For example:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
2. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to the Ingress Controller Service:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    If the filtering node is working in the `block` mode, the code `403 Forbidden` will be returned in the response to the request and the attack will be displayed in Wallarm Console → **Events**.

## ARM64 deployment

With the NGINX Ingress controller's Helm chart version 4.8.2, ARM64 processor compatibility is introduced. Initially set for x86 architectures, deploying on ARM64 nodes involves modifying the Helm chart parameters.

In ARM64 settings, Kubernetes nodes often carry an `arm64` label. To assist the Kubernetes scheduler in allocating the Wallarm workload to the appropriate node type, reference this label using `nodeSelector`, `tolerations`, or affinity rules in the Wallarm Helm chart configuration.

Below is the Wallarm Helm chart example for Google Kubernetes Engine (GKE), which uses the `kubernetes.io/arch: arm64` label for relevant nodes. This template is modifiable for compatibility with other cloud setups, respecting their ARM64 labeling conventions.

=== "nodeSelector"
    ```yaml
    controller:
      nodeSelector:
        kubernetes.io/arch: arm64
      admissionWebhooks:
        nodeSelector:
          kubernetes.io/arch: arm64
        patch:
          nodeSelector:
            kubernetes.io/arch: arm64
      wallarm:
        tarantool:
          nodeSelector:
            kubernetes.io/arch: arm64
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # if using EU Cloud, comment out this line
        # If using an API token, uncomment the following line and specify your node group name
        # nodeGroup: defaultIngressGroup
    ```
=== "tolerations"
    ```yaml
    controller:
      tolerations:
        - key: kubernetes.io/arch
          operator: Equal
          value: arm64
          effect: NoSchedule
      admissionWebhooks:
        patch:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
      wallarm:
        tarantool:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # if using EU Cloud, comment out this line
        # If using an API token, uncomment the following line and specify your node group name
        # nodeGroup: defaultIngressGroup
    ```

## Deployment from your own registries

If you cannot pull the Docker images from the Wallarm public repository due to some reasons, for example because you company security policy restricts usage of any external resources, instead you can clone these images to your local storage and install Wallarm NGINX-based Ingress controller using them.

To do that, specify paths to your local images by overwriting the `values.yaml` file of Wallarm Ingress controller Helm chart:

```yaml
controller:
  image:
    ## The image and tag for wallarm nginx ingress controller
    ##
    image: <CUSTOM_IMAGE_LOCATION>
    tag: <IMAGE_TAG>
    helpers:
      ## The image and tag for the helper image
      ##
      image: <CUSTOM_IMAGE_LOCATION>
      tag: <IMAGE_TAG>
```

## Configuration

After the Wallarm Ingress controller is successfully installed and checked, you can make advanced configurations to the solution such as:

* [Proper reporting of end user public IP address][best-practices-for-public-ip]
* [Management of IP addresses blocking][ip-lists-docs]
* [High availability considerations][best-practices-for-high-availability]
* [Ingress Controller monitoring][best-practices-for-ingress-monitoring]

To find parameters used for advanced configuration and appropriate instructions, please follow the [link][configure-nginx-ing-controller-docs].
