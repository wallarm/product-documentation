# Wallarm OOB للحركة المتطابقة بواسطة NGINX و Envoy وما شابه

تشرح هذه المقالة كيفية نشر Wallarm كحل [OOB](../overview.md) إذا اخترت إنتاج مرآة للحركة بواسطة حلول NGINX أو Envoy أو ما شابه.

يمكن تنفيذ تطابق الحركة عن طريق تكوين خادم الويب أو الوكيل أو خادم مشابه لنسخ الحركة الواردة إلى خدمات Wallarm للتحليل. مع هذا النهج، يبدو تدفق الحركة النموذجي كما يلي:

![مخطط OOB](../../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## إجراء التنشيط

لتنشيط وتكوين Wallarm لتحليل مرآة للحركة، تحتاج إلى:

1. نشر عقدة Wallarm في بنية التحتية الخاصة بك باستخدام واحدة من الطرق التالية:

    * [إلى AWS باستخدام صورة الجهاز](aws-ami.md)
    * [إلى GCP باستخدام صورة الجهاز](gcp-machine-image.md)

    <!-- * [To a container-based environment using the NGINX-based Docker image](docker-image.md)
    * [On a machine with a Debian or Ubuntu OS from DEB/RPM packages](packages.md) -->

    !!! info "دعم تحليل الحركة المتطابقة"
        فقط عقد Wallarm القائمة على NGINX تدعم تصفية الحركة المتطابقة.
1. قم بتكوين Wallarm لتحليل نسخة الحركة - تحتوي التعليمات الواردة أعلاه على الخطوات المطلوبة.
1. قم بتكوين البنية التحتية الخاصة بك لإنتاج نسخة من الحركة الواردة وإرسال النسخة إلى عقدة Wallarm كمكمل للخلفية.

    بالنسبة لتفاصيل التكوين، نوصي بالرجوع إلى توثيق المكونات المستخدمة في البنية التحتية الخاصة بك. نحن [أدناه](#examples-of-web-server-configuration-for-traffic-mirroring) نقدم أمثلة التكوين لبعض الحلول الشائعة مثل NGINX و Envoy وما شابه ولكن التكوين الفعلي يعتمد على خصوصيات البنية التحتية الخاصة بك.

## أمثلة التكوين لتطابق الحركة

أدناه هي الأمثلة على كيفية تكوين NGINX و Envoy و Traefik و Istio لتعكس الحركة الواردة إلى العقد Wallarm كجزء من الخلفية الإضافية.

### NGINX

بدءًا من NGINX 1.13 يمكنك تطابق الحركة إلى خلفية إضافية. لتطابق الحركة في NGINX:

1. قم بتكوين الوحدة [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) بواسطة تعيين توجيه `mirror` في القائمة `location` أو `server`.

    ستعكس الأمثلة أدناه الطلبات المستلمة في `location /` إلى `location /mirror-test`.
1. لإرسال الحركة المتطابقة إلى عقدة Wallarm، سجل الرؤوس المراد تطابقها وحدد عنوان IP للجهاز الذي يحتوي على العقدة في `location` التي تشير إليها التوجيه `mirror`.

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

[راجع توثيق NGINX](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)

### Envoy

يعد هذا المثال تكوينًا لتطابق الحركة ب Envoy عبر المستمع `listener` الوحيد الذي يستمع إلى المنفذ 80 (بدون TLS) ويحتوي على فلتر `filter` واحد. يتم تحديد عناوين الخلفية الأصلية والخلفية الإضافية التي تتلقى الحركة المتطابقة في الكتلة `clusters`.

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
                    cluster: httpbin     # <-- link to the original cluster
                    request_mirror_policies:
                    - cluster: wallarm   # <-- link to the cluster receiving mirrored requests
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### Definition of original cluster
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
              ### Address of the original endpoint. Address is DNS name
              ### or IP address, port_value is TCP port number
              ###
              socket_address:
                address: httpbin # <-- definition of the original cluster
                port_value: 80

  ### Definition of the cluster receiving mirrored requests
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
              ### Address of the original endpoint. Address is DNS name
              ### or IP address, port_value is TCP port number. Wallarm
              ### mirror schema can be deployed with any port but the
              ### default value is TCP/8445 for Terraform module, and
              ### the default value for other deployment options should be 80.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[راجع توثيق Envoy](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

### Istio

لتطابق الحركة في Istio، يمكنك تكوين `VirtualService` لتطابق الطرق إما إلى النقطة النهائية الداخلية (الداخلية لـ Istio، على سبيل المثال المستضافة في Kubernetes) أو إلى النقطة النهائية الخارجية مع `ServiceEntry`:

* لتمكين تطابق الطلبات داخل الكتلة (مثل: بين الوعاءات)، أضف `mesh` إلى `.spec.gateways`.
* لتمكين تطابق الطلبات الخارجية (مثل: عبر خدمة LoadBalancer أو NodePort)، قم بتكوين مكون Istio `Gateway` وأضف اسم المكون إلى `.spec.gateways` من `VirtualService`. تتم تقديم هذا الخيار في الأمثلة التالية.

```yaml
---
### Configuration of destination for mirrored traffic
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # mirroring destination address
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # mirroring destination port
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
    ### Name of istio `Gateway` component. Required for handling traffic from
    ### external sources
    ###
    - httpbin-gateway
    ### Special label, enables this virtual service routes to work with requests
    ### from Kubernetes pods (in-cluster communication not via gateways)
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
        host: some.external.service.tld # mirroring destination address
        port:
          number: 8445 # mirroring destination port
---
### For handling external requests
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

[راجع توثيق Istio](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

### Traefik

يعتمد مثال التكوين التالي على النهج [`dynamic configuration file`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/). يدعم Traefik أيضًا أوضاع تكوين أخرى، ويمكنك بسهولة ضبط واحد الذي تم تقديمه لأي منهم لأنهم يحتوون على بنية مشابهة.

```yaml
### Dynamic configuration file
### Note: entrypoints are described in static configuration file
http:
  services:
    ### This is how to map original and wallarm `services`.
    ### In further `routers` configuration (see below), please 
    ### use the name of this service (`with_mirroring`).
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### The `service` to mirror traffic to - the endpoint
    ### that should receive the requests mirrored (copied)
    ### from the original `service`.
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### Original `service`. This service should receive the
    ### original traffic.
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### The router name must be the same as the `service` name
    ### for the traffic mirroring to work (with_mirroring).
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### The router for the original traffic.
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[راجع توثيق Traefik](https://doc.traefik.io/traefik/routing/services/#mirroring-service)
