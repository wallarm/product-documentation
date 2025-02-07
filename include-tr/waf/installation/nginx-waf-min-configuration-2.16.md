Main yapılandırma dosyaları, NGINX ve Wallarm filtering node için şu dizinlerde yer almaktadır:

* `/etc/nginx/conf.d/default.conf` – NGINX ayarlarıyla birlikte
* `/etc/nginx/conf.d/wallarm.conf` – Genel filtering node ayarlarıyla birlikte

    Bu dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı alan adı grupları için farklı ayarlar uygulamak istiyorsanız, `default.conf` dosyasını kullanabilir veya her alan adı grubu için yeni yapılandırma dosyaları oluşturabilirsiniz (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha ayrıntılı bilgi [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html)'da mevcuttur.
* `/etc/nginx/conf.d/wallarm-status.conf` – Wallarm node izleme ayarlarıyla birlikte. Ayrıntılı açıklamaya [link][wallarm-status-instr] üzerinden ulaşabilirsiniz.
* `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` – Tarantool veritabanı ayarlarıyla birlikte

#### Request filtration mode

Varsayılan olarak, filtering node durumu `off` durumunda olup gelen istekleri analiz etmez. İstek analizini etkinleştirmek için aşağıdaki adımları izleyin:

1. `/etc/nginx/conf.d/default.conf` dosyasını açın:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `https`, `server` veya `location` bloğuna `wallarm_mode monitoring;` satırını ekleyin:

??? note "Example of the file `/etc/nginx/conf.d/default.conf`"

    ```bash
    server {
        # port for which requests are filtered
        listen       80;
        # domain for which requests are filtered
        server_name  localhost;
        # Filtering node mode
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

`monitoring` modunda çalışırken, filtering node isteklerde saldırı belirtilerini arar ancak tespit edilen saldırıları engellemez. Filtering node devreye alındıktan sonra birkaç gün boyunca trafiğin `monitoring` modunda filtering node üzerinden akmasını sağlamanızı ve ancak daha sonra `block` modunu etkinleştirmenizi öneririz. [Learn recommendations on the filtering node operation mode setup →][waf-mode-recommendations]

#### Bellek

!!! info "Ayrı sunucudaki postanalytics modülü"
    Eğer postanalytics modülünü ayrı bir sunucuya kurduysanız, modül zaten yapılandırıldığı için bu adımı atlayın.

Wallarm node, bellek içi depolama olarak Tarantool'u kullanır. Gerekli kaynak miktarı hakkında daha fazla bilgiyi [here][memory-instr] bağlantısından öğrenebilirsiniz. Test ortamları için, üretim ortamlarına göre daha az kaynak tahsis edebileceğinizi unutmayın.

Tarantool için bellek tahsis etmek üzere:

1. Tarantool yapılandırma dosyasını düzenleme modunda açın:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA` yönergesinde GB cinsinden bellek boyutunu belirtin. Değer bir tam sayı ya da ondalık sayı olabilir (ondalık ayırıcı olarak `.` kullanılır).

    Tarantool için bellek tahsisine ilişkin ayrıntılı öneriler bu [instructions][memory-instr] içerisinde açıklanmıştır.
3. Değişiklikleri uygulamak için Tarantool'u yeniden başlatın:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### Ayrı postanalytics sunucusunun adresi

!!! info "NGINX-Wallarm ve postanalytics aynı sunucuda"
    Eğer NGINX-Wallarm ve postanalytics modülleri aynı sunucuya kuruluysa, bu adımı atlayın.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Diğer yapılandırmalar

Diğer NGINX ve Wallarm node yapılandırmalarını güncellemek için, NGINX dokümantasyonunu ve [available Wallarm node directives][waf-directives-instr] listesini kullanın.