By default, the deployed Wallarm node does not analyze incoming traffic.

Varsayılan olarak, dağıtılmış Wallarm düğümü gelen trafiği analiz etmez.

Depending on the selected Wallarm deployment approach ([in-line][inline-docs] or [Out-of-Band][oob-docs]), configure Wallarm to either proxy traffic or process the traffic mirror.

Seçilen Wallarm dağıtım yaklaşımına ([in-line][inline-docs] veya [Out-of-Band][oob-docs]) bağlı olarak, Wallarm’ı trafiği proxylemek veya trafik aynasını işlemek üzere yapılandırın.

Perform the following configuration in the `/etc/nginx/sites-enabled/default` file on the Wallarm instance:

Wallarm örneğinde `/etc/nginx/sites-enabled/default` dosyasında aşağıdaki yapılandırmayı uygulayın:

=== "In-line"
    1. Set an IP address for Wallarm to proxy legitimate traffic to. It can be an IP of an application instance, load balancer, or DNS name, etc., depending on your architecture.
    
        To do so, edit the `proxy_pass` value, e.g. Wallarm should send legitimate requests to `http://10.80.0.5`:

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
    1. For the Wallarm node to analyze the incoming traffic, set the `wallarm_mode` directive to `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        The monitoring mode is the recommended one for the first deployment and solution testing. Wallarm provides safe blocking and blocking modes as well, [read more][wallarm-mode].

=== "In-line"
    1. Wallarm’ın meşru trafiği proxylemesi için bir IP adresi belirleyin. Bu, mimarinize bağlı olarak bir uygulama örneğinin, yük dengeleyicinin veya DNS adının IP’si olabilir.
    
        Bunu yapmak için, `proxy_pass` değerini düzenleyin, örneğin Wallarm meşru istekleri `http://10.80.0.5` adresine göndermelidir:

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
    
        İzleme modu (monitoring mode), ilk dağıtım ve çözüm testi için önerilen moddur. Wallarm ayrıca safe blocking ve blocking modlarını da sağlar, [read more][wallarm-mode].

=== "Out-of-Band"
    1. For the Wallarm node to accept mirrored traffic, set the following configuration in the `server` NGINX block:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # Change 222.222.222.22 to the address of the mirroring server
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * The `set_real_ip_from` and `real_ip_header` directives are required to have Wallarm Console [display the IP addresses of the attackers][real-ip-docs].
        * The `wallarm_force_response_*` directives are required to disable analysis of all requests except for copies received from the mirrored traffic.
    1. For the Wallarm node to analyze the mirrored traffic, set the `wallarm_mode` directive to `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Since malicious requests [cannot][oob-advantages-limitations] be blocked, the only [mode][wallarm-mode] Wallarm accepts is monitoring. For in-line deployment, there are also safe blocking and blocking modes but even if you set the `wallarm_mode` directive to a value different from monitoring, the node continues to monitor traffic and only record malicious traffic (aside from the mode set to off).

=== "Out-of-Band"
    1. Wallarm düğümünün aynalanan trafiği kabul edebilmesi için, `server` NGINX bloğu içinde aşağıdaki yapılandırmayı ayarlayın:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # Change 222.222.222.22 to the address of the mirroring server
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * `set_real_ip_from` ve `real_ip_header` yönergeleri, Wallarm Console’ın [display the IP addresses of the attackers][real-ip-docs] yapabilmesi için gereklidir.
        * `wallarm_force_response_*` yönergeleri, aynalanan trafikten alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için gereklidir.
    1. Wallarm düğümünün aynalanan trafiği analiz etmesi için `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Kötü amaçlı istekler [engellenemediği][oob-advantages-limitations] için, Wallarm’ın kabul ettiği tek [mod][wallarm-mode] izleme modudur. In-line dağıtımda safe blocking ve blocking modları da bulunmasına rağmen, `wallarm_mode` yönergesini monitoring dışında bir değere ayarlasanız bile, düğüm trafiği izlemeye devam eder ve sadece kötü amaçlı trafiği kaydeder (kapalı mod dışında).