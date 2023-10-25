Varsayılan olarak, dağıtılan Wallarm düğümü gelen trafiği analiz etmez.

Trafik aynasını işlemek için Wallarm'ı yapılandırmak üzere yüklü düğümle birlikte olan `/etc/nginx/conf.d/default.conf` dosyasında aşağıdaki yapılandırmayı gerçekleştirin:

1. Wallarm düğümünün aynalanmış trafiği kabul etmesi için `server` NGINX bloğunda aşağıdaki yapılandırmayı ayarlayın:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # 222.222.222.22'yi aynalama sunucusunun adresiyle değiştirin
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * `set_real_ip_from` ve `real_ip_header` direktifleri, Wallarm Console'un saldırganların IP adreslerini [görüntülemesi için][proxy-balancer-instr] gereklidir.
    * `wallarm_force_response_*` direktifleri, aynalanmış trafikten alınan kopyalar dışında tüm isteklerin analizini devre dışı bırakmak için gereklidir.
1. Wallarm düğümünün aynalanmış trafiği analiz etmesi için `wallarm_mode` direktifini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Zararlı istekler [engellenemez][oob-advantages-limitations], bu yüzden Wallarm'ın kabul ettiği tek [mod][waf-mode-instr] izleme modudur. Satır içi dağıtım için, güvenli engelleme ve engelleme modları da vardır ancak `wallarm_mode` direktifini izlemeden farklı bir değere ayarlarsanız, düğüm trafiği izlemeye devam eder ve sadece zararlı trafiği kaydeder (modun kapalıya ayarlanmasından bağımsız olarak).