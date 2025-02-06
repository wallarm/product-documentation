Varsayılan olarak, dağıtılmış Wallarm düğümü gelen trafiği analiz etmez. Trafik analizini başlatmak için, Wallarm örneğinde bulunan `/etc/nginx/sites-enabled/default` dosyası üzerinden trafği proxy yapmak üzere Wallarm'ı yapılandırın:

1. Wallarm'ın geçerli trafiği proxy yapması için bir IP adresi ayarlayın. Bu, mimarinize bağlı olarak bir uygulama örneğinin IP'si, yük dengeleyici veya DNS adı olabilir.

    Bunu yapmak için, `proxy_pass` değerini düzenleyin, örneğin Wallarm geçerli istekleri `http://10.80.0.5` adresine göndermelidir:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;

        ...

        location / {
            proxy_pass http://10.80.0.5; 
            ...
        }
    }
    ```
1. Wallarm düğümünün gelen trafiği analiz etmesi için, `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    İzleme modu, ilk dağıtım ve çözüm testleri için önerilen moddur. Wallarm, güvenli engelleme ve engelleme modlarını da sağlar, [read more][wallarm-mode].