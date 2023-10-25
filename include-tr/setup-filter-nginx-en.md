Aşağıdaki dosyalar NGINX ve filtreleme düğümü ayarlarını içerir:

* `/etc/nginx/nginx.conf` NGINX'in yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm.conf` Wallarm filtreleme düğümünün genel yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm-status.conf` filtreleme düğümü izleme hizmeti yapılandırmasını tanımlar

NGINX ve Wallarm'ın çalışmasını tanımlamak için kendi yapılandırma dosyalarınızı oluşturabilirsiniz. Aynı şekilde işlenmesi gereken alan adlarının her grubu için `server` bloğu ile ayrı bir yapılandırma dosyası oluşturmanız önerilir.

NGINX yapılandırma dosyalarıyla çalışmaya ilişkin ayrıntılı bilgiler için, [resmi NGINX belgelerine](https://nginx.org/en/docs/beginners_guide.html) ilerleyin.

Wallarm direktifleri, Wallarm filtreleme düğümünün işlem mantığını tanımlar. Mevcut Wallarm direktiflerinin listesini görmek için, [Wallarm yapılandırma seçenekleri](configure-parameters-en.md) sayfasına ilerleyin.

**Yapılandırma dosyası örneği**

Sunucuyu aşağıdaki koşullarda çalışacak şekilde yapılandırmanız gerektiğini varsayalım:
* Yalnızca HTTP trafiği işlenir. HTTPS istekleri işlenmez.
* Aşağıdaki alan adları istekleri alır: `example.com` ve `www.example.com`.
* Tüm istekler `10.80.0.5` sunucusuna iletilmelidir.
* Tüm gelen isteklerin boyutu 1MB'ten küçük olarak kabul edilir (varsayılan ayar).
* Bir isteğin işlenmesi 60 saniyeden fazla sürer (varsayılan ayar).
* Wallarm izleme modunda çalışmalıdır.
* Müşteriler, ara bir HTTP yük dengeleyicisi olmadan filtreleme düğümüne doğrudan erişir.

!!! bilgi "Bir yapılandırma dosyası oluşturma"
    Özel bir NGINX yapılandırma dosyası (ör. `example.com.conf`) oluşturabilir veya varsayılan NGINX yapılandırma dosyasını (`default.conf`) değiştirebilirsiniz.
    
    Özel bir yapılandırma dosyası oluştururken, NGINX'in boştaki port üzerinden gelen bağlantıları dinlediğinden emin olun.


Belirtilen koşulları karşılamak için, yapılandırma dosyasının içeriği aşağıdaki gibi olmalıdır:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # trafik işlenen alan adları
      server_name example.com; 
      server_name www.example.com;

      # trafik işleme modunun izlemesini aç
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # istek yönlendirmesi için adres ayarı
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```