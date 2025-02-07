[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../../images/admin-guides/test-attacks-quickstart.png
[nginx-custom]:                 ../../custom/custom-nginx-version.md
[wallarm-token-types]:          ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../../images/tarantool-status.png
[statistics-service-all-parameters]: ../../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:    ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ip-lists-docs]:                     ../../user-guides/ip-lists/overview.md

# EOL postanalytics modülünü Yükseltme

Bu talimatlar, ayrı bir sunucuda kurulu (sürüm 3.6 ve altı) end‑of‑life postanalytics modülünü yükseltmek için gereken adımları açıklamaktadır. Postanalytics modülü, [Upgrading Wallarm NGINX modules][docs-module-update] işleminden önce yükseltilmelidir.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! info "All-in-one Yükleyici ile Yükseltme"
    Yükseltme, bireysel Linux paketlerinin kullanım dışı bırakıldığı Wallarm'ın [all-in-one yükleyicisi](../../installation/nginx/all-in-one.md) kullanılarak gerçekleştirilir. Bu yöntem, önceki yaklaşıma kıyasla yükseltme sürecini ve sürekli dağıtım bakımını sadeleştirir.
    
    Yükleyici otomatik olarak aşağıdaki işlemleri gerçekleştirir:

    1. İşletim sisteminizin ve NGINX sürümünüzün kontrol edilmesi.
    1. Tespit edilen işletim sistemi ve NGINX sürümü için Wallarm depo adreslerinin eklenmesi.
    1. Bu depolardan Wallarm paketlerinin kurulması.
    1. Kurulan Wallarm modülünün NGINX'inize bağlanması.
    1. Sağlanan token kullanılarak filtreleme düğümünün Wallarm Cloud'a bağlanması.
    
        Bireysel Linux paketleriyle manuel yükseltme artık desteklenmemektedir.

    ![All-in-one compared to manual](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Adım 1: Temiz Bir Makine Hazırlama

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Adım 2: Wallarm Token'ını Hazırlama

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 3: All-in-one Wallarm Yükleyicisini İndirme

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 4: Postanalytics'i Kurmak için All-in-one Wallarm Yükleyicisini Çalıştırma

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

## Adım 5: API Portunu Güncelleme

--8<-- "../include/waf/upgrade/api-port-443.md"

## Adım 6: Ayrı bir Sunucuda Çalışan NGINX-Wallarm Modülünü Yükseltme

Postanalytics modülü ayrı bir sunucuda kurulduktan sonra, farklı bir sunucuda çalışan [NGINX-Wallarm modülünü yükseltin](nginx-modules.md).

## Adım 7: NGINX-Wallarm Modülünü Postanalytics Modülüne Yeniden Bağlama

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

## Adım 8: NGINX‑Wallarm ile Ayrı Postanalytics Modüllerinin Etkileşimini Kontrol Etme

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"

## Adım 9: Eski Postanalytics Modülünü Kaldırma

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"