# مثال على تهيئة NGINX لعكس حركة البيانات

ابتداءً من NGINX 1.13، يمكنك عكس حركة البيانات إلى خادم إضافي. تقدم لك هذه المقالة التهيئة اللازمة لـ NGINX ل[عكس حركة البيانات](overview.md)وللعقدة لمعالجة حركة البيانات المعكوسة.

## الخطوة 1: تهيئة NGINX لعكس حركة البيانات

لتهيئة NGINX لعكس حركة البيانات:

1. قم بتهيئة وحدة [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) عبر تعيين توجيه `mirror` في كتلة `location` أو `server`.

    سيعكس المثال أدناه الطلبات المستقبلة عند `location /` إلى `location /mirror-test`.
1. لإرسال حركة البيانات المعكوسة إلى عقدة Wallarm، قم بإدراج الرؤوس لتكون معكوسة وحدد عنوان IP للآلة التي تحتوي على العقدة في `location` الذي يشير إليه توجيه `mirror`.

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

## الخطوة 2: تهيئة عقدة Wallarm لتصفية حركة البيانات المعكوسة

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"