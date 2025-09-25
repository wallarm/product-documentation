# Amazon Machine Image'den Wallarm Dağıtımı

Bu makale, [resmi Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD) kullanarak AWS üzerinde Wallarm dağıtımı için talimatlar sağlar. Çözüm [hat içi][inline-docs] veya [bant dışı][oob-docs] olarak dağıtılabilir.

## Kullanım senaryoları

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Wallarm'ın trafiği analiz etmesini etkinleştirin

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. NGINX'i yeniden başlatın

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Trafiği Wallarm örneğine göndermeyi yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarm çalışmasını test edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. Dağıtılan çözüme ince ayar yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"