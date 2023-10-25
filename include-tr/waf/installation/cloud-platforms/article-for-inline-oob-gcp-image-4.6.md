# GCP Machine Image'den Wallarm'ın Dağıtımı

Bu makale, Wallarm'ı [resmi Makine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) kullanarak GCP'ye dağıtma talimatları sağlar. Çözüm, [satır içi][inline-docs] veya [Bant Dışı][oob-docs] olacak şekilde dağıtılabilir.

## Kullanım Durumları

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.6.md"

## 5. Wallarm'ın trafiği analiz etmesini etkinleştirin

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. NGINX'i Yeniden Başlatın

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Trafiği Wallarm örneğine göndermeyi yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarm işleminin testi

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Dağıtılan çözümü ince ayarlama

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"