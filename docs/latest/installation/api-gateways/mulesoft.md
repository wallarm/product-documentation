[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[wallarm-hosted-connector-desc]:    ../connectors/overview.md#wallarm-edge-connectors
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[self-hosted-connector-node-aio-conf]: ../connectors/self-hosted-node-conf/all-in-one-installer.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[self-hosted-connector-node-helm-conf]: ../connectors/self-hosted-node-conf/helm-chart.md

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
* [Maven (`mvn`)](https://maven.apache.org/install.html) 3.8 or an earlier version is installed. Higher versions of Maven may encounter compatibility issues with the Mule plugin.
* You have been assigned the Mulesoft Exchange contributor's role, enabling you to upload artifacts to your organization's Mulesoft Anypoint Platform account.
* Your [Mulesoft Exchange credentials (username and password)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) are specified in the `<MAVEN_DIRECTORY>/conf/settings.xml` file.
* Your application and API are linked and running on Mulesoft.

## Deployment

### 1. Deploy a Wallarm node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

=== "Wallarm Edge node"
    --8<-- "../include/waf/installation/security-edge/add-connector.md"
=== "Self-hosted node"
    Choose an artifact for a self-hosted node deployment:

    <div class="do-section"><div class="do-main"><a class="do-card" id="aio-connector" style="color: var(--md-typeset-a-color)">
                <h3><img class="non-zoomable" src="../../../images/platform-icons/linux.svg" /> All-in-one installer</h3><p>For Linux infrastructures on bare metal or VMs.</p>
            </a><a class="do-card" id="helm-connector" style="color: var(--md-typeset-a-color)">
                <h3><img class="non-zoomable" src="../../../images/platform-icons/helm.svg" /> Helm chart</h3><p>For infrastructures utilizing Kubernetes.</p>
            </a></div></div>


    <div class="aio-connector-installation" style="display:none">
    --8<-- "../include/waf/installation/connectors/self-hosted-node-aio.md"
    </div>

    <div class="helm-connector-installation" style="display:none">
    --8<-- "../include/waf/installation/connectors/self-hosted-node-helm-chart.md"
    </div>

### 2. Obtain and upload the Wallarm policy to Mulesoft Exchange

To acquire and upload the Wallarm policy to Mulesoft Exchange, follow these steps:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm Mulesoft policy for your connector deployment (Wallarm- or self-hosted).
1. Extract the policy archive once you receive it.
1. Navigate to the policy directory:

    ```
    cd <POLICY_DIRECTORY/wallarm
    ```
1. Within the `pom.xml` file → `groupId` parameter at the top of the file, specify your Mulesoft Business Group ID.

    You can find your organization ID by navigating to Mulesoft Anypoint Platform → **Access Management** → **Business Groups** → choose your organization → copy its ID.
1. In the `conf` directory, create a `settings.xml` file with the content below. Replace `username` and `password` with your actual credentials.

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
    cd ..
    make all
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

* If the solution does not perform as expected, refer to the logs of your API by accessing Mulesoft Anypoint Platform → **Runtime Manager** → your application → **Logs**.

    You can also verify whether the policy is applied to the API by navigating to your API in the **API Manager** and reviewing the policies applied on the **Policies** tab. For automated policies, you can use the **See covered APIs** option to view the APIs covered and the reasons for any exclusions.

--8<-- "../include/waf/installation/security-edge/connector-troubleshooting.md"

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

<script>
    var aioDiv = document.querySelector('.aio-connector-installation');
    var helmDiv = document.querySelector('.helm-connector-installation');

    document.getElementById('aio-connector').addEventListener('click', function() {
        aioDiv.style.display = 'block';
        helmDiv.style.display = 'none';
    });

    document.getElementById('helm-connector').addEventListener('click', function() {
        aioDiv.style.display = 'none';
        helmDiv.style.display = 'block';
    });
</script>

<style>

.do-card h3 {
    align-items: center;
}

.do-card h3 img {
    height: 40px;
    margin-bottom: unset;
    position: initial;
}

</style>