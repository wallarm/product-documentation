# Deploying Wallarm OOB for NGINX, Envoy and Similar Mirroring using Terraform Module

This article demonstrates the **example** on how to deploy Wallarm to AWS as an Out-of-Band solution using the [Wallarm Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/). It is expected that NGINX, Envoy, Istio and/or Traefik provides traffic mirroring.

## Key characteristics

* Wallarm processes traffic in the asynchronous mode (`preset=mirror`) without affecting the current traffic flow which makes the approach the safest one.
* Wallarm solution is deployed as a separate network layer that enables you to control it independently from other layers and place the layer in almost any network structure position. The recommended position is in the private network.

## Solution architecture

![Wallarm for mirrored traffic](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

This example Wallarm solution has the following components:

* Internet-facing load balancer routing traffic to the Wallarm node instances. It is expected that a load balancer has been already deployed, the `wallarm` module will not create this resource.
* Any web or proxy server (e.g. NGINX, Envoy) serving traffic from a load balancer and mirroring HTTP requests to an internal ALB endpoint and backend services. It is expected that a the component used for traffic mirroring has been already deployed, the `wallarm` module will not create this resource.
* An internal ALB accepting mirrored HTTPS requests from a web or proxy server and forwarding them to the Wallarm node instances.
* Wallarm node analyzing requests from an internal ALB and sending malicious traffic data to the Wallarm Cloud.

    The example runs the Wallarm nodes in the monitoring mode that drives the described behavior. If you switch the [mode](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) to another value, nodes continue to only monitor the traffic as the [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) approach does not allow attack blocking.

The last two components will be deployed by the provided `wallarm` example module.

## Code components

This example has the following code components:

* `main.tf`: the main configuration of the `wallarm` module to be deployed as a mirror solution. The configuration produces an internal AWS ALB and Wallarm instances.

## Configuring HTTP request mirroring

Traffic mirroring is a feature provided by many web and proxy servers. The [link](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring) provides the documentation on how to configure traffic mirroring with some of them.

## Limitations

Despite the fact that the described example solution is the most functional Out-of-Band Wallarm solution, it has some limitations inherent in the asynchronous approach:

* Wallarm node does not instantly block malicious requests since traffic analysis proceeds irrespective of actual traffic flow.
* The solution requires an additional component - the web or proxy server providing traffic mirroring or a similar tool (e.g. NGINX, Envoy, Istio, Traefik, custom Kong module, etc).

## Running the example Wallarm mirror solution

1. Sign up for Wallarm Console in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes).
1. Open Wallarm Console → **Nodes** and create the node of the **Wallarm node** type.
1. Copy the generated node token.
1. Clone the repository containing the example code to your machine:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Set variable values in the `default` options in the `examples/mirror/variables.tf` file of the cloned repository and save changes.
1. Deploy the stack by executing the following commands from the `examples/mirror` directory:

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
