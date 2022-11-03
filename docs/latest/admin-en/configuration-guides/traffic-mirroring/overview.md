# Filtering mirrored traffic [![API Security](../../../images/tags/api-security.svg)](../../../about-wallarm/subscription-plans.md)

One of the Wallarm node deployment approaches is an asynchronous-based deployment for mirrored HTTP traffic filtration. This article instructs you on the configuration required for this deployment implementation and provides some examples.

Traffic mirroring enables original incoming traffic to be sent to multiple backends in parallel. Installing a Wallarm node as the additional backend lets you run filtration of traffic mirror (copy) with no impact on the clients - any incoming requests will reach the servers they are addressed.

There is the example of the traffic flow diagram with the mirroring option enabled:

![!Mirror scheme](../../../images/waf-installation/aws/terraform/wallarm-for-mirrored-traffic.png)

## Approach use cases

Installing the Wallarm node to filter mirrored traffic is useful to:

* Be sure that the security solution will not affect the application's performance.
* Train the Wallarm solution on the traffic copy before running the module on the production system.

## Limitations of mirrored traffic filtration

Despite the deployment approach safety, it has some limitations:

* Only NGINX-based Wallarm nodes support mirrored traffic filtration.
* Wallarm node does not instantly block malicious requests since traffic analysis proceeds irrespective of actual traffic flow.
* Wallarm does not detect application and API [vulnerabilities](../../../about-wallarm/detecting-vulnerabilities.md) since the node only has copies of incoming requests, and server responses cannot be mirrored.
* The solution requires an additional component - the web server providing traffic mirroring or a similar tool (e.g. NGINX, Envoy, Istio, Traefik, custom Kong module, etc).

## Configuration

To implement Wallarm to filter mirrored traffic:

1. Configure your web server to mirror incoming traffic to an additional backend.
1. [Install](../../supported-platforms.md) the Wallarm node as the additional backend and configure it to filter the mirrored traffic.

Traffic mirroring is supported by many web servers. Inside the following links, you will find the **example configuration** for the most popular of them:

* [NGINX](nginx-example.md)
* [Traefik](traefik-example.md)
* [Envoy](envoy-example.md)
* [Istio](istio-example.md)
