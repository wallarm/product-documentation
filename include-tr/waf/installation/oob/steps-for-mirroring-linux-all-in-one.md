By default, the deployed Wallarm node does not analyze incoming traffic.  
Varsayılan olarak, dağıtılan Wallarm node'u gelen trafiği analiz etmez.

Perform the following configuration in the NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) on the machine with the installed node to configure Wallarm to process the traffic mirror:  
Yüklü node'un bulunduğu makinedeki NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) dosyasında aşağıdaki yapılandırmayı gerçekleştirerek Wallarm'ın trafik aynasını işlemesini yapılandırın:

1. For the Wallarm node to accept mirrored traffic, set the following configuration in the `server` NGINX block:  
   Wallarm node'un aynalanmış trafiği kabul edebilmesi için, aşağıdaki yapılandırmayı NGINX `server` bloğuna ekleyin:

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

    * The `set_real_ip_from` and `real_ip_header` directives are required to have Wallarm Console [display the IP addresses of the attackers][proxy-balancer-instr].  
      Wallarm Console'ın saldırganların IP adreslerini [display the IP addresses of the attackers][proxy-balancer-instr] göstermesi için `set_real_ip_from` ve `real_ip_header` yönergeleri gereklidir.
    * The `wallarm_force_response_*` directives are required to disable analysis of all requests except for copies received from the mirrored traffic.  
      Aynalanmış trafiğin kopyaları dışındaki tüm isteklerin analizini devre dışı bırakmak için `wallarm_force_response_*` yönergeleri gereklidir.

2. For the Wallarm node to analyze the mirrored traffic, set the `wallarm_mode` directive to `monitoring`:  
   Wallarm node'un aynalanan trafiği analiz edebilmesi için, `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Since malicious requests [cannot][oob-advantages-limitations] be blocked, the only [mode][waf-mode-instr] Wallarm accepts is monitoring. For in-line deployment, there are also safe blocking and blocking modes but even if you set the `wallarm_mode` directive to a value different from monitoring, the node continues to monitor traffic and only record malicious traffic (aside from the mode set to off).  
    Kötü niyetli isteklerin [engellenemeyeceği][oob-advantages-limitations] göz önüne alındığında, Wallarm'ın kabul ettiği tek [mod][waf-mode-instr] monitoring'dir. In-line dağıtımda safe blocking ve blocking modları da bulunmakla birlikte, `wallarm_mode` yönergesini monitoring dışında bir değere ayarlasanız bile, node trafiği izlemeye devam eder ve yalnızca kötü niyetli trafiği kaydeder (off modu hariç).

3. If present, remove the `try_files` directive from the NGINX locations to ensure traffic is directed to Wallarm without local file interference:  
   Trafiğin yerel dosya müdahalesi olmadan Wallarm'a yönlendirildiğinden emin olmak için, mevcutsa NGINX location bloklarındaki `try_files` yönergesini kaldırın:
    
    ```diff
    server {
        ...
        location / {
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```