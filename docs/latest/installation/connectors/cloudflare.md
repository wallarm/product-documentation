[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png

# Wallarm Connector for Cloudflare

[Cloudflare](https://www.cloudflare.com/) is a security and performance service which offers features designed to enhance the security, speed, and reliability of websites and internet applications, including CDN, WAF, DNS services and SSL/TLS encryption. Wallarm can act as a connector to secure APIs running on Cloudflare.

To use Wallarm as a connector for Cloudflare, you need to **deploy the Wallarm node externally** and **run a Cloudflare worker using the Wallarm-provided code** to route traffic to the Wallarm node for analysis.

<a name="cloudflare-modes"></a> The Cloudflare connector supports both [in-line](../inline/overview.md) and [out-of-band](../oob/overview.md) traffic flows:

=== "In-line traffic flow"

    If Wallarm is configured to block malicious activity:

    ![Cloudflare with Wallarm - in-line scheme](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-inline.png)
=== "Out-of-band traffic flow"
    ![Cloudflare with Wallarm - out-of-band scheme](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-oob.png)

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is recommended in case when you provide access to your applications via Cloudflare.

## Limitations

* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of Cloudflare technologies.
* APIs or traffic running through Cloudflare.

## Deployment

### 1. Deploy a Wallarm node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

=== "Edge node"
    To deploy a Wallarm-hosted node for the connector, follow the [instructions](../se-connector.md).
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

### 2. Obtain and deploy the Wallarm worker code

To run a Cloudflare worker routing traffic to the Wallarm node:

1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** and download a code bundle for your platform.
1. [Create a Cloudflare worker](https://developers.cloudflare.com/workers/get-started/dashboard/) using the downloaded code.
1. Set the address of your [Wallarm node instance](#1-deploy-a-wallarm-node) in the `wallarm_node` parameter.
1. If using [out-of-band](../oob/overview.md) mode, set the `wallarm_mode` parameter to `async`.

    Based on the selected mode, the worker controls whether traffic goes through the Wallarm node inline or if original traffic proceeds while a copy is inspected for malicious activities.

    ![Cloudflare worker](../../images/waf-installation/gateways/cloudflare/worker-deploy.png)
1. In **Website** → your domain, go to **Workers Routes** → **Add route**:

    * In **Route**, specify the paths to be routed to Wallarm for analysis (e.g., `*.example.com/*` for all paths).
    * In **Worker**, select the Wallarm worker you created.

    ![Cloudflare add route](../../images/waf-installation/gateways/cloudflare/add-route.png)

## Testing

To test the functionality of the deployed solution, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking and the traffic flows in-line, the request will also be blocked.
