[us-cloud-docs]:                      ../../about-wallarm/overview.md#cloud
[eu-cloud-docs]:                      ../../about-wallarm/overview.md#cloud

# HelmチャートでNative Nodeを構成する

Helmチャートを使用してセルフホスト型の[Wallarm Native Node](../nginx-native-node-internals.md#native-node)をデプロイする際は、構成は`values.yaml`ファイルまたはCLIで指定します。本ドキュメントでは、利用可能な構成パラメータの概要を説明します。

デプロイ後に設定を変更するには、変更したいパラメータを指定して次のコマンドを使用します。

```
helm upgrade --set config.api.token=<VALUE> <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node
```

## 基本設定

主に変更する可能性があるデフォルト`values.yaml`のWallarm固有の部分は次のとおりです。

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

    route_config: {}
      # wallarm_application: -1
      # wallarm_mode: monitoring
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

    proxy_headers:
      # ルール1: 社内プロキシ
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # ルール2: 外部エッジプロキシ（例: CDN、リバースプロキシ）
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP

    log:
      pretty: false
      level: info
      log_file: stdout
      access_log:
        enabled: true
        verbose: false

  aggregation:
    serviceAddress: "[::]:3313"

processing:
  service:
    type: LoadBalancer
    port: 5000
```

### config.api.token（必須）

ノードをWallarm Cloudに接続するための[APIトークン](../../user-guides/settings/api-tokens.md)です。

APIトークンを生成するには:

1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)のWallarm Console → Settings → API tokensに移動します。
1. 使用タイプが「Node deployment/Deployment」のAPIトークンを作成します。

### config.api.host

Wallarm APIエンドポイントです。次のいずれかです:

* `us1.api.wallarm.com`（[US Cloud][us-cloud-docs]向け）
* `api.wallarm.com`（[EU Cloud][eu-cloud-docs]向け、デフォルト）

### config.api.nodeGroup

新しくデプロイするノードを追加するフィルタリングノードグループ名を指定します。

デフォルト値: `defaultNodeNextGroup`

### config.connector.mode

Wallarmノードの動作モードです。次のいずれかです:

* `connector-server`（デフォルト）: MuleSoftの[Mule](../connectors/mulesoft.md)または[Flex](../connectors/mulesoft-flex.md) Gateway、[Akamai](../connectors/akamai-edgeworkers.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md)、[Kong API Gateway](../connectors/kong-api-gateway.md)、[IBM DataPower](../connectors/ibm-api-connect.md)の各コネクタ向けです。
* `envoy-external-filter`: Istioで管理されるAPI向けの[gRPCベースの外部処理フィルタ](../connectors/istio.md)です。

### config.connector.certificate.enabled（必須）

Wallarm Load Balancerが安全な通信のためにSSL/TLS証明書を使用するかどうかを制御します。

trueに設定する必要があり、通信には信頼できる証明書が必要です。

SSL/TLS通信の管理には、`certManager`、`existingSecret`、`customSecret`のいずれかの方式を使用できます。

#### certManager

クラスターで[`cert-manager`](https://cert-manager.io/)を使用しており、SSL/TLS証明書の生成にそれを用いる場合は、このセクションに対応する設定を指定します。

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
          # Issuer（Namespaceスコープ）かClusterIssuer（クラスター全体）か
          kind: ClusterIssuer
```

#### existingSecret

同一Namespace内の既存のKubernetes SecretからSSL/TLS証明書を取得して使用できます。

設定例:

```yaml
config:
  connector:
    certificate:
      enabled: true
      existingSecret:
        enabled: true
        # 証明書と秘密鍵を含むKubernetes Secretの名前
        name: my-secret-name
```

#### customSecret

`customSecret`構成では、Kubernetes Secretやcert-managerなどの外部ソースに依存せず、構成ファイル内に直接証明書を定義できます。

証明書、秘密鍵、必要に応じてCAはBase64エンコード値で指定します。

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

許可するホスト名の一覧です。

デフォルト値: すべてのホストが許可されます。

このパラメータはワイルドカード一致をサポートします:

* `*` は区切り文字以外の任意の連続した文字列に一致します
* `?` は区切り文字以外の任意の1文字に一致します
* `'[' [ '^' ] { character-range } ']'`

??? info "ワイルドカード一致の構文の詳細"
    ```
    // パターンの構文は次のとおりです:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         区切り文字以外の任意の連続した文字列に一致
    //		'?'         区切り文字以外の任意の1文字に一致
    //		'[' [ '^' ] { character-range } ']'
    //		            文字クラス（空であってはならない）
    //		c           文字cに一致（c != '*', '?', '\\', '['）
    //		'\\' c      文字cに一致
    //
    //	character-range:
    //		c           文字cに一致（c != '\\', '-', ']'）
    //		'\\' c      文字cに一致
    //		lo '-' hi   lo <= c <= hi の範囲の文字に一致
    //
    // 一致は部分文字列ではなく、名前全体に対してパターンが一致することを要求します。
    ```

例:

```yaml
config:
  connector:
    allowed_hosts:
      - w.com
      - "*.test.com"
```

### config.connector.route_config

特定のルート向けの設定を指定する構成セクションです。

### config.connector.route_config.wallarm_application

[WallarmアプリケーションID](../../user-guides/settings/applications.md)です。特定のルートでこの値を上書きできます。

デフォルト: `-1`。

### config.connector.route_config.wallarm_mode

トラフィックの[フィルタレーションモード](../../admin-en/configure-wallarm-mode.md): `block`、`safe_blocking`、`monitoring`、`off`のいずれかです。OOBモードではトラフィックのブロッキングはサポートされません。

この値は特定のルートで上書きできます。

!!! info "`off`値の書式"
    `off`値は"off"のように引用符で囲む必要があります。

デフォルト: `monitoring`。

### config.connector.route_config.routes

ルートごとのWallarm設定を定義します。WallarmモードやアプリケーションIDを含みます。設定例:

```yaml
config:
  connector:
    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
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
          wallarm_mode: block
```

#### host

ルートのホストを指定します。このパラメータは[`config.connector.allowed_hosts`](#configconnectorallowed_hosts)と同じワイルドカード一致をサポートします。

例:

```yaml
config:
  connector:
    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
```

#### routes.route または route

特定のルートを定義します。ルートはNGINX風のプレフィックスで設定できます:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ プレフィックス（正規表現より低い優先度）
        #  |   |   |    ^ プレフィックス（正規表現より高い優先度）
        #  |   |   ^ 正規表現（大文字小文字を区別しない）
        #  |   ^ 正規表現（大文字小文字を区別する）
        #  ^ 完全一致
```

例えば、完全一致のルートにのみ一致させるには:

```yaml
- route: =/api/login
```

正規表現でルートに一致させるには:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

[WallarmアプリケーションID](../../user-guides/settings/applications.md)を設定します。特定のエンドポイントに対して`route_config.wallarm_application`を上書きします。

#### wallarm_mode

ホスト固有のトラフィック[フィルタレーションモード](../../admin-en/configure-wallarm-mode.md): `block`、`safe_blocking`、`monitoring`、`off`のいずれかです。OOBモードではトラフィックのブロッキングはサポートされません。

!!! info "`off`値の書式"
    `off`値は"off"のように引用符で囲む必要があります。

デフォルト: `monitoring`。

### config.connector.proxy_headers

プロキシやロードバランサーを経由するトラフィックの場合に、Native NodeがオリジナルのクライアントIPとホストをどのように抽出するかを構成します。

* `trusted_networks`: 信頼するプロキシのIPレンジ（CIDR）です。`X-Forwarded-For`のようなヘッダーは、リクエストがこれらのネットワークから来た場合にのみ信頼します。

    省略した場合はすべてのネットワークを信頼します（非推奨）。
* `original_host`: プロキシにより変更された場合の元の`Host`値を取得するために使用するヘッダーです。
* `real_ip`: 実際のクライアントIPアドレスを抽出するために使用するヘッダーです。

プロキシの種類や信頼レベルごとに複数のルールを定義できます。

!!! info "ルールの評価順序"    
    各リクエストに対して最初に一致したルールのみが適用されます。

Native Node 0.17.1以降でサポートされます。

例:

```yaml
config:
  connector:
    proxy_headers:
      # ルール1: 社内プロキシ
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # ルール2: 外部エッジプロキシ（例: CDN、リバースプロキシ）
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP
```

### config.connector.log

`config.connector.log.*`構成セクションはNative Node Helmチャートのバージョン0.10.0から利用可能です。以前はロギングは`config.connector.log_level`パラメータのみで管理されていました。

#### pretty

エラーログとアクセスログの形式を制御します。可読性の高いログにするには`true`、JSONログにするには`false`を設定します。

デフォルト: `false`。

#### level

ログレベルです。`debug`、`info`、`warn`、`error`、`fatal`を指定できます。

デフォルト: `info`。

#### log_file

エラーログとアクセスログの出力先を指定します。`stdout`、`stderr`、またはログファイルへのパスを設定できます。

デフォルト: `stdout`。

#### access_log.enabled

アクセスログを収集するかどうかを制御します。

デフォルト: `true`。

#### access_log.verbose

アクセスログ出力に各リクエストの詳細情報を含めるかどうかを制御します。

デフォルト: `false`。

### config.aggregation.serviceAddress

wstoreが受信接続を受け付けるアドレスとポートを指定します。

リリース0.15.1以降でサポートされます。

デフォルト値: `[::]:3313` - すべてのIPv4およびIPv6インターフェースのポート3313で待ち受けます。これは0.15.1以前のバージョンでも同様のデフォルト動作でした。

### processing.service.type

Wallarmサービスのタイプです。次のいずれかです:

* `LoadBalancer`: パブリックIPを持つロードバランサーとしてサービスを実行し、トラフィックを容易にルーティングします。

    MuleSoftの[Mule](../connectors/mulesoft.md)または[Flex](../connectors/mulesoft-flex.md) Gateway、[Akamai](../connectors/akamai-edgeworkers.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md)、[IBM DataPower](../connectors/ibm-api-connect.md)、[Istio](../connectors/istio.md)の各コネクタに適しています。
* `ClusterIP`: パブリックIPを公開せず、内部トラフィック向けに使用します。

    これは[Kong API Gateway](../connectors/kong-api-gateway.md)コネクタに適しています。

デフォルト: `ClusterIP`。

### processing.service.port

Wallarmサービスのポートです。

デフォルト: `5000`。

## 高度な設定

追加で変更する可能性があるデフォルト`values.yaml`のWallarm固有の部分は次のとおりです。

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

drop_on_overload: true
```

### config.connector.input_filters

どの受信リクエストをNative Nodeが「検査」するか、または「バイパス」するかを定義します。画像やスクリプト、ヘルスチェックなど無関係なトラフィックを無視することでCPU使用率を低減します。

デフォルトでは、すべてのリクエストを検査します。

!!! warning "検査をスキップしたリクエストは分析もWallarm Cloudへの送信もされません"
    その結果、スキップしたリクエストはメトリクス、API Discovery、API sessions、脆弱性検出などに表示されません。Wallarmの各機能は適用されません。

**互換性**

* Native Node 0.16.1以降

**フィルタリングロジック**

フィルタリングロジックは次の2つのリストに基づきます:

* `inspect`: ここにあるいずれかのフィルタに一致したリクエストのみ検査します。

    省略または空の場合は、`bypass`で除外されない限り、すべてのリクエストを検査します。
* `bypass`: ここにあるフィルタに一致したリクエストは、`inspect`に一致しても検査しません。

**フィルタ形式**

各フィルタは次を含むオブジェクトです:

* `path`または`url`: リクエストパスに一致させるための正規表現（どちらもサポートされ、同等です）。
* `headers`: ヘッダー名をキー、値に一致させる正規表現を値とするマップです。

すべての正規表現は[RE2構文](https://github.com/google/re2/wiki/Syntax)に従う必要があります。

**例**

=== "トークンで許可し、静的コンテンツをスキップ"
    この設定は、`Authorization`ヘッダーに`Bearer`トークンを含むバージョン付きAPIエンドポイント（例: `/api/v1/...`）へのリクエストのみを検査します。
    
    画像、スクリプト、スタイルなどの静的ファイルや、ブラウザー発のHTMLページロードに対するリクエストはバイパスします。

    ```yaml
    config:
      connector:
        input_filters:
          inspect:
          - path: "^/api/v[0-9]+/.*"
            headers:
              Authorization: "^Bearer .+"
          bypass:
          - path: ".*\\.(png|jpg|css|js|svg)$"
          - headers:
              accept: "text/html"
    ```
=== "ドメインで許可し、ヘルスチェックをスキップ"
    この設定は`Host: api.example.com`のリクエストのみを検査し、その他はすべてスキップします。
    
    `/healthz`エンドポイントへのリクエストは、検査対象のホストに一致していても常にバイパスします。

    ```yaml
    config:
      connector:
        input_filters:
          inspect:
          - headers:
              host: "^api\\.example\\.com$"
          bypass:
          - path: "^/healthz$"
    ```

### config.connector.http_inspector.workers

Wallarmワーカー数です。

デフォルト: `auto`（CPUコア数と同数に自動設定）。

### config.connector.http_inspector.api_firewall_enabled

[API Specification Enforcement](../../api-specification-enforcement/overview.md)を有効にするかどうかを制御します。この機能を有効化しても、必要なサブスクリプションやWallarm Console UIでの設定に代わるものではない点にご注意ください。

デフォルト: `true`。

### config.connector.http_inspector.wallarm_dir

ノードの構成ファイルがあるディレクトリパスを指定します。通常、このパラメータを変更する必要はありません。支援が必要な場合は[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。

デフォルト: `/opt/wallarm/etc/wallarm`。

### processing.metrics.enabled

[Prometheusメトリクス](../../admin-en/configure-statistics-service.md#usage)を有効にするかどうかを制御します。このパラメータは`true`に設定する必要があります。無効にするとWallarmノードは正しく機能しません。

デフォルト: `true`。

### processing.metrics.port

Prometheusメトリクスを公開するアドレスとポートを設定します。これらのメトリクスには`/metrics`エンドポイントでアクセスします。

デフォルト: `:9000`（すべてのネットワークインターフェースのポート9000）。

### drop_on_overload

処理負荷が許容量を超えたときに、ノードが受信リクエストをドロップするかどうかを制御します。

**互換性**

* Native Node 0.16.1以降
* [Envoyコネクタ](../connectors/istio.md)では、動作は`failure_mode_allow`設定に依存します

    `drop_on_overload`構成は適用されません。

有効（`true`）にすると、ノードがリアルタイムにデータを処理できない場合、余剰入力をドロップして`503 (Service Unavailable)`で応答します。これにより、処理されていないリクエストが内部キューに蓄積して深刻なパフォーマンス低下やメモリ不足エラーを引き起こすことを防ぎます。

503を返すことで、アップストリームサービス、ロードバランサー、またはクライアントが過負荷状態を検出し、必要に応じてリクエストを再試行できるようになります。

[ブロッキングモード](../../admin-en/configure-wallarm-mode.md)では、そのようなリクエストはブロックされません。

デフォルト: `true`。