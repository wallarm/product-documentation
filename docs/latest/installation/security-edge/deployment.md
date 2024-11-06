# Security Edge Inline <a href="../../../about-wallarm/subscription-plans/#security-edge"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

The **Security Edge** platform provides a managed service for deploying nodes across geographically distributed locations within a Wallarm-hosted environment. One of its key deployment options is **inline** deployment, offering real-time, robust protection for your entire API landscape without the need for any onsite installation.

This is an ideal solution for securing APIs when you can redirect traffic from your hosts to Wallarm's edge nodes by modifying the CNAME records in your DNS settings.

![!](../../images/waf-installation/security-edge/inline/traffic-flow.png)

## How it works

Security Edge service provides a secure cloud environment where the Wallarm node is deployed, hosted, and managed by Wallarm:

* Turnkey deployment: deploy Wallarm nodes in globally distributed locations with minimal setup.
* Autoscaling: node instances automatically scale to handle varying traffic loads.
* Reduced costs: lower operational overhead with Wallarm-managed nodes, allowing faster deployment and scalability.
* Seamless integration: simple configuration with your existing CDN or load balancers, allowing you to protect your API landscape without disruptions.

Only one Edge inline node deployment is allowed per account. In this single deployment, you can configure multiple origins to forward traffic to and multiple hosts to protect.

## Deploying the Edge inline node

To run the Edge inline node, go to the Wallarm Console → **Security Edge** → **Edge inline** → **Configure**.

If this section is unavailable, your account may lack the appropriate subscription, please contact sales@wallarm.com to obtain it.

### 1. General settings

In **General settings**, specify the following:

1. Choose one or more **regions** to deploy the Edge node.

    We recommend selecting regions close to where your APIs or applications are hosted. Deploying in multiple regions enhances geo-redundancy and ensures high availability.
1. Specify **origins** where the Edge node will forward the filtered traffic. This can be an IP address or a domain.

    You can add multiple origins if needed, as the node supports directing traffic to multiple backends.

Later, when adding hosts for traffic analysis and filtering, you will assign each host or location to its designated origin.

### 2. Certificates

To securely direct traffic to your origins Wallarm needs to obtain certificates for your domains. These certificates will be issued based on the DNS zones you specify in the **Certificates** section.

Once configuration is complete, Wallarm will provide a CNAME for each DNS zone to verify ownership and complete certificate issuance.

### 3. Hosts

In the **Hosts** section:

1. Specify the domains or subdomains that will direct traffic to the Wallarm node for analysis. Each host entry must match a DNS zone previously defined in the **Certificates** section.
1. (Optional) Associate the host's traffic with a [Wallarm application](../../user-guides/settings/applications.md) to categorize and manage different API instances or services on the Wallarm platform.
1. Set the [Wallarm mode](../../admin-en/configure-wallarm-mode.md) for each host.
1. For each host, select the TLS policy that defines the TLS version and protocol Wallarm will use to securely manage traffic from that host.
1. Choose an origin where the Wallarm node will forward the filtered traffic from each host.

For specific paths within hosts, you can further customize:

* Origin. The path defined in the location will automatically append to the origin.
* Wallarm application.
* Filtration mode.
* `proxy_read_timeout`: defines how long Wallarm waits for a response from the origin server before closing the connection. Default is `60s`.
* `proxy_send_timeout`: sets the time Wallarm waits for the origin server to acknowledge request data before terminating the connection. Default is `60s`.
* `client_max_body_size`: limits the maximum request body size allowed from the client to the origin server (useful for file uploads or data size control). Default is `1m`.

Each location inherits settings from the host level but can be customized to allow different configurations per path.

<!-- later on the test build check the message returned when no location is specified if it is chosen to customize locations. at least the / location must be specified -->

<!-- case when there is some frontend before our node??? -->

### 4. Certififcate CNAME configuration

Add the provided CNAME records for each DNS zone in your domain’s DNS settings. These records are essential for Wallarm to verify your domain ownership and issue the necessary certificates.

DNS changes can take up to 24 hours to propagate. Wallarm starts the Edge node deployment once the CNAME records are verified.

### 5. CNAME configuration for traffic routing

After the deployment finished and reached the **Active** status, Wallarm provides a CNAME to route traffic. This usually takes ~10 minutes.

Copy this CNAME and add it to your DNS settings to direct traffic to the Wallarm node. For subdomains, if needed, add A records to ensure traffic is properly routed.

DNS changes can take up to 24 hours to propagate. Once propagated, Wallarm will proxy all traffic to your origins and mitigate malicious requests.

## Limitations

<!-- * Second-level domains are not supported  (e.g., instead `domain.com` use `www.domain.com`). -->
<!-- the above is still the truth? -->

* Only domains shorter than 64 characters are supported.
* Only HTTPS traffic is supported; HTTP is not allowed.

## Upgrading the Edge node

Since the Edge node is a managed solution, Wallarm takes care of all upgrades. The latest stable node version is always deployed on the Edge.

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

<!-- Deployment failed and degraded statuses are not the same?? -->