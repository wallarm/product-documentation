[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../../installation/supported-deployment-options.md
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../../admin-en/configure-logging.md
[wallarm-mode]:                     ../../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# Implementando o Wallarm a partir da Imagem de Máquina GCP

Este artigo fornece instruções para implantar o Wallarm na GCP em linha usando a [Imagem oficial de Máquina](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node).

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Ative o Wallarm para analisar o tráfego

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis-inline.md"

## 6. Reinicie o NGINX

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Configure o envio de tráfego para a instância Wallarm

--8<-- "../include-pt-BR/waf/installation/sending-traffic-to-node-inline.md"

## 8. Teste a operação Wallarm

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Ajuste fino da solução implementada

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/fine-tuning-options.md"