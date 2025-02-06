```markdown
# Wallarm NGINX Modüllerinin Yükseltilmesi

Bu talimatlar, Wallarm NGINX modüllerinin 4.x sürümünü ayrı paketlerden kurulanların 5.0 sürümüne yükseltilmesi için adımları tanımlar. Bu modüller aşağıdaki talimatlardan biri doğrultusunda kurulmuştur:

* NGINX stable için ayrı paketler
* NGINX Plus için ayrı paketler
* Dağıtım tarafından sağlanan NGINX için ayrı paketler

!!! info "All-in-one installer ile Yükseltme"
    4.10 sürümünden itibaren, bireysel Linux paketleri kullanımdan kaldırıldığından, yükseltme Wallarm'ın [all-in-one installer](../installation/nginx/all-in-one.md) kullanılarak gerçekleştirilmektedir. Bu yöntem, önceki yaklaşıma kıyasla yükseltme sürecini ve sürekli dağıtım bakımını basitleştirir.
    
    Yükleyici otomatik olarak aşağıdaki işlemleri gerçekleştirir:

    1. İşletim sistemi ve NGINX sürümünüzün kontrol edilmesi.
    1. Algılanan işletim sistemi ve NGINX sürümü için Wallarm depolarının eklenmesi.
    1. Bu depolardan Wallarm paketlerinin kurulması.
    1. Kurulan Wallarm modülünün NGINX'inize entegre edilmesi.
    1. Sağlanan token kullanılarak filtreleme node'unun Wallarm Cloud'a bağlanması.

    ![All-in-one compared to manual](../images/installation-nginx-overview/manual-vs-all-in-one.png)

Ömrünü tamamlamış node'u (3.6 veya daha düşük) yükseltmek için lütfen [farklı talimatları](older-versions/nginx-modules.md) kullanın.

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Yükseltme Prosedürü

* Eğer filtreleme node ve postanalytics modülleri aynı sunucuda kurulu ise, aşağıdaki talimatları izleyerek tüm modülleri yükseltin.

    Yeni sürümü çalışır durumda bir node'u temiz bir makinada all-in-one installer kullanarak çalıştırmanız, düzgün çalıştığını test etmeniz, eski node'u durdurmanız ve eski node yerine yeni makinadan trafik akışını yapılandırmanız gerekecektir.

* Eğer filtreleme node ve postanalytics modülleri farklı sunucularda kuruluysa, **önce** postanalytics modülünü ve **sonra** [bu talimatları](../updating-migrating/separate-postanalytics.md) izleyerek filtreleme modülünü yükseltin.

## Adım 1: Temiz Makine Hazırlama

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Adım 2: En Son NGINX ve Bağımlılıkları Kurma

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Adım 3: Wallarm Token Hazırlama

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 4: All-in-One Wallarm Yükleyicisini İndirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 5: All-in-One Wallarm Yükleyicisinin Çalıştırılması

### Aynı Sunucuda Filtreleme Node ve Postanalytics

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

### Farklı Sunucularda Filtreleme Node ve Postanalytics

!!! warning "Filtreleme Node ve Postanalytics Modüllerinin Yükseltilme Adımlarının Sıralaması"
    Eğer filtreleme node ve postanalytics modülleri farklı sunucularda kuruluysa, filtreleme node paketlerini güncellemeden önce postanalytics paketlerini yükseltmek gerekmektedir.

1. Postanalytics modülünü bu [talimatları](separate-postanalytics.md) izleyerek yükseltin.
1. Filtreleme node'u yükseltin:

    === "API token"
        ```bash
        # Eğer x86_64 sürümü kullanılıyorsa:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # Eğer ARM64 sürümü kullanılıyorsa:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS` değişkeni, node'un ekleneceği grubu ayarlar (Wallarm Console UI'da node'ların mantıksal gruplandırılması için kullanılır).

    === "Node token"
        ```bash
        # Eğer x86_64 sürümü kullanılıyorsa:
        sudo sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # Eğer ARM64 sürümü kullanılıyorsa:
        sudo sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```

