[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../overview.md#advantages-and-limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png

# Deploying Wallarm OOB from GCP Machine Image

This article provides instructions for deploying [Wallarm OOB](overview.md) on Google Cloud Platform using the [official Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). The solution described here is designed to analyze traffic mirrored by a web or proxy server.

## Use cases

Among all supported [Wallarm deployment options](../../supported-deployment-options.md), GCP Machine Image is recommended for out-of-band Wallarm deployment in these **use cases**:

1. Your existing infrastructure resides on GCP. In this case, using Wallarm Machine Image for deploying a Wallarm node is a natural extension.
1. You aim to deploy a security solution as a virtual appliance using a virtual machine image.
1. You leverage a simplified deployment process. With Machine Image, you launch a pre-configured server image, that makes the deployment process both faster and more reliable.

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Enable Wallarm to analyze the mirrored traffic

--8<-- "../include/waf/installation/oob/steps-for-mirroring-cloud.md"

## 6. Restart NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Configure your web or proxy server to mirror traffic to the Wallarm node

Configure your web or server (e.g. NGINX, Envoy) to mirror incoming traffic to the Wallarm node. For configuration details, we recommend to refer to your web or proxy server documentation.

Inside the [link](overview.md#examples-of-web-server-configuration-for-traffic-mirroring), you will find the example configuration for the most popular of web and proxy servers (NGINX, Traefik, Envoy).

## 8. Test the Wallarm operation

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 9. Fine-tune the deployed solution

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"
