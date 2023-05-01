# Deploying Wallarm as Proxy in AWS VPC

This example demonstrates how to deploy Wallarm as an inline proxy to an existing AWS Virtual Private Cloud (VPC) using the [Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

Wallarm proxy solution provides an additional functional network layer serving as an advanced HTTP traffic router with the WAF and API security functions.

You can see the solution flexibility in action by trying the [proxy advanced solution](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced).

## Key characteristics

* Wallarm processes traffic in the synchronous mode that does not limit Wallarm capabilities and enables instant threat mitigation (`preset=proxy`).
* Wallarm solution is deployed as a separate network layer that enables you to control it independently from other layers and place the layer in almost any network structure position. The recommended position is behind an internet-facing load balancer.

## Solution architecture

![Wallarm proxy scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

The example Wallarm proxy solution has the following components:

* Internet-facing Application Load Balancer routing traffic to Wallarm node instances.
* Wallarm node instances analyzing traffic and proxying any requests further. Corresponding elements on the scheme are A, B, C EC2 instances.

    The example runs Wallarm nodes in the monitoring mode that drives the described behavior. Wallarm nodes can also operate in other modes including those aimed at blocking malicious requests and forwarding only legitimate ones further. To learn more about Wallarm node modes, use [our documentation](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* The services Wallarm nodes proxy requests to. The service can be of any type, e.g.:

    * AWS API Gateway application connected to VPC via VPC Endpoints (the corresponding Wallarm Terraform deployment is covered in the [example for API Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway))
    * AWS S3
    * EKS nodes running in the EKS cluster (configuration of Internal Load Balancer or NodePort Service is recommended for this case)
    * Any other backend service

    By default, Wallarm nodes will forward traffic to `https://httpbin.org`. During this example launch, you will be able to specify any other service domain or path available from AWS Virtual Private Cloud (VPC) to proxy traffic to.

    The `https_redirect_code = 302` module configuration option will allow you to safely redirect HTTP requests to HTTPS by AWS ALB.

All listed components (except for the proxied server) will be deployed by the provided `wallarm` example module.

## Code components

This example has the following code components:

* `main.tf`: the main configuration of the `wallarm` module to be deployed as a proxy solution. The configuration produces an AWS ALB and Wallarm instances.
* `ssl.tf`: the SSL/TLS offload configuration that automatically issues a new AWS Certificate Manager (ACM) for the domain specified in the `domain_name` variable and binds it to AWS ALB.

    To disable the feature, remove or comment out the `ssl.tf` and `dns.tf` files, and also comment out the `lb_ssl_enabled`, `lb_certificate_arn`, `https_redirect_code`, `depends_on` options in the `wallarm` module definition. With the feature disabled, you will be able to use just the HTTP port (80).
* `dns.tf`: AWS Route 53 configuration provisioning DNS record for AWS ALB.

    To disable the feature, follow the note above.

## Requirements

* Terraform 1.0.5 or higher [installed locally](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Access to the account with the **Administrator** role in Wallarm Console in the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* Access to `https://api.wallarm.com` if working with EU Wallarm Cloud or to `https://us1.api.wallarm.com` if working with US Wallarm Cloud. Please ensure the access is not blocked by a firewall
* To run the example with the SSL and DNS features enabled, configure the [Route 53 hosting zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html)

## Running the example Wallarm AWS proxy solution

1. Sign up for Wallarm Console in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes).
1. Open Wallarm Console → **Nodes** and create the node of the **Wallarm node** type.
1. Copy the generated node token.
1. Clone the repository containing the example code to your machine:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Set variable values in the `default` options in the `examples/proxy/variables.tf` file of the cloned repository and save changes.
1. Set the proxied server protocol and address in `examples/proxy/main.tf` → `proxy_pass`.

    By default, Wallarm will proxy traffic to `https://httpbin.org`. If the default value meets your needs, leave it as is.
1. Deploy the stack by executing the following commands from the `examples/proxy` directory:

    ```
    terraform init
    terraform apply
    ```

To remove the deployed environment, use the following command:

```
terraform destroy
```

## Troubleshooting

### Wallarm repeatedly creates and terminates instances

The provided AWS Auto Scaling group configuration is focused on the highest reliability and smoothness of the service. Repeated creation and termination of EC2 instances during the AWS Auto Scaling group initialization may be caused by failing health checks.

To address the issue, please review and fix the following settings:

* Wallarm node token has the valid value copied from the Wallarm Console UI
* NGINX configuration is valid
* Domain names specified in the NGINX configuration have been successfully resolved (e.g. the `proxy_pass` value)


**EXTREME WAY** If the above settings are valid, you can try to find the issue reason by manually disabling ELB health checks in the Auto Scaling group settings. It will keep instances active even if service configuration is invalid, instances will not restart. You will be able to thoroughly explore the logs and debug the service rather than investigate the issue in several minutes.

## References

* [AWS ACM certificates](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
