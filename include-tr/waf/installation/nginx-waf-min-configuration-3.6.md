Main configuration files of NGINX and Wallarm filtering node are located in the directories:

* `/etc/nginx/conf.d/default.conf` with NGINX settings
* `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings

    Dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı alan gruplarına farklı ayarlar uygulamak için, `default.conf` dosyasını kullanın veya her alan grubu için yeni yapılandırma dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha detaylı bilgiyi [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html) adresinde bulabilirsiniz.
* `/etc/nginx/conf.d/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` with the Tarantool database settings

#### Request filtration mode

Varsayılan olarak, filtreleme düğümü `off` durumundadır ve gelen istekleri analiz etmez. İstek analizi etkinleştirmek için lütfen şu adımları izleyin:

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

`monitoring` modunda çalışırken, filtreleme düğümü isteklerde saldırı belirtileri arar ancak tespit edilen saldırıları engellemez. Filtreleme düğümünü devreye aldıktan sonraki birkaç gün boyunca trafiğin `monitoring` modunda akışını sürdürmenizi ve ancak sonrasında `block` modunu etkinleştirmenizi öneririz. [Learn recommendations on the filtering node operation mode setup →][waf-mode-recommendations]

#### Memory

!!! info "Postanalytics module on the separate server"
    Eğer postanalytics modülünü ayrı bir sunucuya kurduysanız, modül zaten yapılandırıldığı için bu adımı atlayın.

Wallarm düğümü, bellek içi depolama olarak Tarantool'u kullanır. Gerekli kaynak miktarı hakkında daha fazla bilgiyi [here][memory-instr] adresinde öğrenebilirsiniz. Test ortamları için üretim ortamlarına kıyasla daha düşük kaynak tahsis edebileceğinizi unutmayın.

Tarantool için bellek tahsis etmek:

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
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA` yönergesinde GB cinsinden bellek boyutunu belirtin. Değer bir tam sayı veya ondalıklı sayı olabilir (ondalık ayırıcı olarak nokta `.` kullanılır).

    Tarantool için bellek tahsisi ile ilgili detaylı öneriler bu [instructions][memory-instr] bağlantısında açıklanmıştır.
3. Değişiklikleri uygulamak için Tarantool'u yeniden başlatın:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### Address of the separate postanalytics server

!!! info "NGINX-Wallarm and postanalytics on the same server"
    Eğer NGINX-Wallarm ve postanalytics modülleri aynı sunucuda kuruluysa, bu adımı atlayın.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Other configurations

Diğer NGINX ve Wallarm düğümü yapılandırmalarını güncellemek için NGINX dokümantasyonunu ve [available Wallarm node directives][waf-directives-instr] listesini kullanın.