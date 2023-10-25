NGINX ve Wallarm filtreleme düğümünün ana konfigürasyon dosyaları aşağıdaki dizinlerde bulunur:

* `/etc/nginx/conf.d/default.conf` NGINX ayarlarıyla
* `/etc/nginx/conf.d/wallarm.conf` genel filtreleme düğümü ayarlarıyla

    Bu dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı ayarları farklı alan adı gruplarına uygulamak için `default.conf` dosyasını kullanın veya her alan adı grubu için yeni konfigürasyon dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX konfigürasyon dosyaları hakkında daha detaylı bilgi [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) bulunabilir.
* `/etc/nginx/conf.d/wallarm-status.conf` Wallarm düğümü izleme ayarlarıyla. Detaylı açıklama bu [bağlantıda][wallarm-status-instr] mevcuttur
* `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` Tarantool veritabanı ayarlarıyla

#### İstek filtreleme modu

Varsayılan olarak, filtreleme düğümü `kapalı` durumundadır ve gelen istekleri analiz etmez. İsteklerin analizini etkinleştirmek için lütfen aşağıdaki adımları izleyin:

1. `/etc/nginx/conf.d/default.conf` dosyasını açın:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `wallarm_mode monitoring;` satırını `https`, `server` veya `location` bloğuna ekleyin:

??? note "`/etc/nginx/conf.d/default.conf` dosyasının örneği"

    ```bash
    server {
        # isteklerin süzüldüğü port
        listen       80;
        # isteklerin süzüldüğü domain
        server_name  localhost;
        # Filtreleme düğümü modu
        wallarm_mode monitoring;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
    ```

`monitoring` modunda çalışırken, filtreleme düğümü isteklerde saldırı belirtileri arar ancak tespit edilen saldırıları engellemez. Filtreleme düğümünün kurulumundan birkaç gün sonra `engelleme` modunu etkinleştirmek önerilir. [Filtreleme düğümü işletim modu kurulumuna dair önerileri öğrenin →][waf-mode-recommendations]

#### Bellek

!!! info "Ayrı bir sunucuda postanalytics modülü"
    Eğer postanalytics modülünü ayrı bir sunucuya kurduysanız, bu adımı atlayın çünkü modül zaten yapılandırılmıştır.

Wallarm düğümü, Tarantool adında bir bellek içi depolama kullanır. Gerekli kaynak miktarı hakkında daha fazla bilgiyi [burada][memory-instr] öğrenebilirsiniz. Test ortamları için üretim ortamlarından daha az kaynak ayırabileceğinizi unutmayın.

Tarantool için bellek ayırmak için:

1. Tarantool konfigürasyon dosyasını düzenleme modunda açın:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve altı"
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
2. `SLAB_ALLOC_ARENA` yönergesinde GB cinsinden bellek boyutunu belirtin. Değer, tam sayı veya ondalık (`.` ondalık ayırıcıdır) olabilir.

    Tarantool için bellek ayırma hakkında detaylı tavsiyeler bu [talimatlarda][memory-intr] açıklanmıştır. 
3. Değişiklikleri uygulamak için Tarantool'u yeniden başlatın:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### Ayrı bir postanalytics sunucusunun adresi

!!! info "Aynı sunucuda NGINX-Wallarm ve postanalytics"
    Eğer NGINX-Wallarm ve postanalytics modülleri aynı sunucuya kurulmuşsa, bu adımı atlayın.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Diğer konfigürasyonlar

Diğer NGINX ve Wallarm düğümü konfigürasyonlarını güncellemek için NGINX belgelerini ve [kullanılabilir Wallarm düğümü yönergelerinin listesini][waf-directives-instr] kullanın.