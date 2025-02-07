Depending on the deployment approach being used, perform the following settings:

=== "In-line"
    Load balancer hedeflerini Wallarm instance'ına trafik yönlendirecek şekilde güncelleyin. Detaylar için load balancer dokümantasyonuna bakınız.
=== "Out-of-Band"
    1. Gelen trafiği Wallarm node'una yansıtmak için web veya proxy sunucunuzun (ör. NGINX, Envoy) yapılandırmasını gerçekleştirin. Yapılandırma detayları için web veya proxy sunucu dokümantasyonuna bakmanızı öneririz.

        İçerisinde [link][web-server-mirroring-examples], en popüler web ve proxy sunucularının (NGINX, Traefik, Envoy) örnek yapılandırmalarını bulacaksınız.
    1. Node bulunan instance üzerindeki `/etc/nginx/sites-enabled/default` dosyasına aşağıdaki yapılandırmayı ekleyin:

        ```
        location / {
            include /etc/nginx/presets.d/mirror.conf;
            
            # 222.222.222.22 adresini yansıtma sunucusunun adresi ile değiştirin
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
        }
        ```

        Wallarm Console’un [saldırganların IP adreslerini görüntülemesi][real-ip-docs] için `set_real_ip_from` ve `real_ip_header` yönergeleri gereklidir.