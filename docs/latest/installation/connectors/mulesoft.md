[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Wallarm Connector for MuleSoft Mule Gateway

This guide describes how to secure your Mule APIs managed by [Mule Gateway](https://docs.mulesoft.com/mule-gateway/mule-gateway-capabilities-mule4) using the Wallarm connector.

To use Wallarm as a connector for Mule Gateway, you need to **deploy the Wallarm node externally** and **apply the Wallarm-provided policy in MuleSoft** to route traffic to the Wallarm node for analysis.

The Wallarm connector for Mule Gateway supports only [in-line](../inline/overview.md) traffic analysis:

![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow-mule-gateway-inline.png)

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for securing Mule APIs managed by Mule Gateway.

## Limitations

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the MuleSoft platform.
* [Docker](https://docs.docker.com/engine/install/) installed and running on your host system.
* [Maven (`mvn`)](https://maven.apache.org/install.html).
* Your MuleSoft user is enabled to upload artifacts to your MuleSoft Anypoint Platform account.
* Your [MuleSoft Exchange credentials (username and password)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) are specified in the `<MAVEN_DIRECTORY>/conf/settings.xml` file.
* Your application and API are linked and running on Mule Gateway.
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).

## Deployment

### 1. Deploy a Wallarm node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

=== "Edge node"
    To deploy a Wallarm-hosted node for the connector, follow the [instructions](../se-connector.md).
=== "Self-hosted node"
    Choose an artifact for a self-hosted node deployment and follow the attached instructions:

    * [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
    * [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
    * [AWS AMI](../native-node/aws-ami.md) for AWS infrastructures
    * [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

### 2. Obtain and upload the Wallarm policy to MuleSoft Exchange

To acquire and upload the Wallarm policy to MuleSoft Exchange, follow these steps:

1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** and download a code bundle for your platform.

    If running a self-hosted node, contact sales@wallarm.com to get the code bundle.
1. Extract the policy archive.
1. Within the `pom.xml` file, specify the following:

    === "Global instance"
        1. Navigate to MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → choose your organization → copy its ID.
        1. Specify the copied group ID in the `groupId` parameter of the `pom.xml` file:

        ```xml hl_lines="2"
        <?xml version="1.0" encoding="UTF-8"?>
            <groupId>BUSINESS_GROUP_ID</groupId>
            <artifactId>wallarm</artifactId>
        ```
    === "Regional instance"
        1. Navigate to MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → choose your organization → copy its ID.
        1. Specify the copied group ID in the `groupId` parameter of the `pom.xml` file.
        1. For MuleSoft instances hosted in specific regions, update the `pom.xml` file to use the corresponding regional URLs. For example, for a European instance of MuleSoft:

        ```xml hl_lines="2 7 14 24"
        <?xml version="1.0" encoding="UTF-8"?>
            <groupId>BUSINESS_GROUP_ID</groupId>
            <artifactId>wallarm</artifactId>
            
            <properties>
                <mule.maven.plugin.version>4.1.2</mule.maven.plugin.version>
                <exchange.url>https://maven.eu1.anypoint.mulesoft.com/api/v1/organizations/${project.groupId}/maven</exchange.url>
            </properties>

            <distributionManagement>
                <repository>
                    <id>anypoint-exchange-v3</id>
                    <name>Anypoint Exchange</name>
                    <url>https://maven.eu1.anypoint.mulesoft.com/api/v3/organizations/${project.groupId}/maven
                    </url>
                    <layout>default</layout>
                </repository>
            </distributionManagement>

            <repositories>
                <repository>
                    <id>anypoint-exchange-v3</id>
                    <name>Anypoint Exchange</name>
                    <url>https://maven.eu1.anypoint.mulesoft.com/api/v3/maven</url>
                    <layout>default</layout>
                </repository>
            </repositories>
        ```
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
            <server>
                <id>mulesoft-releases-ee</id>
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
            <server>
                <id>mulesoft-releases-ee</id>
                <username>~~~Token~~~</username>
                <password>01234567-89ab-cdef-0123-456789abcdef</password>
            </server>
        </servers>
        </settings>
        ```
1. Deploy the policy to MuleSoft using the following command:

    ```
    mvn clean deploy -s conf/settings.xml
    ```

Your custom policy is now available in your MuleSoft Anypoint Platform Exchange.

![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Attach the Wallarm policy to your API

You can attach the Wallarm policy to either an individual API or all APIs.

1. To apply the policy to an individual API, navigate to Anypoint Platform → **API Manager** → select the desired API → **Policies** → **Add policy**.
1. To apply the policy to all APIs, go to Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy**.
1. Choose the Wallarm policy from Exchange.
1. Specify the Wallarm node URL including `http://` or `https://`.
1. If necessary, modify other parameters.
1. Apply the policy.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-setup.png)

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<GATEWAY_URL>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to [blocking](../../admin-en/configure-wallarm-mode.md) and the traffic flows in-line, the request will also be blocked.

## Troubleshooting

If the solution does not perform as expected, refer to the logs of your API by accessing MuleSoft Anypoint Platform → **Runtime Manager** → your application → **Logs**.

You can also verify whether the policy is applied to the API by navigating to your API in the **API Manager** and reviewing the policies applied on the **Policies** tab. For automated policies, you can use the **See covered APIs** option to view the APIs covered and the reasons for any exclusions.

## Upgrading the policy

To upgrade the deployed Wallarm policy to a [newer version](code-bundle-inventory.md#mulesoft-mule-gateway):

1. Download the updated Wallarm policy and upload it to MuleSoft Exchange, as described in [Step 2](#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange).
1. Once the new version appears in Exchange, go to **API Manager** → your API → **Policies** → Wallarm policy → **Edit configuration** → **Advanced options** and choose the new policy version from the dropdown.
1. If the new version introduces additional parameters, provide the necessary values.

    For example, if upgrading from 2.x to 3.x:

    * **CLIENT HOST EXPRESSION**: use the default value `#[attributes.headers['x-forwarded-host']]` unless specific changes are needed.
    * **CLIENT IP EXPRESSION**: use the default value `#[attributes.headers['x-forwarded-for']]` unless specific changes are needed.
1. Save changes.

If the Wallarm policy is applied as an automated policy, direct upgrades may not be possible. In such cases, remove the current policy and reapply the new version manually.

Policy upgrades may require a Wallarm node upgrade, especially for major version updates. See the [Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) for the self-hosted Node release notes and upgrade instructions or the [Edge connector upgrade procedure](../se-connector.md#upgrading-the-edge-node). Regular node updates are recommended to avoid deprecation and simplify future upgrades.

## Uninstalling the policy

To uninstall the Wallarm policy, use the **Remove policy** option in either the automated policy list or the list of policies applied to an individual API.
