# Sidecar HelmチャートのWallarm固有の値

このドキュメントでは、[Wallarm Sidecarのデプロイ](deployment.md)または[アップグレード][sidecar-upgrade-docs]の際に変更できる、Wallarm固有のHelmチャート値について説明します。Wallarm固有の値およびその他のチャート値は、Sidecar Helmチャートのグローバル構成に使用します。

!!! info "グローバル設定とPodごとの設定の優先順位"
    PodごとのアノテーションはHelmチャートの値よりも[優先されます](customization.md#configuration-area)。

変更が必要になる可能性がある[デフォルトの`values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml)のWallarm固有の部分は次のとおりです:

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
  wstore:
    config:
      arena: "2.0"
      serviceAddress: "[::]:3313"
    ### TLS構成設定（任意）
    tls:
      enabled: false
    #  certFile: "/root/test-tls-certs/server.crt"
    #  keyFile: "/root/test-tls-certs/server.key"
    #  caCertFile: "/root/test-tls-certs/ca.crt"
    #  mutualTLS:
    #    enabled: false
    #    clientCACertFile: "/root/test-tls-certs/ca.crt"
  ...
# カスタムのadmission webhook証明書をプロビジョニングするための任意のセクション
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

フィルタリングノードのトークン値です。Wallarm APIにアクセスするために必要です。

トークンは次の[種類][node-token-types]のいずれかです:

* **APIトークン（推奨）** - UIの整理のためにノードグループを動的に追加/削除する必要がある場合、またはセキュリティ向上のためにトークンのライフサイクルを管理したい場合に最適です。APIトークンを生成するには:

    APIトークンを生成するには:
    
    1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)のいずれかのWallarm Console → Settings → API tokensに移動します。
    1. 使用タイプが「Node deployment/Deployment」のAPIトークンを作成します。
    1. ノードのデプロイ時に、生成したトークンを使用し、`config.wallarm.api.nodeGroup`パラメータでグループ名を指定します。異なるAPIトークンを使用して複数のノードを1つのグループに追加できます。
* **ノードトークン** - 使用するノードグループがすでに分かっている場合に適しています。

    ノードトークンを生成するには:
    
    1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のいずれかのWallarm Console → Nodesに移動します。
    1. ノードを作成し、ノードグループに名前を付けます。
    1. ノードをデプロイする際、当該グループに含めたい各ノードで、そのグループのトークンを使用します。

このパラメータは、[`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret)の場合は無視されます。

## config.wallarm.api.host

Wallarm APIのエンドポイントです。次のいずれかを指定します:

* `us1.api.wallarm.com` — [US cloud][us-cloud-docs]向け
* `api.wallarm.com` — [EU cloud][eu-cloud-docs]向け（デフォルト）

## config.wallarm.api.nodeGroup

新たにデプロイしたノードを追加するフィルタリングノードのグループ名を指定します。この方法でのノードのグループ化は、使用タイプが「Node deployment/Deployment」のAPIトークン（値は`config.wallarm.api.token`パラメータで渡します）を使用してCloudにノードを作成・接続する場合にのみ利用できます。

**デフォルト値**: `defaultSidecarGroup`

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-node-group`.

## config.wallarm.api.existingSecret

Helmチャートバージョン4.4.4以降、この設定ブロックを使用してKubernetesのSecretからWallarmノードトークンの値を取得できます。外部のシークレット管理（例: external secretsオペレーターを使用している場合）を行う環境に有用です。

K8sのSecretにノードトークンを保存し、Helmチャートに取り込むには:

1. Wallarmノードトークンを使用してKubernetesのSecretを作成します:

    ```bash
    kubectl -n wallarm-sidecar create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * デプロイ手順に従い変更を加えていない場合、`wallarm-sidecar`はWallarm Sidecarコントローラーを含むHelmリリース用に作成されたKubernetesのNamespaceです。別のNamespaceを使用している場合は名称を置き換えてください。
    * `wallarm-api-token`はKubernetesのSecret名です。
    * `<WALLARM_NODE_TOKEN>`はWallarm ConsoleのUIからコピーしたWallarmノードトークンの値です。

    外部のシークレットオペレーターを使用する場合は、[適切なドキュメントに従ってシークレットを作成](https://external-secrets.io)してください。
1. `values.yaml`で次の構成を設定します:

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

**デフォルト値**: `existingSecret.enabled: false`。この場合、Helmチャートは`config.wallarm.api.token`からWallarmノードトークンを取得します。

## config.wallarm.apiFirewall

リリース4.10から利用可能な[API Specification Enforcement][api-spec-enforcement-docs]の設定を制御します。デフォルトで有効で、以下のとおりに設定されています。この機能を使用している場合、これらの値は変更しないことを推奨します。

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

ノード5.3.0以降、以下が提供されています（上記の例のデフォルト値を参照してください）:

| 設定 | 説明 |
| ------- | ----------- |
| `readBufferSize` | 要求読み込みの接続ごとのバッファサイズです。これはヘッダーの最大サイズも制限します。クライアントが複数KBのRequestURIや複数KBのヘッダー（例: 大きなCookie）を送信する場合はこのバッファを増やしてください。 |
| `writeBufferSize` | 応答書き込みの接続ごとのバッファサイズです。 |
| `maxRequestBodySize` | 要求ボディの最大サイズです。この制限を超えるボディを持つ要求はサーバーが拒否します。 |
| `disableKeepalive` | Keep-Alive接続を無効にします。このオプションが`true`に設定されている場合、サーバーはクライアントへの最初の応答送信後、すべての受信接続を閉じます。 |
| `maxConnectionsPerIp` | IPごとに許可される同時クライアント接続の最大数です。`0` = `無制限`。 |
| `maxRequestsPerConnection` | 接続あたりで処理される要求の最大数です。最後の要求後にサーバーは接続を閉じます。最後の応答には`Connection: close`ヘッダーが追加されます。`0` = `無制限`。 |

## config.wallarm.fallback

値を`on`（デフォルト）にすると、NGINXサービスは緊急モードに入る能力を持ちます。Wallarm Cloudの利用不能によりproton.dbやカスタムルールセットをダウンロードできない場合、この設定はWallarmモジュールを無効にし、NGINXの動作を維持します。

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-fallback`.

## config.wallarm.mode

グローバルな[トラフィックフィルタリングモード][configure-wallarm-mode-docs]です。指定可能な値:

* `monitoring`（デフォルト）
* `safe_blocking`
* `block`
* `off`

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode`.

## config.wallarm.modeAllowOverride

Cloudの設定経由で`wallarm_mode`値を[上書きできるかどうか][filtration-mode-priorities-docs]を管理します。指定可能な値:

* `on`（デフォルト）
* `off`
* `strict`

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode-allow-override`.

## config.wallarm.enableLibDetection

[libdetection][libdetection-docs]ライブラリを使用してSQLインジェクション攻撃を追加で検証するかどうか。指定可能な値:

* `on`（デフォルト）
* `off`

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-enable-libdetection`.

## config.wallarm.parseResponse

アプリケーションの応答を攻撃検知のために解析するかどうか。指定可能な値:

* `on`（デフォルト）
* `off`

応答の解析は、[パッシブ検出][passive-detection-docs]および[脅威リプレイテスト][active-threat-verification-docs]における脆弱性検出に必要です。

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-response`.

## config.wallarm.aclExportEnable

denylistに登録された[IP][denylist-docs]からのリクエストに関する統計をノードからCloudへ送信することを`on`で有効化 / `off`で無効化します。

* `config.wallarm.aclExportEnable: "on"`（デフォルト）の場合、denylistに登録されたIPからのリクエストに関する統計は**Attacks**セクションに[表示されます][denylist-view-events-docs]。
* `config.wallarm.aclExportEnable: "off"`の場合、denylistに登録されたIPからのリクエストに関する統計は表示されません。

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-acl-export-enable`.

## config.wallarm.parseWebsocket

WallarmはWebSocketを完全にサポートしています。デフォルトでは、WebSocketのメッセージは攻撃解析されません。この機能を有効化するには、API Securityの[サブスクリプションプラン][subscriptions-docs]を有効にし、この設定を使用します。

指定可能な値:

* `on`
* `off`（デフォルト）

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket`.

## config.wallarm.unpackResponse

アプリケーションの応答で返される圧縮データを解凍するかどうか:

* `on`（デフォルト）
* `off`

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`.

## config.nginx.workerConnections

NGINXワーカープロセスが開くことができる[同時接続数](http://nginx.org/en/docs/ngx_core_module.html#worker_connections)の最大値です。

**デフォルト値**: `4096`。

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/nginx-worker-connections`.

## config.nginx.workerProcesses

[NGINXワーカープロセスの数](http://nginx.org/en/docs/ngx_core_module.html#worker_processes)です。

**デフォルト値**: `auto`。これは、ワーカー数がCPUコア数に設定されることを意味します。

[**Podのアノテーション**](pod-annotations.md): `sidecar.wallarm.io/nginx-worker-processes`.

## config.nginx.logs.extended

NGINXで拡張ログを有効にします。拡張ログには、リクエスト時間、アップストリーム応答時間、リクエスト長、接続の詳細などが含まれます。

リリース5.3.0以降でサポートされています。

**デフォルト値**: `false`。

## config.nginx.logs.format

`config.nginx.logs.extended`が`true`に設定されている場合の拡張ログの形式を指定します。`text`と`json`形式をサポートします。

リリース5.3.0以降でサポートされています。

**デフォルト値**: `text`。

## postanalytics.external.enabled

Sidecarソリューションのデプロイ時にインストールされたpostanalytics（wstore）モジュールを使用するか、外部ホストにインストールされたものを使用するかを決定します。

この機能はHelmリリース4.6.4以降でサポートされています。

指定可能な値:

* `false`（デフォルト）: Sidecarソリューションがデプロイしたpostanalyticsモジュールを使用します。
* `true`: 有効にする場合、`postanalytics.external.host`および`postanalytics.external.port`に外部のpostanalyticsモジュールのアドレスを指定してください。

  `true`に設定した場合、Sidecarソリューションはpostanalyticsモジュールを実行せず、指定された`postanalytics.external.host`および`postanalytics.external.port`で到達できることを期待します。

## postanalytics.external.host

別途インストールされたpostanalyticsモジュールのドメインまたはIPアドレスです。`postanalytics.external.enabled`が`true`に設定されている場合は必須です。

この機能はHelmリリース4.6.4以降でサポートされています。

例: `wstore.domain.external`または`10.10.0.100`。

指定したホストには、Sidecar HelmチャートをデプロイしているKubernetesクラスターから到達できる必要があります。

## postanalytics.external.port

Wallarm postanalyticsモジュールが稼働しているTCPポートです。デフォルトでは、Sidecarソリューションがこのポートにモジュールをデプロイするため3313ポートを使用します。

`postanalytics.external.enabled`が`true`に設定されている場合、指定した外部ホストでモジュールが稼働しているポートを指定してください。

## postanalytics.wstore.config.serviceAddress

**wstore**が受信接続を受け付けるアドレスとポートを指定します。

リリース6.3.0以降でサポートされています。

**デフォルト値**: `[::]:3313` - すべてのIPv4およびIPv6インターフェースの3313番ポートで待ち受けます。これは6.3.0以前のバージョンのデフォルト動作でもありました。

## postanalytics.wstore.tls

postanalyticsモジュールへの安全な接続を可能にするTLSおよび相互TLS（mTLS）の設定を行います（任意）:

```yaml
config:
  wstore:
    tls:
      enabled: false
    #   certFile: "/root/test-tls-certs/server.crt"
    #   keyFile: "/root/test-tls-certs/server.key"
    #   caCertFile: "/root/test-tls-certs/ca.crt"
    #   mutualTLS:
    #     enabled: false
    #     clientCACertFile: "/root/test-tls-certs/ca.crt"

```

リリース6.2.0以降でサポートされています。

| パラメータ | 説明 | 必須か |
| --------- | ----------- | --------- |
| `enabled` | postanalyticsモジュールへの接続でSSL/TLSを有効または無効にします。デフォルトは`false`（無効）です。 | はい |
| `certFile` | フィルタリングノードがpostanalyticsモジュールへのSSL/TLS接続を確立する際、自身を認証するために使用するクライアント証明書のパスを指定します。 | 「`mutualTLS.enabled`」が`true`の場合は必須 |
| `keyFile` | `certFile`で指定したクライアント証明書に対応する秘密鍵のパスを指定します。 | 「`mutualTLS.enabled`」が`true`の場合は必須 |
| `caCertFile` | postanalyticsモジュールが提示するTLS証明書を検証するために使用する信頼された認証局（CA）証明書のパスを指定します。 | カスタムCAを使用する場合は必須 |
| `mutualTLS.enabled` | 相互TLS（mTLS）を有効にします。フィルタリングノードとpostanalyticsモジュールの双方が証明書により相互の正当性を検証します。デフォルトは`false`（無効）です。 | いいえ |
| `mutualTLS.clientCACertFile` | フィルタリングノードが提示するTLS証明書を検証するために使用する信頼された認証局（CA）証明書のパスを指定します。 | カスタムCAを使用する場合は必須 |

## controller.admissionWebhook.certManager.enabled

デフォルトの[`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen)の代わりに[`cert-manager`](https://cert-manager.io/)を使用してadmission webhookの証明書を生成するかどうか。リリース4.10.7以降でサポートされています

**デフォルト値**: `false`。

## controller.admissionWebhook.secret.enabled

デフォルトの[`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen)を使用する代わりに、admission webhook用の証明書を手動でアップロードするかどうか。リリース4.10.7以降でサポートされています。

**デフォルト値**: `false`。

`true`に設定した場合、base64でエンコードされたCA証明書、サーバー証明書、および秘密鍵を指定します。例:

```yaml
controller:
  admissionWebhook:
    secret:
      enabled: true
      ca: <base64-encoded-CA-certificate>
      crt: <base64-encoded-certificate>
      key: <base64-encoded-private-key>
```