# مثال على تكوين Envoy لعكس الحركة

توفر هذه المقالة التكوين المطلوب لـEnvoy ل[عكس الحركة وتوجيهها إلى عقدة Wallarm](overview.md).

## الخطوة 1: تكوين Envoy لعكس الحركة

هذا المثال يُكوّن عكس الحركة باستخدام Envoy من خلال `المستمع` الوحيد الذي يستمع إلى المنفذ 80 (دون TLS) ويحتوي على `مرشح` واحد.  تُحدد عناوين الخلفية الأصلية والخلفية الإضافية التي تتلقى حركة المرور المعكوسة في كتلة `المجموعات`.

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
                    cluster: httpbin     # <-- رابط إلى المجموعة الأصلية
                    request_mirror_policies:
                    - cluster: wallarm   # <-- رابط إلى المجموعة التي تتلقى الطلبات المعكوسة
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### تعريف المجموعة الأصلية
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
              ### عنوان النقطة النهائية الأصلية. العنوان هو اسم DNS
              ### أو عنوان IP، port_value هو رقم المنفذ TCP
              ###
              socket_address:
                address: httpbin # <-- تعريف المجموعة الأصلية
                port_value: 80

  ### تعريف المجموعة التي تتلقى الطلبات المعكوسة
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
              ### عنوان النقطة النهائية الأصلية. العنوان هو اسم DNS
              ### أو عنوان IP، port_value هو رقم المنفذ TCP. يمكن
              ### نشر مخطط مرآة Wallarm مع أي منفذ ولكن
              ### القيمة الافتراضية هي TCP/8445.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[راجع وثائق Envoy](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

## الخطوة 2: تكوين عقدة Wallarm لتصفية حركة المرور المعكوسة

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"