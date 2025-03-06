[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../images/tarantool-status.png
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md

# Postanalytics Modülünü Yükseltme

Bu talimatlar, ayrı bir sunucuda kurulu 4.x sürümündeki postanalytics modülünü yükseltme adımlarını açıklamaktadır. Postanalytics modülü, [Wallarm NGINX modüllerinin yükseltilmesinden][docs-module-update] önce yükseltilmelidir.

!!! info "Tümleşik Yükleyici ile Yükseltme"
    4.10 sürümünden itibaren, bireysel Linux paketlerinin kullanımdan kaldırılması nedeniyle yükseltme işlemi Wallarm'ın [all-in-one installer](../installation/nginx/all-in-one.md) kullanılarak gerçekleştirilir. Bu yöntem, önceki yaklaşıma kıyasla yükseltme sürecini ve sürekli dağıtım bakımını basitleştirir.
    
    Yükleyici otomatik olarak aşağıdaki işlemleri gerçekleştirir:

    1. İşletim sisteminizi ve NGINX sürümünüzü kontrol etme.
    1. Tespit edilen işletim sistemi ve NGINX sürümü için Wallarm depolarını ekleme.
    1. Bu depolardan Wallarm paketlerini kurma.
    1. Kurulan Wallarm modülünü NGINX'inize bağlama.
    1. Sağlanan token kullanılarak filtreleme düğümünü Wallarm Cloud'a bağlama.

    ![All-in-one compared to manual](../images/installation-nginx-overview/manual-vs-all-in-one.png)

Ömrünü tamamlamış modülü (3.6 veya daha düşük) yükseltmek için lütfen [farklı talimatları](older-versions/separate-postanalytics.md) kullanın.

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Adım 1: Temiz Bir Makine Hazırlayın

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Adım 2: Wallarm Token'ını Hazırlayın

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 3: Tümleşik Wallarm Yükleyiciyi İndirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 4: Postanalytics'i Kurmak İçin Tümleşik Wallarm Yükleyiciyi Çalıştırın

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

## Adım 5: Ayrı Bir Sunucudaki NGINX-Wallarm Modülünü Yükseltin

Postanalytics modülü ayrı sunucuya kurulduktan sonra, farklı bir sunucuda çalışan [ilgili NGINX-Wallarm modülünü](nginx-modules.md) yükseltin.

## Adım 6: NGINX-Wallarm Modülünü Postanalytics Modülüne Yeniden Bağlayın

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect-5.0.md"

## Adım 7: NGINX-Wallarm ve Ayrı Postanalytics Modülleri Arasındaki Etkileşimi Kontrol Edin

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"

## Adım 8: Eski Postanalytics Modülünü Kaldırın

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"