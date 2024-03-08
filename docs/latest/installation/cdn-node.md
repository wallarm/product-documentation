[cdn-node-operation-scheme]:        ../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../user-guides/rules/sensitive-data-rule.md
[operation-modes-docs]:             ../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console
[wallarm-cloud-docs]:               ../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../user-guides/settings/users.md
[update-origin-ip-docs]:            ../user-guides/nodes/cdn-node.md#updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../user-guides/rules/rules.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[integration-docs]:                 ../user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     ../user-guides/triggers/triggers.md
[application-docs]:                 ../user-guides/settings/applications.md
[nodes-ui-docs]:                    ../user-guides/nodes/cdn-node.md
[events-docs]:                      ../user-guides/events/check-attack.md
[graylist-populating-docs]:         ../user-guides/ip-lists/overview.md#managing-graylist
[graylist-docs]:                    ../user-guides/ip-lists/overview.md
[link-app-conf]:                    ../user-guides/settings/applications.md
[varnish-cache]:                    #why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node
[using-varnish-cache]:              ../user-guides/nodes/cdn-node.md#using-varnish-cache

# Deploying Wallarm Node with Section.io

[Section](https://www.section.io/) is a Cloud-Native Hosting system that enables easy deployment of a Wallarm node. By routing traffic through it as a reverse proxy, you can effectively mitigate malicious traffic without adding third-party components to your application's infrastructure.

## Use cases

Among all supported [Wallarm deployment options](supported-deployment-options.md), this solution is the recommended one for the following **use cases**:

* You are looking for a security solution that is quick and easy to deploy for protecting lightweight services.
* You lack the capability to deploy Wallarm nodes within your hosting infrastructure.
* You prefer a hands-off approach to deployment, avoiding the management and maintenance of Wallarm filtering nodes.

## Limitations

The solution has certain limitations:

* For high traffic analysis and filtration, the use of CDN nodes is not recommended.
* Deployment of the CDN node type is not supported under the [Free tier plan](../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud).
* With the CDN node you can protect the third-level (or lower, like 4th-, 5th- etc.) domains. For example, you can create CDN node for `ple.example.com`, but not for `example.com`.
* The [`collectd` service](../admin-en/monitoring/intro.md) is not supported.
* Direct [application setup](../user-guides/settings/applications.md) through standard procedures is unavailable. Contact the [Wallarm support team](mailto:support@wallarm.com) for configuration assistance.
* [Custom blocking pages and error codes](../admin-en/configuration-guides/configure-block-page-and-code.md) are not configurable. As a default, CDN node returns a 403 response code for blocked requests.

## Requirements

--8<-- "../include/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

## How CDN node works

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## CDN node deployment

1. Open Wallarm Console → **Nodes** → **CDN** → **Create node**.
1. Input the domain address to be protected, e.g. `ple.example.com`.

    The specified address must be the third-level (or lower) domain and not contain the scheme and slashes.
1. Make sure Wallarm correctly identifies the origin address associated with the specified domain. Otherwise, please change the automatically discovered origin address.

    ![CDN node creation modal][cdn-node-creation-modal]

    !!! warning "Dynamic update of origin address"
        If your hosting provider dynamically updates the origin IP address or domain associated with the protected resource, please keep the origin address specified in the CDN node configuration up to date. Wallarm Console enables you to [change the origin address][update-origin-ip-docs] at any time.

        Otherwise, requests will not reach the protected resource since the CDN node will try to proxy them to an incorrect origin address.
1. Wait for the CDN node registration to finish.

    Once the CDN node registration is finished, the CDN node status will be changed to **Requires CNAME**.
1. Add the CNAME record generated by Wallarm to the DNS records of the protected domain.

    If the CNAME record is already configured for the domain, please replace its value with the one generated by Wallarm.

    ![CDN node creation modal][cname-required-modal]

    Depending on your DNS provider, changes to DNS records can take up to 24 hours to propagate and take effect on the Internet. Once the new CNAME record is propagated, the Wallarm CDN node will proxy all incoming requests to the protected resource and block malicious ones.
1. If required, upload the custom SSL/TLS certificate.

    Wallarm will generate the Let's Encrypt certificate for the CDN node domain by default.
1. Once DNS record changes propagated, send test attack to the protected domain:

    ```bash
    curl http://<PROTECTED_DOMAIN>/etc/passwd
    ```

    * If originating IP address is [graylisted][graylist-docs], the node will both block the attack (the HTTP response code is 403) and record it.
    * If originating IP address is not [graylisted][graylist-docs], the node will only record detected attacks. You can check that attacks have been registered in Wallarm Console → **Attacks**:
    
        ![Attacks in the interface][attacks-in-ui]

## Next steps

Wallarm CDN node is successfully deployed!

Learn the Wallarm configuration options:

--8<-- "../include/waf/installation/cdn-node/cdn-node-configuration-options.md"

## CDN node troubleshooting

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"
