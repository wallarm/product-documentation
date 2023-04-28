[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../admin-en/supported-platforms.md

[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[platform]:                         ../../../admin-en/supported-platforms.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../overview.md#advantages-and-limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md

# Deploying Wallarm OOB from GCP Machine Image

This article provides instructions for deploying [Wallarm OOB](overview.md) on GCP using the [official Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). The solution described here is designed to analyze traffic mirrored by a web server.

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Enable Wallarm to analyze the mirrored traffic

--8<-- "../include/waf/installation/oob/steps-for-mirroring.md"

## 6. Restart NGINX

To apply the settings, restart NGINX:

``` bash
sudo systemctl restart nginx
```

Each configuration file change requires NGINX to be restarted to apply it.

## 7. Test the Wallarm operation

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 8. Configure your web server to mirror traffic to the Wallarm node

Configure your web server to mirror incoming traffic to the Wallarm node. For configuration details, we recommend to refer to your web server documentation.

Inside the [link](overview.md#examples-of-web-server-configuration-for-traffic-mirroring), you will find the example configuration for the most popular of web servers (NGINX, Traefik, Envoy, Istio).

## 9. Fine-tune the deployment architecture

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"
