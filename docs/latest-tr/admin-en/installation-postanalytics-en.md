[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# Ayrı Postanalytics Modülünün Kurulumu

Wallarm’ın istek işleme süreci iki aşamadan oluşur; bunlardan biri istatistiksel istek analizi yapan postanalytics aşamasıdır. Postanalytics bellek açısından yoğun olduğundan, performansı optimize etmek için ayrı bir sunucuda çalıştırılması gerekebilir. Bu makale, postanalytics modülünün ayrı bir sunucuya nasıl kurulacağını açıklar.

## Genel Bakış

Wallarm düğümünde isteklerin işlenmesi iki aşamadan oluşur:

* Bellek açısından talepkâr olmayan ve sunucu gereksinimlerini değiştirmeden ön uç sunucularda çalıştırılabilen NGINX‑Wallarm modülünde birincil işleme.
* İşlenmiş isteklerin istatistiksel analizi olan ve bellek açısından talepkâr olan postanalytics modülü.

Aşağıdaki şemalar, modüllerin aynı sunucuda ve farklı sunucularda kurulu olduğu iki senaryoda etkileşimini göstermektedir.

=== "NGINX‑Wallarm ve postanalytics tek sunucuda"
    ![Postanalytics ve nginx-wallarm arasındaki trafik akışı](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-the-same-server.png)
=== "NGINX‑Wallarm ve postanalytics farklı sunucularda"
    ![Postanalytics ve nginx-wallarm arasındaki trafik akışı](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-different-servers.png)

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one/separate-postanalytics-reqs.md"

## Adım 1: Tümleşik Wallarm yükleyicisini indirin

Tümleşik Wallarm kurulum betiğini indirmek için şu komutu çalıştırın:

=== "x86_64 sürümü"
    ```bash
    curl -O https://meganode.wallarm.com/6.5/wallarm-6.5.1.x86_64-glibc.sh
    ```
=== "ARM64 sürümü"
    ```bash
    curl -O https://meganode.wallarm.com/6.5/wallarm-6.5.1.aarch64-glibc.sh
    ```

## Adım 2: Wallarm token’ını hazırlayın

Düğümü kurmak için [uygun türde][wallarm-token-types] bir Wallarm token’ına ihtiyacınız olacak. Token hazırlamak için:

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde açın.
    1. `Node deployment/Deployment` kullanım türüne sahip bir API token’ı bulun veya oluşturun.
    1. Bu token’ı kopyalayın.

=== "Node token"

    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde açın.
    1. Aşağıdakilerden birini yapın: 
        * **Wallarm node** türünde bir düğüm oluşturun ve üretilen token’ı kopyalayın.
        * Mevcut düğüm grubunu kullanın - düğüm menüsünden → **Copy token** ile token’ı kopyalayın.

## Adım 3: Postanalytics’i kurmak için tümleşik Wallarm yükleyicisini çalıştırın

Postanalytics’i tümleşik yükleyici ile ayrı olarak kurmak için:

=== "API token"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI içinde düğümlerin mantıksal gruplaması için kullanılır).

