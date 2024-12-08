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

* Currently, the Edge inline node supports only direct, Internet-facing deployment. It cannot operate behind a third-party service, such as a CDN or DDoS protection provider (e.g., Cloudflare, Akamai), that routes traffic.
* Only third-level or higher domains are supported (e.g., instead `domain.com` use `www.domain.com`).
* Only domains shorter than 64 characters are supported.
* Only HTTPS traffic is supported; HTTP is not allowed.
* Certificate CNAME records must be added to initiate the Edge node deployment.
* If the certificate CNAME is not added within 14 days, the node deployment will fail.

## Configuring the Edge Inline

To run the Edge inline, go to the Wallarm Console → **Security Edge** → **Edge inline** → **Configure**. You can configure multiple origins to forward traffic to and multiple hosts to protect.

If this section is unavailable, your account may lack the appropriate subscription, please contact sales@wallarm.com to obtain it.

You can update the Edge node deployment settings once it reaches **Active** status. The node will be re‑deployed with existing CNAME records remaining unchanged.

### 1. General settings

In general settings, you specify regions to deploy the Edge node and origins to forward filtered traffic.

#### Regions

Choose one or more regions to deploy the Edge node. We recommend selecting regions close to where your APIs or applications are hosted.

Deploying in multiple regions enhances geo-redundancy and ensures high availability.

#### Origin servers

Specify origins to which the Edge node will forward filtered traffic. For each origin, provide a server IP address, domain name, or FQDN with an optional port (default: 443).

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

![!](../../images/waf-installation/security-edge/inline/general-settings-section.png)

Later, when adding hosts for traffic analysis and filtering, you will assign each host or location to its designated origin.

### 2. Certificates

To securely direct traffic to your origins, Wallarm needs to obtain certificates for your domains. These certificates will be issued based on the DNS zones you specify in the **Certificates** section.

Once configuration is complete, Wallarm will provide a CNAME for each DNS zone. Add this CNAME record to your DNS settings to verify domain ownership and complete the certificate issuance process.

![!](../../images/waf-installation/security-edge/inline/certificates.png)

### 3. Hosts

In the **Hosts** section:

1. Specify the domains and ports or optional subdomains that will direct traffic to the Wallarm node for analysis. Each host entry must match a DNS zone previously defined in **Certificates**.

    ??? info "Allowed ports"
        Directing traffic from HTTP ports to the Edge node is not allowed. The following ports are supported:

        443, 444, 1443, 1760, 2001, 2087, 2096, 4333, 4334, 4430, 4440, 4443 4466, 4993, 5000, 5001, 5454, 7003, 7443, 7741, 8010, 8012, 8070, 8071, 8072, 8075, 8076, 8077, 8078, 8081, 8082, 8084, 8085, 8086, 8088, 8090, 8092, 8093, 8094, 8095, 8096, 8097, 8098, 8099, 8104, 8181, 8243, 8282, 8383, 8443, 8444, 8448, 8585, 8723, 8787, 8801, 8866, 9052, 9090, 9093, 9111, 9193, 9440, 9443, 9797, 44300, 44301, 44302, 44395, 44443, 52233, 55180, 55553, and 60000

1. (Optional) Associate the host's traffic with a [Wallarm application](../../user-guides/settings/applications.md) to categorize and manage different API instances or services on the Wallarm platform.
1. Set the [Wallarm mode](../../admin-en/configure-wallarm-mode.md) for each host.
1. Choose an origin where the Wallarm node will forward the filtered traffic from each host.

![!](../../images/waf-installation/security-edge/inline/hosts.png)

For specific **locations** within hosts, you can further customize:

* Origin. The path defined in the location will automatically append to the origin.
* Wallarm application.
* Filtration mode.
* `proxy_read_timeout`: defines how long Wallarm waits for a response from the origin server before closing the connection. Default is `60s`.
* `proxy_send_timeout`: sets the time Wallarm waits for the origin server to acknowledge request data before terminating the connection. Default is `60s`.
* `client_max_body_size`: limits the maximum request body size allowed from the client to the origin server (useful for file uploads or data size control). Default is `1MB`.

