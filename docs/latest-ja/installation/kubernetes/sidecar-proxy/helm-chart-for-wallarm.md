# Wallarm特有のSidecar Proxy Helm Chartの値

この文書は、[Wallarm Sidecarの展開](deployment.md)または[アップグレード][sidecar-upgrade-docs]中に変更できるWallarm特有のHelm chartの値について説明しています。Wallarm特有の他のchartの値は、Sidecar proxy Helm chartのグローバル設定用です。

!!! info "グローバル設定とPod毎の設定の優先順位"
    Pod毎の注釈はHelm chartの値よりも[優先されます](customization.md#configuration-area)。

[デフォルトの`values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml)のWallarm特有の部分は以下のようになっています：

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
postanalytics:
  external:
    enabled: false
    host: ""
    port: 3313
  ...
```
## config.wallarm.api.token

[US](https://us1.my.wallarm.com/nodes)または[EU](https://my.wallarm.com/nodes)クラウドでWallarm Consoleで作成されたWallarmノードトークンです。Wallarm APIにアクセスするために必要です。

このパラメータは[`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret)の場合、無視されます。

## config.wallarm.api.host

Wallarm APIのエンドポイントです。以下のいずれかが可能です：

* [USクラウド][us-cloud-docs]向けの`us1.api.wallarm.com`
* [EUクラウド][eu-cloud-docs]向けの`api.wallarm.com` (デフォルト)

## config.wallarm.api.existingSecret

Helm chartバージョン4.4.4からは、この設定ブロックを使用して、KubernetesのシークレットからWallarmノードトークンの値を取得できます。これは、シークレット管理が独立した環境（例えば、外部のシークレットオペレータを使用している場合）で便利です。

Helm chartにノードトークンを格納し、K8sのシークレットから取得するには：

1. Wallarmノードトークンを含むKubernetesシークレットを作成します：

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>`は、Wallarm SidecarコントローラーとともにHelmリリースに作成したKubernetesの名前空間です。
    * `wallarm-api-token`はKubernetesのシークレット名です。
    * `<WALLARM_NODE_TOKEN>`はWallarm Console UIからコピーしたWallarmノードトークンの値です。

    外部のシークレットオペレータを使用している場合は、[適切なドキュメントを参照してシークレットを作成](https://external-secrets.io)します。
1. `values.yaml`に以下の設定を記述します：

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

**デフォルトの値**：`existingSecret.enabled: false` は、Helm chartがWallarmノードトークンを `config.wallarm.api.token` から取得するよう指示します。

## config.wallarm.fallback

値が`on`（デフォルト）に設定されている場合、NGINXサービスは緊急モードに入る能力を持っています。proton.dbまたはカスタムルールセットがWallarmクラウドからダウンロードできない場合、この設定はWallarmモジュールを無効にし、NGINXの機能を維持します。

[**Podの注釈**](pod-annotations.md): `sidecar.wallarm.io/wallarm-fallback`.

## config.wallarm.mode

グローバル[トラフィックフィルタリングモード][configure-wallarm-mode-docs]。可能な値：

* `monitoring` (デフォルト)
* `safe_blocking`
* `block`
* `off`

[**Podの注釈**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode`.

## config.wallarm.modeAllowOverride

クラウド設定での `wallarm_mode` 値の上書き可能性を[管理][filtration-mode-priorities-docs]します。可能な値：

* `on` (デフォルト)
* `off`
* `strict`

[**Podの注釈**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode-allow-override`.

## config.wallarm.enableLibDetection

[libdetection][libdetection-docs]ライブラリを使用してSQLインジェクション攻撃を追加で検証するかどうか。可能な値：

* `on` (デフォルト)
* `off`

[**Podの注釈**](pod-annotations.md): `sidecar.wallarm.io/wallarm-enable-libdetection`.

## config.wallarm.parseResponse

アプリケーションの応答を攻撃について解析するかどうか。可能な値：

* `on` (デフォルト)
* `off`

応答分析は、[パッシブ検出][passive-detection-docs]と[アクティブな脅威の確認][active-threat-verification-docs]の間の脆弱性検出に必要です。

[**Podの注釈**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-response`.

## config.wallarm.parseWebsocket

Wallarmは完全なWebSocketsをサポートしています。デフォルトでは、WebSocketsのメッセージは攻撃のために解析されません。この機能を強制するためには、APIセキュリティ[サブスクリプションプラン][subscriptions-docs]を有効にし、この設定を使用します。

可能な値：

* `on`
* `off` (デフォルト)

[**Podの注釈**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket`.

## config.wallarm.unpackResponse

アプリケーションの応答で返される圧縮データを解凍するかどうか：

* `on` (デフォルト)
* `off`

[**Podの注釈**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`.

## postanalytics.external.enabled

Tarantoolモジュールを外部ホストにインストールするか、Sidecarソリューションの展開時にインストールするかどうかを決定します。

この機能はHelmリリース4.6.4からサポートされています。

可能な値：

* `false` (デフォルト): Sidecarソリューションによってデプロイされたpostanalyticsモジュールを使用します。
* `true`: 有効にする場合は、`postanalytics.external.host`と`postanalytics.external.port`の値でpostanalyticsモジュールの外部アドレスを提供してください。

  `true`に設定すると、Sidecarソリューションはpostanalyticsモジュールを起動しませんが、指定した`postanalytics.external.host`と`postanalytics.external.port`でそれにアクセスすることを期待します。

## postanalytics.external.host

別途インストールされたpostanalyticsモジュールのドメインまたはIPアドレスです。`postanalytics.external.enabled`が`true`に設定されている場合、このフィールドは必須です。

この機能はHelmリリース4.6.4からサポートされています。

例示する値： `tarantool.domain.external` または `10.10.0.100`。

指定したホストは、Sidecar HelmチャートがデプロイされたKubernetesクラスタからアクセス可能である必要があります。

## postanalytics.external.port

Wallarm postanalyticsモジュールが動作しているTCPポートです。デフォルトでは、Sidecarソリューションがこのポートにモジュールをデプロイするため、ポート3313を使用します。

`postanalytics.external.enabled`が`true`に設定されている場合、指定された外部ホストでモジュールが動作しているポートを指定してください。