=== "Node token"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo sh wallarm-6.5.1.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo sh wallarm-6.5.1.aarch64-glibc.sh postanalytics
    ```

## Adım 4: Postanalytics modülünü yapılandırın

### Kaynaklar ve bellek

wstore’un ne kadar bellek kullandığını değiştirmek için `/opt/wallarm/env.list` dosyasındaki `SLAB_ALLOC_ARENA` ayarına bakın. Varsayılan olarak 1 GB kullanacak şekilde ayarlanmıştır. Değiştirmek gerekirse, değeri wstore’un ihtiyaç duyduğu gerçek bellek miktarına uyacak şekilde ayarlayabilirsiniz. Ne kadar ayarlanacağına dair yardım için [önerilerimize](configuration-guides/allocate-resources-for-node.md) bakın.

Ayrılan belleği değiştirmek için:

1. `/opt/wallarm/env.list` dosyasını düzenlemek üzere açın:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. `SLAB_ALLOC_ARENA` özniteliğini bellek boyutuna ayarlayın. Değer bir tam sayı veya ondalık (ondalık ayırıcı olarak nokta `.`) olabilir. Örneğin:

    ```
    SLAB_ALLOC_ARENA=2.0
    ```

### Ana makine ve port

Varsayılan olarak, postanalytics modülü ana makinenin tüm IPv4 adreslerinde (0.0.0.0) 3313 portunu kullanarak bağlantıları kabul edecek şekilde ayarlanmıştır. Değişiklik gerekmiyorsa varsayılan yapılandırmanın korunması önerilir.

Bununla birlikte, varsayılan yapılandırmayı değiştirmeniz gerekiyorsa:

1. Postanalytics hizmetinin bulunduğu makinede, `/opt/wallarm/wstore/wstore.yaml` dosyasını düzenlemek üzere açın:

    ```bash
    sudo vim /opt/wallarm/wstore/wstore.yaml
    ```
1. `service.address` parametresine yeni IP adresi ve port değerlerini belirtin, örneğin:

    ```yaml
    service:
      address: 192.158.1.38:3313
    ```

    `service.address` parametresi aşağıdaki değer biçimlerine izin verir:

    * IP adresi:Port, ör. `192.158.1.38:3313`
    * Tüm IP’lerde belirli port, ör. `:3313`
1. Postanalytics hizmetinin bulunduğu makinede, `/opt/wallarm/etc/wallarm/node.yaml` dosyasını düzenlemek üzere açın:

    ```bash
    sudo vim /opt/wallarm/etc/wallarm/node.yaml
    ```
1. `wstore.host` ve `wstore.port` parametrelerinde yeni IP adresi ve port değerlerini belirtin, örneğin:
    ```yaml
    api:
      uuid: <postanalytics düğümünün UUID’si>
      secret: <postanalytics düğümünün gizli anahtarı>
    wstore:
      host: '0.0.0.0'
      port: 3300
    ```

## Adım 5: Postanalytics modülü için gelen bağlantıları etkinleştirin

Postanalytics modülü varsayılan olarak 3313 portunu kullanır, ancak bazı bulut platformları bu porttaki gelen bağlantıları engelleyebilir.

Entegrasyonu garanti etmek için, 3313 portu veya özel portunuz üzerinde gelen bağlantılara izin verin. Bu adım, ayrı kurulan NGINX‑Wallarm modülünün wstore örneğine bağlanabilmesi için gereklidir.

## Adım 6: Wallarm servislerini yeniden başlatın

Gerekli değişiklikleri yaptıktan sonra, güncellemeleri uygulamak için postanalytics modülünü barındıran makinedeki Wallarm servislerini yeniden başlatın:

```
sudo systemctl restart wallarm.service
```

## Adım 7: NGINX‑Wallarm modülünü ayrı bir sunucuya kurun

Postanalytics modülü ayrı sunucuya kurulduktan sonra:

1. Farklı bir sunucuya NGINX‑Wallarm modülünü ilgili [kılavuzu](../installation/nginx/all-in-one.md) izleyerek kurun.
1. NGINX‑Wallarm modülünün kurulum betiğini ayrı sunucuda çalıştırırken `filtering` seçeneğini ekleyin, örneğin:

    === "API token"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI içinde düğümlerin mantıksal gruplaması için kullanılır).

    === "Node token"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo sh wallarm-6.5.1.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo sh wallarm-6.5.1.aarch64-glibc.sh filtering
        ```

## Adım 8: NGINX‑Wallarm modülünü postanalytics modülüne bağlayın

NGINX‑Wallarm modülünün kurulu olduğu makinede, NGINX [yapılandırma dosyasında](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) (genellikle `/etc/nginx/nginx.conf`), postanalytics modülü sunucu adresini belirtin:

```
http {
    # omitted

    upstream wallarm_wstore {
        server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
        server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
        keepalive 2;
    }

    wallarm_wstore_upstream wallarm_wstore;

    # omitted
}
```

* Aşırı bağlantı oluşturulmasını önlemek için her bir upstream wstore sunucusu için `max_conns` değeri belirtilmelidir.
* `keepalive` değeri, wstore sunucularının sayısından düşük olmamalıdır.

Yapılandırma dosyası değiştirildikten sonra, NGINX‑Wallarm modülü sunucusunda NGINX/NGINX Plus’ı yeniden başlatın:

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
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## Adım 9: NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol edin

NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol etmek için, korunan uygulamanın adresine test saldırısı içeren bir istek gönderebilirsiniz:

```bash
curl http://localhost/etc/passwd
```

NGINX‑Wallarm ve ayrı postanalytics modülleri doğru yapılandırılmışsa, saldırı Wallarm Cloud’a yüklenecek ve Wallarm Console’un **Attacks** bölümünde görüntülenecektir:

![Arayüzde Attacks](../images/admin-guides/test-attacks-quickstart.png)

