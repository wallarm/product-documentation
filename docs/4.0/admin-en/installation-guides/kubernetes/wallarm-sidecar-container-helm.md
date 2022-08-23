[versioning-policy]:          ../../../updating-migrating/versioning-policy.md#version-list

# Kubernetes deployment based on Helm charts

These instructions provide you with the steps to deploy Wallarm as the K8s sidecar container in the Helm chart-based K8s environment.

!!! warning "This solution has been re-invented"
    If this sidecar solution is deployed to your infrastructure, we highly recommend you remove it and deploy the [Sidecar proxy 2.0](../../../waf-installation/kubernetes/sidecar-proxy/deployment.md) solution instead. The new solution re-invents this one plugging discovered vulnerabilities and user experience gaps.

## Prerequisites

* Local or cloud (EKS, GKE, AKE, etc) cluster running any version of Kubernetes
* Application packaged as a Helm chart
* Pod exposed to the public Internet or other potential sources of malicious web and API attacks
* Kubernetes Ingress controller or external load balancer (like AWS ELB or ALB) to add the HTTP request header `X-Forwarded-For`, which contains the real public IP address of the connecting client
* Wallarm account in the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* Access to the account with the **Administrator** role in Wallarm Console in the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)

## Installation

1. [Create](#step-1-creating-the-wallarm-node) the Wallarm node.
1. [Create](#step-2-creating-wallarm-configmap) Wallarm ConfigMap.
1. [Update](#step-3-updating-the-deployment-object-in-kubernetes) the definition of the `Deployment` object in Kubernetes.
1. [Update](#step-4-updating-the-service-object-in-kubernetes) the definition of the `Service` object in Kubernetes.
1. [Update](#step-5-updating-the-helm-chart-configuration-file) the Helm chart configuration file.
1. [Test](#step-6-testing-the-wallarm-sidecar-container) the Wallarm sidecar container.

--8<-- "../include/waf/installation/already-deployed-sidecar-helm.md"

### Step 1: Creating the Wallarm node

1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../../../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token. The value will be required to be specified in the Helm chart configuration.

### Step 2: Creating Wallarm ConfigMap

Go to the Helm chart directory → the `templates` folder and create a `wallarm-sidecar-configmap.yaml` template with the following content:

--8<-- "../include/kubernetes-sidecar-container/wallarm-sidecar-configmap-helm-template-latest.md"

### Step 3: Updating the Deployment object in Kubernetes

1. Return to the Helm chart directory → the `templates` folder and open the template defining the `Deployment` object for the application. A complex application can have several `Deployment` objects for different components of the application - please find an object which defines pods which are actually exposed to the Internet. For example:

    --8<-- "../include/kubernetes-sidecar-container/deployment-template.md"

2. Copy the following elements to the template:

    * The `checksum/config` annotation to the `spec.template.metadata.annotations` section to update the running pods after a change in the previously created ConfigMap object
    * The `wallarm` sidecar container definition to the `spec.template.spec.containers` section
    * The `wallarm-nginx-conf` volume definition to the `spec.template.spec.volumes` section
    
    An example of the template with added elements is provided below. Elements for copying are indicated by the `Wallarm element` comment.

    --8<-- "../include/kubernetes-sidecar-container/deployment-with-wallarm-example-helm-latest.md"

3. Update the `ports.containerPort` value in sidecar container definition following the code comments.

### Step 4: Updating the Service object in Kubernetes

1. Return to the Helm chart directory → the `templates` folder and open the template defining the `Service` object that points to `Deployment` modified in the previous step. For example:

    --8<-- "../include/kubernetes-sidecar-container/service-template.md"

2. Change the `ports.targetPort` value to point to the Wallarm sidecar container port (`ports.containerPort` defined in the Wallarm sidecar container). For example:

    --8<-- "../include/kubernetes-sidecar-container/service-template-sidecar-port.md"

### Step 5: Updating the Helm chart configuration file

1. Return to the Helm chart directory and open the `values.yaml` file.

2. Copy the `wallarm` object definition provided below to `values.yaml` and update parameter values following the code comments.

    --8<-- "../include/kubernetes-sidecar-container/values-wallarm-description-4.0.md"

3. Make sure the `values.yaml` file is valid using the following command:

    ```
    helm lint
    ```

4. Deploy the modified Helm chart in the Kubernetes cluster using the following command:

    ```
    helm upgrade <RELEASE> <CHART>
    ```

    * `<RELEASE>` is the name of an existing Helm chart
    * `<CHART>` is the path to the Helm chart directory

!!! warning "NetworkPolicy object in Kubernetes"
    If the application also uses the `NetworkPolicy` object it should be updated to reflect the Wallarm sidecar container port specified above.

### Step 6: Testing the Wallarm sidecar container

--8<-- "../include/kubernetes-sidecar-container/test-sidecar-container-in-kubernetes.md"
