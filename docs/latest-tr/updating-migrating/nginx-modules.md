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
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[oob-docs]:                         ../installation//oob/overview.md
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../installation/oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# Wallarm NGINX Modülleri Yükseltme

Bu talimatlar, yüklü olan Wallarm NGINX modülleri 4.x'in sürüm 4.8'e yükseltilmesi sürecini anlatır. Aşağıdaki talimatlardan birine göre kurulan modüller söz konusudur:

* [NGINX stable için bireysel paketler](../installation/nginx/dynamic-module.md)
* [NGINX Plus için bireysel paketler](../installation/nginx-plus.md)
* [Dağıtım tarafından sağlanan NGINX için bireysel paketler](../installation/nginx/dynamic-module-from-distr.md)

Son kullanım tarihi geçmiş düğümü (3.6 veya daha altı) yükseltmek için, lütfen [farklı talimatlar](older-versions/nginx-modules.md) kullanınız.

## Yükseltme yöntemleri

--8<-- "../include/waf/installation/upgrade-methods.md"

## Tüm bir arada kurulumla yükseltme

Aşağıdaki işlemi kullanarak Wallarm NGINX modülleri 4.x'i sürüm 4.8'e [tüm bir arada kurulum](../installation/nginx/all-in-one.md) kullanarak yükseltin.

### Tüm bir arada kurulumla yükseltme için gereksinimler

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### Yükseltme süreci

* Filtreleme düğümü ve postanalytics modülleri aynı sunucuda yüklüyse, aşağıdaki talimatları uygulayarak tümünü yükseltiniz.

    Temiz bir makinede tüm bir arada kurulum kullanarak daha yeni bir versiyonu çalıştırmanız gerekecek, iyi çalıştığını test etmek ve önceki bir durdurmak ve trafiğin yeni makineye öncekinden akmasını sağlamak için yapılandırma yapmanız gerekecek.

* Filtreleme düğümü ve postanalytics modülleri farklı sunucularda kuruluysa, **önce** postanalytics modülünü yükseltin ve **sonra** aşağıdaki [talimatları](../updating-migrating/separate-postanalytics.md) uygulayarak filtreleme modülünü yükseltin.

### 1. Adım: Temiz makineyi hazırlayın

--8<-- "../include/waf/installation/all-in-one-clean-machine.md"

### 2. Adım: NGINX ve bağımlılıklarını yükleme

--8<-- "../include/waf/installation/all-in-one-nginx.md"

### 3. Adım: Wallarm tokenini hazırlayın

--8<-- "../include/waf/installation/all-in-one-token.md"

### 4. Adım: Tüm bir arada Wallarm yükleyicisini indirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### 5. Adım: Tüm bir arada Wallarm yükleyicisini çalıştırın

#### Filtreleme düğümü ve postanalytics aynı sunucuda

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

#### Filtreleme düğümü ve postanalytics farklı sunucularda

!!! warning "Filtreleme düğümü ve postanalytics modüllerini yükseltmek için adım sırası"
    Filtreleme düğümü ve postanalytics modüllerini farklı sunucularda kuruluysa, filtreleme düğümü paketlerini güncellemeden önce postanalytics paketlerini yükseltmek gerekir.

