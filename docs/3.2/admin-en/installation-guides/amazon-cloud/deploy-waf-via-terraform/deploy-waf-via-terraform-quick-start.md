# Quick start with Terraform example code

## Prerequisites

* Wallarm account in the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* Username and password of the user with the **Deploy** role added to your company's Wallarm account. To add a new user, please follow the [instructions](../../../../user-guides/settings/users.md#create-a-user)
* AWS account and user with the **admin** permissions
* Accepted Terms for the [WordPress Certified by Bitnami and Automattic](https://aws.amazon.com/marketplace/server/procurement?productId=7d426cb7-9522-4dd7-a56b-55dd8cc1c8d0) and [Wallarm Node (AI‑based NG-WAF instance) by Wallarm](https://aws.amazon.com/marketplace/server/procurement?productId=34faafd7-601d-43ac-8d22-3f2d839028c5) products on AWS Marketplace
* Installed [`terraform`](https://learn.hashicorp.com/terraform/getting-started/install.html) CLI tools version 0.12.18 or later
* Installed [`jq`](https://stedolan.github.io/jq/download/) CLI tools
* Installed [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) CLI tools
* Installed [`aws`](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) CLI tools

## Quick Start

1. [Download](#step-1-downloading-terraform-code-example) Terraform code example.
2. [Prepare](#step-2-preparing-terraform-environment-and-variables) Terraform environment and variables.
3. [Deploy](#step-3-deploying-described-stack) described stack.
4. [Test](#step-4-testing-wallarm-node-operation) Wallarm node operation.

### Step 1: Downloading Terraform code example

Terraform code used in this example can be cloned from the [GitHub repository](https://github.com/wallarm/terraform-example) using the following command:

``` bash
git clone -b stable/3.2 --single-branch https://github.com/wallarm/terraform-example.git
```

Configuration files are located in the `terraform` folder of the repository:

* `variables.tf` is used to define necessary Terraform variables which describe the managed environment
* `main.tf` holds the Terraform code which performed the actual AWS provisioning

### Step 2: Preparing Terraform environment and variables

1. Set environment variables with credentials for the Wallarm user with the **Deploy** role:
    ```
    export TF_VAR_deploy_username='DEPLOY_USERNAME'
    export TF_VAR_deploy_password='DEPLOY_PASSWORD'
    ```
    * `DEPLOY_USERNAME` is the email of the user with the **Deploy** role
    * `DEPLOY_PASSWORD` is the password of the user with the **Deploy** role
2. Set environment variables with your [AWS access keys](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys):
    ```
    export AWS_ACCESS_KEY_ID='YOUR_ACCESS_KEY_ID'
    export AWS_SECRET_ACCESS_KEY='YOUR_SECRET_ACCESS_KEY'
    ```
    * `YOUR_ACCESS_KEY_ID` is your access key ID
    * `YOUR_SECRET_ACCESS_KEY` is your secret access key
3. (Optional) Specify your public SSH key in the `key_pair` variable in the `variables.tf` file, if you plan to access the employed EC2 instances using SSH.
4. (Optional) Specify the `api.wallarm.com` API endpoint in the `wallarm_api_domain` variable in the `variables.tf` file, if you use the [EU Cloud](../../../../about-wallarm-waf/overview.md#eu-cloud). If you use the [US Cloud](../../../../about-wallarm-waf/overview.md#us-cloud), please leave an existing value.
5. (Optional) Set AWS region data in the variables listed below in the `variables.tf` file. The provided example is configured for AWS region `us-west-1` (North California).
    * `aws_region` (you can find the list of AWS regions [here](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html))
    * `az_a`
    * `az_b`
    * `wallarm_node_ami_id` with the used AWS EC2 Wallarm filtering node image ID got by the command below. Please replace `REGION_CODE` by `aws-region` value:
    ```
    aws ec2 describe-images --filters "Name=name,Values=*Wallarm Node-3.2*" --region REGION_CODE | jq -r '.Images[] | "\(.ImageId)"'
    ```

    * `wordpress_ami_id` with the used AWS EC2 Wordpress image ID got by the command below. Please replace `REGION_CODE` by `aws-region` value:
    ```
    aws ec2 describe-images --filters "Name=name,Values=*bitnami-wordpress-5.3.2-3-linux-ubuntu-16.04*" --region REGION_CODE | jq -r '.Images[] | "\(.ImageId)"'
    ```

### Step 3: Deploying described stack

1. Go to the `terraform` folder of the cloned repository:
    ```
    cd terraform-example/terraform
    ```
2. Deploy the whole stack using the following commands:

    ```
    terraform init
    terraform plan
    terraform apply
    ```

After a successful run, Terraform will print out a DNS name of the deployed NLB instance. For example:

```
Apply complete! Resources: 4 added, 2 changed, 4 destroyed.

Outputs:

waf_nlb_dns_name = [
  "tf-wallarm-demo-asg-nlb-7b32738728e6ea44.elb.us-east-1.amazonaws.com",
]
```

The DNS name can be used to access the freshly installed Wordpress service with Wallarm cluster deployed in front of it.

![!Installed Wordpress service](../../../../images/admin-guides/configuration-guides/terraform-guide/opened-dns-wordress.png)

### Step 4: Testing Wallarm node operation

The Wallarm cluster is configured with a self-signed SSL certificate so it should be possible to access the same DNS name using HTTPS protocol but the browser will show a security warning.

You can simulate a web attack by adding `/?id='or+1=1--a-<script>prompt(1)</script>'` to the web request - the request should be blocked by Wallarm with response code 403:

![!403 error code after sending an attack](../../../../images/admin-guides/configuration-guides/terraform-guide/attacked-source.png)

A few minutes after simulating a web attack it should be possible to see two blocked attacks - SQLI and XSS - in Wallarm Console → **Events**:

![!Sent attacks displayed in the Wallarm account](../../../../images/admin-guides/configuration-guides/terraform-guide/wallarm-account-with-attacks.png)

Wallarm node deployment settings are performed in the `wallarm_launch_config` object of the `main.tf` file. To change settings to your own, please use directive description available by the [link](../../../configure-parameters-en.md).

!!! info
    To remove the demonstration environment, please use the `terraform destroy` command.