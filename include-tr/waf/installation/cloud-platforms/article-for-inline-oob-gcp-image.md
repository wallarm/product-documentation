# GCP Makina İmajı'ndan Wallarm'ı Yüklemek

Bu makale, Wallarm'ı [resmi Makina İmajı](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) kullanarak GCP'ye yükleme talimatlarını sağlar. Çözüm, ya [hat içi][inline-docs] ya da [Bant Dışı][oob-docs] olarak konuşlandırılabilir. 

## Kullanım durumları

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Wallarm'ın trafiği analiz etmesini etkinleştirin

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. NGINX'i Yeniden Başlat

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Trafiği Wallarm örneğine göndermeyi yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarm operasyonunu test edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Konuşlandırılan çözümü ince ayar yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"