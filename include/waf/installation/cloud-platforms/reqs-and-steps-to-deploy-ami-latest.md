## Requirements

* An AWS account
* Understanding of AWS EC2, Security Groups
* Any AWS region of your choice, there are no specific restrictions on the region for the Wallarm node deployment

    Wallarm supports both single availability zone (AZ) and multi availability zone deployments. In multi-AZ setups, Wallarm Nodes can be launched in separate availability zones and placed behind a Load Balancer for high availability.
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Executing all commands on a Wallarm instance as a superuser (e.g. `root`)
 
## Installation

### 1. Launch a Wallarm Node instance

Launch an EC2 instance using the [Wallarm NGINX Node AMI](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe).

Recommended configuration: 

* Latest available [AMI version][latest-node-version]
* Any preferred AWS region
* EC2 instance type: `t3.medium` (for testing) or `m4.xlarge` (for production), [see cost guidance for details][aws-costs]
* [SSH key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html) for accessing the instance
* Appropriate [VPC and subnet](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) based on your infrastructure
* [Security Group](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-security-group.html) inbound access to ports 22, 80, and 443

    !!! info "Using a security group preconfigured by Wallarm"
        When you deploy the instance and create a security group, AWS prompts you to use the one preconfigured by Wallarm. This group already has all the necessary ports open for inbound access.

        ![!Preconfigured security group][img-security-group]

* [Security Group](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-security-group.html) outbound access to:

    * `https://meganode.wallarm.com` to download the Wallarm installer
    * `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][wallarm-api-via-proxy]
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-lists-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"

### 2. Connect to the Wallarm Node instance via SSH

[Use the selected SSH key](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html) to connect to your running EC2 instance:

```bash
ssh -i <your-key.pem> admin@<your-ec2-public-ip>
```

You need to use the `admin` username to connect to the instance.

### 3. Generate a token to connect an instance to the Wallarm Cloud

The Wallarm node needs to connect to the Wallarm Cloud using a Wallarm token of the [appropriate type][wallarm-token-types]. An API token allows you to create a node group in the Wallarm Console UI, helping you organize your node instances more effectively.

![Grouped nodes][img-grouped-nodes]

Generate a token as follows:

=== "API token"

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Node deployment/Deployment` usage type.
    1. Copy this token.
=== "Node token"

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Do one of the following: 
        * Create the node of the **Wallarm node** type and copy the generated token.
        * Use existing node group - copy token using node's menu → **Copy token**.
