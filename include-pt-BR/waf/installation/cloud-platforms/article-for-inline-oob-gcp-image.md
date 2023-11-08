# Implementando Wallarm a partir da Imagem de Máquina GCP

Este artigo fornece instruções para implementar o Wallarm no GCP usando a [Imagem de Máquina oficial](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). A solução pode ser implementada [em linha][inline-docs] ou [Out-of-Band][oob-docs].

## Casos de uso

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Ative o Wallarm para analisar o tráfego

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. Reinicie o NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Configure o envio de tráfego para a instância do Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Teste o funcionamento do Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Ajuste a solução implementada

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"