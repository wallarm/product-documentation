# NGINX'te dinamik DNS çözümlemesini yapılandırma

Alan adı, NGINX yapılandırma dosyasındaki `proxy_pass` yönergesinde belirtilmişse, NGINX başlatıldıktan sonra ana makinenin IP adresini yalnızca bir kez çözümler. DNS sunucusu ana makinenin IP adresini değiştirirse, NGINX yeniden yüklenip başlatılana kadar eski IP adresini kullanmaya devam eder. Bu süre zarfında NGINX istekleri yanlış IP adresine gönderecektir.

Örneğin:

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

Dinamik DNS çözümlemesi için `proxy_pass` yönergesinin değerini bir değişken olarak tanımlayabilirsiniz. Bu durumda, NGINX değişkeni hesaplarken [`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) yönergesinde ayarlanmış DNS adresini kullanır.

!!! warning "Dinamik DNS çözümlemesinin trafik işleme üzerindeki etkisi"
    * `resolver` yönergesinin ve `proxy_pass` yönergesinde bir değişkenin kullanıldığı NGINX yapılandırması, istek işlemeyi yavaşlatır; çünkü istek işleme sırasında dinamik DNS çözümlemesine ilişkin ek bir adım bulunur.
    * NGINX, alan adını yaşam süresi (TTL) dolduğunda yeniden çözümler. `resolver` yönergesine `valid` parametresini ekleyerek NGINX'e TTL'i yok saymasını ve bunun yerine adları belirli bir sıklıkta yeniden çözmesini söyleyebilirsiniz.
    * DNS sunucusu erişilemez durumdaysa, NGINX trafiği işlemez.

Örneğin:

```bash
location / {
        resolver 172.43.1.2 valid=10s;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! info "NGINX Plus'ta dinamik DNS çözümlemesi"
    NGINX Plus, alan adlarının dinamik çözümlemesini varsayılan olarak destekler.