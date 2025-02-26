[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Azion Edge Firewall with Wallarm Functions

[Azion Edge Functions](https://www.azion.com/en/products/edge-functions/) enable the execution of custom code at the network edge, allowing for the implementation of customer rules to handle requests. By incorporating Wallarm custom code, incoming traffic can be proxied to the Wallarm node for analysis and filtering. This setup enhances the security measures already provided by [Azion Edge Firewall](https://www.azion.com/en/products/edge-firewall/). This guide provides instructions on how to integrate the Wallarm node with Azion Edge to protect services running on Azion Edge.

The solution involves deploying the Wallarm node externally and injecting custom code or policies into the specific platform. This enables traffic to be directed to the external Wallarm node for analysis and protection against potential threats. Referred to as Wallarm's connectors, they serve as the essential link between platforms like Azion Edge, Akamai Edge, Mulesoft, Apigee, and AWS Lambda, and the external Wallarm node. This approach ensures seamless integration, secure traffic analysis, risk mitigation, and overall platform security.

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for the following use cases:

* Securing APIs or traffic running on Azion Edge.
* Requiring a security solution that offers comprehensive attack observation, reporting, and instant blocking of malicious requests.

## Limitations

The solution has certain limitations as it only works with incoming requests:

* Vulnerability discovery using the [passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) method does not function properly. The solution determines if an API is vulnerable or not based on server responses to malicious requests that are typical for the vulnerabilities it tests.
* The [Wallarm API Discovery](../../api-discovery/overview.md) cannot explore API inventory based on your traffic, as the solution relies on response analysis.
* The [protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md) is not available since it requires response code analysis.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of Azion Edge technologies
* APIs or traffic running on Azion Edge.

## Deployment

To secure APIs on Azion Edge with Wallarm, follow these steps:

1. Deploy a Wallarm node using one of the available deployment options.
1. Obtain the Wallarm code for Edge Functions and run it on Azion.

### 1. Deploy a Wallarm node

When utilizing Wallarm on Azion Edge, the traffic flow is [in-line](../inline/overview.md).

1. Choose one of the [supported Wallarm node deployment solutions or artifacts](../supported-deployment-options.md#in-line) for in-line deployment and follow the provided deployment instructions.
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

        real_ip_header X-EDGEWRK-REAL-IP;
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

### 2. Obtain the Wallarm code for Edge Functions and run it on Azion

To acquire and run the Wallarm code for Azion Edge Functions, follow these steps:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm code.
1. On Azion Edge, go to **Billing & Subscriptions** and activate subscription on **Application Acceleration** and **Edge Functions**.
1. Create a new **Edge Application** and save it.
1. Open the created application → **Main Settings** and enable **Application Acceleration** and **Edge Functions**.
1. Navigate to **Domains** and click **Add Domain**.
1. Navigate to **Edge Functions**, click **Add Function** and choose the `Edge Firewall` type.
1. Paste the Wallarm source code replacing `wallarm.node.tld` with the address of [previously deployed Wallarm node](#1-deploy-a-wallarm-node).
1. Go to **Edge Firewall** → **Add Rule Set** → type **Name** → select **Domains** and turn on **Edge Functions**.
1. Switch to the **Functions** tab, click **Add Function** and select the previously created function.
1. Switch to the **Rules Engine** tab → **New Rule** and set the criteria for traffic to be filtered by Wallarm:

    * To analyze and filter all request, select `If Request URI starts with /`.
    * In **Behaviors**, choose `Then Run Function` and select the previously created function.

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

If you encounter any issues or require assistance with the described deployment of Wallarm in conjunction with Azion Edge, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
