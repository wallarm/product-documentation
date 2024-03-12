# مثال على إعدادات NGINX لعكس حركة المرور

ابتداءً من NGINX 1.13، يمكنك عكس حركة المرور إلى خلفية إضافية. يوفر لك هذا المقال إعدادات المثال المطلوبة لـ NGINX ل[عكس حركة المرور](overview.md) وللعقدة لمعالجة حركة المرور المعكوسة.

## الخطوة 1: إعداد NGINX لعكس حركة المرور

لـ NGINX لعكس حركة المرور:

1. قم بإعداد وحدة [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) بوضع توجيه `mirror` في كتلة `location` أو `server`.

    المثال أدناه سوف يعكس الطلبات المستلمة في `location /` إلى `location /mirror-test`.
1. لإرسال حركة المرور المعكوسة إلى عقدة Wallarm، قم بسرد العناوين التي ستتم مرآتها وحدد عنوان IP للآلة التي تحتوي على العقدة في `location` الذي يشير إليه توجيه `mirror`.

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

## الخطوة 2: إعداد عقدة Wallarm لتصفية حركة المرور المعكوسة

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"