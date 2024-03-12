# مثال على إعداد Envoy لعكس الحركة

هذا المقال يقدم مثال الإعداد المطلوب ل Envoy لـ[عكس الحركة وتوجيهها إلى عقدة Wallarm](overview.md).

## الخطوة 1: إعداد Envoy لعكس الحركة

هذا المثال يُعدِل عكس الحركة مع Envoy من خلال `listener` واحد يستمع إلى البورت 80 (بدون TLS) ولديه `filter` واحد. يتم تحديد عناوين خلفيّة أصلية وخلفية إضافية تستقبل الحركة المعكوسة في كتلة `clusters`.

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
                    cluster: httpbin     # <-- الرابط إلى الكتلة الأصلية
                    request_mirror_policies:
                    - cluster: wallarm   # <-- الرابط إلى الكتلة التي تستقبل الطلبات المعكوسة
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
              ### عنوان الخلفية الأصلية. يكون العنوان اسم DNS
              ### أو عنوان IP، port_value هو رقم بورت TCP
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
              ### عنوان الخلفية الأصلية. يكون العنوان اسم DNS
              ### أو عنوان IP، port_value هو رقم بورت TCP. يُمكن نشر
              ### مخطط عكس Wallarm بأي بورت ولكن
              ### القيمة الافتراضية هي TCP/8445.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[راجع وثائق Envoy](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

## الخطوة 2: إعداد عقدة Wallarm لفلترة الحركة المعكوسة

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"