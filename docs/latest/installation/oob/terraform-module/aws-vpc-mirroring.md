# Deploying Wallarm OOB for AWS VPC Mirroring using Terraform module

This example demonstrates how to deploy Wallarm as an Out-of-Band solution using the [Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/) for analyzing [traffic mirrored by Amazon VPC](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html).

## Key characteristics

* Wallarm processes traffic in the asynchronous mode (`preset=mirror`) without affecting the current traffic flow that makes the approach the safest one.
* Wallarm solution is deployed as a separate network layer that enables you to configure it independently from other layers and place the layer in almost any network structure position. The recommended position is in the private network.

## Solution architecture

![!OOB scheme for VPC mirroring](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-traffic-mirrored-by-vpc.png?raw=true)

This example Wallarm solution has the following components:

* Load balancer accepting traffic and routing requests to its instance targets. It is expected that a load balancer has been already deployed, the `wallarm` module will not create this resource.
* Instances serving a load balancer. It is expected that a load balancer has been already deployed, the `wallarm` module will not create this resource.
* Amazon VPC configured to mirror either the load balancer traffic or the instance traffic (dashed arrow on the scheme).
* NLB for mirrored packets that receives the mirrored traffic via UDP/4789 as Ethernet frames encapsulated into VXLAN.
* Traffic rebuilder distributing traffic across Auto Scaling Group instances that detect HTTP requests among VXLAN encapsulated packets. The provided example deploys this layer on the cloud-init script execution stage and uses [goreplay](https://github.com/buger/goreplay) to retreive HTTP requests from the traffic.
* ALB forwarding retrieved HTTP requests to Wallarm instances.
* Wallarm node instances analyzing requests from an internal ALB and sending malicious traffic data to the Wallarm Cloud.

    The example runs the Wallarm nodes in the monitoring mode that drives the described behavior. If you switch the [mode](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) to another value, nodes continue to only monitor the traffic as the [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) approach does not allow attack blocking.

## Code Components

This example has the following code components:

* `main.tf`: the main configuration of the `wallarm` module to be deployed as an AWS VPC mirror solution. The configuration produces an NLB, ALB and Wallarm instances.
* `./modules/vpc-mirror-sessions/*`: the internal example's module that configures the AWS VPC traffic mirroring feature.
* `./modules/vpc-mirror-rebuild/*`: the internal example's module that creates Auto Scaling Group that detects HTTP requests among mirrored traffic.
* `./enis/*`: examples of ENI configuration for different use cases.
* `interfaces.tf`: collects ENI IDs for passing to the `vpc-mirror` module.

## Limitations

The described example solution has some limitations inherent in the AWS VPC traffic mirroring feature:

* Traffic can be mirrored only from Elastic Network Interfaces (ENI) which could not all support this option.
* Traffic can be mirrored only directly from ELB ENI but not ALB, NLB or EC2 Instance ones.
* Mirroring traffic from EC2 may result in load balancer packet catched.
* Real IP address can only be revealed from the ALB + EC2 stack.
* Proxy protocols (e.g. v1 for ELB, v2 for NLB) are no supported even if traffic is mirrored from EC2 ENI.
* If EKS is based on the default CNI (AWS VPC CNI), ALB Ingress works only with the `"alb.ingress.kubernetes.io/target-type": "instance"` annotation applied.

## Running the example Wallarm mirror solution for AWS VPC

1. Sign up for Wallarm Console in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes).
1. Open Wallarm Console → **Nodes** and create the node of the **Wallarm node** type.
1. Copy the generated node token.
1. Clone the repository containing the example code to your machine:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Set variable values in the `examples/vpc-mirror/variables.tf` file of the cloned repository and save changes.
1. Select the appropriate EMIs configuration in the `examples/vpc-mirror/enis/*` directory and specify the selected one in the `examples/vpc-mirror/interfaces.tf` file.
1. Deploy the stack by executing the following commands from the `examples/vpc-mirror` directory:

    ```
    terraform init
    terraform apply
    ```

To remove the deployed environment, use the following command:

```
terraform destroy
```

## Reference Links

* [Amazon VPC Traffic Mirroring](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)
* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Elastic network interfaces](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html)
