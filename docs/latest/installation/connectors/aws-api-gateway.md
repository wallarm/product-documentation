[api-discovery]:                ../../api-discovery/overview.md



# Wallarm Connector for Amazon API Gateway



## Architecture overview

The solution consists of the two main components:

* A [Lambda function](https://docs.aws.amazon.com/lambda/latest/dg/concepts-basics.html), which monitors [API Gateway access logs](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html) and processes them for [API Discovery][api-discovery].
* A Terraform infrastructure, which deploys the Native Node on [Amazon Elastic Container Service](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) (Amazon ECS), the Lambda function, and the [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) log monitoring.

Let's dig deeper intop each component Terraform deployes.

* The Lambda function (`cw-resend-lambda/`):

    * Monitors CloudWatch log groups containing API Gateway access logs.
    * Processes and parses the log data.
    * Forwards the processed data to the Wallarm Native Node.

* The Wallarm Native Node:

* Is deployed Amazon ECS using the EC2 launch type.
* Configures VPC with public and private subnets.
* Is set up with [Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html).
* (Optional) Can be [configured with Route53 DNS records](#ssl-connection-configuration).

Lambda function:

Creates the CloudWatch log processing Lambda function
Sets up IAM permissions for CloudWatch Logs access
Configures environment variables for node communication


CloudWatch integration:

Creates or uses existing CloudWatch log group for API Gateway
Sets up log subscription filter to forward logs to Lambda
Configures proper IAM permissions for log processing





## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of AWS CloudFront and Amazon API Gateway technologies.
* AWS CLI configured with the necessary permissions
* Terraform version 1.0 or later

## Deployment

### 1. Get a Wallarm token

--8<-- "../include/waf/installation/get-api-or-node-token.md"

### 2. Create an IAM policy for Terraform to manage AWS resources

Go to the AWS Management Console and [create the following IAM policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html#access_policies_create-json-editor) using the JSON editor:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"ec2:Describe*",
				"ec2:Create*",
				"ec2:Delete*",
				"ec2:Modify*",
				"ec2:Associate*",
				"ec2:Disassociate*",
				"ec2:Attach*",
				"ec2:Detach*",
				"ec2:Replace*",
				"ec2:Revoke*",
				"ec2:Allocate*",
				"ec2:AuthorizeSecurityGroup*",
				"ec2:RunInstances",
				"ec2:*Address"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"iam:Create*",
				"iam:Get*",
				"iam:Pass*",
				"iam:Delete*",
				"iam:Add*",
				"iam:Remove*",
				"iam:List*",
				"iam:Tag*",
				"iam:Put*",
				"iam:Attach*"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"elasticloadbalancing:Create*",
				"elasticloadbalancing:Describe*",
				"elasticloadbalancing:Modify*",
				"elasticloadbalancing:Delete*",
				"elasticloadbalancing:AddTags",
				"elasticloadbalancing:RemoveTags",
				"elasticloadbalancing:RegisterTargets"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"logs:Create*",
				"logs:Put*",
				"logs:Describe*",
				"logs:Delete*",
				"logs:List*",
				"logs:Tag*"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"route53:*HostedZone",
				"route53:Change*"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"ssm:Get*"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"lambda:Create*",
				"lambda:Update*",
				"lambda:Delete*",
				"lambda:Get*",
				"lambda:GetFunction",
				"lambda:List*",
				"lambda:Invoke*",
				"lambda:Publish*",
				"lambda:Add*",
				"lambda:Remove*",
				"lambda:Tag*",
				"lambda:Untag*"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"ecs:*"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"autoscaling:CreateAutoScalingGroup",
				"autoscaling:Describe*",
				"autoscaling:UpdateAutoScalingGroup",
				"autoscaling:DeleteAutoScalingGroup"
			],
			"Resource": "*"
		}
	]
}
```

### 3. Deploy Terraform

1. [Clone the repository](https://gl.wallarm.com/wallarm-node/connectors/aws-api-gateway-api-discovery/-/tree/NODE-7048-api-gateway?ref_type=heads):

    ```
    git clone <repository-url>
    cd aws-api-gateway-api-discovery
    ```

1. Copy the `terraform.tfvars` example file:

    ```
    cp terraform/terraform.tfvars.example terraform/terraform.tfvars
    ```

1. Edit the copied file configuring the following variables.

    **Required variables**:

    | Variable | Description | Default | 
    | --------- | ----------- | --------- |
    | `wallarm_api_host` | Wallarm API server | `api.wallarm.com` | 
    | `wallarm_api_token` | Wallarm API token [created during step 1](#1-get-a-wallarm-token) | `your-token-here` | 
    | `x_wallarm_application_id` | [Wallarm application ID](../../user-guides/settings/applications.md) | `-1` | 

    **Optional variables**:

    | Variable | Description | Default | 
    | --------- | ----------- | --------- |
    | `region` | [AWS region](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html)| `us-east-1` | 
    | `name_prefix` | Resource name prefix (maximum 38 characters) | `api-gw-discovery` |
    | `node_image` | Docker image for native node | `wallarm/node-native-aio` | 
    | `node_tag` | Docker image tag | `latest` | 
    | `node_group` | Node group identifier | `""` | 
    | `r53_domain_name` | [Amazon Route 53 domain name](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html). [See more details]() | `""` | 
    | `node_dns_name` | Node DNS record name. [See more details]()  | `""` | 
    | `api_gateway_log_group_name` | [A log group](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html) created by Amazon API Gateway for your API | `""` | 

1. Deploy the Terraform infrastructure:

    ```
    cd terraform
    terraform init
    terraform plan
    terraform apply
    ```
1. Once your infrastructed is deployed, you will see the log groups artifacts created by Terraform (see the screenshot below). Copy the `api_gateway_log_group_arn` value. You will need it for the next step.

### 4. Configure CloudWatch API logging using the API Gateway console

1. [Go the API Gateway console](https://console.aws.amazon.com/apigateway).
1. In the main navigation pane, choose **APIs**, and then click the name of your API.
1. Go to **Stages** → your stage (e.g., `prod`), scroll down to the **Logs and tracing** section, and then click **Edit**.
1. Under "CloudWatch logs", select "Errors and info logs" and toggle on "Custom access logging".
1. Under "Access log destination ARN", paste `api_gateway_log_group_arn` copied during the previous step.
1. In the "Log format" section, paste the following JSON log format. It is optimized and contains only essential fields:

```json
{ "requestId": "$context.requestId", "httpMethod": "$context.httpMethod", "path": "$context.path", "protocol": "$context.protocol", "status": "$context.status", "responseLength": "$context.responseLength", "requestTime": "$context.requestTime", "requestTimeEpoch": "$context.requestTimeEpoch", "responseLatency": "$context.responseLatency", "integrationLatency": "$context.integrationLatency", "integrationStatus": "$context.integrationStatus", "errorMessage": "$context.error.message", "stage": "$context.stage", "domainName": "$context.domainName", "sourceIp": "$context.identity.sourceIp", "userAgent": "$context.identity.userAgent" }
```
1. Click **Save**.

[See more details on configuring CloudWatch API logging using the API Gateway console](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html#set-up-access-logging-using-console).

### 5. Check the API Discovery dashboard

If the infrastructure was deployed correctly, [API Discovery][api-discovery] is automatically enabled.

Generate some traffic to your API's endpoints (e.g., via `curl`) to make the [API Discovery dashboard](../../api-discovery/dashboard.md) appear.

If you have any issues, refer to the ["Logs and troubleshooting" section](#logs-and-troubleshooting).

## SSL connection configuration

For secure HTTPS connection between AWS Lambda and the Native Node, you need to define the `r53_domain_name` and `node_dns_name` variables in the `terraform.tfvars` file.

When both variables are set, AWS Lambda will automatically use HTTPS to communicate with the Native Node using the configured domain name. An [ACM SSL certificate](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) will be automatically created and configured for the domain.

## Logs and troubleshooting

See common issues and their corresponding troubleshooting solutions below:

* AWS Lambda is not receiving logs:

    * Verify that the CloudWatch log subscription filter is created.
    * Check the Lambda IAM permissions for CloudWatch Logs.
    * Ensure that API Gateway is writing to the correct log group.

* The Native Node is not accessible:

    * Check the ECS service status.
    * Verify [Health checks for Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html).
    * Check the security group rules.

* API Discovery is not working:

    * Verify environment variables in AWS Lambda.
    * [Check the Native Node connectivity](https://docs.wallarm.com/admin-en/uat-checklist-en/#node-registers-all-traffic).
    * [Check the Wallarm API credentials](https://docs.wallarm.com/user-guides/settings/api-tokens/).

For troubleshooting, you can also review the following logs:

* Lambda Logs: `/aws/lambda/wallarm-cw-resend-{random_name}`
* API Gateway Logs: `/aws/apigateway/wallarm-api-discovery-{random_name}`
* ECS service logs in CloudWatch