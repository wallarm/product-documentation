[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-create-a-security-group
[anchor2]:      #1-create-a-pair-of-ssh-keys-in-aws

[img-create-sg]:                ../../../images/installation-ami/common/create_sg.png
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
[autoscaling-docs]:                 ../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../overview.md#advantages-and-limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png

# Implementação do Wallarm OOB a partir da imagem da Amazon

Este artigo fornece instruções para implantar o [Wallarm OOB](overview.md) na AWS usando a [Imagem oficial de máquina da Amazon (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). A solução descrita aqui foi projetada para analisar o tráfego espelhado por um servidor web ou proxy.

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Permita que o Wallarm analise o tráfego espelhado

--8<-- "../include-pt-BR/waf/installation/oob/steps-for-mirroring-cloud.md"

## 7. Reinicie o NGINX

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Configure seu servidor web ou proxy para espelhar o tráfego no nó Wallarm

Configure seu servidor web ou proxy (por exemplo, NGINX, Envoy) para espelhar o tráfego de entrada no nó Wallarm. Para detalhes da configuração, recomendamos referir-se à documentação do seu servidor web ou proxy.

Dentro do [link](overview.md#examples-of-web-server-configuration-for-traffic-mirroring), você encontrará a configuração de exemplo para os servidores web e proxy mais populares (NGINX, Traefik, Envoy).

## 9. Teste a operação Wallarm

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/test-operation-oob.md"

## 10. Ajuste fino da solução implantada

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/fine-tuning-options.md"