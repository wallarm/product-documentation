# NGINX'de dinamik DNS çözümlemesinin yapılandırılması

Alan adı NGINX yapılandırma dosyasındaki `proxy_pass` yönergesine iletilirse, NGINX, başlangıçtan sonra yalnızca bir kez ana bilgisayarın IP adresini çözümler. DNS sunucusu ana bilgisayarın IP adresini değiştirirse, NGINX yüklenene veya yeniden başlatılıncaya kadar eski IP adresini kullanmaya devam eder. Bundan önce, NGINX istekleri yanlış IP adresine gönderir.

Örneğin:

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

Dinamik DNS çözümlemesi için, `proxy_pass` yönergesini değişken olarak ayarlayabilirsiniz. Bu durumda, NGINX, değişkeni hesaplarken [`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) yönergesinde ayarlanmış olan DNS adresini kullanır.

!!! warning "Dinamik DNS çözümlemesinin trafik işlemeye etkisi"
    * `Resolver` yönergesi ve `proxy_pass` yönergesindeki değişkenle yapılandırılan NGINX, istek işlemesini yavaşlatır çünkü dinamik DNS çözümlemesi istek işleme aşamasında ek bir adım olacaktır.
    * NGINX, zaman-yaşamına (TTL) süresi sona erdiğinde alan adını yeniden çözümler. 'Valid' parametresini `resolver` yönergesine ekleyerek, TTL'yi yoksaymasını ve belirli bir sıklıkta isimleri yeniden çözümlemesini söyleyebilirsiniz.
    * Eğer DNS sunucusu kapalıysa, NGINX trafiği işlemez.

Örneğin:

```bash
location / {
        resolver 172.43.1.2 valid=10s;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! info "NGINX Plus'ta Dinamik DNS Çözümlemesi"
    NGINX Plus, varsayılan olarak alan adlarının dinamik çözümlemesini destekler.