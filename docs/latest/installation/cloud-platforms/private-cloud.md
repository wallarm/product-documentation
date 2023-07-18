# Deploying Wallarm in Private Clouds

Private clouds are cloud environments deployed solely to a single organization or entity, providing exclusive use and control over the resources. This article overviews the principles of deploying the Wallarm node to the private clouds.

## Step 1: Understand your scope and approach to Wallarm deployment

Before deploying Wallarm in your private cloud, it is essential to understand the scope of your application landscape and determine the most suitable approach for Wallarm deployment. Consider the following characteristics during this assessment:

* Assessment of a scope to secure: evaluate your application landscape and identify the critical applications that require protection. Consider factors such as the sensitivity of data, potential impact of breaches, and compliance requirements. This assessment helps you prioritize and focus your efforts on protecting the most important assets in your private cloud.
* In-line vs. [out-of-band (OOB)](../oob/overview.md) analysis: determine whether you want to deploy Wallarm for in-line analysis or out-of-band traffic analysis. In-line analysis involves deploying Wallarm nodes in the traffic path of your applications, while OOB analysis involves capturing and analyzing mirrored traffic.
* Placement of Wallarm nodes: Based on your chosen approach (in-line or OOB analysis), determine the appropriate placement of Wallarm nodes within your private cloud infrastructure. For in-line analysis, consider placing Wallarm nodes close to your applications, such as within the same VLAN or subnet. For OOB analysis, ensure that the mirrored traffic will be properly routed to the Wallarm nodes for analysis.

## Step 2: Allow incoming and outgoing connections for Wallarm

Since private clouds usually have restrictions on incoming connections, it is necessary to allow connections from Wallarm to enable vulnerability testing of your system. In private clouds, access is typically granted based on IP addresses rather than domains. Below is the list of IP addresses you need to allow access for Wallarm to operate correctly:

THE LIST

Additionally, as private clouds often restrict incoming connections, you must also allow connections to Wallarm for nodes to communicate with the Wallarm Cloud and download packages from external sources during installation. Below is the list of IP addresses:

THE LIST

## Step 3: Choose the deployment model and Wallarm artifact

Wallarm offers flexible deployment models, allowing organizations to select the most suitable option for their private cloud environment. Two common deployment models are **virtual appliance deployment** and **Kubernetes deployment**.

### Virtual appliance deployment

In this model, you deploy Wallarm as a virtual appliance within your private cloud infrastructure. The virtual appliance can be installed as a VM or container. You can choose to deploy the Wallarm node using one of the following artifacts:

* NGINX-based Docker image
* Envoy-based Docker image
* Individual Linux packages for NGINX stable
* Individual Linux packages for NGINX Plus
* Individual Linux packages for Distribution-Provided NGINX
* All‑in‑One Installer for Linux

### Kubernetes deployment

If your private cloud utilizes Kubernetes for container orchestration, Wallarm can be deployed as a Kubernetes-native solution. It seamlessly integrates with Kubernetes clusters, leveraging features such as ingress controllers, sidecar containers, or custom Kubernetes resources. You can choose to deploy Wallarm using one of the following solutions:

* NGINX-based Ingress controller
* Kong-based Ingress controller
* Sidecar proxy
