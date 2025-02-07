Main configuration files of NGINX ve Wallarm filtreleme düğümü aşağıdaki dizinlerde bulunur:

* `/etc/nginx/conf.d/default.conf` – NGINX ayarları içindir
* `/etc/nginx/conf.d/wallarm.conf` – Global filtreleme düğümü ayarları içindir

    Bu dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı alan adı gruplarına farklı ayarlar uygulamak için `default.conf` dosyasını kullanın veya her alan adı grubu için yeni konfigürasyon dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX konfigürasyon dosyaları hakkında daha detaylı bilgi [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html) sayfasında mevcuttur.
* `/etc/nginx/conf.d/wallarm-status.conf` – Wallarm düğüm izleme ayarları içindir. Ayrıntılı açıklama [link][wallarm-status-instr] içerisinde bulunabilir.
* `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` – Tarantool veritabanı ayarlarını içerir

#### Request filtration mode

Varsayılan olarak, filtreleme düğümü `off` durumundadır ve gelen istekleri analiz etmez. İstek analizini etkinleştirmek için lütfen aşağıdaki adımları izleyin:

1. `/etc/nginx/conf.d/default.conf` dosyasını açın:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `https`, `server` veya `location` bloğuna `wallarm_mode monitoring;` satırını ekleyin:

??? note "Örnek `/etc/nginx/conf.d/default.conf` dosyası"

    ```bash
    server {
        # Filtrelenen istekler için port
        listen       80;
        # Filtrelenen istekler için alan adı
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

`monitoring` modunda çalışırken, filtreleme düğümü isteklerde saldırı belirtileri arar fakat tespit edilen saldırıları engellemez. Filtreleme düğümü dağıtımından sonra birkaç gün boyunca trafiğin `monitoring` moduyla akmasını sağlamanızı ve ancak daha sonra `block` modunu etkinleştirmenizi öneririz. [Learn recommendations on the filtering node operation mode setup →][waf-mode-recommendations]

#### Memory

!!! info "Ayrı sunucuda bulunan Postanalytics modülü"
    Eğer postanalytics modülünü ayrı bir sunucuya kurduysanız, modülü zaten yapılandırmış olduğunuz için bu adımı atlayın.

Wallarm düğümü, bellek içi depolama olarak Tarantool kullanır. Gerekli kaynak miktarı hakkında daha fazla bilgiyi [here][memory-instr] adresinden öğrenebilirsiniz. Test ortamları için üretim ortamlarına göre daha düşük kaynak tahsis edilebileceğini unutmayın.

Tarantool için bellek tahsis etmek amacıyla:

1. Tarantool konfigürasyon dosyasını düzenleme modunda açın:

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
    === "RHEL 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA` yönergesinde GB cinsinden bellek boyutunu belirtin. Değer bir tamsayı veya ondalık sayı (ondalık ayırıcı olarak nokta `.` kullanılır) olabilir.

    Tarantool için bellek tahsisi hakkında detaylı tavsiyeler bu [instructions][memory-instr] sayfasında açıklanmıştır.
3. Değişiklikleri uygulamak için Tarantool'u yeniden başlatın:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### Address of the separate postanalytics server

!!! info "NGINX-Wallarm ve postanalytics aynı sunucuda"
    Eğer NGINX-Wallarm ve postanalytics modülleri aynı sunucuya kuruluysa, bu adımı atlayın.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Diğer konfigürasyonlar

Diğer NGINX ve Wallarm düğümü konfigürasyonlarını güncellemek için NGINX dokümantasyonunu ve [available Wallarm node directives][waf-directives-instr] listesini kullanın.