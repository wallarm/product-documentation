# Wallarm in-line deployment with a load balancer

Wallarm can be deployed in-line as a reverse proxy mitigating threats in real-time in an infrastructure with or without a load balancer. This article explains the approach in detail.

When Wallarm protects an API as a reverse proxy, traffic to that resource passes through Wallarm before it reaches the backend server. There is no chance of an attacker bypassing Wallarm nodes as long as they are inline and are the only path available to end users.

## Traffic flow

Wallarm reverse proxy sits between the client and the servers. It analyzes incoming traffic, mitigates malicious requests and forwards legitimate requests to the protected server:

![!Reverse proxy scheme](../../images/deployment-options/wallarm-inline-deployment-scheme.png)

## Advantages and limitations

The in-line deployment approach to the Wallarm deployment offers several advantages over other deployment methods, such as [OOB](../oob/overview.md) deployments:

* Wallarm instantly blocks malicious requests since traffic analysis proceeds in real time.
* All Wallarm features work with no limitations as Wallarm has access to real traffic, not a mirror.

Despite the in-line deployment approach advantages, it has some limitations:

* In contrast to the [OOB] deployments, it may introduce latency or other performance issues, particularly in high-traffic scenarios, as each request analysis requires some time, albeit not significant.
* It provides less flexibility, as the solution cannot be added or removed from the network without affecting the primary data path.

## Use cases

The Wallarm in-line solution is suitable for the following use cases:

* Mitigate malicious requests such as SQli, XSS injections, API abuse, brute force before they reach the application server.
* Get knowledge on active security vulnerabilities of your system and apply virtual patches before fixing the application code.
* Observe API inventory and track sensitive data.
* Capture detailed logs and analytics about incoming traffic, which can be used to gain insight into an application usage, user behavior, and security threats.

## Supported deployment options

You can use the Wallarm solution as a load balancer with built-in security features, as well as deploy it behind, after or in a level with an existing load balancer.

Depending on the Wallarm place, there are the following available deployment options (?):

* In front of a load balancer

    * DEB/RPM packages
    * Docker container
    * AWS AMI image
    * GCP cloud image
    * AWS ECS
    * GCE
    * Azure Container Instances service
    * Alibaba ECS
* Behind a load balancer
* Instead of a load balancer

    * K8s Ingress Controller
    * K8s Kong Ingress controller
* On a level with a load balancer

<!-- 
1. are there specific use cases for placing wallarm before LB/after/instead??
1. какие-то еще advantages/disadvantages?
1. на основе чего пользователь выбирает, как ему ставить ноду - до балансировщика, после, вместо и тд?
1. внути самих инструкйи надо в backend-server указывать адрес балансировщика?
1. specify somewhere that +++ correct real IP identification is needed
 -->