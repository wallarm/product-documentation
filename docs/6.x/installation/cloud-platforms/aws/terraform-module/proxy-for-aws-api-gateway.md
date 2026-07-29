[wallarm-proxy-for-aws-api-gateway-img]: ../../../../images/waf-installation/aws/terraform/wallarm-as-proxy-for-aws-api-gateway.png

# Deploying Wallarm as Proxy for Amazon API Gateway

This example demonstrates how to protect [Amazon API Gateway](https://aws.amazon.com/api-gateway/) with Wallarm deployed as an inline proxy to AWS Virtual Private Cloud (VPC) using the [Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

Wallarm proxy solution provides an additional functional network layer serving as an advanced HTTP traffic router with the WAAP and API security functions. It can route requests to almost any service type including Amazon API Gateway without limiting its capabilities.

!!! info "Security note"
    This solution is designed to follow AWS security best practices. We recommend avoiding the use of the AWS root account for deployment. Instead, use IAM users or roles with only the necessary permissions.
    
    The deployment process assumes the principle of least privilege, granting only the minimal access required to provision and operate Wallarm components.

## Use cases

Among all supported [Wallarm deployment options](https://docs.wallarm.com/installation/supported-deployment-options), Terraform module is recommended for Wallarm deployment on AWS VPC in these **use cases**:

* Your existing infrastructure resides on AWS.
* You leverage the Infrastructure as Code (IaC) practice. Wallarm's Terraform module allows for the automated management and provisioning of the Wallarm node on AWS, enhancing efficiency and consistency.

## Requirements

* Terraform 1.0.5 or higher [installed locally](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Access to the account with the **Administrator** [role](https://docs.wallarm.com/user-guides/settings/users/#user-roles) in Wallarm Console in the US or EU [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)
* Access to `https://us1.api.wallarm.com` if working with US Wallarm Cloud or to `https://api.wallarm.com` if working with EU Wallarm Cloud. Please ensure the access is not blocked by a firewall
* Any AWS region of your choice, there are no specific restrictions on the region for the Wallarm node deployment
* Understanding of Terraform, AWS EC2, Security Groups and other AWS services
* AWS root account should never be used for deploying resources

    Please use a dedicated IAM user or role with minimal necessary permissions to perform the deployment described in this guide.
* Avoid the use of broad permissions (e.g., `AdministratorAccess`) and assign only the specific actions needed for this module to operate

    The IAM roles and permissions used in this deployment are designed following the principle of least privilege. Only the permissions required to create and manage the necessary AWS resources (e.g., EC2, networking, logging) should be granted.

## Solution architecture

![Wallarm proxy scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

The example Wallarm proxy solution has the following components:

* Internet-facing Application Load Balancer routing traffic to Wallarm node instances.
* Wallarm node instances analyzing traffic and proxying any requests to API Gateway.

    The example runs Wallarm nodes in the monitoring mode that drives the described behavior. Wallarm nodes can also operate in other modes including those aimed at blocking malicious requests and forwarding only legitimate ones further. To learn more about Wallarm node modes, use [our documentation](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).
* API Gateway the Wallarm nodes proxy requests to. The API Gateway has the following settings:

    * The `/demo/demo` path assigned.
    * A single mock configured.
    * During this Terraform module deployment, you can choose either the "regional" or "private" [endpoint type for the API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html). More details on these types and migration between them are provided below.

    Please note that the provided example deploys a regular Amazon API Gateway, so its operation will not be affected by Wallarm nodes.

All listed components including the API Gateway will be deployed by the provided `wallarm` example module.

## Code components

This example has the following code components:

* `main.tf`: the main configuration of the `wallarm` module to be deployed as a proxy solution. The configuration produces an AWS ALB and Wallarm instances.
* `apigw.tf`: the configuration producing the Amazon API Gateway accessible under the `/demo/demo` path with a single mock integration configured. During the module deployment, you can also choose either the "regional" or "private" endpoint type (see details below).
* `endpoint.tf`: the AWS VPC Endpoint configuration for the "private" type of the API Gateway endpoint.

## Difference between the "regional" and "private" API Gateway endpoints

The `apigw_private` variable sets the API Gateway endpoint type:

* With the "regional" option, Wallarm node instances will submit requests to the publicly available API Gateway [`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html) service.
* With the "private" option - to AWS VPC Endpoints attached to the `execute-api` service. **For production deployment, the "private" option is the recommended one.**

### More options to restrict access to the API Gateway

Amazon also enables you to restrict access to your API Gateway regardless of the "private" or "regional" endpoint type as follows:

* Using [resource policies](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) with any of two endpoint types specified.
* Managing access by [source IPs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html), if the endpoint type is "private".
* Managing access by [VPC and/or Endpoint](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html), if the endpoint type is "private" that already assumes the API Gateway to be unavailable from public networks by design.

### Migration between API Gateway endpoint types

You can change the API Gateway endpoint type without recreation of the component but please consider the following:

* Once the type is changed from "regional" to "private", public endpoints will become private and thus unavailable from public resources. It is applicable to both the `execute-api` endpoints and domain names.
* Once the type is changed from "private" to "regional", AWS VPC Endpoints targeted to your API Gateway will be immediately detached and API Gateway will become unavailable.
* Since NGINX of the community version cannot automatically detect DNS name changes, the changed endpoint type should be followed by the manual NGINX restart on the Wallarm node instances.

    You can reboot, re-create instances or run `nginx -s reload` in each instance. 

If changing the endpoint type from "regional" to "private":

1. Create AWS VPC Endpoint and attach it to `execute-api`. You will find the example in the `endpoint.tf` configuration file.
1. Switch the API Gateway endpoint type and specify the AWS VPC Endpoint in the API Gateway configuration. Once completed, the traffic flow will be stopped.
1. Run `nginx -s reload` in each Wallarm node instance or just re-create each Wallarm node. Once it is completed, the traffic flow will be restored.

It is NOT recommended to change the endpoint type from "private" to "regional" but if you ever do:

1. Remove endpoint required for running in the "private" mode and only then switch the API Gateway endpoint to "regional".
1. Run `nginx -s reload` in each Wallarm node instance or just re-create each Wallarm node. Once it is completed, the traffic flow will be restored.

**For production, it is recommended to change your API Gateway to "private"**, otherwise traffic from Wallarm nodes to API Gateway will be passed via the public network and can produce additional charges.

## Running the example Wallarm AWS proxy solution for API Gateway

1. Sign up for Wallarm Console in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes).
1. Open Wallarm Console → **Nodes** and create the node of the **Wallarm node** type.
1. Copy the generated node token.
1. Clone the repository containing the example code to your machine:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Set variable values in the `default` options in the `examples/apigateway/variables.tf` file of the cloned repository and save changes.
1. Deploy the stack by executing the following commands from the `examples/apigateway` directory:

    ```
    terraform init
    terraform apply
    ```

To remove the deployed environment, use the following command:

```
terraform destroy
```

## References

* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API Gateway Private APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [API Gateway Policies](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [API Gateway Policies examples](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [API Gateway Types](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)
