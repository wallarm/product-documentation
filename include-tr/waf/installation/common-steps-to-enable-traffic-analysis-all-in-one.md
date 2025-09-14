Varsayılan olarak, dağıtılan Wallarm Node gelen trafiği analiz etmez.

Trafik analizini etkinleştirmek için aşağıdaki yapılandırmayı uygulayın:

=== "Hat İçi"
    Wallarm Node'u [hat içi][inline-docs] trafik analizi ve meşru trafiğin proxy'lenmesi için dağıtıyorsanız, genellikle `/etc/nginx/sites-available/default` konumunda bulunan [NGINX yapılandırma dosyasını](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) güncelleyin.
    
    Aşağıdaki asgari yapılandırma düzenlemeleri gereklidir:

    1. Wallarm Node için `wallarm_mode monitoring;` ayarlayın. Bu kip, ilk dağıtımlar ve test için önerilir.
    
        Wallarm ayrıca engelleme ve güvenli engelleme gibi daha fazla kipi de destekler, bunlar hakkında [daha fazla bilgi edinin][waf-mode-instr].
    1. Gerekli konumlarda `proxy_pass` yönergesini ekleyerek düğümün meşru trafiği nereye ileteceğini belirleyin. Bu, bir uygulama sunucusunun IP'sine, bir yük dengeleyiciye veya bir DNS adına olabilir.
    1. Varsa, trafiğin yerel dosya müdahalesi olmadan Wallarm'a yönlendirildiğinden emin olmak için değiştirilmiş konumlardan `try_files` yönergesini kaldırın.

    ```diff
    server {
        ...
    +   wallarm_mode monitoring;
        location / { 
    +        proxy_pass http://example.com;
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```
=== "Bant Dışı"
    Wallarm Node'u [bant dışı][oob-docs] trafik analizi için dağıtıyorsanız, genellikle `/etc/nginx/sites-available/default` konumunda bulunan [NGINX yapılandırma dosyasını](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) güncelleyin.

    Aşağıdaki asgari yapılandırma düzenlemeleri gereklidir:

    1. Wallarm düğümünün yansıtılmış trafiği kabul etmesi için `server` NGINX bloğunda aşağıdaki yapılandırmayı ayarlayın:

        ```
        server {
            listen 80;
            ...

            wallarm_force server_addr $http_x_server_addr;
            wallarm_force server_port $http_x_server_port;
            # 222.222.222.22 değerini yansıtma sunucusunun adresiyle değiştirin
            #set_real_ip_from  222.222.222.22;
            #real_ip_header    X-Forwarded-For;
            #real_ip_recursive on;
            wallarm_force response_status 0;
            wallarm_force response_time 0;
            wallarm_force response_size 0;
        }
        ```

        * Wallarm Console'un saldırganların IP adreslerini [görüntüleyebilmesi][proxy-balancer-instr] için `set_real_ip_from` ve `real_ip_header` yönergeleri gereklidir.
        * `wallarm_force_response_*` yönergeleri, yansıtılmış trafikten alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için gereklidir.
    1. Wallarm düğümünün yansıtılmış trafiği analiz edebilmesi için `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Kötü amaçlı istekler [engellenemediği][oob-advantages-limitations] için, Wallarm'ın kabul ettiği tek [kip][waf-mode-instr] monitoring'dir. Hat içi dağıtım için güvenli engelleme ve engelleme kipleri de vardır, ancak `wallarm_mode` yönergesini monitoring dışında bir değere ayarlasanız bile düğüm trafiği izlemeye devam eder ve yalnızca kötü amaçlı trafiği kaydeder (kapalı moda ayarlama durumu dışında).
    1. Varsa, trafiğin yerel dosya müdahalesi olmadan Wallarm'a yönlendirildiğinden emin olmak için NGINX konumlarından `try_files` yönergesini kaldırın:
        
        ```diff
        server {
            ...
            location / {
        -        # try_files $uri $uri/ =404;
            }
            ...
        }
        ```

Özel trafik yönlendirme kurallarınıza ve gereksinimlerinize bağlı olarak, gerekirse hem [NGINX](https://nginx.org/en/docs/dirindex.html) hem de [Wallarm yapılandırmalarını][waf-directives-instr] daha fazla özelleştirin.