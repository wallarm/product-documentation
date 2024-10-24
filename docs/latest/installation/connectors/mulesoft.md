[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png

# Wallarm Connector for MuleSoft

[MuleSoft](https://www.mulesoft.com/) is an integration platform that enables seamless connectivity and data integration between services with an API gateway serving as the entry point for client applications to access APIs. Wallarm can act as a connector to secure APIs running on MuleSoft.

To use Wallarm as a connector for MuleSoft, you need to **deploy the Wallarm node externally** and **apply the Wallarm-provided policy in MuleSoft** to route traffic to the Wallarm node for analysis.

The Wallarm connector for MuleSoft supports only [in-line](../inline/overview.md) traffic analysis:

![Mulesoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow-inline.png)

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for securing APIs deployed on the MuleSoft Anypoint platform with only one policy.

## Limitations

* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the Mulesoft platform.
* [Docker](https://docs.docker.com/engine/install/) installed and running on your host system.
* [Maven (`mvn`)](https://maven.apache.org/install.html).
* You have been assigned the Mulesoft Exchange contributor's role, enabling you to upload artifacts to your organization's Mulesoft Anypoint Platform account.
* Your [Mulesoft Exchange credentials (username and password)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) are specified in the `<MAVEN_DIRECTORY>/conf/settings.xml` file.
* Your application and API are linked and running on Mulesoft.
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).

## Deployment

### 1. Deploy a Wallarm node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

=== "Edge node"
    To deploy a Wallarm-hosted node for the connector, follow the [instructions](../se-connector.md).
=== "Self-hosted node"
    The current self-hosted node deployment has limitations. Full response analysis is not yet supported, which is why:

    * In some environments, [Wallarm API Discovery](../../api-discovery/overview.md) may generate additional endpoints. Consult [Wallarm support](mailto:support@wallarm.com) for configuration options.
    * Server responses are required for [passive vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection).
    * [Protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md).

    To deploy a self-hosted node for the connector:

    1. Allocate an instance for deploying the node.
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

To acquire and upload the Wallarm policy to Mulesoft Exchange, follow these steps:

1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** and download a code bundle for your platform.
1. Extract the policy archive.
1. Within the `pom.xml` file → `groupId` parameter at the top of the file, specify your Mulesoft Business Group ID.

    You can find your organization ID by navigating to Mulesoft Anypoint Platform → **Access Management** → **Business Groups** → choose your organization → copy its ID.
1. Create the `conf` directory and a `settings.xml` file inside it with the following content:

    === "Username and password"
        Replace `username` and `password` with your actual credentials:

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <servers>
            <server>
                <id>anypoint-exchange-v3</id>
                <username>myusername</username>
                <password>mypassword</password>
            </server>
        </servers>
        </settings>
        ```
    === "Token (if MFA is enabled)"
        [Generate and specify your token](https://docs.mulesoft.com/access-management/saml-bearer-token) in the `password` parameter:

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <servers>
            <server>
                <id>anypoint-exchange-v3</id>
                <username>~~~Token~~~</username>
                <password>01234567-89ab-cdef-0123-456789abcdef</password>
            </server>
        </servers>
        </settings>
        ```
1. Deploy the policy to Mulesoft using the following command:

    ```
    mvn clean deploy -s conf/settings.xml
    ```

Your custom policy is now available in your Mulesoft Anypoint Platform Exchange.

![Mulesoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Attach the Wallarm policy to your API

You can attach the Wallarm policy to either all APIs or an individual API.

#### Attaching the policy to all APIs

To apply the Wallarm policy to all APIs using [Mulesoft's Automated policy option](https://docs.mulesoft.com/gateway/1.4/policies-automated-applying), follow these steps:

1. In your Anypoint Platform, navigate to **API Manager** → **Automated Policies**.
1. Click **Add automated policy** and select the Wallarm policy from Exchange.
1. Specify an address of the [Wallarm node instance](#1-deploy-a-wallarm-node) including `http://` or `https://`.
1. If necessary, modify other parameters.
1. Apply the policy.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/automated-policy.png)

#### Attaching the policy to an individual API

To secure an individual API with the Wallarm policy, follow these steps:

1. In your Anypoint Platform, navigate to **API Manager** and select the desired API.
1. Navigate to **Policies** → **Add policy** and select the Wallarm policy.
1. Specify an address of the [Wallarm node instance](#1-deploy-a-wallarm-node) including `http://` or `https://`.
1. If necessary, modify other parameters.
1. Apply the policy.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-for-an-api.png)

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking and the traffic flows in-line, the request will also be blocked.

## Updating and uninstalling

To update the deployed Wallarm policy, follow these steps:

1. Remove the currently deployed Wallarm policy using the **Remove policy** option in either the automated policy list or the list of policies applied to an individual API.
1. Add the new policy following the steps 2-3 above.
1. Restart attached applications in the **Runtime Manager** to apply new policy.

To uninstall the policy, simply perform the first step of the update process.

## Troubleshooting

If the solution does not perform as expected, refer to the logs of your API by accessing Mulesoft Anypoint Platform → **Runtime Manager** → your application → **Logs**.

You can also verify whether the policy is applied to the API by navigating to your API in the **API Manager** and reviewing the policies applied on the **Policies** tab. For automated policies, you can use the **See covered APIs** option to view the APIs covered and the reasons for any exclusions.
