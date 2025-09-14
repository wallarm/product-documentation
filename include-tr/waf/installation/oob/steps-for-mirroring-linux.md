Varsayılan olarak, dağıtılan Wallarm node gelen trafiği analiz etmez.

Yüklü node bulunan makinede, Wallarm’ın yansıtılmış trafiği işlemesi için `/etc/nginx/conf.d/default.conf` dosyasında aşağıdaki yapılandırmayı uygulayın:

1. Wallarm node’un yansıtılmış trafiği kabul etmesi için `server` NGINX bloğunda aşağıdaki yapılandırmayı yapın:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # 222.222.222.22 değerini yansıtma sunucusunun adresiyle değiştirin
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * `set_real_ip_from` ve `real_ip_header` yönergeleri, Wallarm Console’un [saldırganların IP adreslerini görüntülemesi][proxy-balancer-instr] için gereklidir.
    * `wallarm_force_response_*` yönergeleri, yansıtılmış trafikten alınan kopyalar dışında tüm isteklerin analizini devre dışı bırakmak için gereklidir.
1. Wallarm node’un yansıtılmış trafiği analiz etmesi için `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Kötü amaçlı istekler [engellenemez][oob-advantages-limitations] olduğundan, Wallarm’ın kabul ettiği tek [kip][waf-mode-instr] monitoring’dir. In-line dağıtım için güvenli engelleme ve engelleme kipleri de vardır, ancak `wallarm_mode` yönergesini monitoring’den farklı bir değere ayarlasanız bile, node trafiği izlemeye devam eder ve yalnızca kötü amaçlı trafiği kaydeder (off olarak ayarlanmış kip hariç).