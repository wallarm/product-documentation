The following files contain NGINX and filtering node settings: dosyalarını içeren NGINX ve filtering node ayarlarını içeren dosyalar şunlardır:

* `/etc/nginx/nginx.conf` dosyası NGINX yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm.conf` dosyası Wallarm filtering node'un küresel yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm-status.conf` dosyası filtering node izleme servisi yapılandırmasını tanımlar

NGINX ve Wallarm'ın çalışma şeklini tanımlamak için kendi yapılandırma dosyalarınızı oluşturabilirsiniz. Aynı şekilde işlenmesi gereken domain grupları için `server` bloğuna sahip ayrı bir yapılandırma dosyası oluşturulması önerilir.

NGINX yapılandırma dosyalarıyla ilgili detaylı bilgi için [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html) sayfasına gidin.

Wallarm yönergeleri, Wallarm filtering node'un çalışma mantığını tanımlar. Mevcut Wallarm yönergelerinin listesini görmek için [Wallarm configuration options](configure-parameters-en.md) sayfasına gidin.

**Yapılandırma dosyası örneği**

Sunucuyu aşağıdaki koşullar altında çalışacak şekilde yapılandırmanız gerektiğini varsayalım:
* Yalnızca HTTP trafiği işlenir. Hiçbir HTTPS isteği işlenmez.
* Aşağıdaki domainlere isteği ulaşır: `example.com` ve `www.example.com`.
* Tüm istekler `10.80.0.5` sunucusuna iletilmelidir.
* Tüm gelen istekler 1MB'dan küçük kabul edilir (varsayılan ayar).
* Bir isteğin işlenmesi en fazla 60 saniye sürer (varsayılan ayar).
* Wallarm, monitor modunda çalışmalıdır.
* İstemciler, ara bir HTTP load balancer olmaksızın filtering node'a doğrudan erişir.

!!! info "Bir yapılandırma dosyası oluşturma"
    Özel bir NGINX yapılandırma dosyası (ör. `example.com.conf`) oluşturabilir veya varsayılan NGINX yapılandırma dosyasını (`default.conf`) değiştirebilirsiniz.
    
    Özel bir yapılandırma dosyası oluştururken, NGINX'in gelen bağlantıları boşta olan bir port üzerinden dinlediğinden emin olun.

Belirtilen koşulları karşılamak için yapılandırma dosyasının içeriği aşağıdaki gibi olmalıdır:

```
    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # işlenen trafiğin domainleri
      server_name example.com; 
      server_name www.example.com;

      # trafik işleme izleme modunu aç
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # istek yönlendirme adresi ayarı
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
```