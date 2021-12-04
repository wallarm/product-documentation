# Deploying Wallarm node using Terraform

Terraform is a tool to describe an infrastructure via configuration files and run a single application or your entire datacenter on the basis of these configuration files. To get more information, please use [Terraform official documentation](https://www.terraform.io/intro/index.html).

Wallarm filtering node can be also deployed via Terraform. These instructions provide an [example of Terraform code](https://github.com/wallarm/terraform-example) which can be easily used to deploy a cluster of Wallarm filtering node in AWS public cloud. The example code deploys a complete set of required AWS resources like VPC, subnets, routing tables, Security Groups, SSH public keys, etc, including a simple Wordpress application to be protected by the Wallarm filtering node.

!!! info "Recommended reading"
    * [Managing auto scaling groups and load balancers](https://hands-on.cloud/terraform-recipe-managing-auto-scaling-groups-and-load-balancers/) to better understand provided Terraform code
    * [Cloud config examples](https://cloudinit.readthedocs.io/en/latest/topics/examples.html) to better understand provided Terraform code

## Used resources

The example uses the following resources:

* An official [Wallarm Node AMI](https://aws.amazon.com/marketplace/server/procurement?productId=34faafd7-601d-43ac-8d22-3f2d839028c5) available on the AWS Marketplace
* AWS Autoscaling Group (ASG) feature for automatic scaling of cluster size up or down depending on CPU load of active nodes
* AWS CloudWatch metrics and alerts to monitor the CPU usage of active nodes
* AWS NLB load balancer instance to monitor the availability of registered nodes and distribute incoming web requests among healthy instances

While the document is based on the Official Wallarm Node AMI the same approach can be used for a custom Wallarm filtering node AMI built by you.

## Deployed network architecture

The provided Terraform code deploys the following network architecture:

* A new VPC called `tf-wallarm-demo` and associated resources like Public Subnets, Routing Table, Internet Gateway.
* An ASG managing a cluster of Wallarm filtering nodes. The ASG will use AWS's **User Data** feature to automatically configure new filtering nodes. The implemented provisioning process is mostly following the manual configuration process described on [this page](../../../installation-ami-en.md).
* An NLB instance facing the Internet and accepting incoming requests to ports 80/TCP and 443/TCP; the requests are passed to the Wallarm filtering nodes. The NLB instance will not terminate SSL sessions (assuming that the filtering nodes will provide the functionality).
* An ASG running a sample Wordpress application, and an associated ELB instance. The Wallarm nodes are automatically configured to proxy incoming requests to the DNS name of the Wordpress ELB instance.
