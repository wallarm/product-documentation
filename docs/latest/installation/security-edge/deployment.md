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

## Configuring the Edge Inline

To run the Edge inline, go to the Wallarm Console → **Security Edge** → **Edge inline** → **Configure**. You can configure multiple origins to forward traffic to and multiple hosts to protect.

If this section is unavailable, your account may lack the appropriate subscription, please contact sales@wallarm.com to obtain it.

You can modify the Edge node deployment settings anytime. The nodes will be re-deployed, starting from the **Pending** status to **Active**. The existing CNAME records will remain unchanged.

### 1. General settings

In **General settings**, specify the following:

1. Choose one or more **regions** to deploy the Edge node.

    We recommend selecting regions close to where your APIs or applications are hosted. Deploying in multiple regions enhances geo-redundancy and ensures high availability.
1. Specify **origins** to which the Edge node will forward filtered traffic. You can enter an IP address, domain name or FQDN, with an optional port (defaults to 443 if unspecified).

    You can add multiple origins if needed, as the node supports directing traffic to multiple backends.

Later, when adding hosts for traffic analysis and filtering, you will assign each host or location to its designated origin.

![!](../../images/waf-installation/security-edge/inline/general-settings-section.png)

### 2. Certificates

To securely direct traffic to your origins, Wallarm needs to obtain certificates for your domains. These certificates will be issued based on the DNS zones you specify in the **Certificates** section.

Once configuration is complete, Wallarm will provide a CNAME for each DNS zone. Add this CNAME record to your DNS settings to verify domain ownership and complete the certificate issuance process.

![!](../../images/waf-installation/security-edge/inline/certificates.png)

### 3. Hosts

In the **Hosts** section:

1. Specify the domains or optional subdomains that will direct traffic to the Wallarm node for analysis. Each host entry must match a DNS zone previously defined in the **Certificates** section.
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

After configuring your setup, add the CNAME records provided in the Wallarm Console to your DNS provider's settings for each DNS zone. These records are required for Wallarm to verify domain ownership and issue certificates.

DNS changes can take up to 24 hours to propagate. Wallarm starts the Edge node deployment once the CNAME records are verified.

### 5. CNAME configuration for traffic routing

Once the certificate CNAME record is applied and verified, the Edge deployment status in the Wallarm Console will change to **Deploying**, indicating that the node deployment has started. This process typically takes ~10 minutes.

When the deployment reaches **Active** status, refresh the Edge nodes page to access the CNAME record for traffic routing. Copy this CNAME and update your DNS settings to route traffic to Wallarm.

DNS changes can take up to 24 hours to propagate. Once propagated, Wallarm will proxy all traffic to your origins and mitigate malicious requests.

## Limitations

* Currently, the Edge inline node supports only direct, Internet-facing deployment. It cannot operate behind a third-party service, such as a CDN or DDoS protection provider (e.g., Cloudflare, Akamai), that routes traffic.
* Only third-level or higher domains are supported (e.g., instead `domain.com` use `www.domain.com`).
* Only domains shorter than 64 characters are supported.
* Only HTTPS traffic is supported; HTTP is not allowed.
* Certificate CNAME records must be added to initiate the Edge node deployment.
* If the certificate CNAME is not added within 14 days, the node deployment will fail.

## Upgrading the Edge Inline

Since the Edge node is a managed solution, Wallarm takes care of all upgrades. The latest stable node version is always deployed on the Edge.

## Deleting the Edge Inline

To delete your Edge deployment, you need to unsubscribe from the Wallarm Security Edge platform by contacting sales@wallarm.com. We will cancel your Security Edge subscription, resulting in the nodes' deactivation.

If you intend to delete and re-create the nodes, you can adjust the settings of the existing deployment, and the nodes will be re-deployed with the updated configuration.

## Statuses

The following statuses may appear in Edge nodes:

* **Pending cert CNAME**: Wallarm is waiting for the required certificate CNAME records to be added to DNS for certificate issuance.
* **Cert CNAME error**: There was an issue verifying the certificate CNAME in DNS. Please check that the CNAME is correctly configured.
* **Deploying**: The Edge node is currently being set up and will be available soon.
* **Pending traffic CNAME**: The deployment is complete, and Wallarm is awaiting the addition of the traffic CNAME record to route traffic to the Edge node.
* **Deployment failed**: The Edge node deployment did not succeed. Check configuration settings and try to redeploy.
* **Active**: The Edge node is fully operational and filtering traffic as configured.
* **Degraded**: The Edge node is active but may have limited functionality or be experiencing minor issues. Please contact the [Wallarm Support team](https://support.wallarm.com) to get help.
* **Deleting**: The Edge node is being removed from the environment and will no longer filter traffic once deletion is complete.
