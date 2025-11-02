[api-discovery]:                ../../api-discovery/overview.md
[api-inventory]:                ../../api-discovery/exploring.md
[api-traffic]:                 ../../api-discovery/overview.md#noise-detection
[native-node]:                 ../../installation/nginx-native-node-internals.md#native-node
[native-node-versions]:        ../../updating-migrating/native-node/node-artifact-versions.md
[native-node-logs]:           ../../admin-en/configure-logging.md


# Wallarm Connector for Amazon API Gateway (API Discovery)

The Wallarm Connector for Amazon API Gateway automatically builds an [API inventory][api-inventory] from real traffic by relying on CloudWatch logs.

## How it works

This connector does not inspect or block malicious requests. Instead, it uses a Lambda function to monitor CloudWatch logs from API Gateway, parse the log data, and forward relevant metadata to a Wallarm Native Node running on [Amazon Elastic Container Service](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) (Amazon ECS). The result is your [**API inventory**][api-inventory].

## Terraform deployment

The Terraform configuration automatically deploys all AWS resources required for the Wallarm Connector for Amazon API Gateway. It sets up a complete environment that connects Amazon API Gateway logs to the Wallarm Native Node for API Discovery.

![Amazon API Gateway diagram](../../images/waf-installation/gateways/aws-api-discovery/aws-api-gateway.png)

### Wallarm Native Node in ECS

Terraform deploys a [Wallarm Native Node][native-node] as an ECS service.  
Key components include:

* VPC integration – the Node runs in private subnets within a VPC that also contains public subnets for the [Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) (ALB)
* ECS Cluster – manages the containerized Node workload  
* ECS Service – runs the Node container image (`wallarm/node-native-aio`) using the EC2 launch type  
* Application Load Balancer (ALB) – exposes the Node endpoint via HTTPS and routes requests from the Lambda function to ECS tasks  
* ACM Certificate – provides TLS encryption for the ALB endpoint  
* (Optional) Route 53 Record  – assigns a DNS name to the ALB for easier access  
* AWS Cloud Map (Service Discovery) – enables internal name resolution for the Node service within the VPC

### AWS Lambda for log processing

Terraform creates a [Lambda function](https://docs.aws.amazon.com/lambda/latest/dg/concepts-basics.html) (`cw-resend-lambda/`) that:

* Subscribes to Amazon CloudWatch Logs from [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html)
* Parses API Gateway log entries and extracts API metadata  
* Forwards structured metadata to the Wallarm Node via the ALB  
* Configures the following environment variables for Node communication:
    * `X_WALLARM_APPLICATION_ID` — Wallarm Application ID  
    * `X_NODE_URL` — Native Node ALB DNS name  
    * `X_NODE_SCHEME` — Native Node protocol (HTTP or HTTPS)

All IAM roles and permissions required for Lambda execution and CloudWatch access are automatically provisioned. 

### CloudWatch log delivery integration

Terraform configures CloudWatch to serve as the communication channel between API Gateway and the Lambda function:

* Creates or reuses a CloudWatch log group for API Gateway  
* Adds a log subscription filter to stream new log events to the Lambda function
* Grants permissions for CloudWatch to invoke the Lambda function
* Configures IAM permissions for log processing

This enables near real-time delivery of API Gateway traffic logs for processing.

## Limitations

At the moment, this connector does not detect or monitor attacks. Its primary purpose is to build your [API inventory][api-inventory] using the [API Discovery][api-discovery] feature.

## Requirements

To proceed with the deployment, ensure that the following requirements are met:

* API deployed in Amazon API Gateway
* Understanding of AWS CloudFront and Amazon API Gateway technologies
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) configured with the necessary permissions
* [Native Node version 0.20.0 or later][native-node-versions]
* Terraform version 1.0 or later

## Deployment

### 1. Prepare a Wallarm token

To install the node, you will need a token for registering the node in the Wallarm Cloud. To prepare a token:

1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Find or create an API token with the `Node deployment/Deployment` usage type.
1. Copy this token.

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

1. Contact sales@wallarm.com to get the Terraform configuration for the connector.
1. Copy the `terraform.tfvars` example file:

    ```
    cp terraform/terraform.tfvars.example terraform/terraform.tfvars
    ```

