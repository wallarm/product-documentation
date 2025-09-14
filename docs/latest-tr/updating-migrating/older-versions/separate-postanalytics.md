[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../../images/admin-guides/test-attacks-quickstart.png
[nginx-custom]:                 ../../custom/custom-nginx-version.md
[wallarm-token-types]:          ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[statistics-service-all-parameters]: ../../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:    ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ip-lists-docs]:                     ../../user-guides/ip-lists/overview.md

# EOL postanalytics modülünü yükseltme

Bu talimatlar, ayrı bir sunucuya kurulmuş olan kullanım ömrü sonu (EOL) postanalytics modülünü (sürüm 3.6 ve altı) yükseltme adımlarını açıklar. Postanalytics modülü, [Wallarm NGINX modüllerini yükseltmeden][docs-module-update] önce yükseltilmelidir.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! info "All-in-one installer ile yükseltme"
    Yükseltme, bireysel Linux paketleri kullanım dışı bırakıldığından Wallarm'ın [all-in-one installer](../../installation/nginx/all-in-one.md) kullanılarak gerçekleştirilir. Bu yöntem, önceki yaklaşıma kıyasla yükseltme sürecini ve sürekli dağıtım bakımını basitleştirir.
    
    Yükleyici aşağıdaki işlemleri otomatik olarak gerçekleştirir:

    1. İşletim sisteminizi ve NGINX sürümünüzü kontrol etme.
    1. Algılanan işletim sistemi ve NGINX sürümü için Wallarm depolarını ekleme.
    1. Bu depolardan Wallarm paketlerini yükleme.
    1. Yüklenen Wallarm modülünü NGINX'inize bağlama.
    1. Sağlanan belirteç ile filtreleme düğümünü Wallarm Cloud'a bağlama.
    
        Bireysel Linux paketleriyle manuel yükseltme artık desteklenmemektedir.

    ![Manuel ile All-in-one karşılaştırması](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Adım 1: Temiz makineyi hazırlayın

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Adım 2: Wallarm belirtecini hazırlayın

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 3: All-in-one Wallarm yükleyicisini indirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 4: Postanalytics'i yüklemek için all-in-one Wallarm yükleyicisini çalıştırın

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

## Adım 5: API portunu güncelleyin

--8<-- "../include/waf/upgrade/api-port-443.md"

## Adım 6: Ayrı bir sunucudaki NGINX‑Wallarm modülünü yükseltin

postanalytics modülü ayrı sunucuya kurulduktan sonra, farklı bir sunucuda çalışan [ilgili NGINX‑Wallarm modülünü yükseltin](nginx-modules.md).

## Adım 7: NGINX‑Wallarm modülünü postanalytics modülüne yeniden bağlayın

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

## Adım 8: NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol edin

--8<-- "../include/waf/installation/all-in-one-postanalytics-check-latest.md"

## Adım 9: Eski postanalytics modülünü kaldırın

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"