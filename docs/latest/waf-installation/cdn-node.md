[cdn-node-operation-scheme]:        ../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../user-guides/rules/sensitive-data-rule.md
[operation-modes-docs]:             ../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../user-guides/rules/wallarm-mode-rule.md
[wallarm-cloud-docs]:               ../about-wallarm-waf/overview.md#cloud
[cdn-node-creation-modal]:          ../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../user-guides/settings/users.md
[update-origin-ip-docs]:            ../user-guides/nodes/cdn-node.md#updating-the-origin-ip-address-of-the-protected-domain
[rules-docs]:                       ../user-guides/rules/intro.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[integration-docs]:                 ../user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     ../user-guides/triggers/triggers.md
[application-docs]:                 ../user-guides/settings/applications.md
[nodes-ui-docs]:                    ../user-guides/nodes/cdn-node.md
[events-docs]:                      ../user-guides/events/check-attack.md

# Deploying Wallarm CDN node

Wallarm CDN node operating as a reverse proxy mitigates malicious traffic without placing any third‑party components in the application's infrastructure.

## How CDN node works

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## Requirements

--8<-- "../include/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

## CDN node deployment

--8<-- "../include/waf/installation/cdn-node/cdn-node-deployment.md"

## Next steps

Wallarm CDN node is successfully deployed!

Learn the Wallarm API Security configuration options:

--8<-- "../include/waf/installation/cdn-node/cdn-node-configuration-options.md"

## CDN node troubleshooting

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"
