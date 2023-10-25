Varsayılan olarak, dağıtılan Wallarm düğümü gelen trafiği analiz etmez.

Seçilen Wallarm dağıtım yaklaşımına ([in-line][inline-docs] veya [Out-of-Band][oob-docs]) bağlı olarak, Wallarm'ı ya trafik proxy'si olarak yapılandırın veya trafiğin aynasını işleyin.

Wallarm örneğindeki `/etc/nginx/sites-enabled/default` dosyasında aşağıdaki yapılandırmayı yapın:

=== "In-line"
    1. Wallarm'ın geçerli trafiği proxy olarak nereye yönlendireceği için bir IP adresi belirleyin. Bu bir uygulama örneğinin IP'si, yük dengeleyici, ya da DNS adı, vb. olabilir, mimarinize bağlıdır.
    
        Bunu yapmak için, `proxy_pass` değerini düzenleyin, örneğin, Wallarm geçerli istekleri `http://10.80.0.5` adresine göndermelidir:

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
    1. Wallarm düğümünün gelen trafiği analiz etmesi için, `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        İzleme modu, ilk dağıtım ve çözüm testi için önerilen moddur. Wallarm, güvenli engelleme ve engelleme modlarını da sağlar, [daha fazla bilgi için tıklayın][wallarm-mode].
=== "Out-of-Band"
    1. Wallarm düğümünün aynalanan trafiği kabul etmesi için, `server` NGINX bloğunda aşağıdaki yapılandırmayı ayarlayın:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # 222.222.222.22'yi aynalama sunucusunun adresi ile değiştirin
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * `set_real_ip_from` ve `real_ip_header` yönergeleri, Wallarm Konsol'unun saldırganların IP adreslerini [göstermesi için gereklidir][real-ip-docs].
        * `wallarm_force_response_*` yönergeleri, aynalı trafikten alınan kopyalar dışındaki tüm isteklerin analizinin devre dışı bırakılması için gereklidir.
    1. Wallarm düğümünün aynalanan trafiği analiz etmesi için, `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Zararlı istekler [engellenemez][oob-advantages-limitations], bu yüzden Wallarm'ın kabul ettiği tek [mod][wallarm-mode] izlememe modudur. In-line dağıtım için de güvenli engelleme ve engelleme modları mevcuttur ancak `wallarm_mode` yönergesini izleme modundan farklı bir değere ayarsanız bile, düğüm trafiği izlemeye devam eder ve sadece zararlı trafiği kaydeder (modun kapalı olarak ayarlanmasından başka).