Each location inherits settings from the host level but can be individually customized. Locations not explicitly configured will follow the general settings specified at the host level.

The below example configuration customizes settings per path to meet specific needs: `/auth` prioritizes security with blocking mode enabled, while `/data` allows larger uploads by increasing the `client_max_body_size` to 5MB.

![!](../../images/waf-installation/security-edge/inline/locations.png)

### 4. Certififcate CNAME configuration

After configuration is finished, add the CNAME records provided in the Wallarm Console to your DNS provider's settings for each DNS zone. These records are required for Wallarm to verify domain ownership and issue certificates.

DNS changes can take up to 24 hours to propagate. Wallarm starts the Edge node deployment once the CNAME records are verified.

### 5. CNAME configuration for traffic routing

Once the certificate CNAME is verified (~10 minutes), a **Traffic CNAME** will be available for each host on the **Hosts** tab of the Edge node page. Copy it and update your DNS settings to route traffic to Wallarm.

![!](../../images/waf-installation/security-edge/inline/host-traffic-cname.png)

DNS changes can take up to 24 hours to propagate. Once propagated, Wallarm will proxy all traffic to your origins and mitigate malicious requests.

## Telemetry portal

The telemetry portal for Security Edge Inline in Wallarm provides real-time insights into Edge Node performance via a Grafana dashboard. It displays metrics such as CPU usage, requests per second per host, and response times.

This feature enables proactive monitoring of Edge Nodes, allowing you to independently verify node status and diagnose issues related to origins or hosts, particularly when a node is in a degraded state.

![!](../../images/waf-installation/security-edge/inline/telemetry-portal.png)

**Run telemetry portal** once the Node reaches the **Active** status. It becomes accessible via a direct link from the Security Edge section ~5 minutes after initiation. Authentication uses the credentials you employ for the Wallarm Console.

![!](../../images/waf-installation/security-edge/inline/run-telemetry-portal.png)

## Upgrading the Edge Inline

Since the Edge node is a managed solution, Wallarm takes care of all upgrades. The latest stable node version is always deployed on the Edge.

## Deleting the Edge Inline

To delete your Edge deployment, you need to unsubscribe from the Wallarm Security Edge platform by contacting sales@wallarm.com. We will cancel your Security Edge subscription, resulting in the nodes' deactivation.

If you intend to delete and re-create the nodes, you can adjust the settings of the existing deployment, and the nodes will be re-deployed with the updated configuration.

## Statuses

The Edge node section provides real-time statuses of the deployment and configuration state for your origins, hosts, and regions:

=== "Origins"
    ![!](../../images/waf-installation/security-edge/inline/origin-statuses.png)
=== "Hosts"
    ![!](../../images/waf-installation/security-edge/inline/host-statuses.png)
=== "Regions"
    ![!](../../images/waf-installation/security-edge/inline/region-statuses.png)

* **Pending cert CNAME**: Waiting for the certificate CNAME records to be added to DNS for certificate issuance.
* **Pending traffic CNAME**: The deployment is complete, awaiting the addition of the traffic CNAME record to route traffic to the Edge node.
* **Deploying**: The Edge node is currently being set up and will be available soon.
* **Active**: The Edge node is fully operational and filtering traffic as configured.
* **Cert CNAME error**: There was an issue verifying the certificate CNAME in DNS. Please check that the CNAME is correctly configured.
* **Deployment failed**: The Edge node deployment did not succeed, e.g. due to the certificate CNAME not added within 14 days. Check configuration settings and try to redeploy or contact the [Wallarm Support team](https://support.wallarm.com) to get help.
* **Degraded**: The Edge node is active in the region but may have limited functionality or be experiencing minor issues. Please contact the [Wallarm Support team](https://support.wallarm.com) to get help.
