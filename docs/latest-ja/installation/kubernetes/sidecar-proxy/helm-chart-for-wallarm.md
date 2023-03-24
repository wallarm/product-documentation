# Wallarm特有のSidecarプロキシHelmチャートの値

このドキュメントでは、[Wallarm Sidecarのデプロイ](deployment.md)や[アップグレード](../../../updating-migrating/sidecar-proxy.md)の際に変更できるWallarm特有のHelmチャートの値について説明します。Wallarm固有の他のチャートの値は、SidecarプロキシHelmチャートのグローバル設定用です。

!!! info "グローバルとper-podの設定の優先順位"
     Per-podのアノテーションは、Helmチャートの値よりも[優先されます](customization.md#configuration-area)。

Wallarm特有の[デフォルトの`values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml)は以下のようになります。

```yaml
config:
  wallarm:
    api:
      token: ""
      host: api.wallarm.com
      port: 443
      useSSL: true
      caVerify: true
      existingSecret:
        enabled: false
        secretKey: token
        secretName: wallarm-api-token
    fallback: "on"
    mode: monitoring
    modeAllowOverride: "on"
    enableLibDetection: "on"
    parseResponse: "on"
    parseWebsocket: "off"
    unpackResponse: "on"
    ...
```

## config.wallarm.api.token

[Warm コンソール](https://us1.my.wallarm.com/nodes)の[US Cloud](https://my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で作成されたWallarm_node_token です。Wallarm APIにアクセスするために必要です。

このパラメータは、[`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret)の場合無視されます。

## config.wallarm.api.host

Wallarm APIエンドポイント。次のいずれかが使用できます。

* [USクラウド](../../../about-wallarm/overview.md#us-cloud)の場合: `us1.api.wallarm.com`
* [EUクラウド](../../../about-wallarm/overview.md#eu-cloud)の場合（デフォルト）: `api.wallarm.com`

## config.wallarm.api.existingSecret

Helmチャートバージョン4.4.4から、この設定ブロックを使用して、KubernetesシークレットからWallarmノードトークンの値を取得できます。別の秘密管理用の環境（外部シークレットオペレーターを使用している場合など）で便利です。

K8sのシークレットにノードトークンを保存して、Helmチャートに引き出すには：

1. Wallarmノードトークンを使用してKubernetesシークレットを作成します。

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>`は、Wallarm Sidecarコントローラー用のHelmリリースを作成したKubernetesの名前空間です。
    * `wallarm-api-token`は、Kubernetesシークレット名です。
    * `<WALLARM_NODE_TOKEN>`は、Wallarm Console UIでコピーしたWallarmノードトークン値です。

    何らかの外部シークレットオペレーターを使用している場合は、[適切なドキュメントでシークレットを作成する方法](https://external-secrets.io)に従ってください。
1. `values.yaml` に以下の設定を記述して、wallarm-api-tokenを取得できるように設定する：

    ```yaml
    config:
      wallarm:
        api:
          token: ""
          existingSecret:
            enabled: true
            secretKey: token
            secretName: wallarm-api-token
    ```

**デフォルト値**：`existingSecret.enabled: false`は、HelmチャートがWallarmノードトークンを`config.wallarm.api.token`から取得することを指示しています。

## config.wallarm.fallback

この値を`on`（デフォルト）に設定すると、NGINXサービスは緊急モードに入ることができます。proton.dbまたはカスタムルールセットがWallarm Cloudからダウンロードできない場合、この設定はWallarmモジュールを無効にし、NGINXを稼働させ続けます。

[**Podのアノテーション**](pod-annotations.md)：`sidecar.wallarm.io/wallarm-fallback`。

## config.wallarm.mode

グローバルな[トラフィックフィルターモード](../../../admin-en/configure-wallarm-mode.md)。値の選択肢：

* `monitoring` (デフォルト)
* `safe_blocking`
* `block`
* `off`

[**Podのアノテーション**](pod-annotations.md)：`sidecar.wallarm.io/wallarm-mode`。

## config.wallarm.modeAllowOverride

Cloud上の設定で `wallarm_mode`の値を上書きする[機能を管理する](../../../admin-en/configure-wallarm-mode.md#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override)。値の選択肢：

* `on` (デフォルト)
* `off`
* `strict`

[**Podのアノテーション**](pod-annotations.md)：`sidecar.wallarm.io/wallarm-mode-allow-override`。

## config.wallarm.enableLibDetection

[libdetection](../../../about-wallarm/protecting-against-attacks.md#libdetection-overview) ライブラリを使用してSQLインジェクション攻撃の検証を追加で行うかどうか。値の選択肢：

* `on`(デフォルト)
* `off`

[**Podのアノテーション**](pod-annotations.md)：`sidecar.wallarm.io/wallarm-enable-libdetection`。

## config.wallarm.parseResponse

アプリケーションのレスポンスを攻撃の解析用に分析するかどうか。値の選択肢：

* `on`(デフォルト)
* `off`

レスポンス解析は、[受動検出](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection)と[アクティブ脅威検証](../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)の間の脆弱性検出に必要です。

[**Podのアノテーション**](pod-annotations.md)：`sidecar.wallarm.io/wallarm-parse-response`。

## config.wallarm.parseWebsocket

WallarmはWebSocketsを完全にサポートしています。デフォルトでは、WebSocketsのメッセージは攻撃の解析対象にはなりません。この機能を強制するには、APIセキュリティ[サブスクリプションプラン](../../../about-wallarm/subscription-plans.md#subscription-plans)を有効にして、この設定を使用してください。

値の選択肢：

* `on`
* `off` (デフォルト)

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket` 。

## config.wallarm.unpackResponse

アプリケーションのレスポンスで返される圧縮されたデータを解凍するかどうか：

* `on`(デフォルト)
* `off` 

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`。