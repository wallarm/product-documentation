# Implantando o Wallarm a partir da Amazon Machine Image

Este artigo fornece instruções para implantar o Wallarm na AWS usando a [Imagem oficial da Máquina Amazon (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). A solução pode ser implantada tanto [na linha][inline-docs] quanto [Fora da Banda][oob-docs].

## Casos de uso

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Permitir que o Wallarm analise o tráfego

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. Reiniciar o NGINX 

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Configurar o envio de tráfego para a instância Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Testar a operação do Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. Ajustar a solução implantada

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"