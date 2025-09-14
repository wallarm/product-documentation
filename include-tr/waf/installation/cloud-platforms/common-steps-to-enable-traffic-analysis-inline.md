Varsayılan olarak, dağıtılan Wallarm düğümü gelen trafiği analiz etmez. Trafik analizini başlatmak için, Wallarm örneğinde `/etc/nginx/sites-enabled/default` dosyası üzerinden trafiği proxy'leyecek şekilde Wallarm'ı yapılandırın:

1. Wallarm'ın meşru trafiği yönlendireceği bir IP adresi belirleyin. Mimarinize bağlı olarak bu, bir uygulama örneğinin IP'si, bir yük dengeleyici ya da bir DNS adı vb. olabilir.

    Bunu yapmak için, `proxy_pass` değerini düzenleyin; örneğin, Wallarm meşru istekleri `http://10.80.0.5` adresine göndermelidir:

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
1. Wallarm düğümünün gelen trafiği analiz edebilmesi için `wallarm_mode` yönergesini `monitoring` olarak ayarlayın:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Monitoring modu ilk dağıtım ve çözüm testleri için önerilir. Wallarm ayrıca safe blocking ve blocking modlarını da sağlar, [daha fazlasını okuyun][wallarm-mode].