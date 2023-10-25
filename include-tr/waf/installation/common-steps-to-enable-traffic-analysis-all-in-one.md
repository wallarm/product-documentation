Varsayılan olarak, dağıtılmış Wallarm düğümü gelen trafiği analiz etmez.

Seçilen Wallarm kullanıma hazır hale getirme yaklaşımına bağlı olarak ([in-line][inline-docs] veya [Out-of-Band][oob-docs]), Wallarm'ı ya trafiği proxy olarak yapılandırın veya trafiği ayna işlemi yapmak üzere yapılandırın.

Kurulu düğümün bulunduğu makinedeki NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) dosyasında aşağıdaki yapılandırmayı gerçekleştirin:

=== "In-line"
    1. Wallarm'ın geçerli trafiği proxy olarak yollayacağı bir IP adresi ayarlayın. Bunun, mimarinize bağlı olarak bir uygulama örneği, yük dengeleyici veya DNS adı vb. bir IP olması mümkün.
    
        Bunu yapmak için `proxy_pass` değerini düzenleyin, örneğin Wallarm geçerli istekleri `http://10.80.0.5` adresine yollamalı:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;

            ...

            location / {
                proxy_pass http://10.80.0.5; 
                ...
            }
        }
        ```
    1. Wallarm düğümünün gelen trafiği analiz etmesi için `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        İzleme modu, ilk dağıtım ve çözüm testi için önerilendir. Wallarm ayrıca güvenli bloklama ve bloklama modlarını da sağlar, daha fazla bilgi için [bakınız][waf-mode-instr].
=== "Out-of-Band"
    1. Wallarm düğümünün aynalanan trafiği kabul etmesi için `server` NGINX bloğunda aşağıdaki yapılandırmayı ayarlayın:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # 222.222.222.22 yerine aynalama sunucusunun adresini girin
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * `set_real_ip_from` ve `real_ip_header` yönergeleri, Wallarm Console'un saldırganların IP adreslerini [göstermesi için][proxy-balancer-instr] gereklidir.
        * `wallarm_force_response_*` yönergeleri, aynalanan trafikten alınan kopyalar dışında tüm isteklerin analizini devre dışı bırakmak için gereklidir.
    1. Wallarm düğümünün aynalanan trafiği analiz etmesi için `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Zararlı istekler [engellenemez][oob-advantages-limitations], dolayısıyla Wallarm'ın kabul ettiği tek [mod][waf-mode-instr] izleme modudur. In-line dağıtım için ayrıca güvenli bloklama ve bloklama modları vardır ancak `wallarm_mode` yönergesini izlemeden farklı bir değere ayarlarsanız, düğüm trafiği izlemeye devam eder ve yalnızca zararlı trafiği kaydeder (modun kapalı olarak ayarlandığı durumlar dışında).