1. Aşağıdaki [talimatları](separate-postanalytics.md) izleyerek postanalytics modülünü yükseltin.
2. Filtreleme düğümünü yükseltin:

    === "API token"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GRUP>' sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GRUP>' sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI'da düğümlerin mantıksal gruplandırılması için kullanılır).

    === "Node token"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```

### 6. Adım: NGINX ve postanalytics yapılandırmasını eski düğüm makinesinden yeniye aktarın

Düğümle ilgili NGINX yapılandırmasını ve postanalytics yapılandırmasını, eski makinedeki yapılandırma dosyalarından yeni makinedeki dosyalara aktarın. Bu işlemi gereken yönergeleri kopyalayarak yapabilirsiniz.

**Kaynak dosyalar**

Eski bir makinede, işletim sistemine ve NGINX sürümüne bağlı olarak, NGINX yapılandırma dosyaları farklı dizinlerde bulunabilir ve farklı isimlere sahip olabilir. En yaygın olanlar şunlardır:

* NGINX ayarlarıyla `/etc/nginx/conf.d/default.conf` 
* Küresel filtreleme düğümü ayarlarıyla `/etc/nginx/conf.d/wallarm.conf` 

    Bu dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı ayarların farklı alan adı gruplarına uygulanması için, genellikle `default.conf` kullanılır veya her alan adı grubu için yeni bir yapılandırma dosyası oluşturulur (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında ayrıntılı bilgi, [resmi NGINX dokümantasyonunda](https://nginx.org/en/docs/beginners_guide.html) bulunabilir.
    
* Wallarm düğümü izleme ayarlarıyla `/etc/nginx/conf.d/wallarm-status.conf`. Ayrıntılı açıklama bu [bağlantıda][wallarm-status-instr] mevcuttur.

Ayrıca, postanalytics modülünün yapılandırması (Tarantool veritabanı ayarları) genellikle burada bulunur:

* `/etc/default/wallarm-tarantool` veya
* `/etc/sysconfig/wallarm-tarantool`

**Hedef dosyalar**

Tüm bir arada kurulum, farklı işletim sistemlerinin ve NGINX sürümlerinin kombinasyonlarıyla çalıştığından, yeni makinenizdeki [hedef dosyalar](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) farklı isimlere sahip olabilir ve farklı dizinlerde bulunabilir.

### 7. Adım: NGINX'i yeniden başlatın

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

### 8. Adım: Wallarm düğüm işlemlerini test edin

Yeni düğüm işlemlerini test etmek için:

1. Korunan kaynak adresine test [SQLI][sqli-attack-docs] ve [XSS][xss-attack-docs] saldırıları talebi gönderin:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

2. Wallarm Konsolu'nu açın → **Olaylar** bölümünü [ABD Bulutu](https://us1.my.wallarm.com/search) veya [AB Bulutu](https://my.wallarm.com/search) üzerinde açın ve saldırıların listelenmiş olduğundan emin olun.
3. Cloud'unuzda saklanan veri (kurallar, IP listeleri) yeni düğüme senkronize edildikten sonra, kurallarınızın beklenildiği gibi çalıştığından emin olmak için bazı test saldırıları gerçekleştirin.

### 9. Adım: Trafik göndermeyi Wallarm düğümüne yapılandırın

Kullanılan dağıtım yaklaşımına bağlı olarak, aşağıdaki ayarları gerçekleştirin:

=== "Çizgi üzerinde"
    Yük dengeleyicinizin hedeflerini güncelleyerek trafiği Wallarm örneğine gönderin. Detaylar için, lütfen yük dengeleyicinizin belgelerine başvurun.

    Trafik tamamen yeni düğüme yönlendirilmeden önce, önce kısmen yönlendirmenizi ve yeni düğümün beklendiği gibi çalışıp çalışmadığını kontrol etmenizi öneririz.

=== "Bant Dışı"
    Web sunucunuzu veya proxy sunucunuzu (ör. NGINX, Envoy) ayarlayarak gelen trafiği Wallarm düğümüne ayna yapın. Yapılandırma detayları için, web veya proxy sunucu belgelerine başvurmanızı öneririz.

    [Link] içinde[web-server-mirroring-examples], en popüler web ve proxy sunucularının (NGINX, Traefik, Envoy) örnek yapılandırmasını bulabilirsiniz.

### 10. Adım: Eski düğümü kaldırın

1. Wallarm Konsolu'nda → **Düğümler**'de eski düğümü silin, düğümünüzü seçin ve **Sil**'e tıklayın.
2. İşlemi onaylayın.
    
    Düğüm Cloud'dan silindiğinde, uygulamalarınıza olan isteklerin filtrelemesi durdurulacaktır. Filtreleme düğümünün silinmesi geri alınamaz. Düğüm, düğüm listesinden kalıcı olarak silinir.

3. Eski düğümün bulunduğu makineyi silin veya sadece Wallarm düğüm bileşenlerinden temizleyin:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve daha düşük"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## El ile yükseltme

Aşağıdaki işlemi kullanarak Wallarm NGINX modülleri 4.x'i manuel olarak sürüm 4.8'e yükseltin.

### Manuel yükseltme için gereksinimler

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

### Yükseltme süreci

* Filtreleme düğümü ve postanalytics modülleri aynı sunucuda yüklüyse, aşağıdaki talimatları uygulayarak tüm paketleri yükseltin.
* Filtreleme düğümü ve postanalytics modülleri farklı sunucularda kuruluysa, **önce** postanalytics modülünü yükseltin, ardından filtreleme düğümü modülleri için aşağıdaki adımları gerçekleştirin.

### 1. Adım: NGINX'i en son sürüme yükseltin

İlgili talimatları kullanarak NGINX'i en son sürüme yükseltin:

=== "NGINX stable"

    DEB tabanlı dağıtımlar:

    ```bash
    sudo apt update
    sudo apt -y install nginx
    ```

    RPM tabanlı dağıtımlar:

    ```bash
    sudo yum update
    sudo yum install -y nginx
    ```
=== "NGINX Plus"
    NGINX Plus için, lütfen [resmi yükseltme talimatlarını](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus) izleyin.
=== "NGINX Debian/CentOS deposundan"
    [Debian/CentOS deposundan kurulan NGINX](../installation/nginx/dynamic-module-from-distr.md) için, bu adımı atlayın. Yüklü olan NGINX sürümü [daha sonra](#step-4-upgrade-wallarm-packages) Wallarm modülleri ile birlikte yükseltilecektir.

Altyapınızın belirli bir NGINX sürümünü kullanması gerekiyorsa, lütfen NGINX'nin özel bir sürümü için Wallarm modülünü oluşturmak üzere [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.

### 2. Adım: Yeni Wallarm deposunu ekleyin

Önceki Wallarm deposu adresini silin ve yeni Wallarm düğümü sürümü paketi ile bir depoyu ekleyin. Lütfen uygun platform için komutları kullanın.

**CentOS ve Amazon Linux 2.0.2021x ve daha düşük**

=== "CentOS 7 ve Amazon Linux 2.0.2021x ve daha düşük"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```

