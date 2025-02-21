```markdown
# Envoyのトラフィックミラーリング設定例

本記事はEnvoyが[トラフィックをミラーリングしてWallarmノードへルーティングするため]に必要な設定例を示します。

## ステップ1：Envoyを設定してトラフィックをミラーリングする

この例では、TLSなしの80番ポートで待受する単一の`listener`および単一の`filter`を用いてEnvoyでトラフィックミラーリングを設定します。また、オリジナルバックエンドとミラーリングされたトラフィックを受信する追加バックエンドのアドレスは`clusters`ブロックで指定されています。

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
                    cluster: httpbin     # <-- オリジナルクラスタへのリンク
                    request_mirror_policies:
                    - cluster: wallarm   # <-- ミラーリングされたリクエストを受信するクラスタへのリンク
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### オリジナルクラスタの定義
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
              ### オリジナルエンドポイントのアドレス。アドレスはDNS名またはIPアドレスで、port_valueはTCPポート番号です
              ###
              socket_address:
                address: httpbin # <-- オリジナルクラスタの定義
                port_value: 80

  ### ミラーリングされたリクエストを受信するクラスタの定義
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
              ### オリジナルエンドポイントのアドレス。アドレスはDNS名またはIPアドレスで、port_valueはTCPポート番号です。Wallarmミラーリングスキーマは任意のポートで展開できますが、デフォルト値はTCP/8445です
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Envoyドキュメントを確認する](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

## ステップ2：Wallarmノードを設定してミラーリングされたトラフィックのフィルタリングを行う

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"
```