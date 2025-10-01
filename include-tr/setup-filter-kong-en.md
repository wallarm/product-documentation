Filtreleme ve proxy kuralları `/etc/kong/nginx-wallarm.template` dosyasında yapılandırılır.

NGINX yapılandırma dosyalarıyla çalışma hakkında ayrıntılı bilgi için [resmi NGINX dokümantasyonuna](https://nginx.org/en/docs/beginners_guide.html) bakın.

Wallarm direktifleri, Wallarm filtreleme düğümünün çalışma mantığını tanımlar. Mevcut Wallarm direktiflerinin listesini görmek için [Wallarm yapılandırma seçenekleri](../admin-en/configure-parameters-en.md) sayfasına gidin.

**Yapılandırma dosyası örneği**

Diyelim ki sunucuyu aşağıdaki koşullar altında çalışacak şekilde yapılandırmanız gerekiyor:
* Sadece HTTP trafiği işlenir. HTTPS istekleri işlenmez.
* Aşağıdaki alan adları istekleri alır: `example.com` ve `www.example.com`.
* Tüm istekler `10.80.0.5` sunucusuna iletilmelidir.
* Tüm gelen isteklerin boyutunun 1 MB'tan küçük olduğu varsayılır (varsayılan ayar).
* Bir isteğin işlenmesi en fazla 60 saniye sürer (varsayılan ayar).
* Wallarm'ın izleme (monitoring) modunda çalışması gerekir.
* İstemciler, arada bir HTTP yük dengeleyici olmadan doğrudan filtreleme düğümüne erişir.

Listelenen koşulları karşılamak için, yapılandırma dosyasının içeriği aşağıdaki gibi olmalıdır:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # trafiğin işlendiği alan adları
      server_name example.com; 
      server_name www.example.com;

      # trafik işleme için izleme modunu etkinleştirin
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # istek yönlendirme adresinin ayarlanması
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```