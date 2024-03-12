# Wallarm OOB لتحليل ترافيك المرآة بواسطة NGINX، Envoy وأمثالهم

يشرح هذا المقال كيفية تثبيت Wallarm كحل [OOB](../overview.md) إذا اخترت إنتاج مرآة للترافيك بواسطة NGINX، Envoy أو حل مماثل.

يمكن تنفيذ مرآة الترافيك بتكوين خادم ويب، بروكسي أو مشابه لنسخ ترافيك الوارد إلى خدمات Wallarm للتحليل. مع هذا النهج، يبدو تدفق الترافيك النموذجي كما يلي:

![مخطط OOB](../../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## إجراء التثبيت

لتثبيت وتكوين Wallarm لتحليل مرآة الترافيك، تحتاج إلى:

1. تثبيت عقدة Wallarm في بنيتك التحتية بإحدى الطرق التالية:

    * [إلى AWS باستخدام وحدة Terraform](../terraform-module/mirroring-by-web-server.md)
    * [إلى AWS باستخدام صورة الآلة](aws-ami.md)
    * [إلى GCP باستخدام صورة الآلة](gcp-machine-image.md)

    <!-- * [إلى بيئة قائمة على الحاويات باستخدام صورة Docker المستندة إلى NGINX](docker-image.md)
    * [على جهاز بنظام تشغيل Debian أو Ubuntu من حزم DEB/RPM](packages.md) -->

    !!! معلومات "دعم تحليل ترافيك المرآة"
        فقط عقد Wallarm المستندة إلى NGINX تدعم فلترة ترافيك المرآة.
1. تكوين Wallarm لتحليل نسخة الترافيك - تأتي الإرشادات أعلاه مزودة بالخطوات المطلوبة.
1. تكوين بنيتك التحتية لإنتاج نسخة من ترافيك الوارد وإرسال النسخة إلى عقدة Wallarm كخلفية إضافية.

    لمزيد من التفاصيل حول التكوين، نوصي بالرجوع إلى وثائق المكونات المستخدمة في بنيتك التحتية. [أدناه](#examples-of-web-server-configuration-for-traffic-mirroring) نقدم أمثلة على التكوين لبعض الحلول الشائعة مثل NGINX، Envoy والمشابهة لكن التكوين الفعلي يعتمد على خصوصيات بنيتك التحتية.

## أمثلة على تكوين مرآة الترافيك

فيما يلي أمثلة عن كيفية تكوين NGINX، Envoy، Traefik، Istio لمرآة ترافيك الوارد إلى عقد Wallarm كخلفية إضافية.

### NGINX

ابتداءً من NGINX 1.13، يمكنك مرآة الترافيك إلى خلفية إضافية. لإجراء NGINX لمرآة الترافيك:

1. تكوين وحدة [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) بتعيين توجيه `mirror` في كتلة `location` أو `server`.

    المثال أدناه سيعكس الطلبات الواردة في `location /` إلى `location /mirror-test`.
1. لإرسال ترافيك المرآة إلى عقدة Wallarm، قائمة الرؤوس المطلوب مرآتها وحدد عنوان IP للجهاز بالعقدة في `location` التي يشير إليها توجيه `mirror`.

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

[راجع وثائق NGINX](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)

### Envoy

يقوم هذا المثال بتكوين مرآة الترافيك مع Envoy عبر `listener` واحد يستمع إلى المنفذ 80 (بدون TLS) ويحتوي على `filter` واحد. عناوين خلفية الأصلية والخلفية الإضافية التي تستقبل الترافيك المعكوس محددة في كتلة `clusters`.

```yaml
static_resources:
  listeners:
  - address:
      socket_address:
        address: 0.0.0.0
        port_value: 80
    filter_chains:
    - filters:
        - name: envoy.filters.network.http_connection_manager
          typed_config:
            "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
            stat_prefix: ingress_http
            codec_type: AUTO
            route_config:
              name: local_route
              virtual_hosts:
              - name: backend
                domains:
                - "*"
                routes:
                - match:
                    prefix: "/"
                  route:
                    cluster: httpbin     # <-- رابط إلى الكتلة الأصلية
                    request_mirror_policies:
                    - cluster: wallarm   # <-- رابط إلى الكتلة التي تستقبل الطلبات المعكوسة
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### تعريف الكتلة الأصلية
  ###
  - name: httpbin
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: httpbin
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              ### عنوان النقطة الأصلية. العنوان هو اسم DNS
              ### أو عنوان IP، port_value هو رقم منفذ TCP
              ###
              socket_address:
                address: httpbin # <-- تعريف الكتلة الأصلية
                port_value: 80

  ### تعريف الكتلة التي تستقبل الطلبات المعكوسة
  ###
  - name: wallarm
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: wallarm
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              ### عنوان النقطة الأصلية. العنوان هو اسم DNS
              ### أو عنوان IP، port_value هو رقم منفذ TCP. يمكن
              ### نشر مخطط مرآة Wallarm بأي منفذ لكن القيمة
              ### الافتراضية هي TCP/8445 لوحدة Terraform، و
              ### القيمة الافتراضية لخيارات نشر أخرى يجب أن تكون 80.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[راجع وثائق Envoy](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

### Istio

لاستخدام Istio لمرآة الترافيك، يمكنك تكوين `VirtualService` لمسارات المرآة إما إلى النهاية الداخلية (داخلية بالنسبة لIstio، مثلاً مستضافة في Kubernetes) أو إلى النهاية الخارجية بـ `ServiceEntry`:

* لتمكين مرآة الطلبات داخل العنقود (مثلاً بين الحاويات)، أضف `mesh` إلى `.spec.gateways`.
* لتمكين مرآة الطلبات الخارجية (مثلاً عبر خدمة LoadBalancer أو NodePort)، قم بتكوين مكون Istio `Gateway` وأضف اسم المكون إلى `.spec.gateways` من `VirtualService`. يتم عرض هذا الخيار في المثال أدناه.

```yaml
---
### تكوين وجهة لترافيك المرآة
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # عنوان وجهة المرآة
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # منفذ وجهة المرآة
      name: http
      protocol: HTTP
  resolution: DNS
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
    - ...
  gateways:
    ### اسم مكون `Gateway` istio. مطلوب للتعامل مع الطلبات من
    ### مصادر خارجية
    ###
    - httpbin-gateway
    ### تسمية خاصة، تمكن هذه الخدمة الافتراضية من العمل مع الطلبات
    ### من حاويات Kubernetes (التواصل داخل العنقود غير عبر البوابات)
    ###
    - mesh
  http:
    - route:
        - destination:
            host: httpbin
            port:
              number: 80
          weight: 100
      mirror:
        host: some.external.service.tld # عنوان وجهة المرآة
        port:
          number: 8445 # منفذ وجهة المرآة
---
### للتعامل مع الطلبات الخارجية
###
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: httpbin-gateway
spec:
  selector:
    istio: ingress
    app: istio-ingress
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "httpbin.local"
```

[راجع وثائق Istio](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

### Traefik

يعتمد مثال التكوين التالي على نهج [`ملف التكوين الديناميكي`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/). Traefik يدعم أيضاً أوضاع تكوين أخرى، ويمكنك بسهولة تعديل المثال المقدم لأي منها حيث أن لها هيكل مماثل.

```yaml
### ملف التكوين الديناميكي
### ملاحظة: يتم وصف نقاط الدخول في ملف التكوين الثابت
http:
  services:
    ### هكذا لربط الخدمتين الأصلية و wallarm.
    ### في تكوين `routers` اللاحق (انظر أدناه)، الرجاء
    ### استخدام اسم هذه الخدمة (`with_mirroring`).
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### `الخدمة` لمرآة الترافيك إليها - التنقطة
    ### التي يجب أن تتلقى الطلبات المعكوسة (المنسوخة)
    ### من الخدمة الأصلية.
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### الخدمة الأصلية. هذه الخدمة يجب أن تتلقى
    ### الترافيك الأصلي.
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### يجب أن يكون اسم الموجه هو نفس اسم `الخدمة`
    ### لعمل مرآة الترافيك (with_mirroring).
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### الموجه للترافيك الأصلي.
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[راجع وثائق Traefik](https://doc.traefik.io/traefik/routing/services/#mirroring-service)