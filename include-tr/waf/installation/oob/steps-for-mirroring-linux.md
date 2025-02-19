By default, dağıtılan Wallarm node'u gelen trafiği analiz etmez.

Wallarm'ın trafik aynalama işlemesini yapılandırmak için, node'un yüklü olduğu makinedeki `/etc/nginx/conf.d/default.conf` dosyasında aşağıdaki yapılandırmayı gerçekleştirin:

1. Wallarm node'unun aynalanmış trafiği kabul etmesi için, `server` NGINX bloğunda aşağıdaki yapılandırmayı ayarlayın:

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

    * Wallarm Console'un [saldırganların IP adreslerini görüntüleyebilmesi][proxy-balancer-instr] için `set_real_ip_from` ve `real_ip_header` yönergeleri gereklidir.
    * Aynalanmış trafikten alınan kopyaların dışındaki tüm isteklerin analizini devre dışı bırakmak için `wallarm_force_response_*` yönergeleri gereklidir.
1. Wallarm node'unun aynalanmış trafiği analiz edebilmesi için, `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

Kötü niyetli istekler [engellenemez][oob-advantages-limitations] olduğundan, Wallarm'ın kabul ettiği tek [mod][waf-mode-instr] monitoring'dir. İn-line dağıtım için, güvenli engelleme ve engelleme modları da bulunmaktadır ancak `wallarm_mode` yönergesini monitoring'den farklı bir değere ayarlasanız bile, node trafiği izlemeye devam eder ve yalnızca kötü niyetli trafiği kaydeder (kapalı moda ayarlanmış olanlar hariç).