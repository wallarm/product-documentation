Varsayılan olarak, dağıtılmış Wallarm düğümü gelen trafiği analiz etmez.

Trafik analizini başlatmak için, Wallarm örneğindeki `/etc/nginx/sites-enabled/default` dosyasını aşağıdaki gibi değiştirin:

1. Wallarm düğümünün aynalanan trafiği kabul etmesi için, `server` NGINX bloğunda aşağıdaki yapılandırmayı ayarlayın:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # 222.222.222.22'yi aynalama sunucusunun adresine değiştirin
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * `set_real_ip_from` ve `real_ip_header` direktifleri, Wallarm Konsolunun saldırganların [IP adreslerini görüntülemesini][real-ip-docs] sağlamak için gereklidir.
    * `wallarm_force_response_*` direktifleri, aynalanan trafikten alınan kopyalar dışında tüm isteklerin analizini devre dışı bırakmak için gereklidir.
1. Wallarm düğümünün aynalanan trafiği analiz etmesi için, `wallarm_mode` direktifini `monitoring`'e ayarlayın:
 
    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Zararlı istekler [engellenemez][oob-advantages-limitations], bu yüzden Wallarm'ın kabul ettiği tek [mod][wallarm-mode] izleme modudur. İn-line dağıtım için ayrıca güvenli engelleme ve engelleme modları vardır ama `wallarm_mode` direktifini izlemeden farklı bir değere ayarlamanız durumunda bile, düğüm trafiği izlemeye devam eder ve yalnızca zararlı trafiği kaydeder (mod off olarak ayarlandıysa).