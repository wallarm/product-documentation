# GCP Machine Image kullanarak Wallarm'ı dağıtma

Bu makale, [resmi Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) kullanarak GCP üzerinde Wallarm'ı dağıtma talimatlarını sağlar. Çözüm, ya [satır içi][inline-docs] ya da [bant dışı][oob-docs] olarak dağıtılabilir.

## Kullanım senaryoları

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-5.x.md"

## 5. Örneği Wallarm Cloud'a bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 6. Wallarm örneğine trafik göndermeyi yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 7. Wallarm'ın çalışmasını test edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. Dağıtılan çözüme ince ayar yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-5.0.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"