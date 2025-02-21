# Amazon Machine Image'den Wallarm Dağıtımı

Bu makale, AWS üzerinde [resmi Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD) kullanılarak Wallarm'ın dağıtımı için talimatlar sunmaktadır. Çözüm, [satır içi][inline-docs] veya [Bant Dışı][oob-docs] olarak dağıtılabilir.

En son Wallarm AMI, Debian 12 tabanlıdır ve Debian deposundan NGINX 1.22.1 kullanır.

## Kullanım Durumları

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. Örneği Wallarm Cloud'a Bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 7. Wallarm Örneğine Trafik Gönderimini Yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 8. Wallarm İşlemini Test Edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Dağıtılan Çözümü İnce Ayarlayın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"