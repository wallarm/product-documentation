# Installation in the Kubernetes Cluster

## System Requirements

* Kubernetes platform version 1.20 and lower
* [Helm](https://helm.sh/) package manager
* Compatibility of your services with the official [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx) version 0.26.2

!!! info "See also"
    * [What is Ingress?](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Installation of Helm](https://helm.sh/docs/intro/install/)

## Known Restrictions

* Operation without the postanalytics service is not supported. 
* Scaling down postanalytics service may result in a partial loss of attack data.

## Installation

1. [Install](#step-1-installing-the-wallarm-ingress-controller) the Wallarm Ingress controller.
2. [Enable](#step-2-enabling-traffic-analysis-for-your-ingress) traffic analysis for your Ingress.
3. [Check](#step-3-checking-the-wallarm-ingress-controller-operation) the Wallarm Ingress controller operation. 

### Step 1: Installing the Wallarm Ingress Controller

1. Go to the Wallarm Console → the **Nodes** tab via the link below:
    * https://my.wallarm.com/nodes for the EU cloud
    * https://us1.my.wallarm.com/nodes for the US cloud
2. Create a WAF node with the **Cloud** type and copy the token.
    ![!Creation of a cloud node](../images/installation-kubernetes/create-cloud-node.png)
3. Clone the repository of Wallarm Helm chart:
    ```
    git clone https://github.com/wallarm/ingress-chart --branch 2.18.1-7 --single-branch
    ```
4. Install the Wallarm Ingress controller:

    === "EU Cloud"
        ```bash
        helm install --set controller.wallarm.enabled=true,controller.wallarm.token=<YOUR_CLOUD_NODE_TOKEN> <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```
    === "US Cloud"
        ```bash
        helm install --set controller.wallarm.enabled=true,controller.wallarm.token=<YOUR_CLOUD_NODE_TOKEN>,controller.wallarm.apiHost=us1.api.wallarm.com <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

    * `<YOUR_CLOUD_NODE_TOKEN>` is the cloud WAF node token
    * `<INGRESS_CONTROLLER_NAME>` is the name of the Wallarm Ingress controller
    * `<KUBERNETES_NAMESPACE>` is the namespace of your Ingress

### Step 2: Enabling Traffic Analysis for Your Ingress

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-instance=<INSTANCE>
```
* `<YOUR_INGRESS_NAME>` is the name of your Ingress
* `<INSTANCE>` is a positive number that is unique to each of your applications or application groups. This will allow you to obtain separate statistics and to distinguish between attacks aimed at the corresponding applications

### Step 3: Checking the Wallarm Ingress Controller Operation

1. Get the list of pods specifying the name of the Wallarm Ingress controller in `<INGRESS_CONTROLLER_NAME>`:
    ```
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    Each pod should display the following: "STATUS: Running" and "READY: N/N". For example:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   8/8       Running   0          5m
    ingress-controller-nginx-ingress-default-backend-584ffc6c7xj5xx   1/1       Running   0          5m
    ```
2. Send the request with test [SQLI](../attacks-vulns-list.md#sql-injection) and [XSS](../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the Wallarm Ingress controller address:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    If the WAF node is working in the `block` mode, the code `403 Forbidden` will be returned in the response to the request and attacks will be displayed in Wallarm Console → **Nodes**.

## Configuration

After the Wallarm Ingress controller is successfully installed and checked, you can make advanced configurations to the solution such as:

* [Proper Reporting of End User Public IP Address](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
* [Management of IP Addresses Blocking](configuration-guides/wallarm-ingress-controller/best-practices/block-ip-addresses.md)
* [Configuration of IP Whitelisting for Wallarm Scanner](configuration-guides/wallarm-ingress-controller/best-practices/whitelist-wallarm-ip-addresses.md)
* [High Availability Considerations](configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)
* [Ingress Controller Monitoring](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)

To find parameters used for advanced configuration and appropriate instructions, please follow the [link](configure-kubernetes-en.md).
