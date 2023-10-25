# Trafik aynalama için NGINX yapılandırma örneği

NGINX 1.13 sürümünden başlayarak, trafiği ek bir arka uca aynalayabilirsiniz. Bu makale, NGINX'in [trafiği aynalaması](overview.md) ve düğümün aynalanmış trafiği işlemesi için gerekli örnek yapılandırmayı sağlar.

## Adım 1: Trafiği aynalamak için NGINX'i yapılandırın

NGINX'in trafiği aynalaması için:

1. `location` veya `server` bloğunda `mirror` yönergesini ayarlayarak [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) modülünü yapılandırın.

    Aşağıdaki örnekte `location /` lokasyonuna alınan istekler `location /mirror-test` lokasyonuna aynalayacaktır.
1. Aynalanan trafiği Wallarm düğümüne göndermek için, aynalanacak başlıkları listeliyorsunuz ve `mirror` yönergenin işaret ettiği `location` 'da düğümle aynı makinenin IP adresini belirtin.

```
location / {
        mirror /mirror-test;
        mirror_request_body on;
        root   /usr/share/nginx/html;
        index  index.html index.htm; 
    }
    
location /mirror-test {
        internal;
        #proxy_pass http://111.11.111.1$request_uri;
        proxy_pass http://222.222.222.222$request_uri;
        proxy_set_header X-SERVER-PORT $server_port;
        proxy_set_header X-SERVER-ADDR $server_addr;
        proxy_set_header HOST $http_host;
        proxy_set_header X-Forwarded-For $realip_remote_addr;
        proxy_set_header X-Forwarded-Port $realip_remote_port;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Request-ID $request_id;
    }
```

## Adım 2: Aynalanan trafiği filtrelemek için Wallarm düğümünü yapılandırın

--8<-- "../include-tr/wallarm-node-configuration-for-mirrored-traffic.md"