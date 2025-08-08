# Security Edge Inline Deployment <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

To deploy the Wallarm [Security Edge for inline traffic analysis](overview.md), follow this guide.

## Requirements

* [Security Edge subscription](../../../about-wallarm/sibscription-plans.md) (free or paid)
* Ability to edit DNS records for your domains to verify ownership and route traffic to Wallarm

## Quick setup wizard

A quick setup wizard is available to all accounts via **Quick setup** in **Security Edge** section.

For Free tier users, this is the **only available option** until a deployment is active. To skip it, contact sales@wallarm.com.

The wizard walks you through the basic configuration steps, with [some functional limitations](#quick-setup-limitations).

![](../../../images/waf-installation/security-edge/inline/quick-setup-wizard.png)

Once you complete the setup, Edge Nodes will be deployed in **monitoring** [mode](../../../admin-en/configure-wallarm-mode.md) by default.

You can also invite colleagues to participate in the onboarding process - they will access the same wizard and account.

## Full configuration flow

After deploying Edge Nodes via [Quick setup](#quick-setup-wizard), the Security Edge section becomes available in Wallarm Console. From there, you can fine-tune your deployment using advanced features (except those [restricted to paid subscriptions](../../../about-wallarm/subscription-plans.md#security-edge-paid-plan)).

You can update the Edge node deployment settings at any time. The node will be re‑deployed with existing CNAME and A records remaining unchanged.

See a demo of the full configuration flow:

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/d0rwdofmftda" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
    </div>

## 1. Provider and region

Choose one or more regions (AWS or Azure) for Edge Node deployment. Select locations close to your APIs for optimal latency.

[More about multi-region and multi-cloud deployment](multi-region.md)

## 2. Origins

Specify origins to which the Edge node will forward filtered traffic. For each origin, provide a server IP address or FQDN with an optional port (default: 443).

If an origin has multiple servers, you can specify all of them. Requests are distributed as follows:

* The [round-robin](https://en.wikipedia.org/wiki/Round-robin_DNS) algorithm is used. The first request is sent to the first server, the second to the next, and so on, cycling back to the first server after the last.
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
        === "East US 2"
            ```
            20.65.88.253
            20.65.88.252
            ```
        === "West US"
            ```
            104.210.63.116
            104.210.63.117
            ```
        === "West US 3"
            ```
            20.38.2.233
            20.38.2.232
            ```
        === "Germany West Central"
            ```
            20.79.250.104
            20.79.250.105
            ```
        === "Switzerland North"
            ```
            20.203.240.193
            20.203.240.192
            ```

![!](../../../images/waf-installation/security-edge/inline/general-settings-section.png)

Later, when adding hosts for traffic analysis and filtering, you will assign each host or location to its designated origin.

## 3. Certificates

* If the Edge Inline node is deployed as a direct, Internet-facing solution, Wallarm requires certificates to securely route traffic to your origin servers. Certificates are issued based on the DNS zones specified in this section.

    Once configuration is complete, Wallarm provides a CNAME for each DNS zone. Add this CNAME record to your DNS settings to verify domain ownership and complete the certificate issuance process.
* If your origin servers are behind a third-party service (e.g., a CDN or a DDoS protection provider like Cloudflare or Akamai) that proxies traffic, certificate issuance is not required. In this case, select the **Skip certificate issuance** option.

![!](../../../images/waf-installation/security-edge/inline/certificates.png)

You can specify multiple DNS zones, each with a different certificate issuance approach.

## 4. Hosts

Specify the public domains, ports and subdomains that will direct traffic to the Edge Node for analysis.

!!! info "Apex domains"
    Use `www.example.com` instead of apex domains when possible. Or configure a [redirection from the apex domain to `www.*`](host-redirection.md). This allows Wallarm to use a global CNAME and avoid manual traffic balancing with A records.

1. Specify your hosts. Each host entry must match a DNS zone (when specified in the **Certificates** section) and differ from origins to avoid routing loops.

    ??? note "Allowed ports"
        Directing traffic from HTTP ports to the Edge node is not allowed. The following ports are supported:

        443, 444, 1443, 1760, 2001, 2087, 2096, 4333, 4334, 4430, 4440, 4443 4466, 4993, 5000, 5001, 5454, 7003, 7443, 7741, 8010, 8012, 8070, 8071, 8072, 8075, 8076, 8077, 8078, 8081, 8082, 8084, 8085, 8086, 8088, 8090, 8092, 8093, 8094, 8095, 8096, 8097, 8098, 8099, 8104, 8181, 8243, 8282, 8383, 8443, 8444, 8448, 8585, 8723, 8787, 8801, 8866, 9052, 9090, 9093, 9111, 9193, 9440, 9443, 9797, 44300, 44301, 44302, 44395, 44443, 52233, 55180, 55553, and 60000
1. (Optional) Associate the host's traffic with a [Wallarm application](../../user-guides/settings/applications.md) to categorize and manage different API instances or services on the Wallarm platform.
1. Set the [Wallarm mode](../../admin-en/configure-wallarm-mode.md) for each host.
1. (Optionally) Specify server [NGINX directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html). By default, these directives use NGINX's standard values, as specified in the NGINX documentation.
1. For each host, define the configuration for the root location (`/`):

    * Origin where the Wallarm node will forward the filtered traffic (if no other location-specific settings are defined). The location's path is automatically appended to the origin.
    * (Optionally) Wallarm application.
    * Filtration mode.

![!](../../../images/waf-installation/security-edge/inline/hosts.png)

For specific **locations** within hosts, you can further customize:

* Origin. The path defined in the location will automatically append to the origin.
* Wallarm application.
* Filtration mode.
* Some [NGINX directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html). By default, these directives use NGINX's standard values, as specified in the NGINX documentation.

Each location inherits settings from the host and root location, unless specifically overridden.

The below example configuration customizes settings per path to meet specific needs: `/auth` prioritizes security with blocking mode enabled, while `/data` allows larger uploads by increasing the `client_max_body_size` to 5MB.

![!](../../../images/waf-installation/security-edge/inline/locations.png)

## 5. Certificate CNAME configuration

For domain verification, add the CNAME records provided in the Wallarm Console to your DNS provider's settings for each DNS zone. These records are required for Wallarm to verify domain ownership and issue certificates.

!!! warning "Do not remove the certificate CNAME"
    The certificate CNAME record must stay in your DNS settings. It is needed for further deployment configuration updates and certificate renewal.

![](../../../images/waf-installation/security-edge/inline/host-cnames.png)

![](../../../images/waf-installation/security-edge/inline/cert-cname.png)

DNS changes can take up to 24 hours to propagate. Wallarm starts the Edge node deployment once the CNAME records are verified (if needed).

## 6. Routing traffic to the Edge Node

To send client requests through the Edge Node, update your DNS records based on the type of domain you protect.

### CNAME record

If your protected host is a third-level (or higher-level) domain (e.g., `api.example.com`), you need to specify the CNAME record pointing to the Wallarm‑proided FQDN in your DNS zone.

Once the certificate CNAME is verified, a **Traffic CNAME** is available for each host. If no certificate is issued, the CNAME is available immediately after the configuration is complete.

* Single cloud deployment: use the **Traffic CNAME for the selected cloud provider**.
* Multi-cloud deployment: use the **Traffic CNAME (Global)** to automatically distribute traffic across all selected regions and providers.

    Per-provider CNAMEs are also available if you need to enforce routing to a specific provider - for example, to test latency or performance across providers.

![](../../../images/waf-installation/security-edge/inline/traffic-cname.png)

DNS changes can take up to 24 hours to propagate. Once propagated, Wallarm will proxy all traffic to 

### A records

If your protected host is an apex domain (e.g., `example.com`), a CNAME cannot be used. In this case, the DNS setup must use **A records**, which are returned once the deployment becomes [**Active**](upgrade-and-management.md#statuses).

![](../../../images/waf-installation/security-edge/inline/a-records.png)

Traffic routing in this case is managed by your DNS provider. By default, most DNS providers use [round-robin](https://en.wikipedia.org/wiki/Round-robin_DNS) logic, but some may support latency-based routing as well.

## Quick setup limitations

The [Quick setup wizard](#quick-setup-wizard) offers a simplified deployment flow but comes with several limitations compared to the full configuration:

* [Multi-region and multi-cloud deployment](multi-region.md) is not supported
* Only one origin can be added
* Cannot skip [domain ownership verification](#3-certificates) (even if your origin is behind a proxy like Cloudflare or Akamai)
* [Host redirection](host-redirection.md) is not supported
* [Mutual TLS](mtls.md) configuration is unavailable
* Host fine-tuning is not supported: filtration modes, Wallarm applications, NGINX directives
* Apex domains not supported in hosts

## More configuation options

* [Edge Node deployment in multi regions and providers](multi-region.md)
* [mTLS for Edge Node to Origins](mtls.md)
* [Host redirection](host-redirection.md)
* [Edge Node Upgrade](management.md)
* [Telemetry Portal](telemetry-portal.md)
