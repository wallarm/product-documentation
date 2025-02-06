# GCP Makine İmajı Kullanarak Wallarm Dağıtımı

Bu makale, [official Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) kullanılarak GCP üzerinde Wallarm dağıtımı için talimatlar sunmaktadır. Çözüm, [in-line][inline-docs] veya [Out-of-Band][oob-docs] olarak dağıtılabilir.

## Kullanım Senaryoları

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.8.md"

## 5. Wallarm'un Trafiği Analiz Etmesine İzin Verme

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. NGINX'i Yeniden Başlatma

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Trafiğin Wallarm örneğine gönderilmesini yapılandırma

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarm İşleyişini Test Etme

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Dağıtılan Çözümü İyileştirme

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"