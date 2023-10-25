Varsayılan olarak, dağıtılmış Wallarm düğümü gelen trafiği analiz etmez. Analizi başlatmak için, Wallarm'ı kurulu düğümün olduğu makinedeki `/etc/nginx/conf.d/default.conf` dosyası aracılığıyla trafiği proxy olarak ayarlayın:

1. Wallarm'ın meşru trafiği proxy olarak yönlendireceği bir IP adresi ayarlayın. Uygulama örneğinin IP'si, yük dengeleyici ya da DNS adı olabilir, mimarinize bağlı olarak.

    Bunu yapmak için, `proxy_pass` değerini düzenleyin, örneğin Wallarm, meşru istekleri `http://10.80.0.5` adresine göndermelidir:

    ```
    sunucu {
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
    sunucu {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    İzleme modu, ilk dağıtım ve çözüm testi için önerilen moddur. Wallarm ayrıca güvenli engelleme ve engelleme modlarını da sağlar, [daha fazla bilgi için][waf-mode-instr].
