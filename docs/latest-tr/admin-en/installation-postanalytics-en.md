[tarantool-status]:           ../images/tarantool-status.png
[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# Ayrı Postanalytics Modülü Kurulumu

Wallarm'ın istek işleme sürecinde, istatistiksel istek analizine yönelik postanalytics aşaması da dahil olmak üzere iki aşama yer alır. Postanalytics bellek yoğun bir işlemdir, bu nedenle optimize edilmiş performans için ayrı bir sunucuda gerçekleştirilmesi gerekebilir. Bu makale, postanalytics modülünün ayrı bir sunucuya nasıl kurulacağını açıklar.

## Genel Bakış

Wallarm düğümündeki istek işleme süreci iki aşamadan oluşur:

* NGINX-Wallarm modülündeki temel işleme; bu aşama bellek açısından yoğun değildir ve sunucu gereksinimlerini değiştirmeden ön uç sunucularında çalıştırılabilir.
* İşlenen isteklerin istatistiksel analizi, bellek yoğun olan postanalytics modülünde yapılır.

Aşağıdaki şemalar, modül etkileşimini aynı sunucuda ve farklı sunucularda kurulum senaryolarıyla göstermektedir.

=== "NGINX-Wallarm ve postanalytics aynı sunucuda"
    ![Postanalytics ile nginx-wallarm arasındaki trafik akışı](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-the-same-server.png)
=== "NGINX-Wallarm ve postanalytics farklı sunucularda"
    ![Postanalytics ile nginx-wallarm arasındaki trafik akışı](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-different-servers.png)

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one/separate-postanalytics-reqs.md"

## Adım 1: all-in-one Wallarm Kurulum Paketini İndirin

Tüm bileşenleri içeren Wallarm kurulum betiğini indirmek için aşağıdaki komutu çalıştırın:

=== "x86_64 sürümü"
    ```bash
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.x86_64-glibc.sh
    ```
=== "ARM64 sürümü"
    ```bash
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.aarch64-glibc.sh
    ```

## Adım 2: Wallarm Token'ını Hazırlayın

Düğüm kurulumunu gerçekleştirmek için [uygun tipteki][wallarm-token-types] bir Wallarm token'ına ihtiyacınız vardır. Bir token hazırlamak için:

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinden açın.
    1. `Deploy` kaynak rolüne sahip bir API token'ı bulun veya oluşturun.
    1. Bu token'ı kopyalayın.

=== "Node token"

    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinden açın.
    1. Aşağıdakilerden birini yapın:
        * **Wallarm node** türünde bir düğüm oluşturup üretilen token'ı kopyalayın.
        * Mevcut bir düğüm grubunu kullanın – düğümün menüsünden **Copy token** seçeneği ile token'ı kopyalayın.

## Adım 3: all-in-one Wallarm Kurulum Paketini Çalıştırarak Postanalytics'i Kurun

Postanalytics'i all-in-one kurulum betiği ile ayrı olarak kurmak için şu komutu kullanın:

=== "API token"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS` değişkeni, düğümün eklenmesi gereken grubu belirler (Wallarm Console arayüzünde düğümlerin mantıksal gruplandırması için kullanılır).

=== "Node token"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo sh wallarm-5.3.0.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo sh wallarm-5.3.0.aarch64-glibc.sh postanalytics
    ```

## Adım 4: Postanalytics Modülünü Yapılandırın

### Kaynaklar ve Bellek

Tarantool'un ne kadar bellek kullanacağını değiştirmek için, `/opt/wallarm/env.list` dosyasında `SLAB_ALLOC_ARENA` ayarını arayın. Bu ayar varsayılan olarak 1 GB kullanacak şekilde belirlenmiştir. Bu değeri değiştirmek gerekiyorsa, Tarantool'un ihtiyaç duyduğu bellek miktarına göre ayarlayabilirsiniz. Ne kadar bellek ayarlanacağına ilişkin yardım için [önerilerimize](configuration-guides/allocate-resources-for-node.md) bakın.

Tahsis edilen belleği değiştirmek için:

1. `/opt/wallarm/env.list` dosyasını düzenlemek üzere açın:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. `SLAB_ALLOC_ARENA` özniteliğini bellek boyutuna eşleyin. Değer tam sayı veya ondalık (ondalık ayırıcı olarak nokta `.`) olabilir. Örneğin:

    ```
    SLAB_ALLOC_ARENA=2.0
    ```

### Host ve Port

Varsayılan olarak, postanalytics modülü host'un tüm IPv4 adreslerinden (0.0.0.0) port 3313 üzerinden bağlantıları kabul edecek şekilde ayarlanmıştır. Değişiklik yapılmadığı sürece varsayılan yapılandırmanın kullanılması önerilir.

Ancak, varsayılan yapılandırmada değişiklik yapmanız gerekiyorsa:

1. `/opt/wallarm/env.list` dosyasını düzenlemek üzere açın:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. İhtiyaca göre `HOST` ve `PORT` değerlerini güncelleyin. Henüz tanımlı değilse, `PORT` değişkenini aşağıdaki gibi tanımlayın:

    ```bash
    # tarantool
    HOST=0.0.0.0
    PORT=3300
    ```
1. `/opt/wallarm/etc/wallarm/node.yaml` dosyasını düzenlemek üzere açın:

    ```bash
    sudo vim /opt/wallarm/etc/wallarm/node.yaml
    ```
1. `tarantool` parametreleri için yeni `host` ve `port` değerlerini aşağıdaki şekilde girin:

    ```yaml
    hostname: <postanalytics düğüm adı>
    uuid: <postanalytics düğümün UUID'si>
    secret: <postanalytics düğümün gizli anahtarı>
    tarantool:
        host: '0.0.0.0'
        port: 3300
    ```

## Adım 5: Postanalytics Modülü için Gelen Bağlantılara İzin Verin

Postanalytics modülü varsayılan olarak port 3313'ü kullanır, ancak bazı bulut platformları bu port üzerindeki gelen bağlantıları engelleyebilir.

NGINX-Wallarm modülünün Tarantool örneğine bağlanabilmesi için, port 3313 veya sizin belirlediğiniz özel port üzerinden gelen bağlantılara izin verin.

## Adım 6: Wallarm Servislerini Yeniden Başlatın

Gerekli değişiklikleri yaptıktan sonra, postanalytics modülünün bulunduğu makinadaki Wallarm servislerini güncellemelerin uygulanabilmesi için yeniden başlatın:

```
sudo systemctl restart wallarm.service
```

## Adım 7: Ayrı Bir Sunucuda NGINX-Wallarm Modülünü Kurun

Postanalytics modülü ayrı bir sunucuda kurulduktan sonra:

1. NGINX-Wallarm modülünü, ilgili [kılavuzu](../installation/nginx/all-in-one.md) takip ederek farklı bir sunucuya kurun.
1. Farklı bir sunucuda NGINX-Wallarm modülü kurulum betiğini çalıştırırken, örneğin `filtering` seçeneğini de ekleyin:

    === "API token"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS` değişkeni, düğümün eklenmesi gereken grubu belirler (Wallarm Console arayüzünde düğümlerin mantıksal gruplandırması için kullanılır).

    === "Node token"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```

## Adım 8: NGINX-Wallarm Modülünü Postanalytics Modülüne Bağlayın

NGINX-Wallarm modülünün bulunduğu makinede, NGINX [yapılandırma dosyasında](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/), postanalytics modülü sunucu adresini belirtin:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* Her upstream Tarantool sunucusu için `max_conns` değeri, aşırı bağlantı oluşumunu önlemek amacıyla belirtilmelidir.
* `keepalive` değeri, Tarantool sunucuları sayısından düşük olmamalıdır.

Yapılandırma dosyası değiştirildikten sonra, NGINX/NGINX Plus'ın NGINX-Wallarm modülünün bulunduğu sunucuda yeniden başlatıldığından emin olun:

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

## Adım 9: NGINX‑Wallarm ve Ayrı Postanalytics Modüllerinin Etkileşimini Kontrol Edin

NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol etmek için, korunan uygulamanın adresine test saldırı isteği gönderebilirsiniz:

```bash
curl http://localhost/etc/passwd
```

Eğer NGINX‑Wallarm ve ayrı postanalytics modülleri doğru şekilde yapılandırıldıysa, saldırı Wallarm Cloud'a yüklenecek ve Wallarm Console'daki **Attacks** bölümünde görüntülenecektir:

![Arayüzdeki Saldırılar](../images/admin-guides/test-attacks-quickstart.png)

Saldırı Cloud'a yüklenmediyse, lütfen servislerin çalışmasında herhangi bir hata olmadığından emin olun:

* Postanalytics modül loglarını analiz edin:

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/tarantool-out.log
    ```

    Eğer `SystemError binary: failed to bind: Cannot assign requested address` kaydı varsa, belirtilen adres ve port üzerinden sunucunun bağlantıları kabul ettiğinden emin olun.
* NGINX‑Wallarm modülünün bulunduğu sunucuda, NGINX loglarını analiz edin:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    Eğer `[error] wallarm: <address> connect() failed` kaydı varsa, NGINX‑Wallarm modülü yapılandırma dosyalarında ayrı postanalytics modülünün adresinin doğru girildiğinden ve ayrı postanalytics sunucusunun belirtilen adres ve port üzerinden bağlantıları kabul ettiğinden emin olun.
* NGINX‑Wallarm modülünün bulunduğu sunucuda, işlenen isteklerin istatistiklerini aşağıdaki komutla alın ve `tnt_errors` değerinin 0 olduğundan emin olun:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [İstatistik servisi tarafından döndürülen tüm parametrelerin açıklaması →](configure-statistics-service.md)

## Postanalytics Modülünün Korunması

!!! warning "Kurulmuş postanalytics modülünü koruyun"
    Yeni kurulan Wallarm postanalytics modülünü bir güvenlik duvarı ile korumanızı **şiddetle tavsiye ederiz**. Aksi halde, aşağıdaki riskler ortaya çıkabilir:
    
    *   İşlenen istekler hakkında bilgi sızdırılması
    *   Rastgele Lua kodlarının ve işletim sistemi komutlarının çalıştırılması
   
    NGINX-Wallarm modülü ile aynı sunucuda postanalytics modülünü dağıtıyorsanız, böyle bir risk söz konusu değildir. Çünkü postanalytics modülü `3313` portunu dinleyecektir.
    
    **Ayrı kurulmuş postanalytics modülü için uygulanması gereken güvenlik duvarı ayarları şunlardır:**
    
    *   Postanalytics modülünün Wallarm API sunucuları ile etkileşimde bulunabilmesi için HTTPS trafiğine izin verin:
        *   `us1.api.wallarm.com` – US Wallarm Cloud API sunucusu
        *   `api.wallarm.com` – EU Wallarm Cloud API sunucusu
    *   Sadece Wallarm filtering düğümlerinin IP adreslerinden gelen bağlantılara izin vererek `3313` Tarantool portuna TCP ve UDP protokolleri üzerinden erişimi kısıtlayın.

## Tarantool Sorun Giderme

[Tarantool troubleshooting](../faq/tarantool.md)