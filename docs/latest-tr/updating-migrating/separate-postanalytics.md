[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md

# Postanalytics modülünün yükseltilmesi

Bu talimatlar, ayrı bir sunucuya kurulu postanalytics modülünün en son 6.x sürümüne yükseltilmesi adımlarını açıklar. [Wallarm NGINX modüllerini yükseltmeden][docs-module-update] önce postanalytics modülü yükseltilmelidir.

!!! info "All-in-one yükleyici ile yükseltme"
    4.10 sürümünden itibaren, tekil Linux paketleri kullanımdan kaldırıldığından yükseltme işlemi Wallarm'ın [all-in-one yükleyicisi](../installation/nginx/all-in-one.md) kullanılarak gerçekleştirilir. Bu yöntem, önceki yaklaşıma kıyasla yükseltme sürecini ve sürekli kurulum bakımını basitleştirir.
    
    Yükleyici aşağıdaki işlemleri otomatik olarak gerçekleştirir:

    1. İşletim sisteminizi ve NGINX sürümünü kontrol eder.
    1. Algılanan OS ve NGINX sürümü için Wallarm depolarını ekler.
    1. Bu depolardan Wallarm paketlerini kurar.
    1. Kurulan Wallarm modülünü NGINX'inize bağlar.
    1. Sağlanan token kullanılarak filtreleme düğümünü Wallarm Cloud'a bağlar.

    ![El ile kuruluma kıyasla All-in-one](../images/installation-nginx-overview/manual-vs-all-in-one.png)

Kullanım ömrü sona ermiş modülü (3.6 veya daha düşük) yükseltmek için lütfen [farklı talimatları](older-versions/separate-postanalytics.md) kullanın.

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Adım 1: Temiz makine hazırlayın

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Adım 2: Wallarm token'ını hazırlayın

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 3: Wallarm all-in-one yükleyicisini indirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 4: Postanalytics'i kurmak için Wallarm all-in-one yükleyicisini çalıştırın

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

## Adım 5: Ayrı bir sunucudaki NGINX‑Wallarm modülünü yükseltin

Postanalytics modülü ayrı sunucuya kurulduktan sonra, farklı bir sunucuda çalışan ilgili [NGINX‑Wallarm modülünü yükseltin](nginx-modules.md).

## Adım 6: NGINX‑Wallarm modülünü postanalytics modülüne yeniden bağlayın

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

## Adım 7: NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol edin

--8<-- "../include/waf/installation/all-in-one-postanalytics-check-latest.md"

## Adım 8: Eski postanalytics modülünü kaldırın

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"