# Trafik aynalama için Envoy yapılandırması örneği

Bu makale, trafik aynalaması ve [trafiği Wallarm düğümüne yönlendirmek için](overview.md) gerekli olan örnek Envoy yapılandırmasını sağlar.

## Adım 1: Trafik aynalaması için Envoy yapılandırın

Bu örnek, tek bir `listener`'in 80 portunu (TLS olmadan) dinlemesi ve tek bir `filter` içermesi aracılığıyla Envoy ile trafik aynalamayı yapılandırır. Orijinal hizmetın ve aynalanan trafik alan ek hizmetin adresleri `clusters` bloğunda belirtilmiştir.

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
                    cluster: httpbin     # <-- orijinal gruba bağlantı
                    request_mirror_policies:
                    - cluster: wallarm   # <-- aynalanan talepleri alan gruba bağlantı
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### Orijinal grubun tanımlaması
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
              ### Orijinal uç noktanın adresi. Adres DNS adı
              ### veya IP adresi, port_value TCP port numarasıdır
              ###
              socket_address:
                address: httpbin # <-- orijinal grubun tanımlaması
                port_value: 80

  ### Aynalanan talepleri alan grubun tanımlaması
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
              ### Orijinal uç noktanın adresi. Adres DNS adı
              ### veya IP adres, port_value TCP port numarasıdır. Wallarm
              ### aynalama şeması herhangi bir portla dağıtılabilir fakat
              ### varsayılan değer TCP/8445'tir.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Envoy dokümantasyonuna göz atın](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

## Adım 2: Aynalanan trafiği filtrelemek için Wallarm düğümünü yapılandırın

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"
