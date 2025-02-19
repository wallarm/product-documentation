The following files contain NGINX and filtering node settings:  
Aşağıdaki dosyalar NGINX ve filtreleme düğümü ayarlarını içerir:

* `/etc/nginx/nginx.conf` NGINX yapılandırmasını tanımlar  
* `/etc/nginx/conf.d/wallarm.conf` Wallarm filtreleme düğümünün küresel yapılandırmasını tanımlar  
* `/etc/nginx/conf.d/wallarm-status.conf` Filtreleme düğümü izleme servisi yapılandırmasını tanımlar  

NGINX ve Wallarm'ın çalışmasını tanımlamak için kendi yapılandırma dosyalarınızı oluşturabilirsiniz. Aynı şekilde işlenecek alan adları grubu için her biri ayrı bir `server` bloğu içeren bir yapılandırma dosyası oluşturmanız önerilir.

NGINX yapılandırma dosyaları ile çalışma hakkında detaylı bilgi için lütfen [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html) sayfasına göz atın.

Wallarm yönergeleri, Wallarm filtreleme düğümünün çalışma mantığını tanımlar. Mevcut Wallarm yönergelerinin listesini görmek için lütfen [Wallarm configuration options](configure-parameters-en.md) sayfasına gidin.

**Configuration file example**

Sunucuyu aşağıdaki koşullar altında çalışacak şekilde yapılandırmanız gerektiğini varsayalım:  
* Sadece HTTP trafiği işlenir. HTTPS istekleri işlenmez.  
* Aşağıdaki alan adları istek alır: `example.com` ve `www.example.com`.  
* Tüm istekler `10.80.0.5` sunucusuna yönlendirilmelidir.  
* Gelen tüm istekler 1MB'den küçük kabul edilir (varsayılan ayar).  
* Bir isteğin işlenmesi 60 saniyeden fazla sürmemelidir (varsayılan ayar).  
* Wallarm, izleme modunda çalışmalıdır.  
* İstemciler, ara bir HTTP yük dengeleyici olmadan doğrudan filtreleme düğümüne erişir.

!!! info "Creating a configuration file"  
    Özel bir NGINX yapılandırma dosyası (örneğin, `example.com.conf`) oluşturabilir veya varsayılan NGINX yapılandırma dosyasını (`default.conf`) değiştirebilirsiniz.
    
    Özel bir yapılandırma dosyası oluştururken, NGINX'in boşta olan port üzerinde gelen bağlantıları dinlediğinden emin olun.

Listelenen koşulları karşılamak için, yapılandırma dosyasının içeriği aşağıdaki gibi olmalıdır:

```
    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # the domains for which traffic is processed
      server_name example.com; 
      server_name www.example.com;

      # turn on the monitoring mode of traffic processing
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # setting the address for request forwarding
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
```