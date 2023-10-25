Varsayılan olarak, dağıtılmış Wallarm düğümü gelen trafiği analiz etmez.

Seçilen Wallarm dağıtım yaklaşımına göre ([in-line][inline-docs] veya [Out-of-Band][oob-docs]), Wallarm'ı ya trafiği proxy olarak ayarlamak için veya trafik aynasını işlemek için yapılandırın.

Aşağıdaki yapılandırmayı yüklenmiş düğümle birlikte olan `/etc/nginx/conf.d/default.conf` dosyasında gerçekleştirin:

=== "In-line"
    1. Wallarm'ın meşru trafiği proxy olarak neye iletmesi gerektiği için bir IP adresi ayarlayın. Bu, bir uygulama örneğinin IP'si, yük dengeleyici veya DNS adı vb. olabilir, mimarinize bağlı olarak.
    
        Bunu yapmak için, `proxy_pass` değerini düzenleyin, ör. Wallarm, meşru istekleri `http://10.80.0.5` adresine göndermelidir:

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
    1. Wallarm düğümünün gelen trafiği analiz etmesi için, `wallarm_mode` talimatını `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        İzleme modu, ilk dağıtım ve çözüm testi için önerilen moddur. Wallarm ayrıca güvenli engelleme ve engelleme modlarını da sağlar, [daha fazla bilgi][waf-mode-instr].
        
=== "Out-of-Band"
    1. Wallarm düğümünün aynalanan trafiği kabul etmesi için, şu yapılandırmayı `server` NGINX bloğunda ayarlayın:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # Aynalanma sunucusunun adresini 222.222.222.22 ile değiştirin
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * `set_real_ip_from` ve `real_ip_header` talimatları, Wallarm konsolunun saldırganların IP adreslerini [göstermesi][proxy-balancer-instr] için gereklidir.
        * `wallarm_force_response_*` talimatları, aynalanan trafikten alınan kopyalar dışında tüm isteklerin analizi devre dışı bırakmak için gereklidir.
    1. Wallarm düğümünün aynalanan trafiği analiz etmesi için, `wallarm_mode` talimatına `monitoring` değerini ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Kötü amaçlı istekler [engellenemez][oob-advantages-limitations] olduğundan, Wallarm'ın kabul ettiği tek [mod][waf-mode-instr] izlemedir. İç dağıtım için güvenli engelleme ve engelleme modları bulunmaktadır ancak `wallarm_mode` talimatını izleme dışında bir değere ayarlarsanız, düğüm trafiği izlemeye devam eder ve yalnızca kötü amaçlı trafiği kaydeder (modun kapalı olarak ayarlanmasının yanı sıra).
