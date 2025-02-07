# GCP Makine Görüntüsünden Wallarm Dağıtımı

Bu makale, [official Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) kullanılarak GCP üzerinde Wallarm'ın dağıtımı için talimatları sunmaktadır. Çözüm, [in-line][inline-docs] veya [Out-of-Band][oob-docs] olarak dağıtılabilir.

## Kullanım Durumları

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Örneği Wallarm Cloud ile Bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 6. Trafiğin Wallarm Örneğine Gönderilmesini Yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 7. Wallarm Operasyonunu Test Edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. Dağıtılan Çözümü İnce Ayar Yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"