[tarantool-status]:           ../images/tarantool-status.png
[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# Ayrı Postanalytics Modülünün Kurulumu

Wallarm'ın talep işleminde iki tane aşama bulunmaktadır, bunlardan biri istatistiksel talep analizi için postanalytics aşamasını kapsar. Postanalytics, bellek yoğunluğu altoyalıdır, bu da bunun optimize edilmiş performans için ayrı bir sunucuda yapılmasını gerektirebilir. Bu makale, postanalytics modülünün ayrı bir sunucuda nasıl kurulacağını açıklar.

Postanalytics modülünü aşağıdaki Wallarm artefaktları için ayrı bir sunucuda kurma seçeneği mevcuttur:

* [NGINX stable için ayrı paketler](../installation/nginx/dynamic-module.md)
* [NGINX Plus için ayrı paketler](../installation/nginx-plus.md)
* [Dağıtım sağlanan NGINX için ayrı paketler](../installation/nginx/dynamic-module-from-distr.md)
* [All-in-one yükleyici](../installation/nginx/all-in-one.md)

Varsayılan olarak, Wallarm kurulum talimatları size her iki modülün aynı sunucuda kurulmasını önerir.

## Genel Bakış

Wallarm düğümündeki taleplerin işlenmesi iki aşamadan oluşur:

* NGINX-Wallarm modülünde birincil işleme, bu bellek talep etmiyor ve sunucu gereksinimlerini değiştirmeden ön uç sunucularında çalışabilir.
* Hafıza gereksinimli postanalytics modülünde, işlenen taleplerin istatistiksel analizi yapılır.

Aşağıdaki şemalar, aynı sunucuda ve farklı sunucularda yüklenmiş olduğunda modül etkileşimini iki senaryoda gösterir:

=== "Aynı sunucuda NGINX-Wallarm ve postanalytics"
    ![postanalytics ve nginx-wallarm arasında trafik akışı](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-the-same-server.png)
=== "Farklı sunucularda NGINX-Wallarm ve postanalytics"
    ![postanalytics ve nginx-wallarm arasında trafik akışı](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-different-servers.png)

## Kurulum yöntemleri

Postanalytics modülünü ayrı bir sunucuda iki farklı şekilde kurabilirsiniz:

* [All-in-one yükleyici kullanarak](#all-in-one-otomatik-kurulum) (Wallarm düğüm 4.6'dan itibaren kullanılabilir) - birçok etkinliği otomatikleştirir ve postanalytics modülünün dağıtımını çok daha kolay hale getirir. Bu nedenle bu, önerilen kurulum yöntemidir.
* [Manuel olarak](#manuel-kurulum) - daha eski düğüm sürümleri için kullanın.

Filtreleme ve postanalytics modülünü ayrı ayrı kurarken, manuel ve otomatik yaklaşımları birleştirebilirsiniz: postanalytics kısmını manuel olarak kurun ve ardından filtreleme kısmını all-in-one yükleyici ile, ya da tam tersi: postanalytics kısmını all-in-one yükleyici ile ve ardından filtreleme kısmını manuel olarak.

## All-in-one otomatik kurulum

Wallarm düğüm 4.6'dan itibaren, postanalyticsi ayrı olarak kurmak için, birçok etkinliği otomatikleştiren ve postanalytics modülü dağıtımını çok daha kolay hale getiren [all-in-one kurulum](../installation/nginx/all-in-one.md#launch-options) önerilir.

### Gereksinimler

--8<-- "../include/waf/installation/all-in-one/separate-postanalytics-reqs.md"

### Adım 1: All-in-one Wallarm yükleyicisini indirin

All-in-one Wallarm kurulum betiğini indirmek için aşağıdaki komutu çalıştırın:

=== "x86_64 versiyon"
    ```bash
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.0.x86_64-glibc.sh
    ```
=== "ARM64 versiyon"
    ```bash
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.0.aarch64-glibc.sh
    ```

### Adım 2: Wallarm tokeni hazırlayın

Düğümü kurmak için, [uygun türde][wallarm-token-types] bir Wallarm tokeni gerekmektedir. Bir tokeni hazırlamak için şu adımları izleyin:

=== "API tokeni"

    1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde, Wallarm Konsolu → **Ayarlar** → **API tokeni**'ni açın.
    1. 'Deploy' kaynak rolüne sahip API tokenini bulun veya oluşturun.
    1. Bu tokeni kopyalayın.

=== "Düğüm tokeni"

    1. Konsolu → **Düğümleri**'ni [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde açın.
    1. Aşağıdakilerden birini yapın: 
        * **Wallarm düğümü** türünde düğüm oluşturun ve üretilen tokeni kopyalayın.
        * Var olan düğüm grubunu kullanın - düğümün menüsü → **Tokeni kopyala** kullanarak tokeni kopyalayın.

### Adım 3: All-in-one Wallarm yükleyicisini çalıştırın ve postanalyticsi kurun

Postanalyticsi all-in-one yükleyici ile ayrı olarak kurmak için aşağıdaki komutları kullanın:

=== "API tokeni"
    ```bash
    # Eğer x86_64 versiyonunu kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GRUP>' sh wallarm-4.8.0.x86_64-glibc.sh postanalytics

    # Eğer ARM64 versiyonunu kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GRUP>' sh wallarm-4.8.0.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu belirler (Wallarm Konsolu UI'da düğümlerin mantıksal gruplandırılması için kullanılır).

=== "Düğüm tokeni"
    ```bash
    # Eğer x86_64 versiyonunu kullanıyorsanız:
    sudo sh wallarm-4.8.0.x86_64-glibc.sh postanalytics

    # Eğer ARM64 versiyonunu kullanıyorsanız:
    sudo sh wallarm-4.8.0.aarch64-glibc.sh postanalytics
    ```

### Adım 4: NGINX-Wallarm modülünü ayrı bir sunucuda kurun

Postanalytics modülü ayrı bir sunucuda kurulduktan sonra:

1. NGINX-Wallarm modülünü farklı bir sunucuda kurun:

    === "API tokeni"
        ```bash
        # Eğer x86_64 versiyonunu kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GRUP>' sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # Eğer ARM64 versiyonunu kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GRUP>' sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu belirler (Wallarm Konsolu UI'da düğümlerin mantıksal gruplandırılması için kullanılır).

    === "Düğüm tokeni"
        ```bash
        # Eğer x86_64 versiyonunu kullanıyorsanız:
        sudo sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # Eğer ARM64 versiyonunu kullanıyorsanız:
        sudo sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```

1. Kurulum sonrası adımları uygulayın, örneğin trafiği analiz etmeyi etkinleştirin, NGINX'i yeniden başlatın, trafiği Wallarm örneğine göndermeyi yapılandırın, test edin ve ince ayar yapın, [burada](../installation/nginx/all-in-one.md) anlatıldığı gibi.

### Adım 5: NGINX-Wallarm modülünü postanalytics modülüne bağlayın

NGINX-Wallarm modülü olan makinede, NGINX [yapılandırma dosyasında](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/), postanalytics modülü sunucu adresini belirtin:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # yoksayıldı

wallarm_tarantool_upstream wallarm_tarantool;
```

* `max_conns` değeri, aşırı bağlantı oluşturulmasını önlemek için her bir upstream Tarantool sunucusu için belirtilmelidir.
* `keepalive` değeri, Tarantool sunucularının sayısından düşük olmamalıdır.
* `# wallarm_tarantool_upstream wallarm_tarantool;` dizesi varsayılan olarak yorumlanmıştır - `#`'yi lütfen silin.

Yapılandırma dosyasını değiştirdikten sonra, NGINX-Wallarm modülü sunucusunda NGINX/NGINX Plus'ı yeniden başlatın:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux ya da Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

### Adım 6: NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol edin

NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol etmek için, korunan uygulamanın adresine bir test saldırısı içeren bir talep gönderebilirsiniz:

```bash
curl http://localhost/etc/passwd
```

Eğer NGINX‑Wallarm ve ayrı postanalytics modülleri doğru bir şekilde yapılandırıldıysa, saldırı Wallarm Buluta yüklenecek ve Wallarm Konsolunun **Etkinlikler** bölümünde görüntülenecektir:

![Arayüzdeki saldırılar](../images/admin-guides/test-attacks-quickstart.png)

Eğer saldırı Buluta yüklenmediyse, lütfen hizmetlerin işleyişinde hata olup olmadığını kontrol edin:

* Postanalytics hizmetinin `wallarm-tarantool` durumunun `active` olduğundan emin olun

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![wallarm-tarantool status][tarantool-status]
* Postanalytics modülü günlüklerini analiz edin

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    Eğer `SystemError binary: failed to bind: Cannot assign requested address` gibi bir kayıt varsa, lütfen sunucunun belirtilen adres ve portta bağlantı kabul ettiğinden emin olun.
* NGINX‑Wallarm modülü olan sunucuda, NGINX günlüklerini analiz edin:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    Eğer `[error] wallarm: <address> connect() failed` gibi bir kayıt varsa, lütfen ayrı postanalytics modülünün adresinin NGINX‑Wallarm modülü yapılandırma dosyalarında doğru bir şekilde belirtildiğinden ve ayrı postanalytics sunucusunun belirtilen adres ve portta bağlantı kabul ettiğinden emin olun.
* NGINX‑Wallarm modülü olan sunucuda, işlenen talepler hakkında istatistikleri aşağıdaki belirtilen komutu kullanarak alın ve `tnt_errors`'in değerinin 0 olduğundan emin olun

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [İstatistik hizmeti tarafından döndürülen tüm parametrelerin açıklaması →](configure-statistics-service.md)

## Manuel kurulum

### Gereksinimler

--8<-- "../include/waf/installation/linux-packages/separate-postanalytics-reqs.md"

### Adım 1: Wallarm repolarını ekleyin

Postanalytics modülü, diğer Wallarm modülleri gibi, Wallarm repolarından kurulur ve güncellenir. Repoları eklemek için platformunuza uygun komutları kullanın:

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x ve düşük"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```

### Adım 2: Postanalytics modülü için paketleri yükleyin

Postanalytics modülü ve Tarantool veritabanı için `wallarm-node-tarantool` paketini Wallarm deposundan yükleyin:

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "CentOS veya Amazon Linux 2.0.2021x ve düşük"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```

### Adım 3: Postanalytics modülünü Wallarm Cloud ile bağlayın

Postanalytics modülü, Wallarm Cloud ile etkileşim kurar. Postanalytics modülü için bir Wallarm düğümü oluşturmanız ve bu düğümü Cloud'a bağlamanız gerekmektedir. Bağlanırken, postanalytics düğümünün adını belirleyebilirsiniz, bu ad Wallarm Konsolu UI'da görüntülenecektir ve düğümü uygun **düğüm grubu**'na koyabilirsiniz (UI'da düğümleri mantıksal olarak organize etmek için kullanılır). İlk trafiği işleyen düğüm ve son analizi yapan düğüm için aynı düğüm grubunu kullanmanız **önerilir**.

![Gruplanmış düğümler](../images/user-guides/nodes/grouped-nodes.png)

Düğüme erişim sağlamak için, Cloud tarafında bir token oluşturmanız ve düğüm paketlerinin bulunduğu makinede belirtmeniz gerekmektedir.

Postanalytics filtreleme düğümünü Cloud'a bağlamak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Filtreleme düğümünü yüklediğiniz bir makinede `register-node` betiğini çalıştırın:

    === "API tokeni"

        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKENI> --labels 'group=<GRUP>' -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```
        
        * `<TOKENI>` `Deploy` rolüne sahip API tokeninin kopyalanan değeridir.
        * `--labels 'group=<GRUP>'` parametresi sizin düğümünüzü `<GRUP>` düğüm grubuna (var olan veya, eğer yoksa oluşturulacak) koyar.

    === "Düğüm tokeni"

        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKENI> -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```

        * `<TOKENI>` düğüm tokeninin kopyalanan değeridir.

    * US Cloud'a yüklemek için `-H us1.api.wallarm.com` kullanın, EU Cloud'a yüklemek için bu seçeneği kaldırın.
    * `-n <HOST_NAME>` parametresini ekleyerek düğüm örneğinize özel bir isim verebilirsiniz. Son örneğin adı: `HOST_NAME_NodeUUID` olacaktır.

### Adım 4: Postanalytics modülü yapılandırmasını güncelleyin

Postanalytics modülünün yapılandırma dosyaları şu yollarda yer alır:

* `/etc/default/wallarm-tarantool` Debian ve Ubuntu işletim sistemleri için
* `/etc/sysconfig/wallarm-tarantool` CentOS ve Amazon Linux 2.0.2021x ve altı işletim sistemleri için

Dosyayı düzenleme modunda açmak için lütfen aşağıdaki komutu kullanın:

=== "Debian"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS veya Amazon Linux 2.0.2021x ve düşük"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "RHEL 8.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

#### Bellek

Postanalytics modülü, hafıza kullanılan depolama Tarantool'u kullanır. Üretim ortamları için, daha fazla miktarda belleğe sahip olunması önerilir. Eğer Wallarm düğümünü test ediyorsanız veya küçük bir sunucu boyutuna sahipseniz, daha düşük bir miktar yeterli olabilir.

Ayrılan bellek boyutu, GB cinsinden [`/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool`](#4-postanalytics-modul-yapilandirmasini-guncelle) yapılandırma dosyasında `SLAB_ALLOC_ARENA` yönergesi aracılığıyla ayarlanır. Değer bir tam sayı veya bir ondalık olabilir (ondalık ayırıcı olarak bir nokta `.` kullanılır).

Tarantool için bellek ayrılması hakkında detaylı öneriler bu [talimatlarda](configuration-guides/allocate-resources-for-node.md) açıklanmıştır.

#### Ayrı postanalytics sunucusunun adresi

Ayrı postanalytics sunucusunun adresini ayarlamak için:

1. Tarantool dosyasını düzenleme modunda açın:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve düşük"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "RHEL 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `HOST` ve `PORT` değişkenlerinin yorumunu kaldırın ve onları aşağıdaki değerlere ayarlayın:

    ```bash
    # karlılık için adres ve port
    HOST='0.0.0.0'
    PORT=3313
    ```
3. Tarantool'un yapılandırma dosyası, `0.0.0.0` veya `127.0.0.1` adreslerinden farklı IP adreslerinde bağlantıları kabul etmek üzere ayarlandıysa, lütfen bu adresleri `/etc/wallarm/node.yaml` dosyasında belirtin:

    ```bash
    hostname: <postanalytics düğümünün adı>
    uuid: <postanalytics düğümünün UUID'si>
    secret: <postanalytics düğümünün gizli anahtarı>
    tarantool:
        host: '<Tarantool'un IP adresi>'
        port: 3313
    ```

### Adım 5: Wallarm hizmetlerini yeniden başlatın

Ayarları postanalytics modülüne uygulamak için:

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "CentOS veya Amazon Linux 2.0.2021x ve düşük"
    ````bash
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

### Adım 6: NGINX-Wallarm modülünü ayrı bir sunucuda kurun

Postanalytics modülü ayrı bir sunucuda kurulduktan sonra, diğer Wallarm modülleri farklı bir sunucuda kurulmalıdır. Aşağıda NGINX-Wallarm modülü kurulumu için belirtilecek paket adlarını ve ilgili talimatların bağlantıları bulunur:

* [NGINX stable](../installation/nginx/dynamic-module.md)

    Paket kurulum aşamasında, `wallarm-node-nginx` ve `nginx-module-wallarm`'ı belirtin.
* [NGINX Plus](../installation/nginx-plus.md)

    Paket kurulum aşamasında, `wallarm-node-nginx` ve `nginx-plus-module-wallarm`'ı belirtin.
* [Dağıtım sağlamış NGINX](../installation/nginx/dynamic-module-from-distr.md)

    Paket kurulum aşamasında, `wallarm-node-nginx` ve `libnginx-mod-http-wallarm/nginx-mod-http-wallarm`'ı belirtin.

--8<-- "../include/waf/installation/checking-compatibility-of-separate-postanalytics-and-primary-packages.md"

### Adım 7: NGINX-Wallarm modülünü postanalytics modülüne bağlayın

NGINX-Wallarm modülü olan makinede, NGINX [yapılandırma dosyasında](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/), postanalytics modülü sunucu adresini belirtin:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # yoksayıldı

wallarm_tarantool_upstream wallarm_tarantool;
```

* `max_conns` değeri, aşırı bağlantı oluşturulmasını önlemek için her bir upstream Tarantool sunucusu için belirtilmelidir.
* `keepalive` değeri, Tarantool sunucularının sayısından düşük olmamalıdır.
* `# wallarm_tarantool_upstream wallarm_tarantool;` karakter dizisi varsayılan olarak yorumlanmıştır, lütfen `#`'yi silin.

Yapılandırma dosyasını değiştirdikten sonra, NGINX-Wallarm modülü sunucusunda NGINX/NGINX Plus'ı yeniden başlatın:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

### Adım 8: NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol edin

NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol etmek için, korunan uygulamanın adresine bir test saldırısı içeren bir talep gönderebilirsiniz: 

```bash
curl http://localhost/etc/passwd
```

Eğer NGINX‑Wallarm ve ayrı postanalytics modülleri doğru bir şekilde yapılandırıldıysa, saldırı Wallarm Buluta yüklenecek ve Wallarm Konsolunun **Etkinlikler** bölümünde görüntülenecektir:

![Arayüzdeki saldırılar](../images/admin-guides/test-attacks-quickstart.png)

Eğer saldırı Buluta yüklenmediyse, lütfen hizmetlerin işleyişinde hata olup olmadığını kontrol edin:

* Postanalytics hizmetinin `wallarm-tarantool` durumunun `active` olduğundan emin olun

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![wallarm-tarantool status][tarantool-status]
* Postanalytics modülü günlüklerini analiz edin

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    Eğer `SystemError binary: failed to bind: Cannot assign requested address` gibi bir kayıt varsa, lütfen sunucunun belirtilen adres ve portta bağlantı kabul ettiğinden emin olun.
* NGINX‑Wallarm modülü olan sunucuda, NGINX günlüklerini analiz edin:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    Eğer `[error] wallarm: <address> connect() failed` gibi bir kayıt varsa, lütfen ayrı postanalytics modülünün adresinin NGINX‑Wallarm modülü yapılandırma dosyalarında doğru bir şekilde belirtildiğinden ve ayrı postanalytics sunucusunun belirtilen adres ve portta bağlantı kabul ettiğinden emin olun.
* NGINX‑Wallarm modülü olan sunucuda, işlenen talepler hakkında istatistikleri aşağıdaki belirtilen komutu kullanarak alın ve `tnt_errors`'in değerinin 0 olduğundan emin olun

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [İstatistik hizmeti tarafından döndürülen tüm parametrelerin açıklaması →](configure-statistics-service.md)

## Postanalytics modülünün korunması

!!! uyarı "Yeni yüklenen postanalytics modülünü koruyun"
    Yeni yüklenmiş Wallarm postanalytics modülünü bir güvenlik duvarı ile korumanızı **şiddetle öneririz**. Aksi takdirde, hizmete izinsiz erişim riski oluşabilir ve bu durum:

    *   İşlenen talepler hakkında bilgilerin açığa çıkması
    *   Keyfi Lua kodu ve işletim sistemi komutlarının çalıştırılması olasılığı
   
    Lütfen postanalytics modülünü NGINX-Wallarm modülü ile aynı sunucuda dağıtıyorsanız böyle bir risk olmadığını unutmayın. Bu durum, postanalytics modülünün `3313` portunu dinlemesi nedeniyle gerçekleşir.
    
    **Aşağıda ayrıda yüklenmiş postanalytics modülüne uygulanması gereken güvenlik duvarı ayarları bulunmaktadır:**
    
    *   HTTPS trafiğini Wallarm API sunucularına ve bu sunuculardan izin verin, böylece postanalytics modülü bu sunucularla etkileşim kurabilir:
        *   `us1.api.wallarm.com` US Wallarm Cloud'daki API sunucusudur
        *   `api.wallarm.com` EU Wallarm Cloud'daki API sunucusudur
    *   TCP ve UDP protokolleri aracılığıyla `3313` Tarantool portuna erişimi kısıtlayın ve yalnızca Wallarm filtreleme düğümlerinin IP adreslerinden gelen bağlantılara izin verin.

## Tarantool hata giderme

[Tarantool hata giderme](../faq/tarantool.md)