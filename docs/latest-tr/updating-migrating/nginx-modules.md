[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]:             ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[oob-docs]:                         ../installation//oob/overview.md
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../installation/oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md

# Wallarm NGINX modüllerini yükseltme

Bu talimatlar, bireysel paketlerden kurulmuş Wallarm NGINX modüllerini 4.x’ten 6.x sürümüne yükseltme adımlarını açıklar. Bunlar, aşağıdaki talimatlardan biriyle kurulmuş modüllerdir:

* NGINX stable için bireysel paketler
* NGINX Plus için bireysel paketler
* Dağıtımın sağladığı NGINX için bireysel paketler

!!! info "Tümü bir arada yükleyici ile yükseltme"
    4.10 sürümünden itibaren, bireysel Linux paketleri kullanım dışı bırakıldığından yükseltme Wallarm’ın [all-in-one installer](../installation/nginx/all-in-one.md) aracı ile gerçekleştirilir. Bu yöntem, önceki yaklaşıma kıyasla yükseltme sürecini ve devam eden kurulum bakımını basitleştirir.
    
    Yükleyici aşağıdaki işlemleri otomatik olarak gerçekleştirir:

    1. İşletim sisteminizi ve NGINX sürümünü kontrol eder.
    1. Algılanan işletim sistemi ve NGINX sürümü için Wallarm depolarını ekler.
    1. Bu depolardan Wallarm paketlerini kurar.
    1. Kurulu Wallarm modülünü NGINX’inize bağlar.
    1. Sağlanan belirteç ile filtreleme düğümünü Wallarm Cloud’a bağlar.

    ![Manuele kıyasla tümü bir arada](../images/installation-nginx-overview/manual-vs-all-in-one.png)

Kullanım ömrü sona ermiş düğümü (3.6 veya altı) yükseltmek için lütfen [farklı talimatları](older-versions/nginx-modules.md) kullanın.

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Yükseltme prosedürü

* Filtreleme düğümü ve postanalytics modülleri aynı sunucuda yüklüyse, tümünü yükseltmek için aşağıdaki talimatları izleyin.

    Yeni bir makinede tümü bir arada yükleyici ile daha yeni sürüm bir düğüm çalıştırmanız, düzgün çalıştığını test etmeniz ve önceki düğümü durdurup trafiği eski makine yerine yeni makine üzerinden akacak şekilde yapılandırmanız gerekecektir.

* Filtreleme düğümü ve postanalytics modülleri farklı sunucularda yüklüyse, [bu talimatları](../updating-migrating/separate-postanalytics.md) izleyerek önce postanalytics modülünü, ardından filtreleme modülünü yükseltin.

## Adım 1: Temiz makine hazırlayın

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Adım 2: En güncel NGINX’i ve bağımlılıkları kurun

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Adım 3: Wallarm belirteci hazırlayın

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 4: Tümü bir arada Wallarm yükleyicisini indirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 5: Tümü bir arada Wallarm yükleyicisini çalıştırın

### Filtreleme düğümü ve postanalytics aynı sunucuda

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

### Filtreleme düğümü ve postanalytics farklı sunucularda

!!! warning "Filtreleme düğümü ve postanalytics modüllerini yükseltme adımlarının sırası"
    Filtreleme düğümü ve postanalytics modülleri farklı sunuculara kurulmuşsa, filtreleme düğümü paketlerini güncellemeden önce postanalytics paketlerini yükseltmek gereklidir.

1. Postanalytics modülünü şu [talimatları](separate-postanalytics.md) izleyerek yükseltin.
1. Filtreleme düğümünü yükseltin:

    === "API belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI içinde düğümlerin mantıksal gruplandırılması için kullanılır).

    === "Node belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo sh wallarm-6.5.1.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo sh wallarm-6.5.1.aarch64-glibc.sh filtering
        ```

## Adım 6: Eski düğüm makinesinden yeniye NGINX ve postanalytics yapılandırmasını aktarın

Gerekli yönergeleri veya dosyaları kopyalayarak düğümle ilgili NGINX ve postanalytics yapılandırmalarını eski makineden yeniye taşıyın:

* `/etc/nginx/conf.d/default.conf` veya `http` seviyesi için NGINX ayarlarının bulunduğu `/etc/nginx/nginx.conf`

    Filtreleme ve postanalytics düğümleri farklı sunuculardaysa, filtreleme düğümü makinesindeki `/etc/nginx/nginx.conf` dosyasının `http` bloğunda `wallarm_tarantool_upstream` adını [`wallarm_wstore_upstream`](../admin-en/configure-parameters-en.md#wallarm_wstore_upstream) olarak değiştirin.
* Trafik yönlendirme için NGINX ve Wallarm ayarlarını içeren `/etc/nginx/sites-available/default`
* `/etc/nginx/conf.d/wallarm-status.conf` → yeni makinede `/etc/nginx/wallarm-status.conf` konumuna kopyalayın

    Ayrıntılı açıklama [bağlantıda][wallarm-status-instr] mevcuttur.
* `/etc/wallarm/node.yaml` → yeni makinede `/opt/wallarm/etc/wallarm/node.yaml` konumuna kopyalayın

    Ayrı postanalytics sunucusunda özel host ve port kullanıyorsanız, kopyalanan dosyada postanalytics düğümü makinesinde `tarantool` bölümünün adını `wstore` olarak değiştirin.

## Adım 7: NGINX’i yeniden başlatın

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Adım 8: Wallarm düğümü çalışmasını test edin

Yeni düğümün çalışmasını test etmek için:

1. Korunan kaynak adresine test [SQLI][sqli-attack-docs] ve [XSS][xss-attack-docs] saldırıları içeren isteği gönderin:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içinde açın ve saldırıların listede görüntülendiğinden emin olun.
1. Cloud’da saklanan verileriniz (kurallar, IP lists) yeni düğümle senkronize edildiğinde, kurallarınızın beklendiği gibi çalıştığından emin olmak için bazı test saldırıları gerçekleştirin.

## Adım 9: Trafiği Wallarm düğümüne göndermeyi yapılandırın

Yük dengeleyicinizin hedeflerini Wallarm örneğine trafik gönderecek şekilde güncelleyin. Ayrıntılar için lütfen yük dengeleyicinizin belgelerine bakın.

Tüm trafiği yeni düğüme yönlendirmeden önce, öncelikle kısmi yönlendirme yapmanız ve yeni düğümün beklenildiği gibi davrandığını kontrol etmeniz önerilir.

## Adım 10: Eski düğümü kaldırın

1. Wallarm Console → **Nodes** içinde eski düğümü seçip **Delete**’e tıklayarak silin.
1. İşlemi onaylayın.
    
    Düğüm Cloud’dan silindiğinde, uygulamalarınıza gelen isteklerin filtrelenmesini durduracaktır. Filtreleme düğümünü silme işlemi geri alınamaz. Düğüm, düğümler listesinden kalıcı olarak kaldırılacaktır.

1. Eski düğümlü makineyi silin veya sadece Wallarm düğüm bileşenlerinden temizleyin:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```