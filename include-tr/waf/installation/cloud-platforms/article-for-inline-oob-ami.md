# Amazon Machine İmajı'ndan Wallarm’ı Dağıtmak

Bu makale, [resmi Amazon Machine İmajı (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD) kullanarak AWS üzerinde Wallarm’ı dağıtma talimatlarını sağlar. Çözüm, [hat içi][inline-docs] veya [Bandın-dışında][oob-docs] olmak üzere dağıtılabilir.

## Kullanım durumları

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Wallarm’ın trafiği analiz etmesini etkinleştirin

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. NGINX'i yeniden başlatın

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Trafiği Wallarm örneğine göndermeyi yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarm işlemi test edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. Dağıtılan çözümü ince ayar yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"