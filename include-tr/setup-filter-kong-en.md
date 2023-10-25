Filtreleme ve proxy kuralları `/etc/kong/nginx-wallarm.template` dosyasında yapılandırılmıştır.

NGINX yapılandırma dosyaları ile çalışma hakkında detaylı bilgi almak için, [resmi NGINX belgelerine](https://nginx.org/en/docs/beginners_guide.html) geçiş yapın.

Wallarm direktifleri, Wallarm filtreleme düğümünün işlemleri belirler. Kullanılabilir Wallarm direktiflerinin listesini görmek için, [Wallarm yapılandırma seçenekleri](../admin-en/configure-parameters-en.md) sayfasına ilerleyin.

**Yapılandırma dosyası örneği**

Aşağıdaki koşullarda çalışacak bir sunucuyu yapılandırmanız gerektiğini varsayalım:
* Yalnızca HTTP trafiği işlenir. HTTPS istekleri işlenmez.
* Aşağıdaki alan adları istekleri alır: `example.com` ve `www.example.com`.
* Tüm istekler `10.80.0.5` sunucusuna iletilmelidir.
* Gelen tüm isteklerin boyutu 1MB'tan küçük olarak düşünülür (varsayılan ayar).
* Bir isteğin işlenmesi 60 saniyeden fazla sürmez (varsayılan ayar).
* Wallarm izleme modunda çalışmalıdır.
* İstemciler, ara bir HTTP yük dengeleyicisi olmadan filtreleme düğümüne doğrudan erişir.

Listelenen koşulları karşılamak için, yapılandırma dosyasının içeriği aşağıdaki gibi olmalıdır:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # trafiknin işlendiği alan adları
      server_name example.com; 
      server_name www.example.com;

      # trafik işleme modunu izlemeye al
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # isteğin yönlendirileceği adresin ayarlanması
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```