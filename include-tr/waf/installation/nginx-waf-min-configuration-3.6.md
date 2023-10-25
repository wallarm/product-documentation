NGINX ve Wallarm filtreleme düğümünün ana yapılandırma dosyaları şu dizinlerde bulunur:

* `/etc/nginx/conf.d/default.conf` NGINX ayarları ile
* `/etc/nginx/conf.d/wallarm.conf` küresel filtreleme düğümü ayarları ile

    Bu dosya tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı alan adı gruplarına farklı ayarlar uygulamak için `default.conf` dosyasını kullanın veya her alan adı grubu için yeni yapılandırma dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha detaylı bilgi [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) bulunabilir.
* `/etc/nginx/conf.d/wallarm-status.conf` Wallarm düğümü izleme ayarları ile. Detaylı açıklama bu [bağlantıda][wallarm-status-instr] mevcuttur.
* `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` Tarantool veritabanı ayarları ile

#### İstek filtreleme modu

Varsayılan olarak, filtreleme düğümü `off` durumundadır ve gelen istekleri analiz etmez. İsteklerin analizini etkinleştirmek için lütfen aşağıdaki adımları izleyin:

1. `/etc/nginx/conf.d/default.conf` dosyasını açın:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `wallarm_mode monitoring;` satırını `https`, `server` veya `location` bloğuna ekleyin:

??? note "`/etc/nginx/conf.d/default.conf` dosyasının örneği"

    ```bash
    server {
        # isteklerin filtrelendiği port
        listen       80;
        # isteklerin filtrelendiği domain
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

`monitoring` modunda çalışırken, filtreleme düğümü isteklerde saldırı işaretlerini arar ancak tespit edilen saldırıları engellemez. Filtreleme düğümünün görevlendirilmesinden birkaç gün sonra trafiğin filtreleme düğümü üzerinden `monitoring` modunda akmasını ve ancak o zaman `block` modunu etkinleştirmenizi öneririz. [Filtreleme düğümü işlem modu kurulumu hakkında önerilere buradan ulaşabilirsiniz →][waf-mode-recommendations]

#### Bellek

!!! info "Ayrı bir sunucudaki Postanalytics modülü"
    Eğer postanalytics modülünü ayrı bir sunucuya kurduysanız, bu adımı atlayın çünkü modülü zaten yapılandırdınız.

Wallarm düğümü, bellek içi depolama olan Tarantool’u kullanır. Gerekli kaynak miktarı hakkında daha fazlasını [burada][memory-instr] öğrenin. Test ortamları için, üretim ortamlarına göre daha az kaynak ayırabileceğinizi unutmayın.

Tarantool için bellek ayırmak:

1. Tarantool yapılandırma dosyasını düzenleme modunda açın:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve daha altı"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. GB cinsinden bellek boyutunu `SLAB_ALLOC_ARENA` direktifine belirtin. Değer tam sayı veya ondalık (bir nokta `.` ondalık ayırıcısıdır) olabilir.

    Tarantool için bellek ayırma hakkında ayrıntılı tavsiyeler bu [talimatlarda][memory-instr] açıklanmıştır.
3. Değişiklikleri uygulamak için Tarantool'u yeniden başlatın:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### Ayri postanalytics sunucusunun adresi

!!! info "Bir sunucu üzerindeki NGINX-Wallarm ve postanalytics"
    Eğer NGINX-Wallarm ve postanalytics modülleri aynı sunucuya kurulmuşsa, bu adımı atlayın.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Diğer yapılandırmalar

Diğer NGINX ve Wallarm düğümü yapılandırmalarını güncellemek için, NGINX belgelerini ve [mevcut Wallarm düğümü direktiflerinin listesini][waf-directives-instr] kullanın.