```markdown
[us-cloud-docs]:                      ../../about-wallarm/overview.md#cloud
[eu-cloud-docs]:                      ../../about-wallarm/overview.md#cloud

# Helmチャートを使用したNative Nodeの設定

自己ホスト型[Wallarm Native Node](../nginx-native-node-internals.md#native-node)をHelmチャートを使用してデプロイする際、設定は`values.yaml`ファイルまたはCLIを通じて指定します。本ドキュメントでは利用可能な設定パラメータについて説明します。

デプロイ後に設定を変更するには、変更したいパラメータを指定して以下のコマンドを実行してください:

```
helm upgrade --set config.api.token=<VALUE> <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node
```

## 基本設定

既定の`values.yaml`にあるWallarm固有の設定部分のうち、基本的に変更する必要がある可能性があるものは以下のようになります:

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    nodeGroup: "defaultNodeNextGroup"

  connector:
    certificate:
      enabled: true
      certManager:
        enabled: false
        # issuerRef:
        #   name: letsencrypt-prod
        #   kind: ClusterIssuer
      existingSecret:
        enabled: false
        # name: my-secret-name
      customSecret:
        enabled: false
        # ca: LS0...
        # crt: LS0...
        # key: LS0...
    
    allowed_hosts: []
    mode: monitoring

    route_config: {}
      # wallarm_application: -1
      # routes:
        # - route: "/api/v1"
        #   wallarm_application: 1
        # - route: "/extra_api"
        #   wallarm_application: 2
        # - route: "/testing"
        #   wallarm_mode: monitoring
        # - host: "example.com"
        #   route: /api
        #   wallarm_application: 3

    log:
      pretty: false
      level: info
      log_file: stdout
      access_log:
        enabled: true
        verbose: false

processing:
  service:
    type: LoadBalancer
    port: 5000
```

### config.api.token (必須)

Wallarm Cloudへノードを接続するための[APIトークン](../../user-guides/settings/api-tokens.md)です。

APIトークンを生成するには:

1. Wallarm Console → **Settings** → **API tokens** にアクセスし、[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)のいずれかで設定してください。
1. **Deploy**ソースロールでAPIトークンを作成してください。

### config.api.host

Wallarm APIのエンドポイントです。以下から選択できます:

* [US cloud][us-cloud-docs]の場合は`us1.api.wallarm.com`
* [EU cloud][eu-cloud-docs]の場合は`api.wallarm.com`（既定値）

### config.api.nodeGroup

新しくデプロイされたノードを追加するフィルタリングノードのグループ名を指定します。

既定値: `defaultNodeNextGroup`

### config.connector.certificate.enabled (必須)

Wallarm Load Balancerが安全な通信のためにSSL/TLS証明書を使用するかどうかを制御します。

この値は**`true`に設定する必要があります**。また、通信のために**信頼された証明書**が発行されている必要があります。

SSL/TLS通信の管理には、`certManager`、`existingSecret`、または`customSecret`のいずれかの方法を使用できます。

#### certManager

