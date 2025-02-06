The filtering and proxying rules are configured in the `/etc/kong/nginx-wallarm.template` file.

NGINX yapılandırma dosyalarıyla çalışmaya ilişkin ayrıntılı bilgileri görmek için, lütfen [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html) sayfasına gidin.

Wallarm yönergeleri, Wallarm filtreleme düğümünün çalışma mantığını tanımlar. Mevcut Wallarm yönergelerinin listesini görmek için, lütfen [Wallarm configuration options](../admin-en/configure-parameters-en.md) sayfasına gidin.

**Yapılandırma dosyası örneği**

Sunucuyu aşağıdaki koşullarda çalışacak şekilde yapılandırmanız gerektiğini varsayalım:
* Sadece HTTP trafiği işleniyor. HTTPS istekleri işlenmiyor.
* Aşağıdaki alan adları istek almaktadır: `example.com` ve `www.example.com`.
* Tüm istekler `10.80.0.5` sunucusuna iletilmelidir.
* Gelen tüm istekler 1MB'den küçük kabul edilir (varsayılan ayar).
* Bir isteğin işlenmesi 60 saniyeden uzun sürmemelidir (varsayılan ayar).
* Wallarm, izleme (monitor) modunda çalışmalıdır.
* İstemciler, ara bir HTTP yük dengeleyici olmaksızın doğrudan filtreleme düğümüne erişir.

Belirtilen koşulları karşılamak için, yapılandırma dosyasının içeriği aşağıdaki gibi olmalıdır:

```
    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # trafiğin işleneceği alan adları
      server_name example.com; 
      server_name www.example.com;

      # trafik işlemenin izleme modunu etkinleştir
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # istek iletimi için adresin ayarlanması
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
```