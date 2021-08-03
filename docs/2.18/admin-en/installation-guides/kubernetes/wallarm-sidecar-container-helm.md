# Kubernetes Deployment Based on Helm Charts

## Prerequisites

* Local or cloud (EKS, GKE, AKE, etc) cluster running any version of Kubernetes
* Application packaged as a Helm chart
* Pod exposed to the public Internet or other potential sources of malicious web and API attacks
* Kubernetes ingress controller or external load balancer (like AWS ELB or ALB) to add the HTTP request header `X-Forwarded-For`, which contains the real public IP address of the connecting client
* Wallarm account in the [EU cloud](https://my.wallarm.com/) or [US cloud](https://us1.my.wallarm.com/)
* Username and password of the user with the **Deploy** role added to your Wallarm account. To add a new user, please follow these [instructions](../../../user-guides/settings/users.md#create-a-user)

## Installation

1. [Create](#step-1-creating-wallarm-configmap) Wallarm ConfigMap.
3. [Update](#step-2-updating-the-deployment-object-in-kubernetes) the definition of the `Deployment` object in Kubernetes.
4. [Update](#step-3-updating-the-service-object-in-kubernetes) the definition of the `Service` object in Kubernetes.
5. [Update](#step-4-updating-the-helm-chart-configuration-file) the Helm chart configuration file.
6. [Test](#step-5-testing-the-wallarm-sidecar-container) the Wallarm sidecar container.

!!! info "If Wallarm node is already installed in your environment"
    If you install Wallarm node instead of already existing Wallarm node or need to duplicate the installation in the same environment, please keep the same node version as currently used or update the version of all installations to the latest.

    The version of deployed Wallarm filtering node image is specified in the Helm chart configuration file → `wallarm.image.tag`.

    * If the version `3.0.x` is specified, follow the [instructions for 3.0](/admin-en/installation-guides/kubernetes/wallarm-sidecar-container-helm/).
    * If the version `2.18.x` is specified, follow the current instructions or increase the version of the image to `3.0.0-3` in all deployments and follow the current instructions.
    * If the version `2.16.x` or lower is specified, please increase the version of the image to `3.0.0-3` in all deployments and follow the current instructions. Support for installed versions will be deprecated soon.

    More information about Wallarm node versioning is available in the [Wallarm node versioning policy](../../../updating-migrating/versioning-policy.md).

### Step 1: Creating Wallarm ConfigMap

Go to the Helm chart directory > the `templates` folder and create a `wallarm-sidecar-configmap.yaml` template with the following content:

--8<-- "../include/kubernetes-sidecar-container/wallarm-sidecar-configmap-helm-template-218.md"

### Step 2: Updating the Deployment Object in Kubernetes

<ol start="1"><li>Return to the Helm chart directory > the <code>templates</code> folder and open the template defining the <code>Deployment</code> object for the application. A complex application can have several <code>Deployment</code> objects for different components of the application - please find an object which defines pods which are actually exposed to the Internet. For example:</li></ol>

--8<-- "../include/kubernetes-sidecar-container/deployment-template.md"

<ol start="2"><li>Copy the following elements to the template:<ul><li>the <code>checksum/config</code> annotation to the <code>spec.template.metadata.annotations</code> section to update the running pods after a change in the previously created ConfigMap object,</li><li>the <code>wallarm</code> sidecar container definition to the <code>spec.template.spec.containers</code> section,</li><li>the <code>wallarm-nginx-conf</code> volume definition to the <code>spec.template.spec.volumes</code> section.</li></ul>An example of the template with added elements is provided below. Elements for copying are indicated by the <code>Wallarm element</code> comment.</li></li></ol>

--8<-- "../include/kubernetes-sidecar-container/deployment-with-wallarm-example-helm.md"

<ol start="3"><li>Update the <code>ports.containerPort</code> value in sidecar container definition following the code comments.</li></ol>

### Step 3: Updating the Service Object in Kubernetes

<ol start="1"><li>Return to the Helm chart directory > the <code>templates</code> folder and open the template defining the <code>Service</code> object that points to <code>Deployment</code> modified in the previous step. For example:</li></ol>

--8<-- "../include/kubernetes-sidecar-container/service-template.md"

<ol start="2"><li>Change the <code>ports.targetPort</code> value to point to the Wallarm sidecar container port (<code>ports.containerPort</code> defined in the Wallarm sidecar container). For example:</li></ol>

--8<-- "../include/kubernetes-sidecar-container/service-template-sidecar-port.md"

### Step 4: Updating the Helm Chart Configuration File

<ol start="1"><li>Return to the Helm chart directory and open the <code>values.yaml</code> file.</li></ol>

<ol start="2"><li>Copy the <code>wallarm</code> object definition provided below to <code>values.yaml</code> and update parameter values following the code comments.</li></ol>

--8<-- "../include/kubernetes-sidecar-container/values-wallarm-description-2.18.md"

<ol start="3"><li>Make sure the <code>values.yaml</code> file is valid using the following command:</li></ol>

```
helm lint
```

<ol start="4"><li>Deploy the modified Helm chart in the Kubernetes cluster using the following command:</li></ol>

```
helm upgrade <RELEASE> <CHART>
```

* `<RELEASE>` is the name of an existing Helm chart,
* `<CHART>` is the path to the Helm chart directory.

!!! warning "NetworkPolicy Object in Kubernetes"
    If the application also uses the `NetworkPolicy` object it should be updated to reflect the Wallarm sidecar container port specified above.

### Step 5: Testing the Wallarm Sidecar Container

--8<-- "../include/kubernetes-sidecar-container/test-sidecar-container-in-kubernetes.md"
