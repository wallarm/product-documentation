# GCP Machine Image'dan Wallarm Dağıtımı

Bu makale, GCP üzerinde [resmi Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) kullanarak Wallarm'ı dağıtma talimatlarını sağlar. Çözüm [inline][inline-docs] veya [Bant Dışı][oob-docs] olarak dağıtılabilir.

## Kullanım senaryoları

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.8.md"

## 5. Wallarm'ın trafiği analiz etmesini etkinleştirin

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. NGINX'i yeniden başlatın

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Trafiğin Wallarm örneğine gönderilmesini yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarm'ın çalışmasını test edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Dağıtılan çözüme ince ayar yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"