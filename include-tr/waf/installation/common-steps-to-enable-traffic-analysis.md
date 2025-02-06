Varsayılan olarak, dağıtılan Wallarm node'u gelen trafiği analiz etmez.

Seçilen Wallarm dağıtım yaklaşımına ([in-line][inline-docs] ya da [Out-of-Band][oob-docs]) bağlı olarak, Wallarm'ı trafiği proxylemek veya trafik aynasını işlemek üzere yapılandırın.

Aşağıdaki yapılandırmayı, node'un yüklü olduğu makinedeki `/etc/nginx/conf.d/default.conf` dosyasında uygulayın:

=== "In-line"
    1. Wallarm'ın meşru trafiği proxyleyeceği bir IP adresi belirleyin. Bu, mimarinize bağlı olarak bir uygulama örneğinin, yük dengeleyicisinin IP'si ya da DNS adı vb. olabilir.
    
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
    1. Wallarm node'un gelen trafiği analiz edebilmesi için, `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        Monitoring modu, ilk dağıtım ve çözüm testleri için önerilen moddur. Wallarm ayrıca safe blocking ve blocking modlarını da sunar, [read more][waf-mode-instr].
=== "Out-of-Band"
    1. Wallarm node'un aynalanan trafiği kabul etmesi için, `server` NGINX bloğunda aşağıdaki yapılandırmayı ayarlayın:

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

        * `set_real_ip_from` ve `real_ip_header` yönergeleri, Wallarm Console'un [display the IP addresses of the attackers][proxy-balancer-instr] işlemini gerçekleştirebilmesi için gereklidir.
        * `wallarm_force_response_*` yönergeleri, aynalanan trafikten alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için gereklidir.
    1. Wallarm node'un aynalanan trafiği analiz edebilmesi için, `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Kötü amaçlı istekler [bloklanamayacağı][oob-advantages-limitations] için, Wallarm'ın kabul ettiği tek [mod][waf-mode-instr] monitoring modudur. In-line dağıtım için ayrıca safe blocking ve blocking modları da bulunmaktadır, ancak `wallarm_mode` yönergesini monitoring dışında bir değere ayarlasanız bile, node trafiği izlemeye devam eder ve sadece kötü amaçlı trafiği kaydeder (off moda ayarlanmış olan hariç).