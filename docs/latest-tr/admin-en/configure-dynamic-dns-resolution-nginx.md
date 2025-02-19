# NGINX'de Dinamik DNS Çözümlemesi Yapılandırması

Eğer etki alanı adı NGINX yapılandırma dosyasındaki `proxy_pass` yönergesinde iletiliyorsa, NGINX ana bilgisayarın IP adresini yalnızca başlangıçta bir kez çözer. DNS sunucusu ana bilgisayarın IP adresini değiştirirse, NGINX yeniden yüklenip yeniden başlatılana kadar eski IP adresini kullanmaya devam eder. Bu süre zarfında NGINX istekleri yanlış IP adresine gönderir.

Örneğin:

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

Dinamik DNS çözümlemesi için, `proxy_pass` yönergesini değişken olarak ayarlayabilirsiniz. Bu durumda, NGINX değişkeni hesaplarken [`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) yönergesinde ayarlanan DNS adresini kullanır.

!!! warning "Dinamik DNS çözümlemesinin trafik işleme üzerindeki etkisi"
    * `resolver` yönergesi ve `proxy_pass` yönergesindeki değişken ile yapılan NGINX yapılandırması, istek işleme sırasında dinamik DNS çözümlemesi adımının eklenmesi nedeniyle istek işlemesini yavaşlatır.
    * NGINX, zaman-aşımı (TTL) sona erdiğinde etki alanı adını yeniden çözer. `resolver` yönergesine `valid` parametresini ekleyerek, NGINX'e TTL'yi göz ardı etmesini ve bunun yerine belirtilen bir sıklıkta adları yeniden çözmesini söyleyebilirsiniz.
    * DNS sunucusu kapalıysa, NGINX trafiği işlemez.

Örneğin:

```bash
location / {
        resolver 172.43.1.2 valid=10s;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! info "NGINX Plus'da Dinamik DNS Çözümlemesi"
    NGINX Plus, etki alanı adlarının dinamik çözümlemesini varsayılan olarak destekler.