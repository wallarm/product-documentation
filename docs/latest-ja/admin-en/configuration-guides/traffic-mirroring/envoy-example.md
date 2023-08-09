# トラフィックミラーリングのためのEnvoy設定の例

この記事では、トラフィックをミラーリングし、それをWallarmノードにルーティングするために必要なEnvoyの[設定例](overview.md)を提供します。

## ステップ1: トラフィックミラーリングのためのEnvoy設定

この例では、単一の`listener`がポート80（TLSなし）をリッスニングし、単一の`filter`を持つことで、Envoyを使ったトラフィックミラーリングを設定します。オリジナルのバックエンドと、ミラーリングされたトラフィックを受け取る追加のバックエンドのアドレスは、`clusters`ブロックで指定されます。

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
                    cluster: httpbin     # <-- オリジナルのクラスタへのリンク
                    request_mirror_policies:
                    - cluster: wallarm   # <-- ミラーリングされた要求を受け取るクラスタへのリンク
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### オリジナルのクラスタの定義
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
              ### オリジナルのエンドポイントのアドレス。AddressはDNS名
              ### またはIPアドレス、port_valueはTCPポート番号です
              ###
              socket_address:
                address: httpbin # <-- オリジナルのクラスタの定義
                port_value: 80

  ### ミラーリングされたリクエストを受け取るクラスタの定義
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
              ### オリジナルのエンドポイントのアドレス。AddressはDNS名
              ### またはIPアドレス、port_valueはTCPポート番号です。Wallarm
              ### のミラースキーマは任意のポートでデプロイできますが、
              ### デフォルト値はTCP/8445です。
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Envoyのドキュメンテーションを確認してください](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

## ステップ2: ミラーリングされたトラフィックをフィルタするためのWallarmノードの設定

--8<-- "../include-ja/wallarm-node-configuration-for-mirrored-traffic.md"