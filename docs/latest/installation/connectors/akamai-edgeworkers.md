[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Akamai EdgeWorkers with Wallarm Code Bundle

[Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs) is a powerful edge computing platform that allows for the execution of custom logic and the deployment of lightweight JavaScript functions at the edge of the platform. For customers who have their APIs and traffic running on Akamai EdgeWorkers, Wallarm provides a code bundle that can be deployed on Akamai EdgeWorkers to secure their infrastructure.

The solution involves deploying the Wallarm node externally and injecting custom code or policies into the specific platform. This enables traffic to be directed to the external Wallarm node for analysis and protection against potential threats. Referred to as Wallarm's connectors, they serve as the essential link between platforms like Azion Edge, Akamai Edge, Mulesoft, Apigee, and AWS Lambda, and the external Wallarm node. This approach ensures seamless integration, secure traffic analysis, risk mitigation, and overall platform security.

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for the following use cases:

* Securing APIs or traffic running on Akamai EdgeWorkers.
* Requiring a security solution that offers comprehensive attack observation, reporting, and instant blocking of malicious requests.

## Limitations

The solution has certain limitations as it only works with incoming requests:

* Vulnerability discovery using the [passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) method does not function properly. The solution determines if an API is vulnerable or not based on server responses to malicious requests that are typical for the vulnerabilities it tests.
* The [Wallarm API Discovery](../../api-discovery/overview.md) cannot explore API inventory based on your traffic, as the solution relies on response analysis.
* The [protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md) is not available since it requires response code analysis.

There are also limitations caused by [EdgeWorkers product limitations](https://techdocs.akamai.com/edgeworkers/docs/limitations) and [http-request](https://techdocs.akamai.com/edgeworkers/docs/http-request):

* The only supported traffic delivery method is enhanced TLS.
* Maximum response header size is 8000 bytes.
* Maximum body size is 1 MB.
* Unsupported HTTP methods: `CONNECT`, `TRACE`, `OPTIONS` (supported methods: `GET`, `POST`, `HEAD`, `PUT`, `PATCH`, `DELETE`).
* Unsupported headers: `connection`, `keep-alive`, `proxy-authenticate`, `proxy-authorization`, `te`, `trailers`, `transfer-encoding`, `host`, `content-length`, `vary`, `accept-encoding`, `content-encoding`, `upgrade`.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of Akamai EdgeWorkers technologies
* APIs or traffic running through Akamai EdgeWorkers.

## Deployment

To secure APIs on Akamai EdgeWorkers with Wallarm, follow these steps:

1. Deploy a Wallarm node using one of the available deployment options.
1. Obtain the Wallarm code bundle and run it on Akamai EdgeWorkers.

### 1. Deploy a Wallarm node

When utilizing Wallarm on Akami EdgeWorkers, the traffic flow is [in-line](../inline/overview.md).

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

### 2. Obtain the Wallarm code bundle and run it on Akamai EdgeWorkers

To acquire and [run](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) the Wallarm code bundle on Akamai EdgeWorkers, follow these steps:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm code bundle.
1. [Add](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract) EdgeWorkers to your contract on Akamai.
1. [Create](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id) an EdgeWorker ID.
1. Open the created ID, press **Create Version** and [upload](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) the Wallarm code bundle.
1. **Activate** the created version, initially in the staging environment.
1. After confirming everything is working correctly, repeat the version publication in the production environment.
1. In **Akamai Property Manager**, choose or create a new property where you want install Wallarm.
1. [Create](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1) new behavior with newly created EdgeWorker, call it for example **Wallarm Edge** and add the following criteria:

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    does not exist
    ```
1. Create another behavior **Wallarm Node** with **Origin Server** pointing to [previously deployed node](#1-deploy-a-wallarm-node). Switch **Forward Host Header** to **Origin Hostname** and add the following criteria:

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    exist
    ```
1. Add new property variable `PMUSER_WALLARM_MODE` with [value](../../admin-en/configure-wallarm-mode.md) `monitoring` (default) or `block`. 
    
    Choose **Hidden** for Security settings.
1. Save the new version and deploy it initially to the staging environment, and [then](https://techdocs.akamai.com/api-acceleration/docs/test-stage) to production.

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

If you encounter any issues or require assistance with the described deployment of Wallarm in conjunction with Akamai EdgeWorkers, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
