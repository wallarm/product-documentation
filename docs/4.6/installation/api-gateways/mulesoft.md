[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Mulesoft with Wallarm Policy

[MuleSoft](https://www.mulesoft.com/) is an integration platform that enables seamless connectivity and data integration between services with an API gateway serving as the entry point for client applications to access APIs. With Wallarm, you can secure APIs on the Mulesoft Anypoint platform using the Wallarm policy. This article explains how to attach and utilize the policy.

The Wallarm policy for MuleSoft supports only [in-line](../inline/overview.md) mode. Below diagram shows the traffic flow for APIs on the MuleSoft Anypoint platform with Wallarm policy applied to block malicious activity:

![Mulesoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow-inline.png)

The solution involves deploying the Wallarm node externally and injecting custom code or policies into the specific platform. This enables traffic to be directed to the external Wallarm node for analysis and protection against potential threats. Referred to as Wallarm's connectors, they serve as the essential link between platforms like Azion Edge, Akamai Edge, Mulesoft, Apigee, and AWS Lambda, and the external Wallarm node. This approach ensures seamless integration, secure traffic analysis, risk mitigation, and overall platform security.

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for the following use cases:

* Securing APIs deployed on the MuleSoft Anypoint platform with only one policy.
* Requiring a security solution that offers comprehensive attack observation, reporting, and instant blocking of malicious requests (in the in-line mode).

## Limitations

The MuleSoft integration does not allow the Wallarm node to fully analyze responses, which creates some limitations:

* In some environments, [Wallarm API Discovery](../../api-discovery/overview.md) may generate additional endpoints. Consult [Wallarm support](mailto:support@wallarm.com) for configuration options.
* Server responses are required for [passive vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection).
* [Protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md).

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the Mulesoft platform.
* [Maven (`mvn`)](https://maven.apache.org/install.html) 3.8 or an earlier version is installed. Higher versions of Maven may encounter compatibility issues with the Mule plugin.
* You have been assigned the Mulesoft Exchange contributor's role, enabling you to upload artifacts to your organization's Mulesoft Anypoint Platform account.
* Your [Mulesoft Exchange credentials (username and password)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) are specified in the `<MAVEN_DIRECTORY>/conf/settings.xml` file.
* Your application and API are linked and running on Mulesoft.

## Deployment

To secure APIs on the Mulesoft Anypoint platform using Wallarm policy, follow these steps:

1. Deploy a Wallarm node using one of the available deployment options.
1. Obtain the Wallarm policy and upload it to Mulesoft Exchange.
1. Attach the Wallarm policy to your API.

### 1. Deploy a Wallarm node

1. Choose one of the supported Wallarm node deployment solutions or artifacts for the [in-line deployment](../supported-deployment-options.md#in-line) and follow the provided deployment instructions.
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

### 2. Obtain and upload the Wallarm policy to Mulesoft Exchange

To acquire and [upload](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange) the Wallarm policy to Mulesoft Exchange, follow these steps:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm Mulesoft policy.
1. Extract the policy archive once you receive it.
1. Navigate to the policy directory:

    ```
    cd <POLICY_DIRECTORY/wallarm
    ```
1. Within the `pom.xml` file → `groupId` parameter at the top of the file, specify your Mulesoft Business Group ID.

    You can find your organization ID by navigating to Mulesoft Anypoint Platform → **Access Management** → **Business Groups** → choose your organization → copy its ID.
1. In your Maven `.m2` directory, update the `settings.xml` file with your Exchange credentials:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
      <servers>
        <server>
          <id>exchange-server</id>
          <username>myusername</username>
          <password>mypassword</password>
        </server>
      </servers>
    </settings>
    ```
1. Deploy the policy to Mulesoft using the following command:

    ```
    mvn clean deploy
    ```

Your custom policy is now available in your Mulesoft Anypoint Platform Exchange.

![Mulesoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Attach the Wallarm policy to your API

You can attach the Wallarm policy to either all APIs or an individual API.

#### Attaching the policy to all APIs

To apply the Wallarm policy to all APIs using [Mulesoft's Automated policy option](https://docs.mulesoft.com/gateway/1.4/policies-automated-applying), follow these steps:

1. In your Anypoint Platform, navigate to **API Manager** → **Automated Policies**.
1. Click **Add automated policy** and select the Wallarm policy from Exchange.
1. Specify `WLRM REPORTING ENDPOINT` which is the IP address on the [Wallarm node instance](#1-deploy-a-wallarm-node) including the `http://` or `https://`.
1. If necessary, modify the maximum time period for Wallarm to process a single request by changing the value of `WALLARM NODE REQUEST TIMEOUT`.
1. Apply the policy.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/automated-policy.png)

#### Attaching the policy to an individual API

To secure an individual API with the Wallarm policy, follow these steps:

1. In your Anypoint Platform, navigate to **API Manager** and select the desired API.
1. Navigate to **Policies** → **Add policy** and select the Wallarm policy.
1. Specify `WLRM REPORTING ENDPOINT` which is the IP address on the [Wallarm node instance](#1-deploy-a-wallarm-node) including the `http://` or `https://`.
1. If necessary, modify the maximum time period for Wallarm to process a single request by changing the value of `WALLARM NODE REQUEST TIMEOUT`.
1. Apply the policy.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-for-an-api.png)

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/search) or [EU Cloud](https://my.wallarm.com/search) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking and the traffic flows in-line, the request will also be blocked.

If the solution does not perform as expected, refer to the logs of your API by accessing Mulesoft Anypoint Platform → **Runtime Manager** → your application → **Logs**.

You can also verify whether the policy is applied to the API by navigating to your API in the **API Manager** and reviewing the policies applied on the **Policies** tab. For automated policies, you can use the **See covered APIs** option to view the APIs covered and the reasons for any exclusions.

## Updating and uninstalling

To update the deployed Wallarm policy, follow these steps:

1. Remove the currently deployed Wallarm policy using the **Remove policy** option in either the automated policy list or the list of policies applied to an individual API.
1. Add the new policy following the steps 2-3 above.
1. Restart attached applications in the **Runtime Manager** to apply new policy.

To uninstall the policy, simply perform the first step of the update process.

## Need assistance?

If you encounter any issues or require assistance with the described deployment of Wallarm's policy in conjunction with MuleSoft, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
