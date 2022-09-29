# Deploying Kong Ingress Controller with integrated Wallarm services

To secure APIs managed by Kong API Gateway, you can deploy the Kong Ingress controller with integrated Wallarm API Security services in a Kubernetes cluster. The solution involves the default Kong API Gateway functionality with the layer of real-time malicious traffic mitigation.

!!! info "Preview release"
    The current implementation of the Kong Ingress Controller with integrated Wallarm services is the preview stage of the solution.

The solution is deployed from the [Wallarm Helm chart](https://github.com/wallarm/kong-charts-preview).

The **key features** of the Kong Ingress Controller with integrated Wallarm services:

* Real-time [attack detection and mitigation](../../../about-wallarm/protecting-against-attacks.md)
* [Vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md)
* [API structure discovery](../../../about-wallarm/api-discovery.md)
* The Wallarm API Security services are integrated natively into both the Open-Source and Enterprise [Kong API Gateway](https://docs.konghq.com/gateway/latest/) editions
* This solution is based on the [official Kong Ingress Controller for Kong API Gateway](https://docs.konghq.com/kubernetes-ingress-controller/latest/) that provides full support for features of Kong API Gateway
* Support for Kong API Gateway 2.7.x (for both the Open-Source and Enterprise editions)
* Fine-tuning the Wallarm API Security layer via the Wallarm Console UI
* Provides a dedicated entity for the postanalytics module that is the local data analytics backend for the solution consuming most of the CPU

## Use cases

Among all supported [Wallarm deployment options](../../../admin-en/supported-platforms.md), this solution is the recommended one for the following **use cases**:

* There is no Ingress controller and security layer routing traffic to Ingress resources managed by Kong.
* You are using either the Open-Source or Enterprise official Kong Ingress controller and looking for a security solution compatible with your technology stack.

    You can seamlessly replace the deployed Kong Ingress Controller with the one these instructions describe by only moving your configuration to a new deployment.

## Solution architecture

The solution has the following architecture:

![!Solution architecture](../../../images/waf-installation/kubernetes/kong-ingress-controller/solution-architecture.png)

The solution is based on the official Kong Ingress Controller, its architecture is described in the [official Kong documentation](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/design/).

Kong Ingress Controller with integrated Wallarm services is arranged by the following Deployment objects:

* **Ingress controller** (`wallarm-ingress-kong`) that injects the Kong API Gateway and Wallarm resources into the K8s cluster configuring it based on the Helm chart values and connecting the node components to the Wallarm Cloud.
* **Postanalytics module** (`wallarm-ingress-kong-wallarm-tarantool`) is the local data analytics backend for the solution. The module uses the in-memory storage Tarantool and the set of some helper containers (like the collectd, attack export services).

## Limitations

The described solution allows the Wallarm API Security layer fine-tuning only via the Wallarm Console UI.

However, some Wallarm API Security features require configuration files to be changed that is unsupported in the current solution implementation. It makes the following Wallarm features unavailable:

* [Multitenancy feature](../../multi-tenant/overview.md)
* [Application configuration](../../../user-guides/settings/applications.md)
* [Custom blocking page and code setup](../../../admin-en/configuration-guides/configure-block-page-and-code.md)

## Requirements

* Kubernetes platform version 1.22-1.25
* K8s Ingress resources that configure Kong to route API calls to the microservices you want to protect
* [Helm v3](https://helm.sh/) package manager
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`
* Access to [GCP storage addresses](https://www.gstatic.com/ipranges/goog.json) to download an actual list of IP addresses registered in [allowlisted, denylisted, or graylisted](../../../user-guides/ip-lists/overview.md) countries, regions or data centers
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or the [EU Cloud](https://my.wallarm.com/)

## Deployment

To deploy Kong Ingress Controller with integrated Wallarm services:

1. Create the Wallarm node.
1. Deploy the Wallarm Helm chart with the Kong API Gateway and Wallarm services.
1. Test Kong Ingress Controller with integrated Wallarm services.

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
1. Create the `values.yaml` file with the [solution configuration](customization.md).

    Example of the file with the minimum configuration to run the **Open-Source** Kong Ingress controller with integrated Wallarm services:

    === "US Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong-oss-preview
          tag: "2.7-ubuntu-4.2"

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
            tag: "2.1.1"
        ```
    === "EU Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong-oss-preview
          tag: "2.7-ubuntu-4.2"

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
            tag: "2.1.1"
        ```  
        
    Example of the file with the minimum configuration to run **Enterprise** Kong Ingress controller with integrated Wallarm services:

    === "US Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong-ee-preview
          tag: "2.7-ubuntu-4.2"
          license_secret: "<KONG-ENTERPRISE-LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        enterprise:
          enabled: true

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
            tag: "2.1.1"
        ```
    === "EU Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong-ee-preview
          tag: "2.7-ubuntu-4.2"
          license_secret: "<KONG-ENTERPRISE-LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        enterprise:
          enabled: true

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
            tag: "2.1.1"
        ```  
    
    * `<NODE_TOKEN>` is the Wallarm node token you copied from the Wallarm Console UI
    * `<KONG-ENTERPRISE-LICENSE>` is the [Kong Enterprise License](https://github.com/Kong/charts/blob/master/charts/kong/README.md#kong-enterprise-license)
1. Deploy the Wallarm Helm chart:

    ``` bash
    helm install --version 4.2.3 <RELEASE_NAME> wallarm/kong-preview -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` is the name for the Kong Ingress Controller release
    * `<KUBERNETES_NAMESPACE>` is the new namespace to deploy the Kong Ingress Controller
    * `<PATH_TO_VALUES>` is the path to the `values.yaml` file

### Step 3: Test Kong Ingress Controller with integrated Wallarm services

To test that Kong Ingress Controller with integrated Wallarm services operates correctly:

1. Get the Wallarm pod details to check they have been successfully started:

    ```bash
    kubectl get pods -n <KUBERNETES_NAMESPACE>
    ```

    As for the `wallarm-*` pods, each pod should display the following: **READY: N/N** and **STATUS: Running**, e.g.:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-preview-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-ingress-kong-preview-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Send the test [SQLI](../../../attacks-vulns-list.md#sql-injection) and [XSS](../../../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the Kong Ingress Controller Service:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    Since the Wallarm layer operates in the **monitoring** [filtration mode](../../../admin-en/configure-wallarm-mode.md#available-filtration-modes) by default, the Wallarm node will not block attacks but will register them.

    To check that attacks have been registered, proceed to Wallarm Console → **Events**:

    ![!Attacks in the interface](../../../images/admin-guides/test-attacks-quickstart.png)

## Customization

Wallarm pods have been injected based on the [default `values.yaml`](https://github.com/wallarm/kong-charts-preview/blob/main/charts/kong/values.yaml) and the custom configuration you specified on the 2nd deployment step.

You can customize both the Kong API Gateway and Wallarm API Security behavior even more and get the most out of API security for your company.

Just proceed to the [Kong Ingress Controller solution customization guide](customization.md).
