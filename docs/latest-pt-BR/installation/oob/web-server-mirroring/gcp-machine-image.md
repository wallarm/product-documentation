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

# Implantando Wallarm OOB a partir da Imagem de Máquina GCP

Este artigo fornece instruções para implantar o [Wallarm OOB](overview.md) na Google Cloud Platform usando a [Imagem de Máquina oficial](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). A solução descrita aqui é projetada para analisar o tráfego espelhado por um servidor web ou proxy.

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Ative o Wallarm para analisar o tráfego espelhado

--8<-- "../include-pt-BR/waf/installation/oob/steps-for-mirroring-cloud.md"

## 6. Reinicie o NGINX

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Configure seu servidor web ou proxy para espelhar o tráfego para o nó Wallarm

Configure seu servidor web ou servidor (por exemplo, NGINX, Envoy) para espelhar o tráfego de entrada para o nó Wallarm. Para detalhes de configuração, recomendamos consultar a documentação do seu servidor web ou proxy.

Dentro do [link](overview.md#examples-of-web-server-configuration-for-traffic-mirroring), você encontrará a configuração exemplo para os servidores web e proxy mais populares (NGINX, Traefik, Envoy).

## 8. Teste a operação do Wallarm

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/test-operation-oob.md"

## 9. Ajuste fino da solução implantada

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/fine-tuning-options.md"