**Debian ve Ubuntu**

1. Wallarm deposu adresinin bulunduğu dosyayı yüklü metin düzenleyicide açın. Bu talimatlarda **vim** kullanılmaktadır.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Önceki depo adresini yorum satırına alın veya silin.
3. Yeni depo adresini ekleyin:

    === "Debian 10.x (buster)"
        !!! warning "NGINX stable ve NGINX Plus tarafından desteklenmiyor"
            Resmi NGINX sürümleri (stable ve Plus) ve sonuç olarak, Wallarm düğümü 4.4 ve üstü, Debian 10.x (buster) üzerine kurulamaz. Lütfen bu İşletim Sistemini yalnızca [NGINX Debian/CentOS depolarından kurulduysa](../installation/nginx/dynamic-module-from-distr.md) kullanın.

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/
        ```

### 3. Adım: Wallarm paketlerini yükseltin

#### Filtreleme düğümü ve postanalytics aynı sunucuda

1. Filtreleme düğümü ve postanalytics modüllerini yükseltmek için aşağıdaki komutu çalıştırın:

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "CentOS veya Amazon Linux 2.0.2021x ve daha düşük"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum update
        ```
2. Paket yöneticisi, yapılandırma dosyası `/etc/cron.d/wallarm-node-nginx` içeriğinin yeniden yazılmasını onaylamanızı isterse, `Y` seçeneğini gönderin.

    `/etc/cron.d/wallarm-node-nginx` içeriği, yeni RPS hesaplama scriptinin indirilmesi için güncellenmelidir.

    Paket yöneticisi varsayılan olarak `N` seçeneğini kullanır, ancak doğru RPS hesaplaması için `Y` seçeneği gereklidir.

#### Filtreleme düğümü ve postanalytics farklı sunucularda

!!! warning "Filtreleme düğümü ve postanalytics modüllerini yükseltmek için adımların sırası"
    Filtreleme düğümü ve postanalytics modülleri farklı sunucularda kuruluysa, filtreleme düğümü paketlerini güncellemeden önce postanalytics paketlerini yükseltmek gerekir.

