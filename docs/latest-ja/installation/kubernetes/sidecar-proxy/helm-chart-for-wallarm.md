# Sidecar HelmチャートのWallarm固有の値

本書は[Wallarm Sidecarのデプロイ](deployment.md)または[アップグレード][sidecar-upgrade-docs]時に変更可能なWallarm固有のHelmチャートの値について説明します。Wallarm固有およびその他のチャート値は、Sidecar Helmチャートのグローバル設定用です。

!!! info "グローバル設定とPodごとの設定の優先順位"
    PodごとのannotationsはHelmチャートの値よりも[優先](customization.md#configuration-area)されます。

変更が必要な[デフォルトの`values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml)内のWallarm固有の部分は、以下のようになっています:

```yaml
config:
  wallarm:
    api:
      token: ""
      host: api.wallarm.com
      port: 443
      useSSL: true
      caVerify: true
      nodeGroup: "defaultSidecarGroup"
      existingSecret:
        enabled: false
        secretKey: token
        secretName: wallarm-api-token
    apiFirewall:
      mode: "on"
      readBufferSize: 8192
      writeBufferSize: 8192
      maxRequestBodySize: 4194304
      disableKeepalive: false
      maxConnectionsPerIp: 0
      maxRequestsPerConnection: 0
    fallback: "on"
    mode: monitoring
    modeAllowOverride: "on"
    enableLibDetection: "on"
    parseResponse: "on"
    aclExportEnable: "on"
    parseWebsocket: "off"
    unpackResponse: "on"
    ...
  nginx:
    workerProcesses: auto
    workerConnections: 4096
    logs:
      extended: false
      format: text
postanalytics:
  external:
    enabled: false
    host: ""
    port: 3313
  ...
# カスタムadmission webhook証明書提供用のオプション部分
# controller:
#  admissionWebhook:
#    certManager:
#      enabled: false
#    secret:
#      enabled: false
#      ca: <base64-encoded-CA-certificate>
#      crt: <base64-encoded-certificate>
#      key: <base64-encoded-private-key>
```

## config.wallarm.api.token

フィルタリングノードのトークン値です。Wallarm APIにアクセスするために必須です。

トークンは以下の[種類][node-token-types]の1つを使用できます:

* **API token (recommended)** - UIの整理のために、動的にノードグループを追加・削除する必要がある場合や、セキュリティ向上のためにトークンのライフサイクルを管理したい場合に最適です。APIトークンを生成するには:

    APIトークンを生成するには:
    
    1. Wallarm Console → **Settings** → **API tokens**にアクセスし、[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で行います。
    1. **Deploy**ソースロールを持つAPIトークンを作成します。
    1. ノードデプロイ時に生成されたトークンを使用し、`config.wallarm.api.nodeGroup`パラメータでグループ名を指定します。異なるAPIトークンを使用して複数のノードを1つのグループに追加できます。
* **Node token** - 既に使用するノードグループが決まっている場合に適しています。

    Nodeトークンを生成するには:
    
    1. Wallarm Console → **Nodes**にアクセスし、[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で行います。
    1. ノードを作成し、ノードグループに名前を付けます。
    1. ノードデプロイ時に、そのグループのトークンをノードごとに使用します。

`config.wallarm.api.existingSecret.enabled: true`の場合、このパラメータは無視されます。

## config.wallarm.api.host

Wallarm APIエンドポイントです。以下のいずれかになります:

* [US cloud][us-cloud-docs]の場合は`us1.api.wallarm.com`
* [EU cloud][eu-cloud-docs]の場合は`api.wallarm.com`（デフォルト）

## config.wallarm.api.nodeGroup

新たにデプロイされるノードを追加するフィルタリングノードのグループ名を指定します。この形式でのノードグループ化は、**Deploy**ロールを持つAPIトークン（`config.wallarm.api.token`で渡される値）を使用してCloudにノードを作成・接続する場合にのみ利用可能です。

**デフォルト値**: `defaultSidecarGroup`

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-node-group`.

## config.wallarm.api.existingSecret

Helm chartバージョン4.4.4以降、KubernetesのシークレットからWallarmノードトークンを取得するためにこの構成ブロックを使用できます。別々のシークレット管理を行っている環境（例: external secrets operatorを使用）に有用です。

WallarmノードトークンをK8sシークレットに格納し、Helmチャートに取り込むには:

1. Wallarmノードトークンを含むKubernetesシークレットを作成します:

    ```bash
    kubectl -n wallarm-sidecar create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * デプロイ手順に変更を加えずに実施した場合、`wallarm-sidecar`はWallarm SidecarコントローラーのHelmリリース用に作成されたKubernetesネームスペースです。別のネームスペースを使用する場合は、名前を適宜置き換えてください。
    * `wallarm-api-token`はKubernetesシークレット名です。
    * `<WALLARM_NODE_TOKEN>`はWallarm Console UIからコピーしたWallarmノードトークン値です。

    外部のシークレットオペレーターを使用する場合は、[該当のドキュメント](https://external-secrets.io)に従ってシークレットを作成してください。
1. `values.yaml`に以下の構成を設定します:

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

**デフォルト値**: `existingSecret.enabled: false`（HelmチャートはWallarmノードトークンを`config.wallarm.api.token`から取得します）。

## config.wallarm.apiFirewall

リリース4.10以降で利用可能な[API Specification Enforcement][api-spec-enforcement-docs]の設定を制御します。デフォルトでは有効になっており、以下の通りに設定されています。この機能を使用している場合、これらの値は変更せずにおくことを推奨します。

```yaml
config:
  wallarm:
    apiFirewall:
      mode: "on"
      readBufferSize: 8192
      writeBufferSize: 8192
      maxRequestBodySize: 4194304
      disableKeepalive: false
      maxConnectionsPerIp: 0
      maxRequestsPerConnection: 0
```

[node 5.3.0][sidecar-5.3.0-changelog]以降、以下の説明が付いています（上記の例のデフォルト値を参照）:

| 設定項目 | 説明 |
| ------- | ----------- |
| `readBufferSize` | リクエスト読み取り用の接続ごとのバッファサイズです。ヘッダーの最大サイズも制限されます。クライアントが数KB以上のRequestURIや数KB以上のヘッダー（例: 大きなCookie）を送信する場合は、このバッファを増加してください。 |
| `writeBufferSize` | レスポンス書き込み用の接続ごとのバッファサイズです。 |
| `maxRequestBodySize` | リクエストボディの最大サイズです。この制限を超えるリクエストボディはサーバが拒否します。 |
| `disableKeepalive` | keep-alive接続を無効にします。`true`に設定すると、サーバは最初のレスポンス送信後、すべての着信接続を閉じます。 |
| `maxConnectionsPerIp` | IPごとに許可される同時クライアント接続の最大数です。`0`は`無制限`を意味します。 |
| `maxRequestsPerConnection` | 接続ごとに処理される最大リクエスト数です。最後のリクエスト後にサーバは接続を閉じ、最後のレスポンスに`Connection: close`ヘッダーが追加されます。`0`は`無制限`を意味します。 |

## config.wallarm.fallback

デフォルトで`on`に設定されている場合、NGINXサービスは緊急モードに入ることが可能です。proton.dbまたはカスタムルールセットがWallarm Cloudからダウンロードできない場合（サービスが利用できない場合）、この設定によりWallarmモジュールは無効になり、NGINXを稼働状態に保ちます。

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-fallback`.

## config.wallarm.mode

グローバルな[トラフィックフィルトレーションモード][configure-wallarm-mode-docs]です。可能な値:

* `monitoring`（デフォルト）
* `safe_blocking`
* `block`
* `off`

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode`.

## config.wallarm.modeAllowOverride

Cloud内の設定を通じて`wallarm_mode`の値を上書きする[機能の管理][filtration-mode-priorities-docs]です。可能な値:

* `on`（デフォルト）
* `off`
* `strict`

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode-allow-override`.

## config.wallarm.enableLibDetection

[libdetection][libdetection-docs]ライブラリを使用してSQL Injection攻撃を追加で検証するかどうかです。可能な値:

* `on`（デフォルト）
* `off`

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-enable-libdetection`.

## config.wallarm.parseResponse

アプリケーションのレスポンスを攻撃検出のために解析するかどうかです。可能な値:

* `on`（デフォルト）
* `off`

レスポンス解析は、[パッシブ検出][passive-detection-docs]および[脅威再現テスト][active-threat-verification-docs]時の脆弱性検出に必要です。

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-response`.

## config.wallarm.aclExportEnable

ノードからCloudへ、[denylisted][denylist-docs] IPからのリクエスト統計情報を送信する機能を`on`で有効、`off`で無効にします。

* `config.wallarm.aclExportEnable: "on"`（デフォルト）の場合、denylisted IPからのリクエストに関する統計情報は**Attacks**セクションに[表示][denylist-view-events-docs]されます。
* `config.wallarm.aclExportEnable: "off"`の場合、denylisted IPからのリクエストに関する統計情報は表示されません。

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-acl-export-enable`.

## config.wallarm.parseWebsocket

WallarmはWebSocketsを完全にサポートします。デフォルトではWebSocketsのメッセージは攻撃解析されません。この機能を強制するには、API Securityの[サブスクリプションプラン][subscriptions-docs]をアクティベートし、この設定を使用してください。

可能な値:

* `on`
* `off`（デフォルト）

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket`.

## config.wallarm.unpackResponse

アプリケーションレスポンスで返される圧縮データを解凍するかどうかです:

* `on`（デフォルト）
* `off`

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`.

## config.nginx.workerConnections

NGINXワーカープロセスが開くことができる同時接続数の[最大値](http://nginx.org/en/docs/ngx_core_module.html#worker_connections)です。

**デフォルト値**: `4096`.

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/nginx-worker-connections`.

## config.nginx.workerProcesses

[NGINXワーカープロセス数](http://nginx.org/en/docs/ngx_core_module.html#worker_processes)です。

**デフォルト値**: `auto`（CPUコア数に応じてワーカー数が自動設定されます）。

[**Podのannotation**](pod-annotations.md): `sidecar.wallarm.io/nginx-worker-processes`.

## config.nginx.logs.extended

NGINXにおいて拡張ログ記録を有効にします。拡張ログにはリクエスト時間、upstreamレスポンス時間、リクエスト長、接続の詳細等が含まれます。

5.3.0リリース以降にサポートされています。

**デフォルト値**: `false`.

## config.nginx.logs.format

`config.nginx.logs.extended`が`true`に設定されている場合の拡張ログの形式を指定します。`text`および`json`形式がサポートされています。

5.3.0リリース以降にサポートされています。

**デフォルト値**: `text`.

## postanalytics.external.enabled

別ホストにインストールされたWallarmのpostanalytics（Tarantool）モジュールを使用するか、Sidecarソリューションのデプロイ時にインストールされるモジュールを使用するかを決定します。

この機能はHelmリリース4.6.4からサポートされています。

可能な値:

* `false`（デフォルト）：Sidecarソリューションによってデプロイされたpostanalyticsモジュールを使用します。
* `true`：有効にした場合、`postanalytics.external.host`および`postanalytics.external.port`に外部のpostanalyticsモジュールのアドレスを指定してください。

`true`に設定した場合、Sidecarソリューションはpostanalyticsモジュールを実行せず、指定された`postanalytics.external.host`および`postanalytics.external.port`で接続を試みます。

## postanalytics.external.host

別途インストールされたpostanalyticsモジュールのドメインまたはIPアドレスです。`postanalytics.external.enabled`が`true`に設定されている場合、必須項目です。

この機能はHelmリリース4.6.4からサポートされています。

例: `tarantool.domain.external`または`10.10.0.100`。

指定されたホストは、Sidecar HelmチャートがデプロイされているKubernetesクラスターからアクセス可能である必要があります。

## postanalytics.external.port

Wallarmのpostanalyticsモジュールが稼働するTCPポートです。デフォルトでは、Sidecarソリューションがこのポート（3313）でモジュールをデプロイするため、ポート3313を使用します。

`postanalytics.external.enabled`が`true`に設定されている場合、外部ホスト上でモジュールが稼働しているポートを指定してください。

## controller.admissionWebhook.certManager.enabled

既定の[`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen)ではなく、admission webhook証明書の生成に[`cert-manager`](https://cert-manager.io/)を使用するかどうかです。リリース4.10.7以降でサポートされています。

**デフォルト値**: `false`.

## controller.admissionWebhook.secret.enabled

既定の[`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen)ではなく、admission webhook用の証明書を手動でアップロードするかどうかです。リリース4.10.7以降でサポートされています。

**デフォルト値**: `false`.

`true`に設定した場合、base64エンコードされたCA証明書、サーバ証明書、および秘密鍵を指定してください。例:

```yaml
controller:
  admissionWebhook:
    secret:
      enabled: true
      ca: <base64-encoded-CA-certificate>
      crt: <base64-encoded-certificate>
      key: <base64-encoded-private-key>
```