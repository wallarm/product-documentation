# Amazon Machine Image'den Wallarm Dağıtma

Bu makale, AWS üzerinde [official Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD) kullanılarak Wallarm'ın dağıtımını gerçekleştirmek için talimatlar sunmaktadır. Çözüm, [in-line][inline-docs] veya [Out-of-Band][oob-docs] şeklinde dağıtılabilir.

## Kullanım Durumları

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Wallarm'ın Trafiği Analiz Etmesine İzin Verme

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. NGINX'i Yeniden Başlatma

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Trafiğin Wallarm Kurulumuna Gönderilmesini Yapılandırma

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarm Operasyonunu Test Etme

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. Dağıtılmış Çözümü İnce Ayar Yapma

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"