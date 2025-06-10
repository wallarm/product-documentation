# Security Edge Inline <a href="../../../about-wallarm/subscription-plans/#security-edge"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

The **Security Edge** platform provides a managed service for deploying Wallarm nodes across geographically distributed locations within a Wallarm-hosted environment. One of its key deployment options is **inline** deployment, offering real-time, robust protection for your entire API landscape without the need for any onsite installation.

This is an ideal solution for securing APIs when you can redirect traffic from your hosts to Wallarm's edge nodes by modifying the CNAME records in your DNS settings.

![!](../../images/waf-installation/security-edge/inline/traffic-flow.png)

## How it works

Security Edge service provides a secure cloud environment where Wallarm nodes are deployed, hosted, and managed by Wallarm:

* Turnkey deployment: minimal setup is required for Wallarm to automatically deploy nodes across globally distributed locations.
* Autoscaling: nodes automatically scale horizontally to handle varying traffic loads, with no manual configuration needed.
* Reduced costs: lower operational overhead with Wallarm-managed nodes, allowing faster deployment and scalability.
* Seamless integration: simple configuration, allowing you to protect your API landscape without disruptions.

## Limitations

* Only third-level or higher domains are supported (e.g., instead `domain.com` use `www.domain.com`).
* Only domains shorter than 64 characters are supported.
* Only HTTPS traffic is supported; HTTP is not allowed.
* [Custom blocking page and blocking code](../../admin-en/configuration-guides/configure-block-page-and-code.md) configurations are not yet supported.

## Configuring the Edge Inline

To run the Edge inline, go to the Wallarm Console → **Security Edge** → **Edge inline** → **Configure**. If this section is unavailable, contact sales@wallarm.com to access the required subscription.

You can configure multiple origins to forward traffic to and multiple hosts to protect. See the demo:

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/d0rwdofmftda" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
      </div>

You can update the Edge node deployment settings at any time. The node will be re‑deployed with existing CNAME records remaining unchanged.

### 1. General settings

In general settings, you specify regions to deploy the Edge node and origins to forward filtered traffic.

#### Cloud providers and regions

Select regions in one or more cloud providers - **AWS** and **Azure** are supported. You can deploy the Edge Node across multiple regions and providers.

=== "Multi-region deployment"
    When selecting multiple regions within a single cloud provider, traffic is routed based on latency - **each request goes to the nearest available region**. This reduces response time and balances the load.

    This is the most common setup, recommended when you serve requests from multiple locations.

    If one region becomes unavailable, traffic is automatically re-routed within the same provider.

