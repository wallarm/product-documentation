# Trafik Aynalaması için NGINX Yapılandırma Örneği

NGINX 1.13'ten itibaren, trafiği ek bir arka uca aynalayabilirsiniz. Bu makale, NGINX'in trafiği [aynalanması](overview.md) ve düğümün aynalanan trafiği işlemesi için gerekli örnek yapılandırmayı sunar.

## Adım 1: NGINX'i Trafiği Aynalamak için Yapılandırın

NGINX'in trafiği aynalaması için:

1. `location` veya `server` bloğunda `mirror` direktifini ayarlayarak [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) modülünü yapılandırın.

    Aşağıdaki örnek, `location /` üzerinde alınan istekleri `location /mirror-test`e aynalayacaktır.
1. Aynalanan trafiği Wallarm node’una göndermek için, aynalanacak başlıkları listeleyin ve `mirror` direktifinin işaret ettiği `location` içerisinde node’un bulunduğu makinenin IP adresini belirtin.

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

## Adım 2: Wallarm Node’unu Aynalanan Trafiği Filtreleyecek Şekilde Yapılandırın

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"