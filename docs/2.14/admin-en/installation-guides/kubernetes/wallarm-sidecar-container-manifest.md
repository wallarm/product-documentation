# Kubernetes Deployment Based on Manifests

## Prerequisites

* Local or cloud (EKS, GKE, AKE, etc) cluster running any version of Kubernetes
* Application defined in plain Kubernetes manifest files
* Pod exposed to the public Internet or other potential sources of malicious web and API attacks
* Kubernetes ingress controller or external load balancer (like AWS ELB or ALB) to add the HTTP request header `X-Forwarded-For`, which contains the real public IP address of the connecting client
* Wallarm account in the [EU cloud](https://my.wallarm.com/) or [US cloud](https://us1.my.wallarm.com/)
* Username and password of the user with the **Deploy** role added to your Wallarm account. To add a new user, please follow these [instructions](../../../user-guides/settings/users.md#create-a-user)

## Installation

1. [Create](#step-1-creating-wallarm-configmap) Wallarm ConfigMap.
3. [Update](#step-2-updating-the-deployment-object-in-kubernetes) the definition of the `Deployment` object in Kubernetes.
4. [Update](#step-3-updating-the-service-object-in-kubernetes) the definition of the `Service` object in Kubernetes.
5. [Deploy](#step-4-deploying-the-manifest-to-the-kubernetes-cluster) the manifest to the Kubernetes cluster.
6. [Test](#step-5-testing-the-wallarm-sidecar-container) the Wallarm sidecar container.

!!! info "If Wallarm WAF is already installed in your environment"
    If you install Wallarm WAF instead of already existing Wallarm WAF or need to duplicate the installation in the same environment, please keep the same WAF version as currently used or update the version of all installations to the latest.

    The version of deployed Wallarm WAF image is specified in the Deployment template → `spec.template.spec.containers` section → `image` of the Wallarm container.

    * If the version `2.16` is specified, follow the [instructions for 2.16](../../../../../admin-en/installation-guides/kubernetes/wallarm-sidecar-container-manifest/).
    * If the version `2.14` is specified, follow the current instructions or increase the version of the image to `2.14` in all deployments and follow the [instructions for 2.16](../../../../../admin-en/installation-guides/kubernetes/wallarm-sidecar-container-manifest/).
    * If the version `2.12` or lower is specified, please increase the version of the image to `2.16` in all deployments and follow the [instructions for 2.16](../../../../../admin-en/installation-guides/kubernetes/wallarm-sidecar-container-manifest/).

    More information about WAF node versioning is available in the [WAF node versioning policy](../../../updating-migrating/versioning-policy.md).

### Step 1: Creating Wallarm ConfigMap

<ol start="1"><li>Create a new manifest file or add a new object to the existing manifest for a new Kubernetes ConfigMap object that will hold the NGINX configuration file for the Wallarm sidecar container:</li></ol>

--8<-- "../include/kubernetes-sidecar-container/wallarm-sidecar-configmap-manifest.md"

<ol start="2"><li>Update parameter values following the code comments.</li></ol>

### Step 2: Updating the Deployment Object in Kubernetes

<ol start="1"><li>Go to the Kubernetes manifests and open the template that defines the <code>Deployment</code> object for the application. A complex application can have several <code>Deployment</code> objects for different components of the application - please find an object which defines pods which are actually exposed to the Internet. For example:</li></ol>

--8<-- "../include/kubernetes-sidecar-container/deployment-template.md"

<ol start="2"><li>Copy the following elements to the template:<ul><li>the <code>wallarm</code> sidecar container definition to the <code>spec.template.spec.containers</code> section,</li><li>the <code>wallarm-nginx-conf</code> volume definition to the <code>spec.template.spec.volumes</code> section.</li></ul>An example of the template with added elements is provided below. Elements for copying are indicated by the <code>Wallarm element</code> comment.</li></li></ol>

--8<-- "../include/kubernetes-sidecar-container/deployment-with-wallarm-example-manifest.md"

<ol start="3"><li>Update parameter values following the code comments.</li></ol>

### Step 3: Updating the Service Object in Kubernetes

<ol start="1"><li>Return to the Kubernetes manifests and open the template that defines the <code>Service</code> object that points to <code>Deployment</code> modified in the previous step. For example:</li></ol>

--8<-- "../include/kubernetes-sidecar-container/service-template-manifest.md"

<ol start="2"><li>Change the <code>ports.targetPort</code> value to point to the Wallarm sidecar container port (<code>ports.containerPort</code> defined in the Wallarm sidecar container). For example:</li></ol>

--8<-- "../include/kubernetes-sidecar-container/service-template-sidecar-port-manifest.md"

### Step 4: Deploying the Manifest to the Kubernetes Cluster

Update or deploy the new application manifest in the Kubernetes cluster.

!!! warning "NetworkPolicy Object in Kubernetes"
    If the application also uses the `NetworkPolicy` object it should be updated to reflect the Wallarm sidecar container port specified above.

### Step 5: Testing the Wallarm Sidecar Container

--8<-- "../include/kubernetes-sidecar-container/test-sidecar-container-in-kubernetes.md"