クラスター内で[`cert-manager`](https://cert-manager.io/)を使用し、SSL/TLS証明書の生成にそれを利用する場合は、このセクションで対応する設定を指定してください。

設定例:

```yaml
config:
  connector:
    certificate:
      enabled: true
      certManager:
        enabled: true
        issuerRef:
          # cert-managerのIssuerまたはClusterIssuerの名前
          name: letsencrypt-prod
          # Issuer（namespaceスコープ）またはClusterIssuer（クラスタ全体）
          kind: ClusterIssuer
```

#### existingSecret

同一namespace内の既存のKubernetesシークレットからSSL/TLS証明書を取得する場合、この設定ブロックを使用できます。

設定例:

```yaml
config:
  connector:
    certificate:
      enabled: true
      existingSecret:
        enabled: true
        # 証明書と秘密鍵を含むKubernetesシークレットの名前
        name: my-secret-name
```

#### customSecret

`customSecret`設定では、Kubernetesシークレットやcert-managerなど外部ソースに依存せず、設定ファイル内で直接証明書を定義できます。

証明書、秘密鍵、およびオプションでCAはbase64エンコードされた値として指定します。

設定例:

```yaml
config:
  connector:
    certificate:
      enabled: true
      customSecret:
        enabled: true
        ca: LS0...
        crt: LS0...
        key: LS0...
```

### config.connector.allowed_hosts

許可されたホスト名のリストです。

既定値: すべてのホストが許可されます。

このパラメータはワイルドカードマッチングをサポートしています:

* `*` はセパレーター以外の任意の文字列に一致します
* `?` はセパレーター以外の任意の1文字に一致します
* `'[' [ '^' ] { character-range } ']'`

??? info "ワイルドカードマッチング構文の詳細"
    ```
    // パターン構文は以下の通りです:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         セパレーター以外の文字の任意の連続に一致
    //		'?'         セパレーター以外の1文字に一致
    //		'[' [ '^' ] { character-range } ']'
    //		            文字クラス（空であってはならない）
    //		c           文字 c に一致 (c != '*', '?', '\\', '[')
    //		'\\' c      文字 c に一致
    //
    //	character-range:
    //		c           文字 c に一致 (c != '\\', '-', ']')
    //		'\\' c      文字 c に一致
    //		lo '-' hi   lo <= c <= hi の文字 c に一致
    //
    // マッチするにはパターンが名前全体に一致する必要があり、部分文字列ではありません。
    ```

例えば:

```yaml
config:
  connector:
    allowed_hosts:
      - w.com
      - "*.test.com"
```

### config.connector.mode

一般的なトラフィックの[フィルトレーションモード](../../admin-en/configure-wallarm-mode.md)です。指定可能な値は`block`、`safe_blocking`、`monitoring`、または`off`です。OOBモードではトラフィックブロッキングはサポートされません。

既定値: `monitoring`

このモードは[特定のルートに対して上書きすることが可能です](#wallarm_mode).

### config.connector.route_config

特定のルートに対する設定を指定するセクションです。

### config.connector.route_config.wallarm_application

[WallarmアプリケーションID](../../user-guides/settings/applications.md)です。この値は特定のルートに対して上書き可能です。

既定値: `-1`

### config.connector.route_config.routes

WallarmのモードおよびアプリケーションIDなど、特定のルートに対する設定を行います。設定例:

```yaml
config:
  connector:
    route_config:
      wallarm_application: 10
      routes:
        - host: example.com
          wallarm_application: 1
          routes:
            - route: /app2
              wallarm_application: 2
        - host: api.example.com
          route: /api
          wallarm_application: 100
        - route: /testing
          wallarm_mode: off
```

#### host

ルートのホストを指定します。このパラメータは[`config.connector.allowed_hosts`](#configconnectorallowed_hosts)と同様のワイルドカードマッチングをサポートします。

例えば:

```yaml
config:
  connector:
    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
```

#### routes.route または route

特定のルートを定義します。ルートはNGINXライクなプレフィックスで設定可能です:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ プレフィックス (正規表現より低い優先度)
        #  |   |   |    ^ プレフィックス (正規表現より高い優先度)
        #  |   |   ^re 大文字小文字を区別しない
        #  |   ^re 大文字小文字を区別する
        #  ^ 完全一致
```

例えば、正確なルートにのみ一致させるには:

```yaml
- route: =/api/login
```

正規表現でルートに一致させるには:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

特定のエンドポイントに対して[WallarmアプリケーションID](../../user-guides/settings/applications.md)を設定します。`route_config.wallarm_application`を上書きします。

#### wallarm_mode

ホスト固有のトラフィック[フィルトレーションモード](../../admin-en/configure-wallarm-mode.md)です。指定可能な値は`block`、`safe_blocking`、`monitoring`、または`off`です。OOBモードではトラフィックブロッキングはサポートされません。

既定値: `monitoring`

### config.connector.log

`config.connector.log.*`設定セクションは、Native Node Helmチャートバージョン0.10.0から利用可能です。以前は、ログは`config.connector.log_level`パラメータのみで管理されていました。

#### pretty

エラーおよびアクセスログのフォーマットを制御します。人間が読みやすいログの場合は`true`、JSONログの場合は`false`を設定します。

既定値: `false`

#### level

ログレベルです。指定可能な値は`debug`、`info`、`warn`、`error`、`fatal`です。

既定値: `info`

#### log_file

エラーおよびアクセスログ出力の宛先を指定します。`stdout`、`stderr`、またはログファイルへのパスが選択できます。

既定値: `stdout`

#### access_log.enabled

アクセスログを収集するかどうかを制御します。

既定値: `true`

#### access_log.verbose

アクセスログ出力において、各リクエストの詳細情報を含めるかどうかを制御します。

既定値: `false`

### processing.service.type

Wallarmサービスのタイプです。以下から選択できます:

* `LoadBalancer`の場合、パブリックIPを持つロードバランサーとしてサービスを実行し、容易なトラフィックルーティングを実現します。

    これは[MuleSoft](../connectors/mulesoft.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md)コネクタに適しています。
* `ClusterIP`の場合、パブリックIPを使用せず、内部トラフィックのみを対象とします。

    これは[Kong API Gateway](../connectors/kong-api-gateway.md)または[Istio](../connectors/istio.md)コネクタに適しています。

既定値: `ClusterIP`

### processing.service.port

Wallarmサービスのポートです。

既定値: `5000`

## 高度な設定

追加で変更が必要となる可能性がある、既定の`values.yaml`にあるWallarm固有の設定部分は以下のようになります:

```yaml
config:
  connector:
    http_inspector:
      workers: auto
      api_firewall_enabled: true
      wallarm_dir: /opt/wallarm/etc/wallarm

processing:
  metrics:
    enabled: true
    port: 9090
```

### config.connector.http_inspector.workers

Wallarmのワーカー数です。

既定値: `auto` で、これはワーカー数がCPUコア数に設定されることを意味します。

### config.connector.http_inspector.api_firewall_enabled

[API Specification Enforcement](../../api-specification-enforcement/overview.md)が有効かどうかを制御します。なお、この機能を有効にしても、必要なサブスクリプションおよびWallarm Console UIを通じた設定の代替にはなりません。

既定値: `true`

### config.connector.http_inspector.wallarm_dir

ノード設定ファイルのディレクトリパスを指定します。通常、このパラメータを変更する必要はありません。支援が必要な場合は、[Wallarmサポートチーム](mailto:support@wallarm.com)までお問い合わせください。

既定値: `/opt/wallarm/etc/wallarm`

### processing.metrics.enabled

[Prometheus metrics](../../admin-en/configure-statistics-service.md#usage)が有効かどうかを制御します。このパラメータは`true`に設定する必要があります。Wallarmノードはこれが有効でなければ正しく動作しません。

既定値: `true`

### processing.metrics.port

Prometheus metricsが公開されるアドレスとポートを設定します。これらのメトリクスにアクセスするには`/metrics`エンドポイントを使用してください。

既定値: `:9000`（ポート9000のすべてのネットワークインターフェース）
```