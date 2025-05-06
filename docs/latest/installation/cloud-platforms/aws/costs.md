# Cost Guidance for Deploying NGINX Node in AWS

This page outlines the typical AWS infrastructure costs associated with deploying Wallarm NGINX Nodes using different methods, such as AMI-based EC2 instances and ECS-based Docker containers.

These are AWS-native costs only and do not include [Wallarm subscription fees](../../../about-wallarm/subscription-plans/).

## AMI-based deployment (EC2 instance)

[NGINX Node AMI](ami.md) is launched as an EC2 instance in your VPC. For high availability, you may place multiple EC2 instances behind an Application Load Balancer (ALB). You will also use Amazon EBS for storage, and standard AWS networking components (VPC, subnets, security groups).

Key cost components:

* EC2 instance hours: The cost depends on instance type, region, and uptime. For example, a `t3.medium` in `us-east` costs about $0.0416/hour (~$30/month if running 24/7). Multiply by the number of instances if using multiple Nodes for redundancy.
* EBS storage: Typically adds ~$5/month for 50 GB of general-purpose SSD.
* Elastic or Application Load Balancer: Base cost is ~$16/month plus traffic-based usage fees (LCUs), bringing the typical total to ~$22/month. [ALB costs](https://aws.amazon.com/elasticloadbalancing/pricing/) grow with higher traffic.
* Data transfer: The first 100 GB of outbound traffic from EC2 to the Internet per month is free; additional usage is billed at ~$0.09/GB. Cross-AZ traffic (e.g. ALB → EC2 in another AZ) is also charged at this rate. Same-AZ traffic is free.

Use the [AWS Pricing Calculator](https://calculator.aws/) for precise estimates based on region and traffic.

**Example estimate:**

A typical AMI-based deployment in `us-east-1` with one `t3.medium` EC2 instance running 24/7 behind an ALB, handling ~10 million requests and 200 GB of outbound traffic per month:

* EC2 instance: ~$30/month
* EBS storage: ~$5/month (50 GB SSD)
* ALB: ~$22/month (base + LCU usage)
* Data transfer: ~$9/month (first 100 GB free)
* Estimated total: ~$60–70/month plus [Wallarm subscription fees](../../../about-wallarm/subscription-plans/)

## Amazon ECS (Docker container) deployment

[You can deploy Wallarm (NGINX Node) in AWS using Amazon ECS](docker-container.md), either on EC2 instances or using AWS Fargate.

* ECS on EC2: You manage EC2 instances, ECS handles container orchestration. Costs are similar to [AMI-based deployment](#ami-based-deployment-ec2-instance) - EC2, EBS, optional ALB, and data transfer.
* ECS on Fargate: Fully managed. You pay for allocated vCPU and RAM per second. No need to manage EC2 instances.

AWS does not charge for ECS itself — only for the resources your containers run on.

Use the [AWS Pricing Calculator](https://calculator.aws/) for precise estimates based on region and traffic.

**Example estimate:**

In `us-west-2`, with 2 tasks (each with 1 vCPU and 2 GB RAM), ~10–15 million requests/month and ~200 GB outbound traffic:

* Fargate compute: ~$72/month (2 tasks × ~$36)
* ALB: ~$20/month (base + moderate traffic)
* Data transfer: ~$9/month (first 100 GB free, next 100 GB at $0.09/GB)
* Estimated total: ~$101/month plus [Wallarm subscription fees](../../../about-wallarm/subscription-plans/)

You may also use Amazon ECR for storing Wallarm images (usually negligible cost).
