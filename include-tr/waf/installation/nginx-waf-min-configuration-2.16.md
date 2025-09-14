NGINX ve Wallarm filtreleme düğümünün ana yapılandırma dosyaları aşağıdaki dizinlerde bulunur:

* `/etc/nginx/conf.d/default.conf` — NGINX ayarları
* `/etc/nginx/conf.d/wallarm.conf` — küresel filtreleme düğümü ayarları

    Bu dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı alan adı gruplarına farklı ayarlar uygulamak için `default.conf` dosyasını kullanın veya her alan adı grubu için yeni yapılandırma dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha detaylı bilgi [resmi NGINX dokümantasyonunda](https://nginx.org/en/docs/beginners_guide.html) mevcuttur.
* `/etc/nginx/conf.d/wallarm-status.conf` — Wallarm düğümü izleme ayarları. Ayrıntılı açıklama şu [bağlantıda][wallarm-status-instr] mevcuttur
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

`monitoring` modunda çalışırken, filtreleme düğümü isteklerde saldırı belirtilerini arar ancak tespit edilen saldırıları engellemez. Filtreleme düğümünü devreye aldıktan sonra trafiği birkaç gün boyunca `monitoring` modunda akıtmaya devam etmenizi ve ancak bundan sonra `block` modunu etkinleştirmenizi öneririz. [Filtreleme düğümünün çalışma modu kurulumuna ilişkin önerileri öğrenin →][waf-mode-recommendations]

#### Bellek

!!! info "Ayrı sunucuda postanalytics modülü"
    Postanalytics modülünü ayrı bir sunucuya kurduysanız, bu adımı atlayın çünkü modül zaten yapılandırılmış durumda.

Wallarm düğümü, bellek içi depolama Tarantool’u kullanır. Gerekli kaynak miktarı hakkında daha fazla bilgiyi [buradan][memory-instr] öğrenin. Test ortamları için üretim ortamlarına kıyasla daha düşük kaynaklar ayırabileceğinizi unutmayın.

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
    === "CentOS veya Amazon Linux 2.0.2021x ve daha düşük"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA` yönergesinde bellek boyutunu GB cinsinden belirtin. Değer tamsayı veya ondalık olabilir (ondalık ayırıcı olarak nokta `.` kullanılır).

    Tarantool için bellek ayırmaya ilişkin ayrıntılı öneriler bu [talimatlarda][memory-instr] açıklanmaktadır. 
3. Değişiklikleri uygulamak için Tarantool’u yeniden başlatın:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### Ayrı postanalytics sunucusunun adresi

!!! info "Aynı sunucuda NGINX-Wallarm ve postanalytics"
    NGINX-Wallarm ve postanalytics modülleri aynı sunucuya kuruluysa, bu adımı atlayın.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Diğer yapılandırmalar

Diğer NGINX ve Wallarm düğümü yapılandırmalarını güncellemek için NGINX dokümantasyonunu ve [kullanılabilir Wallarm düğüm yönergeleri][waf-directives-instr] listesini kullanın.