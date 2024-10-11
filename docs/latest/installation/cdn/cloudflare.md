[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[wallarm-hosted-connector-desc]:    ../connectors/overview.md#wallarm-edge-connectors
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[self-hosted-connector-node-aio-conf]: ../connectors/self-hosted-node-conf/all-in-one-installer.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[self-hosted-connector-node-helm-conf]: ../connectors/self-hosted-node-conf/helm-chart.md

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

### 2. Obtain and deploy the Wallarm worker code

To run a Cloudflare worker routing traffic to the Wallarm node:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to get the Wallarm worker code for your connector deployment (Wallarm- or self-hosted).
1. [Create a Cloudflare worker](https://developers.cloudflare.com/workers/get-started/dashboard/) using the provided code.
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

## Troubleshooting

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