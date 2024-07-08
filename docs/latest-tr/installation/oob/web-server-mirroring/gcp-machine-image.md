[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.md
[node-token]:                       ../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
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

# GCP Makine İmajı'ndan Wallarm OOB'u Dağıtma

Bu makale, [Wallarm OOB](overview.md)'nun Google Cloud Platform'da [resmi Makine İmajı](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) kullanılarak dağıtılması için talimatları sağlamaktadır. Burada tarif edilen çözüm, bir web veya proxy sunucusu tarafından yansıtılan trafiği analiz etmek için tasarlanmıştır.

## Kullanım senaryoları

--8<-- "../include-tr/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include-tr/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Wallarm'ın yansıtılan trafiği analiz etmesini sağlayın

--8<-- "../include-tr/waf/installation/oob/steps-for-mirroring-cloud.md"

## 6. NGINX'i Yeniden Başlatın

--8<-- "../include-tr/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Web veya proxy sunucunuzu Wallarm düğümüne trafiği yansıtmak üzere yapılandırın

Web veya sunucunuzu (ör. NGINX, Envoy), Wallarm düğümüne gelen trafiği yansıtmak üzere yapılandırın. Yapılandırma ayrıntıları için web veya proxy sunucunuzun belgelerine başvurmanızı öneririz.

[Link](overview.md#examples-of-web-server-configuration-for-traffic-mirroring) içinde, en popüler web ve proxy sunucularının (NGINX, Traefik, Envoy) örnek yapılandırmasını bulacaksınız.

## 8. Wallarm işlemini test edin

--8<-- "../include-tr/waf/installation/cloud-platforms/test-operation-oob.md"

## 9. Dağıtılmış çözümü ince ayar yapın

--8<-- "../include-tr/waf/installation/cloud-platforms/fine-tuning-options.md"