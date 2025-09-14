Varsayılan olarak, dağıtılan Wallarm node gelen trafiği analiz etmez.

Kurulu node'un bulunduğu makinede Wallarm'ın trafik yansısını işlemesi için NGINX [yapılandırma dosyasında](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) aşağıdaki yapılandırmayı uygulayın:

1. Wallarm node'un yansıtılan trafiği kabul etmesi için, NGINX'in `server` bloğunda aşağıdaki yapılandırmayı yapın:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # 222.222.222.22 adresini yansıtma sunucusunun adresiyle değiştirin
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * Wallarm Console'da [saldırganların IP adreslerini görüntülemek][proxy-balancer-instr] için `set_real_ip_from` ve `real_ip_header` yönergeleri gereklidir.
    * Yansıtılan trafikten alınan kopyalar haricindeki tüm isteklerin analizini devre dışı bırakmak için `wallarm_force_response_*` yönergeleri gereklidir.
1. Wallarm node'un yansıtılan trafiği analiz etmesi için, `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Kötü amaçlı istekler [engellenemez][oob-advantages-limitations], bu nedenle Wallarm'ın kabul ettiği tek [mod][waf-mode-instr] monitoring'dir. In-line dağıtım için Safe blocking ve blocking modları da vardır ancak `wallarm_mode` yönergesini monitoring dışında bir değere ayarlasanız bile, node trafiği izlemeye devam eder ve yalnızca kötü amaçlı trafiği kaydeder (off olarak ayarlanan mod dışında).
1. Varsa, trafiğin yerel dosya müdahalesi olmadan Wallarm'a yönlendirildiğinden emin olmak için NGINX location'larından `try_files` yönergesini kaldırın:
    
    ```diff
    server {
        ...
        location / {
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```