Saldırı Cloud’a yüklenmediyse, lütfen servislerin çalışmasında hata olmadığından emin olun:

* Postanalytics modülü günlüklerini analiz edin

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/wstore-out.log
    ```

    `SystemError binary: failed to bind: Cannot assign requested address` benzeri bir kayıt varsa, sunucunun belirtilen adres ve port üzerinden bağlantı kabul ettiğinden emin olun.
* NGINX‑Wallarm modülünün bulunduğu sunucuda, NGINX günlüklerini analiz edin:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    `[error] wallarm: <address> connect() failed` benzeri bir kayıt varsa, ayrı postanalytics modülünün adresinin NGINX‑Wallarm modülü yapılandırma dosyalarında doğru belirtildiğinden ve ayrı postanalytics sunucusunun belirtilen adres ve port üzerinden bağlantı kabul ettiğinden emin olun.
* NGINX‑Wallarm modülünün bulunduğu sunucuda, aşağıdaki komutla işlenen isteklerin istatistiğini alın ve `tnt_errors` değerinin 0 olduğundan emin olun

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [İstatistik servisinin döndürdüğü tüm parametrelerin açıklaması →](configure-statistics-service.md)

## NGINX‑Wallarm modülü ile postanalytics modülü arasında SSL/TLS ve mTLS

İsteğe bağlı olarak, NGINX‑Wallarm modülü ile postanalytics arasında SSL/TLS üzerinden güvenli bağlantı kurabilirsiniz. Hem tek yönlü sunucu sertifikası doğrulaması hem de karşılıklı TLS desteklenir.

6.2.0 sürümünden itibaren kullanılabilir.

### Postanalytics modülüne SSL/TLS bağlantısı

NGINX‑Wallarm modülünden postanalytics modülüne güvenli SSL/TLS bağlantısını etkinleştirmek için:

1. Çalışan postanalytics modülünün ana makinesinin FQDN’i veya IP adresi için bir sunucu sertifikası çıkarın.
1. Postanalytics sunucusunda, `/opt/wallarm/wstore/wstore.yaml` dosyasında SSL/TLS’i etkinleştirin:

    ```yaml
    service:
      TLS:
        enabled: true
        address: 0.0.0.0:6388
        certFile: "/opt/wallarm/wstore/wstore.crt"
        keyFile: "/opt/wallarm/wstore/wstore.key"
        # caCertFile: "/opt/wallarm/wstore/wstore-ca.crt"
    ```

    * `enabled`: postanalytics modülü için SSL/TLS’i etkinleştirir veya devre dışı bırakır. Varsayılan `false`’tur.
    * `address`: postanalytics modülünün gelen TLS bağlantılarını kabul ettiği adres ve port. Belirtilen adresin gelen bağlantılara izin vermesi gerekir.
    * `certFile`: TLS el sıkışması sırasında istemciye (NGINX‑Wallarm modülü) sunulan sunucu sertifikasının yolu.
    * `keyFile`: sunucu sertifikasına karşılık gelen özel anahtarın yolu.
    * `caCertFile` (isteğe bağlı): sunucu için özel CA sertifikasının yolu.
1. Postanalytics sunucusunda Wallarm servislerini yeniden başlatın:

    ```
    sudo systemctl restart wallarm.service
    ```
1. NGINX‑Wallarm sunucusunda, NGINX [yapılandırma dosyasında](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) (genellikle, `/etc/nginx/nginx.conf`):

    1. TLS üzerinden postanalytics için kullanılan upstream’i yapılandırın.
    1. [`wallarm_wstore_upstream`](configure-parameters-en.md#wallarm_wstore_upstream) yönergesine `ssl=on` seçeneğini ekleyin.
    1. Postanalytics modülü özel bir CA tarafından imzalanmış bir sertifika kullanıyorsa, CA sertifikasını NGINX‑Wallarm sunucusuna yükleyin ve yolunu [`wallarm_wstore_ssl_ca_cert_file`](configure-parameters-en.md#wallarm_wstore_ssl_ca_cert_file) içinde belirtin.
    
        Bu dosya, postanalytics sunucusunda yapılandırılmış `service.TLS.caCertFile` ile aynı olmalıdır.

    ```
    http {
        upstream wallarm_wstore {
            server postanalytics.server.com:6388 max_fails=0 fail_timeout=0 max_conns=1;
            keepalive 1;
        }
    
        wallarm_wstore_upstream wallarm_wstore ssl=on;

        # wallarm_wstore_ssl_ca_cert_file /path/to/wstore-ca.crt;
    }
    ```
1. NGINX‑Wallarm sunucusunda NGINX’i yeniden başlatın:

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
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo systemctl restart nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl restart nginx
        ```
