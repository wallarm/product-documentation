# トラフィックミラーリングのためのTraefik設定例

この記事では、トラフィックをミラーリングし、[Wallarmノードへルーティングするため](overview.md)に必要なTraefikの設定例を提供します。

## ステップ1：トラフィックをミラーリングするようにTraefikを設定します

次の設定例は、[`動的設定ファイル`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/)のアプローチに基づいています。Traefikウェブサーバーは他の設定モードもサポートしており、それらは似た構造を持っているため、提供されたものを簡単にそれらに合わせて調整することができます。

```yaml
### 動的設定ファイル
### 注：エントリーポイントは静的設定ファイルで説明されています
http:
  services:
    ### オリジナルとwallarm `services`をマッピングする方法です。
    ### さらなる `routers`設定（下記参照）では、
    ### このサービスの名前（`with_mirroring`）を使用してください。
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### トラフィックをミラーリングする`service` - エンドポイント
    ### オリジナルの`service`からミラーリング（コピー）
    ### されたリクエストを受け取るべきです。
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### オリジナルの`service`。このサービスは
    ### オリジナルのトラフィックを受け取るべきです。
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### ルーターの名前は、トラフィックミラーリングが
    ### 機能するためには`service`の名前と同じである必要があります（with_mirroring）。
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### オリジナルのトラフィック用のルーター。
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[Traefikのドキュメンテーションを確認する](https://doc.traefik.io/traefik/routing/services/#mirroring-service)

## ステップ2：Wallarmノードをミラーリングされたトラフィックをフィルタリングするように設定します

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"