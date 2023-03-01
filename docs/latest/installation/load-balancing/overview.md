# Wallarm in-line deployment with a load balancer

Wallarm can be deployed in-line as a reverse proxy mitigating threats in real-time in an infrastructure with a load balancer or another traffic distribution service. This article explains the approach in detail.

When Wallarm protects an API as a reverse proxy, traffic to that resource passes through Wallarm before it reaches the backend server. There is no chance of an attacker bypassing Wallarm nodes as long as they are inline and are the only path available to end users.

## Traffic flow

Wallarm reverse proxy sits between the client and the servers. It analyzes incoming traffic, mitigates malicious requests and forwards legitimate requests to the protected server:

![!In-line filtering scheme](../../images/waf-installation/load-balancing/wallarm-inline-deployment-scheme.png)

## Advantages and limitations

The in-line deployment approach to the Wallarm deployment offers several advantages over other deployment methods, such as [OOB](../oob/overview.md) deployments:

* Wallarm instantly blocks malicious requests since traffic analysis proceeds in real time.
* All Wallarm features, including [API Discovery](../../about-wallarm/api-discovery.md) and [vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md) work with no limitations as Wallarm has access to both incoming requests and server responses.

In contrast to the [OOB](../oob/overview.md) approach, the in-line deployment may introduce additional latency, particularly in high-traffic scenarios, as each request analysis requires some time, albeit not significant. [Allocating sufficient resources for Wallarm node](admin-en/configuration-guides/allocate-resources-for-node.md) prevents any issues.

## Use cases

The Wallarm in-line solution is suitable for the following use cases:

* Mitigate malicious requests such as SQli, XSS injections, API abuse, brute force before they reach the application server.
* Get knowledge on active security vulnerabilities of your system and apply virtual patches before fixing the application code.
* Observe API inventory and track sensitive data.

## Supported deployment options

Wallarm offers various artifacts for in-line deployment depending on a web server being used for load balancing:

* NGINX stable:
    * DEB/RPM packages
    * Docker image
    * K8s Ingress Controller
    * K8s Sidecar Proxy
    * AWS AMI image
    * GCP cloud image
    * AWS ECS
    * GCE
    * Azure Container Instances service
    * Alibaba ECS
    * Terraform module for AWS
* NGINX Plus:
    * DEB/RPM packages
* NGINX Distro:
    * DEB/RPM packages
* Kong:
    * K8s Kong Ingress Controller
* Envoy:
    * Docker image

Depending on the scope you are going to protect, you can place the Wallarm solution behind, after, on a level with an existing load balancer, or replace it with the Wallarm K8s solution.

<!-- 
1. внути самих инструкйи надо в backend-server указывать адрес балансировщика?
1. specify somewhere that +++ correct real IP identification is needed
 -->