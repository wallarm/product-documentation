[versioning-policy]:          ../../../updating-migrating/versioning-policy.md#version-list

# Kubernetes deployment based on manifests

These instructions provide you with the steps to deploy Wallarm as the K8s sidecar container in the manifest-based K8s environment.

## Prerequisites

* Local or cloud (EKS, GKE, AKE, etc) cluster running any version of Kubernetes
* Application defined in plain Kubernetes manifest files
* Pod exposed to the public Internet or other potential sources of malicious web and API attacks
* Kubernetes Ingress controller or external load balancer (like AWS ELB or ALB) to add the HTTP request header `X-Forwarded-For`, which contains the real public IP address of the connecting client
* Wallarm account in the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* Username and password of the user with the **Deploy** role added to your company's Wallarm account. To add a new user, please follow these [instructions](../../../user-guides/settings/users.md#create-a-user)

## Installation

1. [Create](#step-1-creating-wallarm-configmap) Wallarm ConfigMap.
3. [Update](#step-2-updating-the-deployment-object-in-kubernetes) the definition of the `Deployment` object in Kubernetes.
4. [Update](#step-3-updating-the-service-object-in-kubernetes) the definition of the `Service` object in Kubernetes.
5. [Deploy](#step-4-deploying-the-manifest-to-the-kubernetes-cluster) the manifest to the Kubernetes cluster.
6. [Test](#step-5-testing-the-wallarm-sidecar-container) the Wallarm sidecar container.

--8<-- "../include/waf/installation/already-deployed-sidecar-manifests.md"

### Step 1: Creating Wallarm ConfigMap

1. Create a new manifest file or add a new object to the existing manifest for a new Kubernetes ConfigMap object that will hold the NGINX configuration file for the Wallarm sidecar container:

    --8<-- "../include/kubernetes-sidecar-container/wallarm-sidecar-configmap-manifest-latest.md"

2. Update parameter values following the code comments.

### Step 2: Updating the Deployment object in Kubernetes

1. Go to the Kubernetes manifests and open the template that defines the `Deployment` object for the application. A complex application can have several `Deployment` objects for different components of the application - please find an object which defines pods which are actually exposed to the Internet. For example:

    --8<-- "../include/kubernetes-sidecar-container/deployment-template.md"

2. Copy the following elements to the template:

    * The `wallarm` sidecar container definition to the `spec.template.spec.containers` section
    * The `wallarm-nginx-conf` volume definition to the `spec.template.spec.volumes` section
    
    An example of the template with added elements is provided below. Elements for copying are indicated by the `Wallarm element` comment.

    --8<-- "../include/kubernetes-sidecar-container/deployment-with-wallarm-example-manifest-3.6.md"

3. Update parameter values following the code comments.

### Step 3: Updating the Service object in Kubernetes

1. Return to the Kubernetes manifests and open the template that defines the `Service` object that points to `Deployment` modified in the previous step. For example:

    --8<-- "../include/kubernetes-sidecar-container/service-template-manifest.md"

2. Change the `ports.targetPort` value to point to the Wallarm sidecar container port (`ports.containerPort` defined in the Wallarm sidecar container). For example:

    --8<-- "../include/kubernetes-sidecar-container/service-template-sidecar-port-manifest.md"

### Step 4: Deploying the manifest to the Kubernetes cluster

Update or deploy the new application manifest in the Kubernetes cluster.

!!! warning "NetworkPolicy object in Kubernetes"
    If the application also uses the `NetworkPolicy` object it should be updated to reflect the Wallarm sidecar container port specified above.

### Step 5: Testing the Wallarm sidecar container

--8<-- "../include/kubernetes-sidecar-container/test-sidecar-container-in-kubernetes.md"