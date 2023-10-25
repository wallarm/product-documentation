Filtreleme ve proxy kuralları, `/etc/kong/nginx-wallarm.template` dosyasında yapılır.

NGINX yapılandırma dosyalarıyla nasıl çalışılacağına dair detaylı bilgileri görüntülemek için [resmi NGINX belgelendirmesine](https://nginx.org/en/docs/beginners_guide.html) devam edin.

Wallarm yönergeleri, Wallarm filtreleme düğümünün işlem mantığını tanımlar. Mevcut Wallarm yönergelerinin listesini görmek için [Wallarm yapılandırma seçeneklerini](../admin-en/configure-parameters-en.md) ziyaret edin.

**Yapılandırma Dosyası Örneği**

Aşağıdaki koşullarda çalışacak bir sunucuyu yapılandırmanız gerektiğini varsayalım:
* Yalnızca HTTP trafiği işlenir. HTTPS istekleri işlenmez.
* İstek alan aşağıdaki alanlar: `example.com` ve `www.example.com`.
* Tüm istekler `10.80.0.5` sunucusuna iletilmelidir.
* Gelen tüm isteklerin boyutu 1MB'den küçük olarak kabul edilir (varsayılan ayar).
* Bir isteğin işlenmesi en fazla 60 saniye sürer (varsayılan ayar).
* Wallarm, izleme modunda çalışmalıdır.
* İstemciler, ara bir HTTP yük dengeleyicisi olmadan filtreleme düğümüne doğrudan erişir.

Listelenen koşulları karşılamak için, yapılandırma dosyasının içeriği aşağıdaki gibi olmalıdır:

```
    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # trafik işlenen alanlar
      server_name example.com; 
      server_name www.example.com;

      # trafik işleme modunun izlenmesini aç
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # istek yönlendirmesi için adresin ayarlanması
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
```