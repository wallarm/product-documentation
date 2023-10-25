Aşağıdaki dosyalar, NGINX ve filtreleme düğümü ayarlarını içerir:

* `/etc/nginx/nginx.conf`, NGINX'in yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm.conf`, Wallarm filtreleme düğümünün genel yapılandırmasını tanımlar
* `/etc/nginx/conf.d/wallarm-status.conf`, filtreleme düğümü izleme hizmeti yapılandırmasını tanımlar

NGINX ve Wallarm'ın işlemlerini tanımlamak için kendi yapılandırma dosyalarınızı oluşturabilirsiniz. Aynı şekilde işlenmesi gereken her alan adı grubu için `server` bloğuyla ayrı bir yapılandırma dosyası oluşturmanız önerilir.

NGINX yapılandırma dosyalarıyla çalışma hakkında ayrıntılı bilgi için, [resmi NGINX belgelendirmesine](https://nginx.org/en/docs/beginners_guide.html) devam edin.

Wallarm direktifleri, Wallarm filtreleme düğümünün işlem mantığını tanımlar. Kullanılabilir Wallarm direktiflerinin listesini görmek için, [Wallarm yapılandırma seçenekleri](configure-parameters-en.md) sayfasına devam edin.

**Yapılandırma dosyası örneği**

Sunucuyu aşağıdaki koşullarda çalışacak şekilde yapılandırmanız gerektiğini varsayalım:
* Sadece HTTP trafiği işlenmektedir. HTTPS talepleri işlenmemektedir.
* Talepleri alan alan adları: `example.com` ve `www.example.com`.
* Tüm talepler `10.80.0.5` sunucusuna iletilmelidir.
* Gelen tüm istekler 1MB'tan daha küçük boyutta olarak kabul edilir (varsayılan ayar).
* Bir isteğin işlenmesi en fazla 60 saniye sürer (varsayılan ayar).
* Wallarm, izleme modunda çalışmalıdır.
* Kullanıcılar, filtreme düğümüne bir HTTP yük dengeleyici olmadan doğrudan erişirler.

!!! bilgi "Bir yapılandırma dosyası oluşturma"
    Özel bir NGINX yapılandırma dosyası (ör. `example.com.conf`) oluşturabilir veya varsayılan NGINX yapılandırma dosyasını (`default.conf`) değiştirebilirsiniz.
    
    Özel bir yapılandırma dosyası oluştururken, NGINX'in gelen bağlantıları boş bir portta dinlediğini kontrol edin.


Belirtilen koşulları karşılamak için, yapılandırma dosyasının içeriği aşağıdaki gibi olmalıdır:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # trafiğin işlendiği alan adları
      server_name example.com; 
      server_name www.example.com;

      # trafiğin izleme modunda işlenmesini açın
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # istek yönlendirmesi için adres ayarı
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```