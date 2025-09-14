Varsayılan olarak, dağıtılan Wallarm düğümü gelen trafiği analiz etmez.

Seçilen Wallarm dağıtım yaklaşımına ([satır içi][inline-docs] veya [Bant Dışı][oob-docs]) bağlı olarak, Wallarm'ı ya trafiği proxy üzerinden iletecek ya da trafik yansımasını işleyecek şekilde yapılandırın.

Wallarm örneğinde `/etc/nginx/sites-enabled/default` dosyasında aşağıdaki yapılandırmayı gerçekleştirin:

=== "Satır içi"
    1. Wallarm'ın meşru trafiği proxy üzerinden ileteceği hedef IP adresini ayarlayın. Mimarinize bağlı olarak bu, bir uygulama örneğinin IP'si, bir yük dengeleyici ya da bir DNS adı vb. olabilir.
    
        Bunu yapmak için `proxy_pass` değerini düzenleyin, örneğin Wallarm meşru istekleri `http://10.80.0.5` adresine göndermelidir:

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
    1. Wallarm düğümünün gelen trafiği analiz edebilmesi için, `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        Monitoring modu ilk dağıtım ve çözümün test edilmesi için önerilir. Wallarm ayrıca Safe blocking ve blocking modlarını da sunar, [daha fazlasını okuyun][wallarm-mode].
=== "Bant Dışı"
    1. Wallarm düğümünün yansıtılan trafiği kabul edebilmesi için, NGINX `server` bloğunda aşağıdaki yapılandırmayı ayarlayın:

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

        * Wallarm Console'un [saldırganların IP adreslerini görüntülemesi][real-ip-docs] için `set_real_ip_from` ve `real_ip_header` yönergeleri gereklidir.
        * Yansıtılan trafikten alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için `wallarm_force_response_*` yönergeleri gereklidir.
    1. Wallarm düğümünün yansıtılan trafiği analiz etmesi için, `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Kötü amaçlı istekler [bloklanamaz][oob-advantages-limitations], bu nedenle Wallarm'ın kabul ettiği tek [mod][wallarm-mode] monitoring'dir. Satır içi dağıtım için Safe blocking ve blocking modları da vardır; ancak `wallarm_mode` yönergesini monitoring'den farklı bir değere ayarlasanız bile düğüm trafiği izlemeye devam eder ve yalnızca kötü amaçlı trafiği kaydeder (off moduna ayarlanmış olması durumu hariç).