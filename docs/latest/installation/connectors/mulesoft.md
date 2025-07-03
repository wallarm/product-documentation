[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Wallarm Connector for MuleSoft

[MuleSoft](https://www.mulesoft.com/) is an integration platform that enables seamless connectivity and data integration between services with an API gateway serving as the entry point for client applications to access APIs. Wallarm can act as a connector to secure APIs running on MuleSoft.

To use Wallarm as a connector for MuleSoft, you need to **deploy the Wallarm node externally** and **apply the Wallarm-provided policy in MuleSoft** to route traffic to the Wallarm node for analysis.

The Wallarm connector for MuleSoft supports only [in-line](../inline/overview.md) traffic analysis:

![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow-inline.png)

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for securing APIs deployed on the MuleSoft Enterprise Edition platform with only one policy.

## Limitations

* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the MuleSoft platform.
* [Docker](https://docs.docker.com/engine/install/) installed and running on your host system.
* [Maven (`mvn`)](https://maven.apache.org/install.html).
* You have been assigned the MuleSoft Exchange contributor's role, enabling you to upload artifacts to your organization's MuleSoft Anypoint Platform account.
* Your [MuleSoft Exchange credentials (username and password)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) are specified in the `<MAVEN_DIRECTORY>/conf/settings.xml` file.
* Your application and API are linked and running on MuleSoft.
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

--8<-- "../include/waf/installation/connectors/mulesoft-upload-policy.md"

### 3. Attach the Wallarm policy to your API

--8<-- "../include/waf/installation/connectors/mulesoft-attach-policy.md"

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-setup.png)

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to [blocking](../../admin-en/configure-wallarm-mode.md) and the traffic flows in-line, the request will also be blocked.

## Troubleshooting

If the solution does not perform as expected, refer to the logs of your API by accessing MuleSoft Anypoint Platform → **Runtime Manager** → your application → **Logs**.

You can also verify whether the policy is applied to the API by navigating to your API in the **API Manager** and reviewing the policies applied on the **Policies** tab. For automated policies, you can use the **See covered APIs** option to view the APIs covered and the reasons for any exclusions.

## Upgrading the policy

To upgrade the deployed Wallarm policy to a [newer version](code-bundle-inventory.md#mulesoft):

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
