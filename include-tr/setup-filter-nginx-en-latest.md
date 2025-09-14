Aşağıdaki dosyalar NGINX ve filtreleme düğümü ayarlarını içerir:

* `/etc/nginx/nginx.conf` NGINX yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm.conf` Wallarm filtreleme düğümünün genel yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm-status.conf` filtreleme düğümü izleme hizmeti yapılandırmasını tanımlar

NGINX ve Wallarm'ın çalışma şeklini tanımlamak için kendi yapılandırma dosyalarınızı oluşturabilirsiniz. Aynı şekilde işlenmesi gereken her bir etki alanı grubu için `server` bloğuna sahip ayrı bir yapılandırma dosyası oluşturmanız önerilir.

NGINX yapılandırma dosyalarıyla çalışma hakkında ayrıntılı bilgi için [resmi NGINX belgelerine](https://nginx.org/en/docs/beginners_guide.html) bakın.

Wallarm yönergeleri, Wallarm filtreleme düğümünün çalışma mantığını tanımlar. Kullanılabilir Wallarm yönergelerinin listesi için [Wallarm yapılandırma seçenekleri](configure-parameters-en.md) sayfasına bakın.

**Yapılandırma dosyası örneği**

Varsayalım ki sunucuyu aşağıdaki koşullarda çalışacak şekilde yapılandırmanız gerekiyor:
* Yalnızca HTTP trafiği işlenir. HTTPS istekleri işlenmez.
* İstekleri aşağıdaki etki alanları alır: `example.com` ve `www.example.com`.
* Tüm istekler `10.80.0.5` sunucusuna iletilmelidir.
* Tüm gelen isteklerin boyutu 1 MB'tan küçük kabul edilir (varsayılan ayar).
* Bir isteğin işlenmesi 60 saniyeden fazla sürmez (varsayılan ayar).
* Wallarm izleme modunda çalışmalıdır.
* İstemciler, arada bir HTTP yük dengeleyicisi olmadan doğrudan filtreleme düğümüne erişir.

!!! info "Bir yapılandırma dosyası oluşturma"
    Özel bir NGINX yapılandırma dosyası (ör. `example.com.conf`) oluşturabilir veya varsayılan NGINX yapılandırma dosyasını (`default.conf`) değiştirebilirsiniz.
    
    Özel bir yapılandırma dosyası oluştururken, NGINX'in gelen bağlantıları kullanılmayan bir bağlantı noktasında dinlediğinden emin olun.


Listelenen koşulları karşılamak için yapılandırma dosyasının içeriği aşağıdaki gibi olmalıdır:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # trafiğin işlendiği etki alanları
      server_name example.com; 
      server_name www.example.com;

      # trafik işleme için izleme modunu aç
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # istek yönlendirme adresinin ayarlanması
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```