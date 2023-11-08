# Implementando Wallarm a partir da Imagem da Máquina GCP

Este artigo fornece instruções para implementar o Wallarm no GCP usando a [Imagem oficial da Máquina](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). A solução pode ser implementada [no local][inline-docs] ou [Fora da Banda][oob-docs].

## Casos de uso

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.6.md"

## 5. Permita que Wallarm analise o tráfego

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. Reinicializar o NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Configure o envio de tráfego à instância Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Teste a operação do Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Ajuste a solução implantada

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"