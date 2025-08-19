# Security Edge Free Tier

The Free Tier of [Security Edge](overview.md) lets you evaluate the Wallarm platform and protect up to **500,000 requests per month - free of charge**, without hosting the Wallarm Node yourself.

With the Security Edge Free Tier, you gain access to the Wallarm platform as [Advanced API Security](../../about-wallarm/subscription-plans.md#waap-and-advanced-api-security), including most features, but with some [limitations](#limitations).

## Getting started

To start using the Security Edge Free Tier, **sign up for Wallarm in either the [US](https://us1.my.wallarm.com/signup/?utm_source=wallarm_docs&utm_campaign=se_free_tier_guide) or [EU Cloud](https://my.wallarm.com/signup/?utm_source=wallarm_docs&utm_campaign=se_free_tier_guide)**.

You will be automatically assigned to the Free Tier and redirected to the **Quick setup wizard**.

If Security Edge deployment does not fit your use case, contact sales@wallarm.com for alternatives.

## Quick setup wizard

The wizard walks you through the basic [Inline](inline/overview.md) or [Connector](se-connector.md) Security Edge deployment.

Edge Nodes start in **monitoring** [mode](../../admin-en/configure-wallarm-mode.md), so requests are not blocked.

=== "Security Edge Inline"
    1. Choose a region for deployment.
    1. Specify a public host (the domain your users connect to).
    1. Define an origin to forward analyzed traffic to.

        If the origin has multiple servers, you can specify all of them. The Edge Node will forward traffic to them using [round-robin](https://en.wikipedia.org/wiki/Round-robin_DNS) load balancing.

        Origins must differ from hosts to avoid loops.
    1. Add the provided **Certificate CNAME** record in your DNS zone to verify domain ownership.
    1. Point your host's DNS to the provided **Traffic CNAME** to complete routing.

        Traffic CNAME is provided once the certificate CNAME is verified.

    ![](../../images/waf-installation/security-edge/inline/quick-setup-wizard-inline.png)
=== "Security Edge Connector"
    1. Choose a region for deployment.
    1. Copy the provided Node URL — the entry point for the Connector.
    1. **Download code bundle** for your platform.
    1. Apply the bundle on your API management platform following the instructions:

        * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
        * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)

    ![](../../images/waf-installation/security-edge/inline/quick-setup-wizard-connector.png)

After setup, a test attack is automatically sent to the Edge Node. Once detected, you gain access to the Wallarm Console with full Free Tier functionality. The attack will appear in the [**Attacks**](../../user-guides/events/check-attack.md) section.

You can also invite teammates to join the onboarding. They will be assigned the **Administrator** [role](../../user-guides/settings/users.md#user-roles) and receive an invitation link by email.

You can reopen the wizard later via the **Quick setup** in the Security Edge section or at `/onboarding`.

## Limitations

Compared to the full Security Edge configuration flow, the **Quick setup** wizard has the following restrictions:

* Host fine-tuning is not supported: filtration modes, Wallarm applications, NGINX directives
* Multi-region deployment of Security Edge is not supported
* Security Edge Inline:

    * Apex domains not supported in hosts
    * Only one origin can be added
    * Cannot skip [domain ownership verification](inline/deployment.md#3-certificates) (e.g. if your origin is behind a proxy like Cloudflare)
    * [Host redirection](inline/host-redirection.md) is not supported
    * [Mutual TLS](inline/mtls.md) configuration is unavailable

Some features are not available in the Free Tier, regardless of whether the quick setup or the full configuration flow is used:

* [Vulnerability assessment](../../user-guides/vulnerabilities.md)
* [API Abuse Prevention](../../api-abuse-prevention/overview.md)
* Telemetry portal of Security Edge
* Multi-cloud Security Edge Inline deployment

## Next steps

* [Security Edge Inline: full configuration flow](inline/deployment.md)
* [Security Edge Connector: full configuration flow](se-connector.md)
