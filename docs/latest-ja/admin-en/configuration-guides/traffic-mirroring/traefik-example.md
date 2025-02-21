# Traefikの構成例: トラフィックミラーリング

この記事はTraefikが[トラフィックをミラーリングし、Wallarmノードにルーティングする](overview.md)ために必要な設定例を提供します。

## ステップ1: Traefikを構成してトラフィックをミラーリングする

以下の設定例は[`dynamic configuration file`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/)方式に基づいています。Traefikウェブサーバーは他の構成モードもサポートしていますので、各モードの構造が似ているため、ここで示した設定を簡単に調整することができます。

```yaml
### 動的構成ファイル
### 注意: entrypointsは静的構成ファイルに記述されています
http:
  services:
    ### これがオリジナルとWallarmの`services`をマッピングする方法です．
    ### 以下の`routers`構成（下記参照）には必ず
    ### このサービス名(`with_mirroring`)を使用してください．
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### トラフィックをミラーリングする先の`service`、すなわち
    ### オリジナルの`service`からミラーリングされたリクエストを受信すべき
    ### エンドポイントです．
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### オリジナルの`service`．このサービスはオリジナルトラフィックを受信します．
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### トラフィックミラーリングを機能させるため，ルーター名は`service`名と同一にしてください（with_mirroring）．
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### オリジナルトラフィック用のルーターです．
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[Traefikドキュメントを確認する](https://doc.traefik.io/traefik/routing/services/#mirroring-service)

## ステップ2: ミラーリングされたトラフィックをフィルタリングするようにWallarmノードを構成する

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"