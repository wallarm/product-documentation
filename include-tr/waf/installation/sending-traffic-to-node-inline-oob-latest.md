Kullanılan dağıtım yaklaşımına bağlı olarak aşağıdaki ayarları uygulayın:

=== "Hat içi"
    Trafiği Wallarm örneğine gönderecek şekilde yük dengeleyicinizin hedeflerini güncelleyin. Ayrıntılar için lütfen yük dengeleyicinizin belgelerine bakın.
=== "Bant dışı"
    1. Gelen trafiği Wallarm node'una yansıtacak şekilde web veya proxy sunucunuzu (örn. NGINX, Envoy) yapılandırın. Yapılandırma ayrıntıları için web veya proxy sunucunuzun belgelerine başvurmanızı öneririz.

        [bağlantıda][web-server-mirroring-examples], en popüler web ve proxy sunucuları (NGINX, Traefik, Envoy) için örnek yapılandırmayı bulacaksınız.
    1. Wallarm filtering node'unun çalıştığı makinedeki `/etc/nginx/sites-enabled/default` dosyasına aşağıdaki yapılandırmayı ekleyin:

        ```
        location / {
            include /etc/nginx/presets.d/mirror.conf;
            
            # 222.222.222.22 değerini yansıtma sunucusunun adresiyle değiştirin
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
        }
        ```

        `set_real_ip_from` ve `real_ip_header` yönergeleri, Wallarm Console'un [saldırganların IP adreslerini görüntülemesini][real-ip-docs] sağlamak için gereklidir.