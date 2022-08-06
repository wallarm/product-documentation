[cdn-node-operation-scheme]:        images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       user-guides/rules/sensitive-data-rule.md
[operation-modes-docs]:             admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         user-guides/rules/wallarm-mode-rule.md
[wallarm-cloud-docs]:               about-wallarm-waf/overview.md#cloud
[cdn-node-creation-modal]:          images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  user-guides/settings/users.md
[update-origin-ip-docs]:            user-guides/nodes/cdn-node.md#updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       user-guides/rules/intro.md
[ip-lists-docs]:                    user-guides/ip-lists/overview.md
[integration-docs]:                 user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     user-guides/triggers/triggers.md
[application-docs]:                 user-guides/settings/applications.md
[nodes-ui-docs]:                    user-guides/nodes/cdn-node.md
[events-docs]:                      user-guides/events/check-attack.md

# Quick start with Wallarm API Security

The quickest way to deploy the Wallarm filtering node is to use the node of the CDN type that mitigates malicious traffic without placing any third‑party components in the application's infrastructure.

All that is required to deploy the CDN node is to **specify the domain to be protected** and **add the Wallarm CNAME record to the domain's DNS records**.

If the CDN node does not meet your requirements, learn other [supported deployment options](admin-en/supported-platforms.md).

## How CDN node works

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## Requirements

--8<-- "../include/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

## CDN node deployment

--8<-- "../include/waf/installation/cdn-node/cdn-node-deployment.md"

## Next steps

Wallarm node quick deployment is successfully completed!

To continue the product exploration, we recommend learning more about the following Wallarm API Security features:

--8<-- "../include/waf/installation/cdn-node/cdn-node-configuration-options.md"

## CDN node troubleshooting

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"
