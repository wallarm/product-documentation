# Trying Wallarm Terraform Module with examples

We have prepared the examples of different ways to use the [Wallarm Terraform Module](https://registry.terraform.io/modules/wallarm/wallarm/aws/), so you could try it before deploying it to production.

There are 4 examples representing frequent deployment approaches:

* Proxy solution
* Proxy advanced solution
* Mirror solution
* Solution for AWS VPC Traffic Mirroring

## Proxy solution

[This example](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) demonstrates how to deploy Wallarm as an inline proxy to AWS Virtual Private Cloud (VPC) using the Terraform module.

Wallarm proxy solution provides an additional functional network layer serving as an advanced HTTP traffic router with the Next-Gen WAF and API security functions. This is the **recommended** deployment option since it provides the most functional and easy to implement solution.

![!Proxy scheme](../../../../images/waf-installation/aws/terraform/wallarm-as-proxy.png)

Key characteristics of the solution:

* Wallarm processes traffic in the synchronous mode that does not limit Wallarm capabilities and enables instant threat mitigation (`preset=proxy`).
* The Wallarm solution is deployed as a separate network layer that enables you to control it independently from other layers and place the layer in almost any network structure position. The recommended position is behind an internet-facing load balancer.

[Refer to the example deployment guide on GitHub](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)

You can see the solution flexibility in action by trying the [proxy advanced solution](#proxy-advanced-solution).

## Proxy advanced solution

[This example](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced) demonstrates how to deploy Wallarm as an inline proxy with advanced settings to AWS Virtual Private Cloud (VPC) using the Terraform module. It is a lot like the [simple proxy deployment](#proxy-solution) but with some frequent advanced configuration options demonstrated.

Wallarm proxy advanced solution (as well as a simple proxy) provides an additional functional network layer serving as an advanced HTTP traffic router with the Next-Gen WAF and API security functions.

[Refer to the example deployment guide on GitHub](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)

## Proxy solution for Amazon API Gateway

[This example](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway) demonstrates how to protect [Amazon API Gateway](https://aws.amazon.com/api-gateway/) with Wallarm deployed as an inline proxy to AWS Virtual Private Cloud (VPC) using the Terraform module.

Wallarm proxy solution provides an additional functional network layer serving as an advanced HTTP traffic router with the Next-Gen WAF and API security functions. It can route requests to almost any service type including Amazon API Gateway without limiting its capabilities.

[Refer to the example deployment guide on GitHub](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)

## Mirror solution

[This example](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/mirror) demonstrates how to deploy the Wallarm Terraform module as an Out-of-Band solution analyzing mirrored traffic. It is expected that NGINX, Envoy, Istio and/or Traefik already provides traffic mirroring.

![!Mirror scheme](../../../../images/waf-installation/aws/terraform/wallarm-for-mirrored-traffic.png)

Key characteristics of the solution:

* Wallarm processes traffic in the asynchronous mode (`preset=mirror`) without affecting the current traffic flow which makes the approach the safest one.
* The Wallarm solution is deployed as a separate network layer that enables you to control it independently from other layers and place the layer in almost any network structure position. The recommended position is in the private network.

[Refer to the example deployment guide on GitHub](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/mirror)

## Solution for AWS VPC Traffic Mirroring

[This example](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/vpc-mirror) demonstrates how to deploy the Wallarm Terraform module as an Out-of-Band solution analyzing [traffic mirrored by Amazon VPC](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html).

![!Mirror scheme](../../../../images/waf-installation/aws/terraform/wallarm-for-traffic-mirrored-by-vpc.png)

Key characteristics of the solution:

* Wallarm processes traffic in the asynchronous mode (`preset=mirror`) without affecting the current traffic flow that makes the approach the safest one.
* The Wallarm solution is deployed as a separate network layer that enables you to configure it independently from other layers and place the layer in almost any network structure position. The recommended position is in the private network.

[Refer to the example deployment guide on GitHub](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/vpc-mirror)
