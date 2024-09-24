[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[wallarm-hosted-connector-desc]:    ../connectors/overview.md#wallarm-edge-connectors
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md

# Wallarm Connector for Amazon CloudFront

[CloudFront](https://aws.amazon.com/cloudfront/) is a content delivery network operated by Amazon Web Services. Wallarm can act as a connector to secure and monitor traffic delivered through CloudFront.

To use Wallarm as a connector for CloudFront, you need to **deploy the Wallarm node externally** and **run Wallarm-provided Lambda@Edge functions** to route traffic to the Wallarm node for analysis.

The CloudFront connector supports both [in-line](../inline/overview.md) and [out-of-band](../oob/overview.md) traffic analysis:

=== "In-line traffic flow"

    If Wallarm is configured to block malicious activity:

    ![Cloudfront with Wallarm - in-line scheme](../../images/waf-installation/gateways/cloudfront/traffic-flow-inline.png)
=== "Out-of-band traffic flow"
    ![Cloudfront with Wallarm - out-of-band scheme](../../images/waf-installation/gateways/cloudfront/traffic-flow-oob.png)

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is recommended in case when you deliver traffic through Amazon CloudFront.

## Limitations

* The following [restrictions apply to Lambda@Edge functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-edge-function-restrictions.html#lambda-at-edge-restrictions-request-body):

    * The body size is limited to 40 KB for viewer requests and 1MB for origin requests.
    * The maximum response time from the Wallarm node is 5 seconds for viewer requests and 30 seconds for origin requests.
    * Lambda@Edge does not support private networks (VPC).
    * The default limit for concurrent requests is 1,000 per region, but it can be increased up to tens of thousands.
* Vulnerability detection based on [passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) and API [response structure in API Discovery](../../api-discovery/exploring.md#endpoint-details) are limited due to Lambda@Edge response trigger restrictions. Since Wallarm functions cannot receive response bodies and rely on them, these features are unavailable.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of AWS CloudFront and Lambda technologies.
* APIs or traffic running on AWS.

## Deployment

### 1. Deploy a Wallarm node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

=== "Wallarm Edge node"
    --8<-- "../include/waf/installation/security-edge/add-connector.md"
=== "Self-hosted node"
    The current self-hosted node deployment has limitations. Full response analysis is not yet supported, which is why:

    * Vulnerability discovery using the [passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) method does not function properly. The solution determines if an API is vulnerable or not based on server responses to malicious requests that are typical for the vulnerabilities it tests.
    * The [Wallarm API Discovery](../../api-discovery/overview.md) cannot explore API inventory based on your traffic, as the solution relies on response analysis.
    * The [protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md) is not available since it requires response code analysis.

    To deploy a self-hosted node for the connector:

    1. Allocate an instance for deploying the node.
    1. Choose one of the supported Wallarm node deployment solutions or artifacts for the [in-line](../supported-deployment-options.md#in-line) or [out-of-band](../oob/overview.md) deployment and follow the provided deployment instructions.
    1. Configure the deployed node using the following template:

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

            real_ip_header X-REAL-IP;
            set_real_ip_from unix:;

            location / {
                echo_read_request_body;
            }
        }
        ```

        Please ensure to pay attention to the following configurations:

        * TLS/SSL certificates for HTTPS traffic: To enable the Wallarm node to handle secure HTTPS traffic, configure the TLS/SSL certificates accordingly. The specific configuration will depend on the chosen deployment method. For example, if you are using NGINX, you can refer to [its article](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) for guidance.
        * [Wallarm operation mode](../../admin-en/configure-wallarm-mode.md) configuration.

    1. Once the deployment is complete, make a note of the node instance IP as you will need it later to set the address for incoming request forwarding.

### 2. Obtain and deploy the Wallarm Lambda@Edge functions

To connect your CloudFront CDN with the Wallarm node, you need to deploy the Wallarm Lambda@Edge functions on AWS.

There are two Python-based functions: one for request forwarding and analysis, and another for response forwarding and analysis.

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to get the Wallarm Lambda@Edge functions for your connector deployment (Wallarm- or self-hosted).
1. Proceed to your AWS Console → **Services** → **Lambda** → **Functions**.
1. Select the `us-east-1` (N. Virginia) region which is [required for Lambda@Edge functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function).
1. **Create function** with the following settings:

    * Runtime: Python 3.x.
    * Execution role: **Create a new role from AWS policy templates** → **Basic Lambda@Edge permissions (for CloudFront trigger)**.
    * Other settings can remain as default.
1. Once the function is created, on the **Code** tab, paste the Wallarm request processing code.
1. Update the following parameters in the code:

    * `wlrm_node_addr`: your [Wallarm node instance](#1-deploy-a-wallarm-node) address.
    * `wlrm_inline`: if using [out-of-band](../oob/overview.md) mode, set to `False`.
    * If necessary, modify other parameters.
1. Proceed to **Actions** → **Deploy to Lambda@Edge** and specify the following settings:

    * Configure new CloudFront trigger.
    * Distribution: your CDN that routes traffic to the origin you want to protect.
    * Cache behavior: the cache behavior for the Lambda function, typically `*`.
    * CloudFront event: 
        * **Origin request**: executes the function only when CloudFront CDN requests data from the backend. If CDN returns a cached response, the function will not be executed.
        * **Viewer request**: executes the function for every request to CloudFront CDN.
    * Check **Include body**.
    * Check **Confirm deploy to Lambda@Edge**.

    ![Cloudfront function deployment](../../images/waf-installation/gateways/cloudfront/function-deploy.png)
1. Repeat the procedure for the Wallarm-provided response function, selecting responses as the trigger.

    Ensure the response trigger matches the request trigger (origin response for origin request, viewer response for viewer request).

## Testing

To test the functionality of the deployed functions, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your CloudFront CDN:

    ```
    curl http://<CLOUDFRONT_CDN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking, the request will also be blocked.

## Troubleshooting

--8<-- "../include/waf/installation/security-edge/connector-troubleshooting.md"
