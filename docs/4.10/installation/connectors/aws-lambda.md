[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Wallarm Node.js for AWS Lambda

[AWS Lambda@Edge](https://aws.amazon.com/lambda/edge/) is a serverless, event-driven compute service that allows you to run code for various types of applications or backend services without the need to provision or manage servers. By incorporating Wallarm Node.js code, you can proxy incoming traffic to the Wallarm node for analysis and filtering. This article provides instructions on configuring Wallarm for traffic analysis and filtration specifically for Node.js lambdas in your AWS application.

<!-- ![Lambda](../../images/waf-installation/gateways/aws-lambda-traffic-flow.png) -->

The solution involves deploying the Wallarm node externally and injecting custom code or policies into the specific platform. This enables traffic to be directed to the external Wallarm node for analysis and protection against potential threats. Referred to as Wallarm's connectors, they serve as the essential link between platforms like Azion Edge, Akamai Edge, MuleSoft, Apigee, and AWS Lambda, and the external Wallarm node. This approach ensures seamless integration, secure traffic analysis, risk mitigation, and overall platform security.

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for the following use cases:

* Securing applications on AWS that utilize Node.js lambdas.
* Requiring a security solution that offers comprehensive attack observation, reporting, and instant blocking of malicious requests.

## Limitations

The solution has certain limitations as it only works with incoming requests:

* Vulnerability discovery using the [passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) method does not function properly. The solution determines if an API is vulnerable or not based on server responses to malicious requests that are typical for the vulnerabilities it tests.
* The [Wallarm API Discovery](../../api-discovery/overview.md) cannot explore API inventory based on your traffic, as the solution relies on response analysis.
* The [protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md) is not available since it requires response code analysis.

There are also other limitations:

* The HTTP packet body size is limited to 40 KB when intercepted at the Viewer request level and 1MB at the Origin request level.
* The maximum response time from the Wallarm node is limited to 5 seconds for Viewer requests and 30 seconds for Origin requests.
* Lambda@Edge does not work within private networks (VPC).
* The maximum number of concurrently processed requests per region is 1,000 (Default Quota), but it can be increased up to tens of thousands.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of AWS Lambda technologies.
* APIs or traffic running on AWS.

## Deployment

To secure with Wallarm applications on AWS that use Node.js lambdas, follow these steps:

1. Deploy a Wallarm node on the AWS instance.
1. Obtain the Wallarm Node.js script for AWS Lambda and run it.

### 1. Deploy a Wallarm node

When integrating Wallarm with AWS Lambda, the traffic flow operates [in-line](../inline/overview.md). Therefore, choose one of the supported Wallarm node deployment artifacts for in-line deployment on AWS:

* [AWS AMI](../packages/aws-ami.md)
* [Amazon Elastic Container Service (ECS)](../cloud-platforms/aws/docker-container.md)

Configure the deployed node using the following template:

```
server {
    listen 80;

    server_name _;

	access_log off;
	wallarm_mode off;

	location / {
		proxy_set_header Host $http_x_forwarded_host;
		proxy_pass http://unix:/tmp/wallarm-nginx.sock;
	}
}

server {
    listen 443 ssl;

    server_name yourdomain-for-wallarm-node.tld;

	### SSL configuration here

	access_log off;
	wallarm_mode off;

	location / {
		proxy_set_header Host $http_x_forwarded_host;
		proxy_pass http://unix:/tmp/wallarm-nginx.sock;
	}
}


server {
	listen unix:/tmp/wallarm-nginx.sock;
	
	server_name _;
	
	wallarm_mode monitoring;
	#wallarm_mode block;

	real_ip_header X-Lambda-Real-IP;
	set_real_ip_from unix:;

	location / {
		echo_read_request_body;
	}
}
```

Please ensure to pay attention to the following configurations:

* TLS/SSL certificates for HTTPS traffic: To enable the Wallarm node to handle secure HTTPS traffic, configure the TLS/SSL certificates accordingly. The specific configuration will depend on the chosen deployment method. For example, if you are using NGINX, you can refer to [its article](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) for guidance.
* [Wallarm operation mode](../../admin-en/configure-wallarm-mode.md) configuration.

### 2. Obtain the Wallarm Node.js script for AWS Lambda and run it

To acquire and run the Wallarm Node.js script on AWS Lambda, follow these steps:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm Node.js.
1. [Create](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) a new IAM policy with the following permissions: 

    ```
    lambda:CreateFunction, 
    lambda:UpdateFunctionCode, 
    lambda:AddPermission, 
    iam:CreateServiceLinkedRole, 
    lambda:GetFunction, 
    lambda:UpdateFunctionConfiguration, 
    lambda:DeleteFunction, 
    cloudfront:UpdateDistribution, 
    cloudfront:CreateDistribution, 
    lambda:EnableReplication. 
    ```
1. In the AWS Lambda service, create a new function using Node.js 14.x as the runtime and the role created in the previous step. Choose **Create a new role with basic Lambda permissions**.
1. In the code source editor, paste the code received from the Wallarm support team.
1. In the pasted code, update the `WALLARM_NODE_HOSTNAME` and `WALLARM_NODE_PORT` values to point to the [previously deployed Wallarm node](#1-deploy-a-wallarm-node).
    
    To send the traffic to the filtering node via 443/SSL, use the following configuration:

    ```
    const WALLARM_NODE_PORT = '443';

    var http = require('https');
    ```

    If you are using a self-signed certificate, make the following change to disable strict certificate enforcement:

    ```
    var post_options = {
        host: WALLARM_NODE_HOSTNAME,
        port: WALLARM_NODE_PORT,
        path: request.uri + request.querystring,
        method: request.method,
        // only need if self-signed cert
        rejectUnauthorized: false, 
        // 
        headers: newheaders
        
    };
    ```
1. Go back to the IAM section and edit the newly created role by attaching the following policies: `AWSLambda_FullAccess`, `AWSLambdaExecute`, `AWSLambdaBasicExecutionRole`, `AWSLambdaVPCAccessExecutionRole`, and `LambdaDeployPermissions` created in the previous step.
1. In Trust relationships, add the following change to **Service**:

    ```
    "Service": [
                        "edgelambda.amazonaws.com",
                        "lambda.amazonaws.com"
                    ]
    ```
1. Navigate to Lambda → Functions → <YOUR_FUNCTION> and click **Add Trigger**.
1. In the Deploy to Lambda@Edge options, click **Deploy to Lambda@Edge** and select the CloudFront Distribution that needs to have the Wallarm handler added or create a new one.

    During the process, choose the **Viewer request** for the CloudFront event and check the box for **Include body**.

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking, the request will also be blocked.

## Need assistance?

If you encounter any issues or require assistance with the described deployment of Wallarm in conjunction with AWS Lambda, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
