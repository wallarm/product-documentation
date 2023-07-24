`# トラフィックミラーリングのためのEnvoy設定例

この記事では、Envoy を使用して[トラフィックをミラーリングし、Wallarm ノードにルーティングする](overview.md)ために必要な設定例を提供します。

## ステップ1： Envoy を通じてトラフィックミラーリングを設定する

この例では、ポート80（TLSなし）でリッスンする唯一の`listener`を使ってEnvoyを経由してトラフィックミラーリングを設定しています。元のバックエンドとミラーリングされたトラフィックを受信する追加のバックエンドのアドレスは、`clusters`ブロックに記述されています。

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
                    cluster: httpbin     # <-- 元のクラスタへのリンク
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
  ### 元のクラスタの定義
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
              ### オリジナルエンドポイントのアドレス。アドレスはDNS名
              ### またはIPアドレスであり、port_valueはTCPポート番号
              ###
              socket_address:
                address: httpbin # <-- 元のクラスタの定義
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
              ### オリジナルエンドポイントのアドレス。アドレスは DNS 名
              ### または IP アドレスであり、port_value は TCP ポート番号です。巻
              ### 拡張鏡スキームは任意のポートでデプロイできますが、
              ### デフォルト値は TCP/8445 です。
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

`[Envoy のドキュメント](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto) を確認する`

## ステップ2： Wallarm ノードを構成して、ミラーリングされたトラフィックのフィルタリングを行う

`--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.ja.md"`