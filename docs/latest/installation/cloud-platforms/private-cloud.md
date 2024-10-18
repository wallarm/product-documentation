[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Deploying Wallarm in Private Clouds

Private clouds are cloud environments deployed solely to a single organization or entity, providing exclusive use and control over the resources. This article overviews the principles of deploying the Wallarm node to the private clouds.

## Step 1: Understand your scope and approach to Wallarm deployment

Before deploying Wallarm in your private cloud, it is essential to understand the scope of your application landscape and determine the most suitable approach for Wallarm deployment. Consider the following characteristics during this assessment:

* Assessment of a scope to secure: evaluate your application landscape and identify the critical applications that require protection. Consider factors such as the sensitivity of data, potential impact of breaches, and compliance requirements. This assessment helps you prioritize and focus your efforts on protecting the most important assets in your private cloud.
* [In-line](../inline/overview.md) vs. [out-of-band (OOB)](../oob/overview.md) analysis: determine whether you want to deploy Wallarm for in-line analysis or out-of-band traffic analysis. In-line analysis involves deploying Wallarm nodes in the traffic path of your applications, while OOB analysis involves capturing and analyzing mirrored traffic.
* Placement of Wallarm nodes: Based on your chosen approach (in-line or OOB analysis), determine the appropriate placement of Wallarm nodes within your private cloud infrastructure. For in-line analysis, consider placing Wallarm nodes close to your applications, such as within the same VLAN or subnet. For OOB analysis, ensure that the mirrored traffic will be properly routed to the Wallarm nodes for analysis.

## Step 2: Allow outgoing connections for Wallarm

In private clouds, there are often restrictions on outgoing connections. To ensure that Wallarm functions properly, it is necessary to enable outgoing connections, allowing it to download packages during installation, establish network connectivity between local node instances and Wallarm Cloud, and fully operationalize Wallarm features.

Access in private clouds is typically granted based on IP addresses. Wallarm requires access to the following DNS records:

* `35.235.66.155` to have access to the US Wallarm Cloud (`us1.api.wallarm.com`) to get security rules, upload attack data, etc.
* `34.90.110.226` to have access to the EU Wallarm Cloud (`api.wallarm.com`) to get security rules, upload attack data, etc.
* IP addresses used by Docker Hub if you choose to run Wallarm from a Docker image.
* `35.244.197.238` (`https://meganode.wallarm.com`) to install Wallarm from [all-in-one installer](../nginx/all-in-one.md). The installer is downloaded from this address.
* The IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-lists-docs] countries, regions, or data centers.

    --8<-- "../include/wallarm-cloud-ips.md"

## Step 3: Choose the deployment model and Wallarm artifact

Wallarm offers flexible deployment models, allowing organizations to select the most suitable option for their private cloud environment. Two common deployment models are **virtual appliance deployment** and **Kubernetes deployment**.

### Virtual appliance deployment

In this model, you deploy Wallarm as a virtual appliance within your private cloud infrastructure. The virtual appliance can be installed as a VM or container. You can choose to deploy the Wallarm node using one of the following artifacts:

* Docker images:
    * [NGINX-based Docker image](../../admin-en/installation-docker-en.md)
    * [Envoy-based Docker image](../../admin-en/installation-guides/envoy/envoy-docker.md)
* [All‑in‑One Installer for Linux](../nginx/all-in-one.md)

### Kubernetes deployment

If your private cloud utilizes Kubernetes for container orchestration, Wallarm can be deployed as a Kubernetes-native solution. It seamlessly integrates with Kubernetes clusters, leveraging features such as ingress controllers, sidecar containers, or custom Kubernetes resources. You can choose to deploy Wallarm using one of the following solutions:

* [NGINX-based Ingress controller](../../admin-en/installation-kubernetes-en.md)
* [Kong-based Ingress controller](../kubernetes/kong-ingress-controller/deployment.md)
* [Sidecar controller](../kubernetes/sidecar-proxy/deployment.md)
