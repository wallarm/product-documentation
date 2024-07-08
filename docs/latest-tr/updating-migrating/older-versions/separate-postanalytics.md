[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../../images/admin-guides/test-attacks-quickstart.png
[nginx-custom]:                 ../../custom/custom-nginx-version.md
[wallarm-token-types]:          ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../../images/tarantool-status.png
[statistics-service-all-parameters]: ../../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:    ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md

# EOL postanalytics modülünün güncellenmesi

Bu talimatlar, ayrı bir sunucuda yüklü olan yaşam sonu postanalytics modülünün (versiyon 3.6 ve daha düşük) nasıl yükseltileceğini adımlar halinde açıklamaktadır. Postanalytics modülü, [Wallarm NGINX modüllerini yükseltmeden önce][docs-module-update] yükseltilmelidir.

--8<-- "../include-tr/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Yükseltme yöntemleri

--8<-- "../include-tr/waf/installation/upgrade-methods.md"

## All-in-one kurucu ile yükseltme

Aşağıdaki prosedürü kullanarak, ayrı bir sunucuda yüklü olan yaşam sonu postanalytics modülünü (versiyon 3.6 ve daha düşük) [all-in-one kurucu](../../installation/nginx/all-in-one.md) kullanarak versiyon 4.8'e yükseltin.

### All-in-one kurucu kullanarak yükseltme için gereksinimler

--8<-- "../include-tr/waf/installation/all-in-one-upgrade-requirements.md"

### Adım 1: Temiz makine hazırlama

--8<-- "../include-tr/waf/installation/all-in-one-clean-machine.md"

### Adım 2: Wallarm belirteci hazırlama

--8<-- "../include-tr/waf/installation/all-in-one-token.md"

### Adım 3: All-in-one Wallarm kurucusunu indir

--8<-- "../include-tr/waf/installation/all-in-one-installer-download.md"

### Adım 4: Postanalytics'i yüklemek için all-in-one Wallarm kurucusunu çalıştırın

--8<-- "../include-tr/waf/installation/all-in-one-postanalytics.md"

### Adım 5: API bağlantı noktasını güncelle

--8<-- "../include-tr/waf/upgrade/api-port-443.md"

### Adım 6: Ayrı bir sunucuda NGINX-Wallarm modülünü yükselt

Postanalytics modülü ayrı bir sunucuya yüklendikten sonra, başka bir sunucuda çalışan [ilgili NGINX-Wallarm modülünü yükseltin](nginx-modules.md).

!!! bilgi "Yükseltme yöntemlerini birleştirme"
    İlgili NGINX-Wallarm modülünü yükseltmek için hem manuel hem de otomatik yaklaşımlar kullanılabilir.

### Adım 7: NGINX-Wallarm modülünü postanalytics modülüne yeniden bağla

--8<-- "../include-tr/waf/installation/all-in-one-postanalytics-reconnect.md"

### Adım 8: NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol et

--8<-- "../include-tr/waf/installation/all-in-one-postanalytics-check.md"

### Adım 9: Eski postanalytics modülünü kaldır

--8<-- "../include-tr/waf/installation/all-in-one-postanalytics-remove-old.md"

## Manuel yükseltme

Aşağıdaki prosedürü kullanarak, ayrı bir sunucuda yüklü olan yaşam sonu postanalytics modülünü (versiyon 3.6 ve daha düşük) manuel olarak versiyon 4.8'e yükseltin.

### Gereksinimler

--8<-- "../include-tr/waf/installation/basic-reqs-for-upgrades.md"

### Adım 1: API bağlantı noktasını güncelle

--8<-- "../include-tr/waf/upgrade/api-port-443.md"

### Adım 2: Yeni Wallarm deposunu ekleyin

Önceki Wallarm deposu adresini silin ve yeni bir Wallarm düğüm versiyonu paketlerine sahip bir depo ekleyin. Lütfen uygun platform için komutları kullanın.

**CentOS ve Amazon Linux 2.0.2021x ve daha düşük**

=== "CentOS 7 ve Amazon Linux 2.0.2021x ve daha düşük"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! uyarı "CentOS 8.x desteği sona erdi"
        CentOS 8.x desteği [sona erdi](https://www.centos.org/centos-linux-eol/). Wallarm düğümünü AlmaLinux, Rocky Linux, Oracle Linux 8.x veya RHEL 8.x işletim sistemi üzerine yükleyebilirsiniz.

        * [NGINX `stable` için kurulum talimatları](../../installation/nginx/dynamic-module.md)
        * [CentOS/Debian depolarından NGINX için kurulum talimatları](../../installation/nginx/dynamic-module-from-distr.md)
        * [NGINX Plus için kurulum talimatları](../../installation/nginx-plus.md)
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

1. Yüklü metin düzenleyicisiyle Wallarm deposu adresinin bulunduğu dosyayı açın. Bu talimatta **vim** kullanılmıştır.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```

2. Önceki depo adresini yorum satırına alın veya silin.
3. Yeni bir depo adresi ekleyin:

    === "Debian 10.x (buster)"
        !!! uyarı "NGINX stable ve NGINX Plus tarafından desteklenmiyor"
            Resmi NGINX sürümleri (kararlı ve Artı) ve sonuç olarak Wallarm düğümü 4.4 ve üzeri, Debian 10.x (buster) üzerinde yüklenemez. Lütfen bu işletim sistemini yalnızca [NGINX'in Debian/CentOS depolarından yüklendiği durumlarda](../../installation/nginx/dynamic-module-from-distr.md) kullanın.

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

### Adım 3: Tarantool paketlerini yükselt

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

### Adım 4: Düğüm türünü güncelle

Dağıtılan postanalytics düğümü 3.6 veya daha düşük, artık kullanılmayan **regular** türündedir ve [şimdi yeni **Wallarm düğümü** türü ile değiştirilmiştir](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

Versiyon 4.8'e geçiş sırasında geçerli olan düğüm türünün yerine yeni düğüm türünü yüklemeniz önerilir. Regular düğüm türü gelecekteki sürümlerde kaldırılacak, lütfen önce taşıyın.

Regular postanalytics düğümünü Wallarm düğümü ile değiştirmek için:

1. Wallarm Konsolu → **Düğümler**'i açın [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) ve **Wallarm düğümü** türünde bir düğüm oluşturun.

    ![Wallarm düğümü oluşturma][img-create-wallarm-node]
1. Oluşturulan belirteci kopyalayın.
1. Wallarm düğümünü çalıştırmak için `register-node` betiğini çalıştırın:

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>` kopyalanan düğüm belirteci değeri veya `Deploy` rolüne sahip API belirtecinin değeri.
    * `--force` seçeneği, `/etc/wallarm/node.yaml` dosyasında belirtilen Wallarm Bulut erişim kimlik bilgilerinin yeniden yazılmasını zorlar.

    <div class="admonition info"> <p class="admonition-title">Bir belirteci birkaç kurulum için kullanma</p> <p>Bir belirteci birkaç kurulum için kullanma için iki seçeneğiniz vardır:</p> <ul><li>**Tüm düğüm sürümleri için**, bir [**düğüm belirteci**](../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node)'yi seçilen [platforma](../../installation/supported-deployment-options.md) bakılmaksızın birkaç kurulumda kullanabilirsiniz. Bu, Wallarm Konsol UI'da düğüm örneklerinin mantıksal gruplandırılmasına izin verir. Örnek: Bir geliştirme ortamına birkaç Wallarm düğümü dağıtıyorsunuz, her düğüm kendi makinesi üzerinde ve belirli bir geliştirici tarafından sahip olunmuş.</li><li><p>**Düğüm 4.6'dan itibaren**, düğümleri gruplandırmak için `Deploy` rolüne sahip bir [**API belirteci**](../../user-guides/settings/api-tokens.md) ile birlikte `--labels 'group=<GROUP>'` bayrağını kullanabilirsiniz, örneğin:</p>
    ```
    sudo /usr/share/wallarm-common/register-node -t <API TOKEN WITH DEPLOY ROLE> --labels 'group=<GROUP>'
    ```
    </p></li></div>

### Adım 5: Postanalytics modülünü yeniden başlat

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

[Upgrade Wallarm NGINX modules][docs-module-update]