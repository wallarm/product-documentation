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

1. Go to Wallarm Console → **Nodes** via the link below:
    * https://us1.my.wallarm.com/nodes for the US Cloud
    * https://my.wallarm.com/nodes for the EU Cloud
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
4. Create the `values.yaml` file with the [Wallarm configuration][configure-nginx-ing-controller-docs].

    Example of the file with the minimum configuration:

    === "US Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            apiHost: "us1.api.wallarm.com"
        ```
    === "EU Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
        ```    
    
    Starting from Helm chart version 4.4.1, you can also store the Wallarm node token in Kubernetes secrets and pull it to the Helm chart. [Read more][controllerwallarmexistingsecret-docs]
    
    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Install the Wallarm packages:

    ``` bash
    helm install --version 4.6.6 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
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
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      4/4       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
2. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to the Ingress Controller Service:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    If the filtering node is working in the `block` mode, the code `403 Forbidden` will be returned in the response to the request and the attack will be displayed in Wallarm Console → **Events**.

## Configuration

After the Wallarm Ingress controller is successfully installed and checked, you can make advanced configurations to the solution such as:

* [Proper reporting of end user public IP address][best-practices-for-public-ip]
* [Management of IP addresses blocking][ip-lists-docs]
* [High availability considerations][best-practices-for-high-availability]
* [Ingress Controller monitoring][best-practices-for-ingress-monitoring]

To find parameters used for advanced configuration and appropriate instructions, please follow the [link][configure-nginx-ing-controller-docs].