1. [Entegrasyonu kontrol edin](#step-9-check-the-nginxwallarm-and-separate-postanalytics-modules-interaction).

### Karşılıklı TLS (mTLS)

Hem NGINX‑Wallarm modülünün hem de postanalytics modülünün birbirlerinin sertifikalarını doğruladığı karşılıklı kimlik doğrulamayı etkinleştirmek için:

1. Yukarıda açıklandığı gibi, postanalytics modülüne [SSL/TLS bağlantısını etkinleştirin](#ssltls-connection-to-the-postanalytics-module).
1. Çalışan NGINX‑Wallarm modülünün ana makinesinin FQDN’i veya IP adresi için bir istemci sertifikası çıkarın.
1. NGINX‑Wallarm sunucusunda, istemci sertifikasını ve özel anahtarı yükleyin ve yollarını [`wallarm_wstore_ssl_cert_file`](configure-parameters-en.md#wallarm_wstore_ssl_cert_file) ve [`wallarm_wstore_ssl_key_file`](configure-parameters-en.md#wallarm_wstore_ssl_key_file) içinde belirtin:

    ```
    http {
        upstream wallarm_wstore {
            server postanalytics.server.com:6388 max_fails=0 fail_timeout=0 max_conns=1;
            keepalive 1;
        }
    
        wallarm_wstore_upstream wallarm_wstore ssl=on;

        wallarm_wstore_ssl_cert_file /path/to/client.crt;
        wallarm_wstore_ssl_key_file /path/to/client.key;
        
        # wallarm_wstore_ssl_ca_cert_file /path/to/wstore-ca.crt;
    }
    ```

    Ardından, NGINX’i yeniden başlatın:

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
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo systemctl restart nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl restart nginx
        ```

1. Postanalytics sunucusunda, `/opt/wallarm/wstore/wstore.yaml` içinde mTLS’i etkinleştirin:

    ```yaml
    service:
      TLS:
        enabled: true
        address: 0.0.0.0:6388
        certFile: "/opt/wallarm/wstore/wstore.crt"
        keyFile: "/opt/wallarm/wstore/wstore.key"
        # caCertFile: "/opt/wallarm/wstore/wstore-ca.crt"
        mutualTLS:
          enabled: true
          # clientCACertFile: "/opt/wallarm/wstore/client-ca.crt"
    ```

    * `mutualTLS.enabled`: mTLS’i etkinleştirir veya devre dışı bırakır. Varsayılan `false`’tur.
    * `mutualTLS.clientCACertFile` (isteğe bağlı): NGINX‑Wallarm istemcisi için özel CA sertifikasının yolu.


    Ardından, Wallarm servislerini yeniden başlatın:

    ```
    sudo systemctl restart wallarm.service
    ```

## Postanalytics modülü koruması

!!! warning "Yüklenen postanalytics modülünü koruyun"
    Yeni kurulan Wallarm postanalytics modülünü bir güvenlik duvarı ile korumanızı şiddetle öneririz. Aksi takdirde, aşağıdakilerle sonuçlanabilecek yetkisiz erişim riski vardır:
    
    *   İşlenen isteklere ilişkin bilgilerin ifşası
    *   Keyfi Lua kodu ve işletim sistemi komutlarının çalıştırılabilmesi
   
    Lütfen, postanalytics modülünü NGINX‑Wallarm modülü ile aynı sunucuda dağıtıyorsanız böyle bir riskin olmadığını unutmayın. Bunun nedeni, postanalytics modülünün `3313` portunu dinlemesidir.
    
    **Ayrı olarak kurulan postanalytics modülüne uygulanması gereken güvenlik duvarı ayarları şunlardır:**
    
    *   Postanalytics modülünün bu sunucularla etkileşime geçebilmesi için Wallarm API sunucularına giden ve bu sunuculardan gelen HTTPS trafiğine izin verin:
        *   `us1.api.wallarm.com`, US Wallarm Cloud’daki API sunucusudur
        *   `api.wallarm.com`, EU Wallarm Cloud’daki API sunucusudur
    *   TCP ve UDP protokolleri üzerinden `3313` wstore portuna erişimi kısıtlayın; yalnızca Wallarm filtreleme düğümlerinin IP adreslerinden gelen bağlantılara izin verin.