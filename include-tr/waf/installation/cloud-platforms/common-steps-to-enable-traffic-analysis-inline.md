Varsayılan olarak, dağıtılan Wallarm düğümü gelen trafiği analiz etmez. Trafik analizini başlatmak için, Wallarm'ı `/etc/nginx/sites-enabled/default` dosyası aracılığıyla trafiği proxy olarak yapılandırın:

1. Wallarm'ın yasal trafik için proxy olarak kullanılacak bir IP adresini ayarlayın. Mimarinize bağlı olarak bir uygulama örneği, yük dengeleyici veya DNS adı gibi bir IP olabilir.

   Bunu yapmak için, `proxy_pass` değerini düzenleyin, örneğin Wallarm'ın yasal istekleri `http://10.80.0.5` adresine göndermesi gerekir:

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

1. Wallarm düğümünün gelen trafiği analiz etmesi için, `wallarm_mode` direktifini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    İzleme modu, ilk dağıtım ve çözüm testi için önerilen moddur. Wallarm ayrıca güvenli blokaj ve blokaj modlarını da sağlar, daha fazlasını okuyun [wallarm-mode].