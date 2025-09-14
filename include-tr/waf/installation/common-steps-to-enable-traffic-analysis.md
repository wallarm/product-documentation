Varsayılan olarak, dağıtılmış Wallarm düğümü gelen trafiği analiz etmez.

Seçilen Wallarm dağıtım yaklaşımına ([Hat içi][inline-docs] veya [Bant Dışı][oob-docs]) bağlı olarak, Wallarm'ı ya trafiği proxy üzerinden geçirmek ya da trafik yansısını işlemek için yapılandırın.

Yüklü düğüm bulunan makinede `/etc/nginx/conf.d/default.conf` dosyasında aşağıdaki yapılandırmayı gerçekleştirin:

=== "Hat içi"
    1. Wallarm'ın meşru trafiği ileteceği bir IP adresi belirleyin. Mimarinizdeki uygulama örneğinin IP’si, yük dengeleyici veya DNS adı vb. olabilir.
    
        Bunu yapmak için `proxy_pass` değerini düzenleyin, örn. Wallarm meşru istekleri `http://10.80.0.5` adresine göndermelidir:

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
    1. Wallarm düğümünün gelen trafiği analiz etmesi için `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        İzleme modu, ilk dağıtım ve çözümün test edilmesi için önerilir. Wallarm ayrıca güvenli engelleme ve engelleme modlarını da sunar, [daha fazla bilgi edinin][waf-mode-instr].
=== "Bant Dışı"
    1. Wallarm düğümünün yansıtılmış trafiği kabul etmesi için `server` NGINX bloğunda aşağıdaki yapılandırmayı ayarlayın:

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

        * Wallarm Console’un [saldırganların IP adreslerini görüntüleyebilmesi][proxy-balancer-instr] için `set_real_ip_from` ve `real_ip_header` yönergeleri gereklidir.
        * `wallarm_force_response_*` yönergeleri, yansıtılmış trafikten alınan kopyalar haricindeki tüm isteklerin analizini devre dışı bırakmak için gereklidir.
    1. Wallarm düğümünün yansıtılmış trafiği analiz etmesi için `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Kötü amaçlı istekler [engellenemez][oob-advantages-limitations] olduğundan, Wallarm’ın kabul ettiği tek [mod][waf-mode-instr] izleme modudur. Hat içi dağıtımda güvenli engelleme ve engelleme modları da vardır, ancak `wallarm_mode` yönergesini izleme dışında bir değere ayarlasanız bile, düğüm trafiği izlemeye ve yalnızca kötü amaçlı trafiği kaydetmeye devam eder (modun off olarak ayarlanması durumu hariç).