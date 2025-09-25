NGINX ve Wallarm filtreleme düğümünün ana yapılandırma dosyaları şu dizinlerde bulunur:

* `/etc/nginx/conf.d/default.conf` — NGINX ayarları
* `/etc/nginx/conf.d/wallarm.conf` — global filtreleme düğümü ayarları

    Bu dosya, tüm etki alanlarına uygulanan ayarlar için kullanılır. Farklı etki alanı gruplarına farklı ayarlar uygulamak için `default.conf` dosyasını kullanın veya her etki alanı grubu için yeni yapılandırma dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha ayrıntılı bilgi [resmi NGINX dokümantasyonunda](https://nginx.org/en/docs/beginners_guide.html) mevcuttur.
* `/etc/nginx/conf.d/wallarm-status.conf` — Wallarm düğümünün izleme ayarları. Ayrıntılı açıklama şu [bağlantıda][wallarm-status-instr] mevcuttur
* `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` — Tarantool veritabanı ayarları

#### İstek filtreleme modu

Varsayılan olarak, filtreleme düğümü `off` durumundadır ve gelen istekleri analiz etmez. İstek analizini etkinleştirmek için lütfen şu adımları izleyin:

1. `/etc/nginx/conf.d/default.conf` dosyasını açın:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `wallarm_mode monitoring;` satırını `https`, `server` veya `location` bloğuna ekleyin:

??? note "Dosya `/etc/nginx/conf.d/default.conf` örneği"

    ```bash
    server {
        # isteklerin filtrelendiği bağlantı noktası
        listen       80;
        # isteklerin filtrelendiği alan adı
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

`monitoring` modunda çalışırken, filtreleme düğümü isteklerde saldırı belirtilerini arar ancak tespit edilen saldırıları engellemez. Filtreleme düğümünü devreye aldıktan sonra trafiğin birkaç gün boyunca `monitoring` modunda düğüm üzerinden akmasını ve ancak bundan sonra `block` modunu etkinleştirmenizi öneririz. [Filtreleme düğümünün çalışma modu yapılandırmasına ilişkin önerileri öğrenin →][waf-mode-recommendations]

#### Bellek

!!! info "Ayrı sunucuda Postanalytics modülü"
    Postanalytics modülünü ayrı bir sunucuya kurduysanız, modül zaten yapılandırıldığı için bu adımı atlayın.

Wallarm düğümü, bellek içi depolama Tarantool'u kullanır. Gerekli kaynak miktarı hakkında daha fazla bilgiyi [buradan][memory-instr] edinebilirsiniz. Test ortamları için üretim ortamlarına kıyasla daha az kaynak ayırabileceğinizi unutmayın.

Tarantool için bellek ayırmak üzere:

1. Tarantool yapılandırma dosyasını düzenleme modunda açın:

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
2. Bellek boyutunu GB cinsinden `SLAB_ALLOC_ARENA` yönergesinde belirtin. Değer bir tamsayı veya kayan nokta olabilir (ondalık ayırıcı olarak nokta `.` kullanılır).

    Tarantool için bellek ayırmaya ilişkin ayrıntılı öneriler bu [talimatlarda][memory-instr] açıklanmıştır. 
3. Değişiklikleri uygulamak için Tarantool'u yeniden başlatın:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### Ayrı postanalytics sunucusunun adresi

!!! info "NGINX-Wallarm ve postanalytics aynı sunucuda"
    NGINX-Wallarm ve postanalytics modülleri aynı sunucuya kuruluysa, bu adımı atlayın.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Diğer yapılandırmalar

Diğer NGINX ve Wallarm düğümü yapılandırmalarını güncellemek için NGINX dokümantasyonunu ve [kullanılabilir Wallarm düğümü yönergeleri][waf-directives-instr] listesini kullanın.