Varsayılan olarak, dağıtılan Wallarm node gelen trafiği analiz etmez.

Trafik analizini başlatmak için, Wallarm örneğindeki `/etc/nginx/sites-enabled/default` dosyasını aşağıdaki gibi değiştirin:

1. Wallarm node'un yansıtılmış trafiği kabul etmesi için, NGINX'in `server` bloğuna aşağıdaki yapılandırmayı ekleyin:

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

    - Wallarm Console'un saldırganların IP adreslerini [gösterebilmesi][real-ip-docs] için `set_real_ip_from` ve `real_ip_header` yönergeleri gereklidir.
    - Yansıtılmış trafikten alınan kopyalar dışında tüm isteklerin analizini devre dışı bırakmak için `wallarm_force_response_*` yönergeleri gereklidir.
1. Wallarm node'un yansıtılmış trafiği analiz edebilmesi için `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Kötü amaçlı istekler [engellenemez][oob-advantages-limitations] olduğundan, Wallarm'ın kabul ettiği tek [mod][wallarm-mode] monitoring'dir. Satır içi (inline) dağıtım için güvenli engelleme ve engelleme modları da vardır ancak `wallarm_mode` yönergesini monitoring'den farklı bir değere ayarlasanız bile, Wallarm node trafiği izlemeye devam eder ve yalnızca kötü amaçlı trafiği kaydeder (off olarak ayarlanan mod hariç).
1. Varsa, trafiğin yerel dosya müdahalesi olmadan Wallarm'a yönlendirilmesini sağlamak için NGINX lokasyonlarından `try_files` yönergesini kaldırın:
    
    ```diff
    server {
        ...
        location / {
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```