=== "Multi-cloud deployment"
    When selecting regions across multiple clouds, traffic is distributed using a **[global round‑robin strategy](https://en.wikipedia.org/wiki/Round-robin_DNS)** - each request is routed to one of the selected regions, regardless of provider or latency.

    This setup is recommended in the following cases:

    * Cloud provider redundancy - for example, if AWS becomes unavailable, traffic is automatically routed to Azure to maintain availability.
    * Regional high availability - for example, you can select the same region (e.g., East) in both AWS and Azure. If one provider becomes unavailable, traffic is routed to the same region in the other cloud.

#### Origin servers

Specify origins to which the Edge node will forward filtered traffic. For each origin, provide a server IP address or FQDN with an optional port (default: 443).

If an origin has multiple servers, you can specify all of them. Requests are distributed as follows:

* The round-robin algorithm is used. The first request is sent to the first server, the second to the next, and so on, cycling back to the first server after the last.
* With IP-based session persistence, traffic from the same IP consistently routes to the same server.

!!! info "Allow traffic from Wallarm IP ranges to origins"
    Your origins should allow incoming traffic from the IP ranges used by the selected regions:


    * AWS

        === "US East 1"
            ```
            18.215.213.205
            44.214.56.120
            44.196.111.152
            ```
        === "US West 1"
            ```
            52.8.91.20
            13.56.117.139
            54.177.237.34
            50.18.177.184
            ```
        === "EU Central 1 (Frankfurt)"
            ```
            18.153.123.2
            18.195.202.193
            3.76.66.246
            3.79.213.212
            ```
        === "EU Central 2 (Zurich)"
            ```
            51.96.131.55
            16.63.191.19
            51.34.0.90
            51.96.67.145
            ```
            
    * Azure

        === "East US"
            ```
            104.211.29.72
            104.211.29.73
            ```
        === "West US"
            ```
            104.210.63.116
            104.210.63.117
            ```
        === "Germany West Central (EU)"
            ```
            20.79.250.104
            20.79.250.105
            ```
        === "Switzerland North (EU)"
            ```
            20.203.240.193
            20.203.240.192
            ```

![!](../../images/waf-installation/security-edge/inline/general-settings-section.png)

Later, when adding hosts for traffic analysis and filtering, you will assign each host or location to its designated origin.

### 2. Certificates

In the **Certificates** section, you can obtain certificates for your domains:

* If the Edge Inline node is deployed as a direct, Internet-facing solution, Wallarm requires certificates to securely route traffic to your origin servers. Certificates are issued based on the DNS zones specified in this section.

    Once configuration is complete, Wallarm provides a CNAME for each DNS zone. Add this CNAME record to your DNS settings to verify domain ownership and complete the certificate issuance process.
* If your origin servers are behind a third-party service (e.g., a CDN or a DDoS protection provider like Cloudflare or Akamai) that proxies traffic, certificate issuance is not required. In this case, select the **Skip certificate issuance** option.

![!](../../images/waf-installation/security-edge/inline/certificates.png)

You can specify multiple DNS zones, each with a different certificate issuance approach.

### 3. Hosts

In the **Hosts** section:

1. Specify the domains, ports and subdomains that will direct traffic to the Wallarm node for analysis. Each host entry must match a DNS zone previously defined in **Certificates**.

    ??? info "Allowed ports"
        Directing traffic from HTTP ports to the Edge node is not allowed. The following ports are supported:

        443, 444, 1443, 1760, 2001, 2087, 2096, 4333, 4334, 4430, 4440, 4443 4466, 4993, 5000, 5001, 5454, 7003, 7443, 7741, 8010, 8012, 8070, 8071, 8072, 8075, 8076, 8077, 8078, 8081, 8082, 8084, 8085, 8086, 8088, 8090, 8092, 8093, 8094, 8095, 8096, 8097, 8098, 8099, 8104, 8181, 8243, 8282, 8383, 8443, 8444, 8448, 8585, 8723, 8787, 8801, 8866, 9052, 9090, 9093, 9111, 9193, 9440, 9443, 9797, 44300, 44301, 44302, 44395, 44443, 52233, 55180, 55553, and 60000

1. (Optional) Associate the host's traffic with a [Wallarm application](../../user-guides/settings/applications.md) to categorize and manage different API instances or services on the Wallarm platform.
1. Set the [Wallarm mode](../../admin-en/configure-wallarm-mode.md) for each host.
1. (Optionally) Specify server [NGINX directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html). By default, these directives use NGINX's standard values, as specified in the NGINX documentation.
1. For each host, define the configuration for the root location (`/`):

    * Origin where the Wallarm node will forward the filtered traffic (if no other location-specific settings are defined). The location's path is automatically appended to the origin.
    * (Optionally) Wallarm application.
    * Filtration mode.

![!](../../images/waf-installation/security-edge/inline/hosts.png)

For specific **locations** within hosts, you can further customize:

* Origin. The path defined in the location will automatically append to the origin.
* Wallarm application.
* Filtration mode.
* Some [NGINX directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html). By default, these directives use NGINX's standard values, as specified in the NGINX documentation.

Each location inherits settings from the host and root location, unless specifically overridden.

The below example configuration customizes settings per path to meet specific needs: `/auth` prioritizes security with blocking mode enabled, while `/data` allows larger uploads by increasing the `client_max_body_size` to 5MB.

![!](../../images/waf-installation/security-edge/inline/locations.png)

### 4. (Optional) Admin settings

In the **Admin settings** section, you choose a node version and specify upgrade settings:

* Select the Edge node version to deploy. The latest available version is deployed by default.

    For the changelog of versions, refer to the [article](../../updating-migrating/node-artifact-versions.md#all-in-one-installer). The Edge node version follows the `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` format, corresponding to the same version in the linked article. The build number in the Edge node version indicates minor changes.
* Enable [Auto update](#upgrading-the-edge-inline) if needed.

![!](../../images/waf-installation/security-edge/inline/admin-settings.png)

### 5. Certificate CNAME configuration

If DNS zones are specified in the **Certificates** section, add the CNAME records provided in the Wallarm Console to your DNS provider's settings for each DNS zone. These records are required for Wallarm to verify domain ownership and issue certificates.

!!! warning "Do not remove the certificate CNAME"
    The certificate CNAME record must stay in your DNS settings. It is needed for further deployment configuration updates and certificate renewal.

![](../../images/waf-installation/security-edge/inline/host-cnames.png)

![](../../images/waf-installation/security-edge/inline/cert-cname.png)

For example, if `myservice.com` is specified in the DNS zone, the certificate CNAME is the following:

```
_acme-challenge.myservice.com CNAME _acme-challenge.<WALLARM_CLOUD>-<CLIENT_ID>-<DEPLOYMENT_ID>.acme.<CLOUD_PROVIDER>.wallarm-cloud.com
```

DNS changes can take up to 24 hours to propagate. Wallarm starts the Edge node deployment once the CNAME records are verified (if needed).

### 6. Routing traffic to the Edge Node

To route traffic to the Edge Node, you need to specify the CNAME record pointing to the Wallarm‑proided FQDN in your DNS zone. This record is returned as the **Traffic CNAME**.

Once the certificate CNAME is verified, a **Traffic CNAME** is available for each host. If no certificate is issued, the CNAME is available immediately after the configuration is complete.

* If you route traffic to a single cloud provider, use the **Traffic CNAME for selected cloud**.
* If you are using multi-cloud deployment, copy the **Traffic CNAME (Global)** - traffic will be automatically distributed across all selected regions and providers.

    Per-provider CNAMEs are also available if you need to enforce routing to a specific provider - for example, to test latency or performance across clouds.

    !!! warning "If you remove one of the cloud providers"
        Before removing a [cloud provider](#cloud-providers-and-regions) from the deployment, first switch to the per-provider CNAME to avoid service disruption.

![](../../images/waf-installation/security-edge/inline/traffic-cname.png)

DNS changes can take up to 24 hours to propagate. Once propagated, Wallarm will proxy all traffic to 

## Telemetry portal

The telemetry portal for Security Edge Inline provides a Grafana dashboard with real-time insights into metrics on traffic processed by Wallarm.

The dashboard displays key metrics such as total processed requests, RPS, detected and blocked attacks, deployed Edge node number, resource consumption, number of 5xx responses, etc.

![!](../../images/waf-installation/security-edge/inline/telemetry-portal.png)

**Run telemetry portal** once the Node reaches the **Active** status. It becomes accessible via a direct link from the Security Edge section ~5 minutes after initiation.

![!](../../images/waf-installation/security-edge/inline/run-telemetry-portal.png)

From the Grafana home page, to reach the dashboard, navigate to **Dashboards** → **Wallarm** → **Portal Inline Overview**.

## Upgrading the Edge Inline

When **Auto update** is enabled in **Admin settings**, the Edge node is automatically upgraded as soon as a new minor or patch version is released (depending on the selected option). All your initial settings are preserved. Auto update is off by default.

To manually upgrade the Edge node, go to **Configure** → **Admin settings** and select a version from the list. Using the latest version is recommended for optimal performance and security.

Upgrading to a new major version can only be done manually.

For the changelog of versions, refer to the [article](../../updating-migrating/node-artifact-versions.md#all-in-one-installer). The Edge node version follows the `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` format, corresponding to the same version in the linked article. The build number in the Edge node version indicates minor changes.

## Deleting the Edge Inline

To delete your Edge deployment, click **Configure** → **Admin settings** → **Delete inline**.

If you intend to delete and re-create the nodes, you can adjust the settings of the existing deployment, and the nodes will be re-deployed with the updated configuration.

If your subscription expires, the Edge node will be automatically deleted after 14 days.

## Statuses

The Edge node section provides real-time statuses of the deployment and configuration state for your origins, hosts, and regions:

=== "Hosts"
    ![!](../../images/waf-installation/security-edge/inline/host-statuses.png)
=== "Origins"
    ![!](../../images/waf-installation/security-edge/inline/origin-statuses.png)
=== "Regions"
    ![!](../../images/waf-installation/security-edge/inline/region-statuses.png)
=== "Nodes"
    The **Nodes** tab provides technical details for each Edge node. This view is primarily for Wallarm Support to assist in troubleshooting. The number of nodes depends on traffic demand and is managed automatically by Wallarm's autoscaling.

    ![!](../../images/waf-installation/security-edge/inline/nodes-tab.png)

* **Pending cert CNAME**: Waiting for the certificate CNAME records to be added to DNS for certificate issuance (if applicable).
* **Pending traffic CNAME**: The deployment is complete, awaiting the addition of the traffic CNAME or proxy target record to route traffic to the Edge node.
* **Deploying**: The Edge node is currently being set up and will be available soon.
* **Active**: The Edge node is fully operational and filtering traffic as configured.
* **Cert CNAME error**: There was an issue verifying the certificate CNAME in DNS. Please check that the CNAME is correctly configured (if applicable).
* **Deployment failed**: The Edge node deployment did not succeed, e.g. due to the certificate CNAME not added within 14 days. Check configuration settings and try to redeploy or contact the [Wallarm Support team](https://support.wallarm.com) to get help.
* **Degraded**: The Edge node is active in the region but may have limited functionality or be experiencing minor issues. Please contact the [Wallarm Support team](https://support.wallarm.com) to get help.

RPS and request amount per hosts and origins are returned starting from the [version](../../updating-migrating/node-artifact-versions.md#all-in-one-installer) 5.3.0.
