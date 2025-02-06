# Trafiğin Aynalanması için Envoy Yapılandırma Örneği

Bu makale, Envoy'un trafiği aynalaması ve Wallarm node'una yönlendirmesi için gereken örnek yapılandırmayı sunar ([trafiği aynala ve Wallarm node'una yönlendir](overview.md)).

## Adım 1: Trafiği aynalamak için Envoy'u yapılandırın

Bu örnek, TLS kullanılmayan, port 80'de dinleyen tek bir listener ve tek bir filter üzerinden Envoy ile trafik aynalama yapılandırmasını gösterir. Orijinal backend ile aynalanan trafiği alan ek backend'in adresleri, `clusters` bloğunda belirtilmiştir.

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
                    cluster: httpbin     # <-- orijinal kümeye bağlantı
                    request_mirror_policies:
                    - cluster: wallarm   # <-- aynalanan istekleri alan kümeye bağlantı
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### Orijinal kümenin tanımlanması
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
              ### Orijinal uç noktanın adresi. Adres, DNS adı veya IP adresidir,
              ### port_value ise TCP port numarasıdır.
              ###
              socket_address:
                address: httpbin # <-- orijinal kümenin tanımı
                port_value: 80

  ### Aynalanan istekleri alan kümenin tanımlanması
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
              ### Orijinal uç noktanın adresi. Adres, DNS adı veya IP adresidir,
              ### port_value ise TCP port numarasıdır. Wallarm aynalama şeması herhangi bir portta
              ### konuşlandırılabilir ancak varsayılan değer TCP/8445'tir.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Envoy belgelerini inceleyin](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

## Adım 2: Aynalanan trafiği filtrelemesi için Wallarm node'unu yapılandırın

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"