Varsayılan olarak, dağıtılan Wallarm düğümü gelen trafiği analiz etmez.

Trafik aynasını işlemek için Wallarm'ı yapılandırmak üzere, yüklü düğümle birlikte olan makinedeki NGINX [yapılandırma dosyası](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) üzerinde aşağıdaki yapılandırmayı gerçekleştirin:

1. Wallarm düğümünün aynalanan trafiği kabul etmesi için, aşağıdaki yapılandırmayı `sunucu` NGINX bloğunda ayarlayın:

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

    * `set_real_ip_from` ve `real_ip_header` direktifleri, Wallarm Konsolunun [saldırganların IP adreslerini görüntülemesi](proxy-balancer-instr) için gereklidir.
    * `wallarm_force_response_*` direktifleri, aynalanan trafikten alınan kopyalar dışında tüm isteklerin analizini devre dışı bırakmak için gereklidir.
1. Wallarm düğümünün aynalanan trafiği analiz etmesi için, `wallarm_mode` direktifini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Zararlı istekler engellenemez, Wallarm tarafından kabul edilen tek [mod](waf-mode-instr) izleme modudur. Doğrudan hizmete alım için de güvenli engelleme ve engelleme modları mevcut olsa da, `wallarm_mode` direktifini izleme modundan farklı bir değere ayarlarsanız düğüm trafiği izlemeye devam eder ve sadece zararlı trafiği kaydeder (mod off ayarına dışında).