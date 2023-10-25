NGINX ve Wallarm filtreleme düğümünün ana yapılandırma dosyaları dizinlerde bulunur:

* `/etc/nginx/conf.d/default.conf` NGINX ayarları ile
* `/etc/nginx/conf.d/wallarm.conf` genel filtreleme düğümü ayarları ile

    Bu dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı alan adı gruplarına farklı ayarlar uygulamak için `default.conf` dosyasını kullanın veya her alan adı grubu için yeni yapılandırma dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha ayrıntılı bilgi [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) mevcuttur.
* `/etc/nginx/conf.d/wallarm-status.conf` Wallarm düğüm izleme ayarları ile. Detaylı açıklaması bu [bağlantı][wallarm-status-instr] içinde mevcuttur
* `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` Tarantool veritabanı ayarları ile

#### İstek filtreleme modu

Varsayılan olarak, filtreleme düğümü `off` durumundadır ve gelen istekleri analiz etmez. İsteklerin analizini etkinleştirmek için aşağıdaki adımları uygulayın:

1. `/etc/nginx/conf.d/default.conf` dosyasını açın:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `wallarm_mode monitoring;` satırını `https`, `server` veya `location` bloğuna ekleyin:

??? note "`/etc/nginx/conf.d/default.conf` dosyasının örneği"

    ```bash
    server {
        # filtrelenen istekler için port
        listen       80;
        # filtrelenen istekler için alan adı
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

`monitoring` modunda çalışırken, filtreleme düğümü isteklerde saldırı belirtileri arar ancak tespit edilen saldırıları engellemez. Filtreleme düğümü kurulumundan birkaç gün sonra trafiğin filtreleme düğümü üzerinden `monitoring` modunde kalmasını ve ancak o zaman `block` modunu etkinleştirmenizi öneririz. [Filtreleme düğümü işletim modu kurulumu hakkında önerileri öğrenin →][waf-mode-recommendations]

#### Bellek

!!! info "Ayrı bir sunucudaki postanalytics modülü"
    Eğer postanalytics modülünü ayrı bir sunucuya kurduysanız, bu adımı atlayın çünkü modül zaten yapılandırılmıştır.
  
Wallarm düğümü, bellek içi depolama olan Tarantool'u kullanır. Gerekli kaynak miktarı hakkında daha fazla bilgiyi [burada][memory-instr] öğrenin. Test ortamları için üretim ortamlarından daha düşük kaynakları tahsis edebileceğinizi unutmayın.

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
    === "CentOS veya Amazon Linux 2.0.2021x ve altı"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA` yönergesinde GB cinsinden bellek boyutunu belirtin. Değer tam veya ondalık (bir nokta `.` ondalık ayırıcıdır) bir sayı olabilir.

    Tarantool içi bellek tahsisi hakkında detaylı öneriler bu [talimatlarda][memory-instr] anlatılmıştır. 
3. Değişiklikleri uygulamak için Tarantool'u yeniden başlatın:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### Ayrı postanalytics sunucusunun adresi

!!! info "Aynı sunucudaki NGINX-Wallarm ve postanalytics"
    Eğer NGINX-Wallarm ve postanalytics modülleri aynı sunucuya kurulmuşsa, o zaman bu adımı atlayın.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Diğer yapılandırmalar

Diğer NGINX ve Wallarm düğümü yapılandırmalarını güncellemek için NGINX belgelerini ve [kullanılabilir Wallarm düğümü yönergelerinin listesini][waf-directives-instr] kullanın.