1. Edit the copied file and configure the following variables:

    **Required variables**:

    | Variable | Description | Default | 
    | --------- | ----------- | --------- |
    | `wallarm_api_host` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul> | `api.wallarm.com` | 
    | `wallarm_api_token` | Wallarm API token [created in Step 1](#1-prepare-a-wallarm-token). | `your-token-here` | 
    | `x_wallarm_application_id` | [Wallarm application ID](../../user-guides/settings/applications.md). | `-1` | 
   
    **Optional variables**:

    | Variable | Description | Default | 
    | --------- | ----------- | --------- |
    | `region` | [AWS region](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html) where all resources will be deployed. | `us-east-1` | 
    | `name_prefix` | Resource name prefix (maximum 38 characters). | `api-gw-discovery` |
    | `node_image` | Docker image for the Native Node. | `wallarm/node-native-aio` | 
    | `node_tag` | Docker image tag. | `latest` | 
    | `node_group` | Node group identifier. | `api-gateway-api-discovery` | 
    | `r53_domain_name` | To enable secure HTTPS communication between AWS Lambda and the Native Node, define the [Amazon Route 53 domain name](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html). When both `r53_domain_name` and `node_dns_name` are set, AWS Lambda will automatically use HTTPS to communicate with the Native Node using the configured domain name. An [ACM SSL certificate](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) will be automatically created and configured for the domain. | `""` | 
    | `node_dns_name` | To enable secure HTTPS communication between AWS Lambda and the Native Node, define the Node DNS record name. When both `r53_domain_name` and `node_dns_name` are set, AWS Lambda will automatically use HTTPS to communicate with the Native Node using the configured domain name. An [ACM SSL certificate](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) will be automatically created and configured for the domain.  | `""` | 
    | `api_gateway_log_group_name` | [Log group](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html) created by Amazon API Gateway for your API. | `""` | 

1. Deploy the Terraform infrastructure:

    ```
    cd terraform
    terraform init
    terraform plan
    terraform apply
    ```
1. Once your infrastructure is deployed, you will see the log groups artifacts created by Terraform (see the screenshot below). Copy the `api_gateway_log_group_arn` value. You will need it for the next step.

    ![Artifacts created by Terraform](../../images/waf-installation/gateways/amazon-api-gateway/terraform-deployment.png)

### 4. Configure CloudWatch API logging using the API Gateway console

1. [Go to the API Gateway console](https://console.aws.amazon.com/apigateway).
1. In the main navigation panel, choose **APIs**, and then click the name of your API.
1. Go to **Stages** → your stage (e.g., `prod`), scroll down to the **Logs and tracing** section, and then click **Edit**.
1. Under **CloudWatch logs**, select **Errors and info logs** and toggle on **Custom access logging**.
1. Under **Access log destination ARN**, paste the `api_gateway_log_group_arn` copied in the previous step.
1. In the **Log format** section, paste the following JSON log format (optimized to include only essential fields):

    ```json
    { "requestId": "$context.requestId", "httpMethod": "$context.httpMethod", "path": "$context.path", "protocol": "$context.protocol", "status": "$context.status", "responseLength": "$context.responseLength", "requestTime": "$context.requestTime", "requestTimeEpoch": "$context.requestTimeEpoch", "responseLatency": "$context.responseLatency", "integrationLatency": "$context.integrationLatency", "integrationStatus": "$context.integrationStatus", "errorMessage": "$context.error.message", "stage": "$context.stage", "domainName": "$context.domainName", "sourceIp": "$context.identity.sourceIp", "userAgent": "$context.identity.userAgent" }
    ```

1. Click **Save**.

[See more details on configuring CloudWatch API logging using the API Gateway console](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html#set-up-access-logging-using-console).

### 5. Check the API Discovery inventory

If the infrastructure was deployed correctly, the [API Discovery][api-discovery] feature is automatically enabled.

Generate traffic to your API endpoints (e.g., using `curl`) to build the [API inventory][api-inventory] and populate the API Discovery dashboard.

Wallarm builds the API inventory only after receiving a [sufficient number of requests for each endpoint][api-traffic].

![Amazon API Gateway inventory](../../images/waf-installation/gateways/aws-api-discovery/aws-api-gateway-inventory.png)

If you have any issues, refer to the ["Logs and troubleshooting" section](#logs-and-troubleshooting).

## Logs and troubleshooting

See common issues and their corresponding troubleshooting solutions below:

* AWS Lambda is not receiving logs:

    * Verify that the CloudWatch log subscription filter is created
    * Check the Lambda IAM permissions for CloudWatch Logs
    * Ensure that API Gateway is writing to the correct log group

* The Native Node is not accessible:

    * Check the ECS service status
    * [Check the Native Node logs][native-node-logs]
    * Verify [Application Load Balancer health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html)
    * Check the security group rules

* API Discovery is not working:

    * Verify environment variables in AWS Lambda
    * [Check the Native Node connectivity](https://docs.wallarm.com/admin-en/uat-checklist-en/#node-registers-all-traffic)
    * [Check Wallarm API credentials](https://docs.wallarm.com/user-guides/settings/api-tokens/)

For troubleshooting, you can also review the following logs:

* Native Node logs: `go-node.log`
* Lambda Logs: `/aws/lambda/wallarm-cw-resend-{random_name}`
* API Gateway Logs: `/aws/apigateway/wallarm-api-discovery-{random_name}`
* ECS service logs in CloudWatch
