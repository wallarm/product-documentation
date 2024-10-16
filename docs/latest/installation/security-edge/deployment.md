# Security Edge Inline <a href="../../../about-wallarm/subscription-plans/#security-edge"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

The **Security Edge** platform provides a streamlined, managed service for deploying nodes across geographically distributed locations within a Wallarm-hosted environment. One of its key deployment options is **inline** deployment, offering real-time, robust protection for your entire API landscape without the need for any onsite installation.

This is an ideal solution for securing APIs when you can redirect traffic from your hosts to Wallarm's edge nodes by modifying the CNAME records in your DNS settings.

![!](../../images/waf-installation/se-inline.png)

## How it works

Wallarm Edge service provides a secure cloud environment where the Wallarm node is deployed, hosted, and managed by Wallarm:

* Turnkey deployment: deploy Wallarm nodes in globally distributed locations with minimal setup.
* Autoscaling: node instances automatically scale to handle varying traffic loads.
* Reduced costs: lower operational overhead with Wallarm-managed nodes, allowing faster deployment and scalability.
* Seamless integration: simple configuration with your existing CDN or load balancers, allowing you to protect your API landscape without disruptions.

## Running the Edge inline node

1. The Security Edge deployment is available only with the corresponding subscription. Contact sales@wallarm.com to obtain it.
1. Go to the Wallarm Console → **Security Edge** → **Edge inline** → **Add origin**.
1. Specify the **origin** (source server or infrastructure) that will send traffic to the Wallarm Edge node. This can be either an IP address or a domain.
1. Choose one or more **regions** to deploy the Wallarm node.

    We recommend selecting regions close to where your APIs or applications are hosted. Deploying in multiple regions enhances geo-redundancy and ensures high availability.
1. In the **Hosts** section, specify the domains or subdomains that will direct traffic to the Wallarm node.
    
    Set the [Wallarm mode](../../admin-en/configure-wallarm-mode.md) for each host and, if needed, associate the host's traffic with a [Wallarm application](../../user-guides/settings/applications.md).
1. (Optional) For specific **locations** within hosts, you can adjust the following parameters:

    * `proxy_read_timeout`: defines how long Wallarm waits for a response from the origin server before closing the connection.
    * `proxy_send_timeout`: sets the time Wallarm waits for the origin server to acknowledge request data before terminating the connection.
    * `client_max_body_size`: limits the maximum request body size allowed from the client to the origin server (useful for file uploads or data size control).
1. Add the Wallarm-generated **CNAME** record to your DNS settings.

    If a CNAME already exists, replace its value with the Wallarm-generated one.
    
    DNS changes can take up to 24 hours to propagate. Once the CNAME is updated, Wallarm will proxy all traffic and mitigate malicious requests.

## Limitations

* Second-level domains (e.g., `domain.com`) are not supported. Use subdomains (e.g., `www.domain.com`) instead.
* Only domains shorter than 64 characters are supported.
* Only HTTPS traffic is supported; HTTP is not allowed.

<!-- You can not manual add certificate - only issue a new one.???
no cert manageent again?
  -->
