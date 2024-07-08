[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../images/tarantool-status.png
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md

# Postanalytics modülünü yükseltme

Bu talimatlar, ayrı bir sunucuya kurulu postanalytics modülü 4.x'in nasıl yükseltileceğini anlatmaktadır. Postanalytics modülü, [Wallarm NGINX modüllerini yükseltme][docs-module-update] işleminden önce yükseltilmelidir.

Sonlanmış modülü (3.6 veya daha düşük) yükseltmek için lütfen [farklı talimatları](older-versions/separate-postanalytics.md) kullanın.

## Yükseltme yöntemleri

--8<-- "../include-tr/waf/installation/upgrade-methods.md"

## Tüm bir arada kurucu ile yükseltme

Aşağıdaki işlemi kullanarak, ayrı bir sunucuda kurulu postanalytics modülü 4.x'i tüm bir arada kurucu kullanarak sürüm 4.8'e yükseltin.

### Tüm bir arada kurucu ile yükselme için gereksinimler

--8<-- "../include-tr/waf/installation/all-in-one-upgrade-requirements.md"

### Adım 1: Temiz makineyi hazırlayın

--8<-- "../include-tr/waf/installation/all-in-one-clean-machine.md"

### Adım 2: Wallarm belirtecini hazırlayın

--8<-- "../include-tr/waf/installation/all-in-one-token.md"

### Adım 3: Tüm bir arada Wallarm kurucuyu indirin

--8<-- "../include-tr/waf/installation/all-in-one-installer-download.md"

### Adım 4: Postanalytics'i kurmak için tüm bir arada Wallarm kurucuyu çalıştırın

--8<-- "../include-tr/waf/installation/all-in-one-postanalytics.md"

### Adım 5: Ayrı bir sunucuda NGINX-Wallarm modülünü yükseltin

Postanalytics modülü ayrı bir sunucuya kurulduktan sonra, farklı bir sunucuda çalışan ilgili NGINX-Wallarm modülünü [yükseltin](nginx-modules.md).

!!! info "Yükseltme yöntemlerini birleştirme"
    İlgili NGINX-Wallarm modülünü yükseltmek için hem manuel hem de otomatik yaklaşımlar kullanılabilir.

### Adım 6: NGINX-Wallarm modülünü postanalytics modülüne yeniden bağlayın

--8<-- "../include-tr/waf/installation/all-in-one-postanalytics-reconnect.md"

### Adım 7: NGINX‑Wallarm'ın ayrı postanalytics modülleriyle etkileşimi kontrol edin

--8<-- "../include-tr/waf/installation/all-in-one-postanalytics-check.md"

### Adım 8: Eski postanalytics modülünü kaldırın

--8<-- "../include-tr/waf/installation/all-in-one-postanalytics-remove-old.md"

## Manuel yükseltme

Aşağıdaki işlemi kullanarak, ayrı bir sunucuya kurulu olan postanalytics modülü 4.x'i manuel olarak versiyon 4.8'a yükseltin.

### Gereksinimler

--8<-- "../include-tr/waf/installation/basic-reqs-for-upgrades.md"

### Adım 1: Yeni Wallarm depozitosunu ekleyin

Önceki Wallarm depozitosu adresini silin ve yeni Wallarm düğüm versiyonu paketleri ile bir depo ekleyin. Lütfen uygun platform için komutları kullanın.

**CentOS ve Amazon Linux 2.0.2021x ve daha düşük versiyonlar**

=== "CentOS 7 ve Amazon Linux 2.0.2021x ve daha düşük versiyonlar"
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

1. Wallarm depozitosu adresinin bulunduğu dosyayı yüklü metin düzenleyicide açın. Bu talimatlarda **vim** kullanılmaktadır.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Önceki depo adresini yorum satırı yapın veya silin.
3. Yeni bir depo adresi ekleyin:

    === "Debian 10.x (buster)"
        !!! warning "NGINX tarafından desteklenmiyor ve NGINX Plus"
            Resmi NGINX sürümleri (kararlı ve Plus) ve sonuç olarak Wallarm düğümü 4.4 ve daha üst sürümler Debian 10.x (buster) üzerine kurulamaz. Lütfen [NGINX'in Debian/CentOS depolarından kurulduğu](../installation/nginx/dynamic-module-from-distr.md) bu işletim sistemini kullanın.

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

### Adım 2: Tarantool paketlerini yükseltin

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include-tr/waf/upgrade/warning-expired-gpg-keys-4.8.md"

    --8<-- "../include-tr/waf/upgrade/details-about-dist-upgrade.md"
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include-tr/waf/upgrade/warning-expired-gpg-keys-4.8.md"

    --8<-- "../include-tr/waf/upgrade/details-about-dist-upgrade.md"
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

### Adım 3: Düğüm tipini güncelleyin

!!! info "`addnode` betiği kullanılarak kurulan düğümler için yalnız"
    Bu adımı yalnızca, bir önceki sürümdeki düğüm `addnode` betiği kullanılarak Wallarm Buluta bağlıysa takip edin. Bu betiğin [kaldırıldı](what-is-new.md#removal-of-the-email-password-based-node-registration) ve düğümü Buluta kayıt etmek için bir belirtecin gerektiği `register-node` ile değiştirildi.

1. Wallarm hesabınızın **Yönetici** rolüne sahip olduğundan emin olun. Bu, kullanıcı listesine  [US Bulutu](https://us1.my.wallarm.com/settings/users) veya [EU Bulutu](https://my.wallarm.com/settings/users) adresinden girerek kontrol edilir.

    ![Wallarm konsolundaki kullanıcı listesi][img-wl-console-users]
1. [US Bulutu](https://us1.my.wallarm.com/nodes) veya [EU Bulutu](https://my.wallarm.com/nodes) adresinde Wallarm Konsolu → **Düğümler**'i açın ve **Wallarm düğümü** tipinde bir düğüm oluşturun.

    ![Wallarm düğümünün oluşturulması][img-create-wallarm-node]
1. Oluşturulan belirteci kopyalayın.
1. Düğümü çalıştırmak için `register-node` betiğini çalıştırın:

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>` değeri, kopyalanan düğüm belirteci veya `Deploy` rolüne sahip API belirteci değeridir.
    * `--force` seçeneği, `/etc/wallarm/node.yaml` dosyasında belirtilen Wallarm Bulut erişim kimlik bilgilerinin yeniden yazılmasını zorlar.

    <div class="admonition info"> <p class="admonition-title">Bir tokenin birden çok kurulumda kullanılması</p> <p>Tokeni birkaç kurulumda kullanmak için iki seçeneğiniz vardır:</p> <ul><li>**Tüm düğüm sürümleri için**, bir [**düğüm belirteci**](../quickstart/getting-started.md#deploy-the-wallarm-filtering-node) seçilen [platforma](../installation/supported-deployment-options.md) bakılmaksızın birkaç kurulumda kullanılabilir. Bu, Wallarm Konsol UI'da düğüm örneklerinin mantıksal gruplamasına izin verir. Örneğin, birkaç Wallarm düğümünü bir geliştirme ortamına dağıtıyorsunuz, her düğüm belirli bir geliştiricinin sahip olduğu bir makinesine kurulmuştur.</li><li><p>**Düğüm 4.6'dan itibaren**, düğümler için gruplandırma, bir `Deploy` rolüne sahip [**API belirteci**](../user-guides/settings/api-tokens.md) ile birlikte `--labels 'group=<GROUP>'` bayrağını kullanabilirsiniz, örneğin:</p>
    ```
    sudo /usr/share/wallarm-common/register-node -t <API TOKEN WITH DEPLOY ROLE> --labels 'group=<GROUP>'
    ```
    </p></li></div>

### Adım 4: Postanalytics modülünü yeniden başlatın

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x veya Amazon Linux 2.0.2021x ve daha düşük"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

[Wallarm NGINX modüllerini yükseltin][docs-module-update]