## Adım 6: Eski Node Makinesinden Yeniye NGINX ve Postanalytics Yapılandırmasının Aktarılması

Eski makinedeki yapılandırma dosyalarından yeni makinadaki dosyalara node ile ilgili NGINX yapılandırması ve postanalytics yapılandırmasını aktarın. Gerekli direktifleri kopyalayarak bunu gerçekleştirebilirsiniz.

**Kaynak Dosyalar**

Eski bir makinada, işletim sistemi ve NGINX sürümüne bağlı olarak NGINX yapılandırma dosyaları farklı dizinlerde yer alabilir ve farklı isimlere sahip olabilir. En yaygın olanlar şunlardır:

* `/etc/nginx/conf.d/default.conf` – NGINX ayarlarını içerir.
* `/etc/nginx/conf.d/wallarm-status.conf` – Wallarm node izleme ayarlarını içerir. Detaylı açıklama [link][wallarm-status-instr] içinde bulunmaktadır.

Ayrıca, postanalytics modülünün yapılandırması (Tarantool veritabanı ayarları) genellikle burada bulunur:

* `/etc/default/wallarm-tarantool` veya
* `/etc/sysconfig/wallarm-tarantool`

**Hedef Dosyalar**

All-in-one installer, işletim sistemi ve NGINX sürümlerinin farklı kombinasyonlarıyla çalıştığından, yeni makinenizde [hedef dosyalar](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) farklı isimlere sahip olabilir ve farklı dizinlerde yer alabilir.

## Adım 7: NGINX'i Yeniden Başlatın

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Adım 8: Wallarm Node İşleyişini Test Edin

Yeni node işleyişini test etmek için:

1. Korumalı kaynak adresine test [SQLI][sqli-attack-docs] ve [XSS][xss-attack-docs] saldırıları içeren isteği gönderin:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açın ve saldırıların listede görüntülendiğinden emin olun.
1. Cloud'da depolanan verileriniz (kurallar, IP listeleri) yeni node ile senkronize olunca, kurallarınızın beklendiği gibi çalıştığını test etmek için bazı saldırılar gerçekleştirin.

## Adım 9: Wallarm Node'a Trafik Gönderimini Yapılandırın

Kullanılan dağıtım yaklaşımına bağlı olarak, aşağıdaki ayarları yapın:

=== "In-line"
    Yük dengeleyicinizin hedeflerini, trafiği Wallarm instance'ına yönlendirecek şekilde güncelleyin. Detaylar için lütfen yük dengeleyici dokümantasyonuna bakın.

    Trafiğin yeni node'a tamamen yönlendirilmesinden önce, kısmen yönlendirilmesi ve yeni node'un beklendiği gibi davrandığının kontrol edilmesi önerilir.

=== "Out-of-Band"
    Web veya proxy sunucunuzun (örn. NGINX, Envoy) gelen trafiği Wallarm node'una ayna yoluyla yönlendirecek şekilde yapılandırın. Yapılandırma detayları için web veya proxy sunucusu dokümantasyonuna bakmanız önerilir.

    [web-server-mirroring-examples] içindeki bağlantıda, en popüler web ve proxy sunucuları (NGINX, Traefik, Envoy) için örnek yapılandırmayı bulabilirsiniz.

## Adım 10: Eski Node'u Kaldırın

1. Wallarm Console → **Nodes** bölümünde node'unuzu seçip **Delete**'e tıklayarak eski node'u silin.
1. İşlemi onaylayın.
    
    Node Cloud'dan silindiğinde, uygulamalarınıza gelen taleplerin filtrelenmesi duracaktır. Filtreleme node'unun silinmesi geri alınamaz. Node, node listesinden kalıcı olarak silinecektir.

1. Eski node içeren makineyi silin veya sadece Wallarm node bileşenlerinden temizleyin:

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
```