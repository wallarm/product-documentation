# Deploying Security Edge Inline <a href="../../../about-wallarm/subscription-plans/#security-edge"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

To run the Edge inline, go to the Wallarm Console → **Security Edge** → **Edge inline** → **Configure**. If this section is unavailable, contact sales@wallarm.com to access the required subscription.

You can configure multiple origins to forward traffic to and multiple hosts to protect. See the demo:

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/d0rwdofmftda" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
      </div>

You can update the Edge node deployment settings at any time. The node will be re‑deployed with existing CNAME records remaining unchanged.

## 1. General settings

In general settings, you specify regions to deploy the Edge node and origins to forward filtered traffic.

### Regions

Choose one or more regions to deploy the Edge node. We recommend selecting regions close to where your APIs or applications are hosted.

Deploying in multiple regions enhances geo-redundancy and ensures high availability.

### Origin servers

Specify origins to which the Edge node will forward filtered traffic. For each origin, provide a server IP address or FQDN with an optional port (default: 443).

If an origin has multiple servers, you can specify all of them. Requests are distributed as follows:

* The round-robin algorithm is used. The first request is sent to the first server, the second to the next, and so on, cycling back to the first server after the last.
* With IP-based session persistence, traffic from the same IP consistently routes to the same server.

!!! info "Allow traffic from Wallarm IP ranges to origins"
    Your origins should allow incoming traffic from the IP ranges used by the selected regions:

    === "us-east-1"
        ```
        18.215.213.205
        44.214.56.120
        44.196.111.152
        ```
    === "us-west-1"
        ```
        52.8.91.20
        13.56.117.139
        54.177.237.34
        50.18.177.184
        ```
    === "eu-central-1 (Frankfurt)"
        ```
        18.153.123.2
        18.159.1.147
        18.195.202.193
        18.196.137.253
        3.121.155.217
        3.64.17.152
        3.65.203.122
        3.67.238.138
        3.73.24.253
        3.76.66.246
        3.79.213.212
        35.156.124.164
        35.156.156.244
        52.59.182.91
        63.177.5.76
        63.178.215.171
        ```
    === "eu-central-2 (Zurich)"
        ```
        51.96.131.55
        16.63.191.19
        51.34.0.90
        51.96.67.145
        ```

![!](../../images/waf-installation/security-edge/inline/general-settings-section.png)

Later, when adding hosts for traffic analysis and filtering, you will assign each host or location to its designated origin.

## 2. Certificates

In the **Certificates** section, you can obtain certificates for your domains:

* If the Edge Inline node is deployed as a direct, Internet-facing solution, Wallarm requires certificates to securely route traffic to your origin servers. Certificates are issued based on the DNS zones specified in this section.

    Once configuration is complete, Wallarm provides a CNAME for each DNS zone. Add this CNAME record to your DNS settings to verify domain ownership and complete the certificate issuance process.
* If your origin servers are behind a third-party service (e.g., a CDN or a DDoS protection provider like Cloudflare or Akamai) that proxies traffic, certificate issuance is not required. In this case, select the **Skip certificate issuance** option.

![!](../../images/waf-installation/security-edge/inline/certificates.png)

You can specify multiple DNS zones, each with a different certificate issuance approach.

## 3. Hosts

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

## 4. (Optional) Admin settings

In the **Admin settings** section, you choose a node version and specify upgrade settings:

* Select the Edge node version to deploy. The latest available version is deployed by default.

    For the changelog of versions, refer to the [article](../../updating-migrating/node-artifact-versions.md#all-in-one-installer). The Edge node version follows the `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` format, corresponding to the same version in the linked article. The build number in the Edge node version indicates minor changes.
* Enable [Auto update](upgrade-and-management.md#upgrading-the-edge-inline) if needed.

![!](../../images/waf-installation/security-edge/inline/admin-settings.png)

## 5. Certificate CNAME configuration

If DNS zones are specified in the **Certificates** section, add the CNAME records provided in the Wallarm Console to your DNS provider's settings for each DNS zone. These records are required for Wallarm to verify domain ownership and issue certificates.

!!! warning "Do not remove the certificate CNAME"
    The certificate CNAME record must stay in your DNS settings. It is needed for further deployment configuration updates and certificate renewal.

![](../../images/waf-installation/security-edge/inline/host-cnames.png)

![](../../images/waf-installation/security-edge/inline/cert-cname.png)

For example, if `myservice.com` is specified in the DNS zone, the cart CNAME is the following:

```
_acme-challenge.myservice.com CNAME _acme-challenge.<WALLARM_CLOUD>-<CLIENT_ID>-<DEPLOYMENT_ID>.acme.aws.wallarm-cloud.com
```

DNS changes can take up to 24 hours to propagate. Wallarm starts the Edge node deployment once the CNAME records are verified.

## 6. Routing traffic to the Edge Node

To route traffic to the Edge Node, you need to specify the CNAME record pointing to the Wallarm‑proided FQDN in your DNS zone. This record is returned as the **Traffic CNAME**.

Once the certificate CNAME is verified, a **Traffic CNAME** is available for each host. If no certificate is issued, the CNAME is available immediately after the configuration is complete.

![](../../images/waf-installation/security-edge/inline/traffic-cname.png)

DNS changes can take up to 24 hours to propagate. Once propagated, Wallarm will proxy all traffic to 
