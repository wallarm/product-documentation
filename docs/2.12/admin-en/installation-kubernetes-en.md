# Installation in the Kubernetes Cluster

## System Requirements

* Kubernetes platform version 1.15 or lower
* [Helm](https://helm.sh/) package manager
* Compatibility of your services with the official [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx)

!!! info "See also"
    * [What is Ingress?](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Installation of Helm](https://helm.sh/docs/intro/install/)

## Installation

1. [Install](#step-1-installing-the-wallarm-ingress-controller) the Wallarm Ingress controller.
2. [Enable](#step-2-enabling-traffic-analysis-for-your-ingress) traffic analysis for your Ingress.
3. [Check](#step-3-checking-the-wallarm-ingress-controller-operation) the Wallarm Ingress controller operation. 

### Step 1: Installing the Wallarm Ingress Controller

Select the method of the controller installation:
* creation of a new controller,
* replacement of an existing controller.

#### Creating a New Controller

1. Go to your Wallarm account > the **Nodes** tab via the link below:
    * https://my.wallarm.com/nodes for the EU cloud,
    * https://us1.my.wallarm.com/nodes for the US cloud.
2. Create a filter node with the **Cloud** type and copy the token.
    ![!Creation of a cloud node](../images/installation-kubernetes/create-cloud-node.png)
3. Clone the repository of Wallarm NGINX Ingress:
    ```
    git clone https://github.com/wallarm/ingress-chart
    ```
4. Install the Wallarm Ingress controller:
    ```
    helm install --set controller.wallarm.enabled=true,controller.wallarm.token=<YOUR_CLOUD_NODE_TOKEN>,controller.wallarm.apiHost=<WALLARM_API_HOST> <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
   
    * `<YOUR_CLOUD_NODE_TOKEN>` is the token value you've received earlier
    * `<WALLARM_API_HOST>` is `api.wallarm.com` for the [EU cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud) or `us1.api.wallarm.com` for the [US cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)
    * `<INGRESS_CONTROLLER_NAME>` is the name of the Wallarm Ingress controller
    * `<KUBERNETES_NAMESPACE>` is the namespace of your Ingress
    
      
#### Replacing an Existing Controller

1. Go to your Wallarm account > the **Nodes** tab via the link below:
    * https://my.wallarm.com/nodes for the EU cloud,
    * https://us1.my.wallarm.com/nodes for the US cloud.
2. Create a filter node with the **Cloud** type and copy the token.
    ![!Creation of a cloud node](../images/installation-kubernetes/create-cloud-node.png)
3. Clone the repository of Wallarm NGINX Ingress:
   
    ```
    git clone https://github.com/wallarm/ingress-chart
    ```
4. Replace an existing controller:
   
    ```
    helm upgrade --set controller.wallarm.enabled=true,controller.wallarm.token=<YOUR_CLOUD_NODE_TOKEN>,controller.wallarm.apiHost=<WALLARM_API_HOST> <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE> --reuse-values
    ```
   
    * `<YOUR_CLOUD_NODE_TOKEN>` is the token value you've received earlier
    * `<WALLARM_API_HOST>` is `api.wallarm.com` for the [EU cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud) or `us1.api.wallarm.com` for the [US cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)
    * `<INGRESS_CONTROLLER_NAME>` is the name of the Ingress controller to replace
    * `<KUBERNETES_NAMESPACE>` is the namespace of your Ingress

### Step 2: Enabling Traffic Analysis for Your Ingress

``` bash
kubectl annotate ingress YOUR_INGRESS_NAME nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress YOUR_INGRESS_NAME nginx.ingress.kubernetes.io/wallarm-instance=INSTANCE
```
* `YOUR_INGRESS_NAME` is the name of your Ingress,
* `INSTANCE` is a positive number that is unique to each of your applications or application groups. This will allow you to obtain separate statistics and to distinguish between attacks aimed at the corresponding applications.

### Step 3: Checking the Wallarm Ingress Controller Operation

1. Get the list of pods specifying the name of the Wallarm Ingress controller in `INGRESS_CONTROLLER_NAME`:
    ```
    kubectl get po -l release=INGRESS_CONTROLLER_NAME
    ```

    Each pod should display the following: "STATUS: Running" and "READY: N/N". For example:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   8/8       Running   0          5m
    ingress-controller-nginx-ingress-default-backend-584ffc6c7xj5xx   1/1       Running   0          5m
    ```
2. Send a test attack to your Ingress resource as described in this [documentation](../quickstart-en/qs-check-operation-en.md#2-run-a-test-attack).
3. Go to your Wallarm account > the **Events** tab via the link below and check that an attack is displayed in the list:
    * https://my.wallarm.com for the EU cloud,
    * https://us1.my.wallarm.com for the US cloud.

## Configuration

After the Wallarm Ingress controller is successfully installed and checked, you can make advanced configurations to the solution such as:
* [Proper Reporting of End User Public IP Address](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
* [Management of IP Addresses Blocking](configuration-guides/wallarm-ingress-controller/best-practices/block-ip-addresses.md)
* [Configuration of IP Whitelisting for Wallarm Scanner](configuration-guides/wallarm-ingress-controller/best-practices/whitelist-wallarm-ip-addresses.md)
* [High Availability Considerations](configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)
* [Ingress Controller Monitoring](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)

To find parameters used for advanced configuration and appropriate instructions, please follow the [link](configure-kubernetes-en.md).

## Known Restrictions

* IP blocking is not supported.
* Operation without the postanalytics service is not supported. 
* Scaling down postanalytics service may result in a partial loss of attack data.
