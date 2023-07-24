トラフィックミラーリングのためのTraefik設定例

この記事では、Traefikを使用して[トラフィックをミラーリングし、Wallarmノードにルーティングする](overview.md)ために必要な設定例を提供します。

## ステップ1: トラフィックのミラーリングを行うようTraefikを設定

以下の設定例は、[`動的設定ファイル`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/)アプローチに基づいています。Traefik Webサーバーは他の設定モードもサポートしており、それらの構造が似ているため、提供されているものを簡単に調整して使用することができます。

```yaml
### 動的設定ファイル
### 注: entrypointsは静的設定ファイルに記述されています
http:
  services:
    ### オリジナルの`services`とwallarmをマッピングする方法。
    ### 以下の`routers`設定で (参照)、このサービスの名前（`with_mirroring`）を
    ### 使用してください。
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### トラフィックをミラーリングする`service` - エンドポイント
    ### は、オリジナルの`service`からミラーリング（複製）されたリクエストを受信する必要があります。
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### オリジナルの`service` 。このサービスはオリジナルのトラフィックを受信する必要があります。
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### ルーターの名前は、トラフィックミラーリングが機能するために`service`の名前と同じである必要があります（with_mirroring）。
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

[Traefikのドキュメントを調べる](https://doc.traefik.io/traefik/routing/services/#mirroring-service)

## ステップ2: ミラーリングされたトラフィックをフィルタリングするようWallarmノードを設定

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.ja.md"