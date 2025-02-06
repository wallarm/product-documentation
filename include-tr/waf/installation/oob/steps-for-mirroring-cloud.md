By default, dağıtılan Wallarm node'u gelen trafiği analiz etmez.

Trafik analizini başlatmak için, Wallarm örneğinde bulunan `/etc/nginx/sites-enabled/default` dosyasını aşağıdaki gibi değiştirin:

1. Wallarm node'un ayna trafiğini kabul edebilmesi için, `server` NGINX bloğu içerisinde aşağıdaki yapılandırmayı ayarlayın:

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

    * `set_real_ip_from` ve `real_ip_header` direktiflerinin, Wallarm Console'ın saldırganların IP adreslerini [display the IP addresses of the attackers][real-ip-docs] göstermesi için gerekli olduğu unutulmamalıdır.
    * `wallarm_force_response_*` direktifleri, ayna trafiğinden alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için gereklidir.
1. Wallarm node'un ayna trafiği analiz edebilmesi için, `wallarm_mode` direktifini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Kötü amaçlı istekler [cannot][oob-advantages-limitations] engellenemediğinden, Wallarm'ın kabul ettiği tek [mode][wallarm-mode] monitoring'dir. In-line dağıtım için safe blocking ve blocking modları da bulunmakla birlikte, `wallarm_mode` direktifini monitoring dışındaki bir değere ayarlasanız bile, node trafiği izlemeye devam eder ve sadece kötü amaçlı trafiği kaydeder (off modunun dışındaki).
1. Eğer mevcutsa, trafiğin yerel dosya müdahalesi olmaksızın Wallarm'a yönlendiğinden emin olmak için NGINX lokasyonlarından `try_files` direktifini kaldırın:
    
    ```diff
    server {
        ...
        location / {
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```