1. Aşağıdaki [talimatları](separate-postanalytics.md) izleyerek postanalytics modülünü yükseltin.
2. Wallarm düğümü paketlerini yükseltin:

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include-waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "CentOS veya Amazon Linux 2.0.2021x ve daha düşük"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum update
        ```
3. Paket yöneticisi, yapılandırma dosyası `/etc/cron.d/wallarm-node-nginx` içeriğinin yeniden yazılmasını onaylamanızı isterse, `Y` seçeneğini gönderin.

    `/etc/cron.d/wallarm-node-nginx` içeriği, yeni RPS hesaplama scriptinin indirilmesi için güncellenmelidir.

    Paket yöneticisi varsayılan olarak `N` seçeneğini kullanır, ancak doğru RPS hesaplaması için `Y` seçeneği gereklidir.

### 4. Adım: Düğüm türünü güncelleyin

!!! info "Yalnızca `addnode` scripti kullanılarak kurulmuş düğümler için"
    Yalnızca bir önceki sürüm düğümü, `addnode` scripti kullanılarak Wallarm Cloud'la bağlantı kurmuşsa bu adımı izleyin. Bu script [kaldırıldı](what-is-new.md#removal-of-the-email-password-based-node-registration) ve düğümün Cloud'da kayıt için bir token gerektiren `register-node` tarafından yerine geçti.

1. Wallarm hesabınızın **Yönetici** rolüne sahip olduğundan emin olun, [ABD Cloud](https://us1.my.wallarm.com/settings/users) veya [AB Bulutu](https://my.wallarm.com/settings/users) üzerinden kullanıcı listesine giderek kontrol edin.

    ![Wallarm konsolunda kullanıcı listesi][img-wl-console-users]
1. Wallarm Konsolu'nu açın → **Düğümler** bölümünü [ABD Cloud](https://us1.my.wallarm.com/nodes) veya [AB Bulutunda](https://my.wallarm.com/nodes) açın ve **Wallarm düğümü** türünde düğüm oluşturun.

    ![Wallarm düğümü oluşturma][img-create-wallarm-node]

    !!! info "Eğer postanalytics modülü ayrı bir sunucuya yüklendiyse"
        İlk trafik işleme ve postanalytics modülleri ayrı sunucularda kuruluysa, bu modülleri aynı düğüm tokeni kullanarak Wallarm Buluta bağlamak önerilir. Wallarm Console UI, her modülü ayrı bir düğüm örneği olarak görüntüler, örneğin:

        ![Birkaç örneği olan düğüm](../images/user-guides/nodes/wallarm-node-with-two-instances.png)

        Wallarm düğümü, [ayrı postanalytics modül yükseltme](separate-postanalytics.md) sırasında zaten oluşturuldu. İlk trafik işleme modülünü aynı düğüm kimliği bilgilerini kullanarak Buluta bağlamak için:

        1. Ayrı postanalytics modül yükseltme sırasında oluşturulan düğüm tokenini kopyalayın.
        1. Aşağıdaki 4. adımdan devam edin.
1. Oluşturulan tokeni kopyalayın.
1. NGINX hizmetini duraklatın, yanlış RPS hesaplamasını önlemek için:

    === "Debian"
        ```bash
        sudo systemctl stop nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx stop
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve daha düşük"
        ```bash
        sudo systemctl stop nginx
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
1. **Wallarm düğümünü** çalıştırmak için `register-node` scriptini çalıştırın:

    === "ABD Bulutu"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force
        ```
    === "AB Bulutu"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force
        ```
    
    * `<TOKEN>` düğüm tokeninin veya `Deploy` rolüne sahip API tokeninin kopyalanan değeri.
    * `--force` seçeneği, `/etc/wallarm/node.yaml` dosyasında belirtilen Wallarm Cloud erişim kimliği bilgilerinin yeniden yazılmasını zorlar.

### 5. Adım: Wallarm engelleme sayfasını güncelleyin

Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirildi](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-postası varsayılan olarak boştur.

İstekleri engellenen yanıtların yanıt olarak dönülmesi için `&/usr/share/nginx/html/wallarm_blocked.html` sayfası yapılandırılmışsa, [kopyalayın ve özelleştirin](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) örnek sayfanın yeni sürümünü.

### 6. Adım: NGINX'i yeniden başlatın

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### 7. Adım: Wallarm düğüm işlemlerini test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

### Ayarların özelleştirilmesi

Wallarm modülleri sürüm 4.8'e yükseltildi. Önceki düğümün filtreleme ayarları otomatik olarak yeni versiyona uygulanır. Ek ayarlar yapmak için [mevcut yönergeleri](../admin-en/configure-parameters-en.md) kullanın.

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"