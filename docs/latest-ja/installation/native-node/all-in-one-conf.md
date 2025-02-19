# All-in-OneインストーラーまたはDockerイメージを使用したNative Nodeの設定

self-hosted [Wallarm Native Node](../nginx-native-node-internals.md#native-node) をAll-in-OneインストーラーまたはDockerイメージを使用してデプロイする際、`.yaml` 設定ファイルを作成します．このファイルにおいて、ノードの設定および本ドキュメントに記載されたすべてのパラメータを指定できます．

All-in-Oneインストーラーを使用してノードが稼働中である場合、設定を変更するには以下を実行します:

1. `/opt/wallarm/etc/wallarm/go-node.yaml` ファイルを更新します．インストール時に初期設定ファイルがこのパスへコピーされます．
1. Wallarmサービスを再起動し、変更を適用します:

    ```
    sudo systemctl restart wallarm
    ```

Dockerイメージを使用してノードがデプロイされている場合、ホストマシン上の設定ファイルを更新し、更新したファイルでDockerコンテナを再起動することを推奨します．

## mode (必須)

Wallarmノードの動作モードを指定します．以下のいずれかになります:

* `connector-server` は [MuleSoft](../connectors/mulesoft.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md) コネクタ用です．
* `tcp-capture` は [TCP traffic mirror analysis](../oob/tcp-traffic-mirror/deployment.md) 用です．

=== "connector-server"
    Native NodeをWallarmコネクタ用にインストールした場合、基本的な設定は以下の通りです:

    ```yaml
    version: 2

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
      blocking: true
      allowed_networks:
        - 0.0.0.0/0
      allowed_hosts:
        - w.com
        - "*.test.com"
      mesh:
        discovery: dns
        name: native-node-mesh-discovery
        port: 9093
      url_normalize: true

    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
      routes:
        - route: /example/api/v1
          wallarm_mode: off
        - route: /example/extra_api
          wallarm_application: 2
        - route: /example/testing
          wallarm_mode: off

    log:
      pretty: true
      level: debug
      log_file: stderr
      access_log:
        enabled: true
        verbose: true
        log_file: stderr
    ```
=== "tcp-capture"
    TCP traffic mirror analysis用にNative Nodeをインストールした場合、基本的な設定は以下の通りです:

    ```yaml
    version: 3

    mode: tcp-capture

    goreplay:
      filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
      extra_args:
        - -input-raw-engine
        - vxlan
      path: /opt/wallarm/usr/bin/gor
      parse_responses: true
      response_timeout: 5s
      url_normalize: true

    http_inspector:
      real_ip_header: "X-Real-IP"
    
    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
      routes:
        - route: /example/api/v1
          wallarm_mode: off
        - route: /example/extra_api
          wallarm_application: 2
        - route: /example/testing
          wallarm_mode: off

    log:
      pretty: true
      level: debug
      log_file: stderr
      access_log:
        enabled: true
        verbose: true
        log_file: stderr
    ```

## コネクタ固有の設定

### connector.address (必須)

コロン（`:`）で区切られたリスニングIPアドレスとポートを指定します．

ポートが`80`、`8080`、`9000`、または`3313`にならないようにしてください．これらは他のWallarmプロセスで使用されています．

=== "IP address:Port"
    ```yaml
    version: 2

    connector:
      address: '192.158.1.38:5050'
    ```
=== "Specific port on all IPs"
    ```yaml
    version: 2

    connector:
      address: ':5050'
    ```

### connector.tls_cert (必須)

ノードが稼働しているドメインに対して発行されたTLS/SSL証明書へのパスを指定します（通常は`.crt`や`.pem`ファイル）．

安全な通信を確保するために、証明書は信頼された認証局（CA）から提供される必要があります．

Dockerイメージを使用してノードがデプロイされている場合、SSL復号はトラフィックがコンテナ化されたノードに到達する前にロードバランサーで実施されるため、このパラメータは必要ありません．

### connector.tls_key (必須)

TLS/SSL証明書に対応する秘密鍵へのパスを指定します（通常は`.key`ファイル）．

Dockerイメージを使用してノードがデプロイされている場合、SSL復号はトラフィックがコンテナ化されたノードに到達する前にロードバランサーで実施されるため、このパラメータは必要ありません．

### connector.blocking

通常、このパラメータを変更する必要はありません．悪意のあるリクエストに対する特定のブロッキング動作は、[`wallarm_mode`](#route_configwallarm_mode)パラメータで制御されます．

このパラメータは、悪意のあるリクエスト、denylisted IPからのリクエスト、またはその他ブロックが必要な条件の場合に、Native Nodeが着信リクエストをブロックする一般的な機能を有効にします．

初期値: `true`．

### connector.allowed_networks

接続を許可するIPネットワークのリストを指定します．

初期値: `0.0.0.0/0`（すべてのIPネットワークを許可）．

### connector.allowed_hosts

許可するホスト名のリストを指定します．

初期値: すべてのホストが許可されます．

このパラメータはワイルドカードによる一致をサポートします:

* `*` はセパレーター以外の任意の文字列に一致します
* `?` はセパレーター以外の任意の単一文字に一致します
* `'[' [ '^' ] { character-range } ']'`

??? info "ワイルドカード一致の構文詳細"
    ```
    // パターンの構文は以下の通りです:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         セパレーター以外の任意の文字列に一致します
    //		'?'         セパレーター以外の任意の単一文字に一致します
    //		'[' [ '^' ] { character-range } ']'
    //		            文字クラス（空であってはなりません）
    //		c           文字 c に一致します (c != '*', '?', '\\', '[')
    //		'\\' c      文字 c に一致します
    //
    //	character-range:
    //		c           文字 c に一致します (c != '\\', '-', ']')
    //		'\\' c      文字 c に一致します
    //		lo '-' hi   lo <= c <= hi に一致する文字 c に一致します
    //
    // マッチにはパターンがname全体に一致する必要があり、部分文字列のみではありません．
    ```

例えば:

```yaml
version: 2

connector:
  allowed_hosts:
    - w.com
    - "*.test.com"
```

### connector.mesh

`connector-server`モードにおけるWallarmノードで、多数のノードレプリカが展開されている場合、一貫したトラフィック処理を確実にするためにmesh機能を使用します．これにより、最初は異なるレプリカで処理されたリクエストとその応答が同じノードにルーティングされます．自動スケーリングやECSでの複数レプリカ展開時に重要です．

!!! info "Kubernetes環境"
    Kubernetesの場合、[Helm chartによるnative Wallarm nodeのデプロイ](helm-chart.md)を使用します．自動スケーリングや複数レプリカが検出された場合、meshは自動的に設定されるため、追加のセットアップは不要です．

ECSでmeshを設定するには:

1. サービスディスカバリ（例: [AWS Cloud Map](https://docs.aws.amazon.com/cloud-map/latest/dg/what-is-cloud-map.html)、[Google Cloud DNS](https://cloud.google.com/dns/)、または類似のサービス）を設定し、mesh内のノードが動的に相互を検出し通信できるようにします．

    サービスディスカバリがない場合、ノードは互いに位置を特定できず、トラフィックのルーティングに問題が発生するため、meshは正しく機能しません．
1. 以下のように設定ファイル内で`connector.mesh`パラメータを指定し、Wallarmノードにmeshを使用するよう構成します:

```yaml
version: 2

connector:
  mesh:
    discovery: dns
    name: native-node-mesh-discovery
    port: 9093
```

#### discovery

mesh内でノード同士がどのように検出されるかを定義します．現在、`dns` の値のみが許可されています．

ノードはDNSを使用して互いを検出します．DNSレコードはmeshに参加しているすべてのノードのIPアドレスに解決する必要があります．

#### name

mesh内の他のノードのIPアドレスを解決するために使用されるDNSドメイン名を指定します．通常、これはECSサービス内のすべてのノードインスタンスに解決される値に設定します．

#### port

mesh内のノード間通信に使用される内部ポートを指定します．このポートは外部には公開されず、ECSクラスター内でのノード間トラフィックに予約されています．

### connector.url_normalize

ルート構成の選択やlibprotonによるデータ解析前にURLの正規化を有効にします．

初期値: `true`．

## TCP mirror固有の設定

### goreplay.filter

トラフィックをキャプチャするネットワークインターフェースを指定します．値が指定されない場合、インスタンス上のすべてのネットワークインターフェースからトラフィックをキャプチャします．

値はコロン（`:`）で区切られたネットワークインターフェースとポート（例: 'eth0:80'）である必要があります．

=== "Interface:Port"
    ```yaml
    version: 3

    goreplay:
      filter: 'eth0:80'
    ```
    
    複数のインターフェースおよびポートからトラフィックをキャプチャするには、`goreplay.filter`と`goreplay.extra_args`を併用します．例:

    ```yaml
    version: 3

    goreplay:
      filter: 'eth0:80'
      extra_args:
        - "-input-raw"
        - "eth0:8080"
        - "-input-raw"
        - "eth0:8081"
        - "-input-raw"
        - "eth1:80"
    ```

    `filter` は `-input-raw` 引数付きでGoReplayを設定し、`extra_args`は追加の `-input-raw` 入力を指定できます．
=== "All ports on interface"
    ```yaml
    version: 3

    goreplay:
      filter: 'eth0:'
    ```
=== "Specific port on all interfaces"
    ```yaml
    version: 3

    goreplay:
      filter: ':80'
    ```
=== "All interfaces and ports"
    ```yaml
    version: 3

    goreplay:
      filter: ':'
    ```

ホスト上で利用可能なネットワークインターフェースを確認するには、以下を実行してください:

```
ip addr show
```

### goreplay.extra_args

このパラメータは、GoReplayに渡す[追加の引数](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md)を指定するためのものです．

* 一般的には、VLAN、VXLANなどの解析対象となるミラーリングされたトラフィックの種類を定義するために使用します．例えば:

    === "VLAN-wrapped mirrored traffic"
        ```yaml
        version: 3

        goreplay:
          extra_args:
            - -input-raw-vlan
            - -input-raw-vlan-vid
            # VID of your VLAN, e.g.:
            # - 42
        ```
    === "VXLAN-wrapped mirrored traffic (common in AWS)"
        ```yaml
        version: 3

        goreplay:
          extra_args:
            - -input-raw-engine
            - vxlan
            # Custom VXLAN UDP port, e.g.:
            # - -input-raw-vxlan-port 
            # - 4789
            # Specific VNI (by default, all VNIs are captured), e.g.:
            # - -input-raw-vxlan-vni
            # - 1
        ```

    ミラーリングされたトラフィックがVLANやVXLANなどの追加プロトコルでラップされていない場合、`extra_args`の設定は省略できます．ラップされていないトラフィックはデフォルトで解析されます．
* `filter`に`extra_args`を組み合わせることで、追加のインターフェースやポートからのキャプチャが可能です:

    ```yaml
    version: 3

    goreplay:
      filter: 'eth0:80'
      extra_args:
        - "-input-raw"
        - "eth0:8080"
        - "-input-raw"
        - "eth0:8081"
        - "-input-raw"
        - "eth1:80"
    ```

    `filter`は`-input-raw`引数付きでGoReplayを設定し、`extra_args`は追加の`-input-raw`入力を指定できます．

### goreplay.path

GoReplayバイナリファイルへのパスを指定します．通常、このパラメータを変更する必要はありません．

初期値: `/opt/wallarm/usr/bin/gor`．

### goreplay.parse_responses

ミラーリングされた応答を解析するかどうかを制御します．これにより、[脆弱性検出](../../about-wallarm/detecting-vulnerabilities.md)や[APIディスカバリー](../../api-discovery/overview.md)などのWallarm機能が有効になります．

初期値: `true`．

応答のミラーリングがWallarmノードに到達する対象インスタンスで構成されていることを確認してください．

Nodeバージョン0.10.1以前では、このパラメータは`middleware.parse_responses`として設定されます．

### goreplay.response_timeout

応答を待つ最大時間を指定します．この時間内に応答が得られない場合、Wallarmプロセスは対応する応答の待機を中止します．

初期値: `5s`．

Nodeバージョン0.10.1以前では、このパラメータは`middleware.response_timeout`として設定されます．

### goreplay.url_normalize

ルート構成の選択およびlibprotonによるデータ解析前にURLの正規化を有効にします．

初期値: `true`．

Nodeバージョン0.10.1以前では、このパラメータは`middleware.url_normalize`として設定されます．

### http_inspector.real_ip_header

通常、WallarmはネットワークパケットのIPヘッダーから送信元IPアドレスを読み取ります．しかし、プロキシやロードバランサーはこれを自身のIPに変更する場合があります．

実際のクライアントIPを保持するため、これらの中継機器はしばしばHTTPヘッダー（例: `X-Real-IP`、`X-Forwarded-For`）を追加します．`real_ip_header`パラメータは、元のクライアントIPを抽出するために使用するヘッダーをWallarmに指示します．

## 基本設定

### route_config

特定のルートに対する設定を指定するセクションです．

### route_config.wallarm_application

[WallarmアプリケーションID](../../user-guides/settings/applications.md)を指定します．この値は特定のルートで上書き可能です．

初期値: `-1`．

### route_config.wallarm_mode

一般的なトラフィックの[フィルトレーションモード](../../admin-en/configure-wallarm-mode.md)：`block`、`safe_blocking`、`monitoring`または`off`を指定します．OOBモードではトラフィックブロックはサポートされません．

モードは特定のルートで[上書き可能](#wallarm_mode)です．

初期値: `monitoring`．

### route_config.routes

ルート固有のWallarm設定を定義します．WallarmモードやアプリケーションIDが含まれます．例:

=== "connector-server"
    ```yaml
    version: 2

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
          wallarm_mode: off
    ```
=== "tcp-capture"
    ```yaml
    version: 3

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
          wallarm_mode: off
    ```

#### host

ルートのホストを指定します．

このパラメータは[`connector.allowed_hosts`](#connectorallowed_hosts)と同様のワイルドカード一致をサポートします．

例えば:

=== "connector-server"
    ```yaml
    version: 2

    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
    ```
=== "tcp-capture"
    ```yaml
    version: 3

    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
    ```

#### routes.routeまたはroute

特定のルートを定義します．ルートはNGINXライクなプレフィックスで設定できます:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ 正確な一致（正規表現より低い優先順位）
        #  |   |   |    ^ プレフィックス（一致、正規表現より高い優先順位）
        #  |   |   ^ 大文字小文字を区別しない正規表現
        #  |   ^ 大文字小文字を区別する正規表現
        #  ^ 完全一致
```

例えば、正確なルートのみをマッチさせるには:

```yaml
- route: =/api/login
```

正規表現でルートに一致させるには:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

特定のエンドポイントで[`route_config.wallarm_application`](../../user-guides/settings/applications.md)を上書きするWallarmアプリケーションIDを設定します．

#### wallarm_mode

ホスト固有のトラフィック[フィルトレーションモード](../../admin-en/configure-wallarm-mode.md)：`block`、`safe_blocking`、`monitoring`または`off`を指定します．OOBモードではトラフィックブロックはサポートされません．

初期値: `monitoring`．

### log.pretty

エラーおよびアクセスログのフォーマットを制御します．人間が読みやすいログにする場合は`true`、JSONログにする場合は`false`に設定します．

初期値: `true`．

### log.level

ログレベルを設定します．`debug`、`info`、`warn`、`error`、`fatal`が使用可能です．

初期値: `info`．

### log.log_file

エラーログの出力先を指定します．`stdout`、`stderr`、またはログファイルへのパスが使用可能です．

初期値: `stderr`．ただし、ノードは`stderr`を`/opt/wallarm/var/log/wallarm/go-node.log`へリダイレクトします．

### log.access_log.enabled

アクセスログの収集を制御します．

初期値: `true`．

### log.access_log.verbose

アクセスログ出力において、各リクエストの詳細情報を含めるかどうかを制御します．

初期値: `true`．

### log.access_log.log_file

アクセスログ出力の宛先を指定します．`stdout`、`stderr`、またはログファイルへのパスが使用可能です．

初期値: `stderr`．ただし、ノードは`stderr`を`/opt/wallarm/var/log/wallarm/go-node.log`へリダイレクトします．

未設定の場合、[`log.log_file`](#loglog_file)の設定が使用されます．

## 高度な設定

=== "connector-server"
    ```yaml
    version: 2

    http_inspector:
      workers: auto
      libdetection_enabled: true
      api_firewall_enabled: true
      api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
      wallarm_dir: /opt/wallarm/etc/wallarm
      shm_dir: /tmp
      wallarm_process_time_limit: 1s

    tarantool_exporter:
      address: 127.0.0.1:3313
      enabled: true

    log:
      proton_log_mask: info@*

    metrics:
      enabled: true
      listen_address: :9000
      legacy_status:
        enabled: true
        listen_address: 127.0.0.1:10246

    health_check:
      enabled: true
      listen_address: :8080
    ```
=== "tcp-capture"
    ```yaml
    version: 3

    http_inspector:
      workers: auto
      libdetection_enabled: true
      api_firewall_enabled: true
      api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
      wallarm_dir: /opt/wallarm/etc/wallarm
      shm_dir: /tmp
      wallarm_process_time_limit: 1s

    tarantool_exporter:
      address: 127.0.0.1:3313
      enabled: true

    log:
      proton_log_mask: info@*

    metrics:
      enabled: true
      listen_address: :9000
      legacy_status:
        enabled: true
        listen_address: 127.0.0.1:10246

    health_check:
      enabled: true
      listen_address: :8080
    ```

### http_inspector.workers

Wallarmワーカーの数を指定します．

初期値: `auto`（CPUコア数に基づいてワーカー数が設定されます）．

### http_inspector.libdetection_enabled

[SQL Injection攻撃](../../about-wallarm/protecting-against-attacks.md#libdetection-overview)を[libdetection](../../about-wallarm/protecting-against-attacks.md#libdetection-overview)ライブラリを使用して追加で検証するかどうかを指定します．

初期値: `true`．

### http_inspector.api_firewall_enabled

[API Specification Enforcement](../../api-specification-enforcement/overview.md)を有効にするかどうかを制御します．この機能を有効にしても、Wallarm Console UI上での必要なサブスクリプションおよび設定の代わりにはなりません．

初期値: `true`．

### http_inspector.api_firewall_database

[API Specification Enforcement](../../api-specification-enforcement/overview.md)のためにアップロードしたAPI仕様を保持するデータベースへのパスを指定します．このデータベースはWallarm Cloudと同期されます．

通常、このパラメータを変更する必要はありません．

初期値: `/opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db`．

### http_inspector.wallarm_dir

ノード設定ファイルの格納ディレクトリのパスを指定します．通常、このパラメータを変更する必要はありません．支援が必要な場合は[Wallarm support team](mailto:support@wallarm.com)にお問い合わせください．

初期値: `/opt/wallarm/etc/wallarm`．

### http_inspector.shm_dir

HTTPアナライザーの共有ディレクトリを指定します．通常、このパラメータを変更する必要はありません．

初期値: `/tmp`．

### http_inspector.wallarm_process_time_limit

Wallarm Native Nodeによる単一HTTPリクエストの処理に対する最大時間を定義します．

この制限を超えた場合、リクエストは[`overlimit_res`](../../attacks-vulns-list.md#resource-overlimit)攻撃としてマークされ、ブロックされます．

このパラメータまたは[Wallarm Console](../../user-guides/rules/configure-overlimit-res-detection.md)経由で制限を設定できます．Wallarm Consoleの設定はローカル設定より優先されます．

### tarantool_exporter.address

Wallarmのリクエスト処理における統計解析を行うpostanalyticsサービスのアドレスを設定します．通常、このパラメータを変更する必要はありません．

初期値: `127.0.0.1:3313`．

### tarantool_exporter.enabled

postanalyticsサービスが有効かどうかを制御します．Wallarmノードはpostanalyticsサービスなしでは機能しないため、このパラメータは`true`に設定する必要があります．

初期値: `true`．

### log.proton_log_mask

内部トラフィックのログ記録用マスクを設定します．通常、このパラメータを変更する必要はありません．

初期値: `info@*`．

### metrics.enabled

[Prometheus metrics](../../admin-en/configure-statistics-service.md#usage)が有効かどうかを制御します．Wallarmノードはこれが有効でないと正しく動作しないため、このパラメータは`true`に設定する必要があります．

初期値: `true`．

### metrics.listen_address

Prometheus metricsが公開されるアドレスおよびポートを設定します．これらのmetricsにアクセスするには、`/metrics`エンドポイントを使用します．

初期値: `:9000`（ポート9000上のすべてのネットワークインターフェース）．

### metrics.legacy_status.enabled

[`/wallarm-status`](../../admin-en/configure-statistics-service.md#usage) metricsサービスが有効かどうかを制御します．Wallarmノードはこれが有効でないと正しく動作しないため、このパラメータは`true`に設定する必要があります．

初期値: `true`．

### metrics.legacy_status.listen_address

JSON形式で`/wallarm-status` metricsが公開されるアドレスおよびポートを設定します．これらのmetricsにアクセスするには、`/wallarm-status`エンドポイントを使用します．

初期値: `127.0.0.1:10246`．

### health_check.enabled

ヘルスチェックエンドポイントを有効にするかどうかを制御します．

初期値: `true`．

### health_check.listen_address

`/live`および`/ready`ヘルスチェックエンドポイントのアドレスおよびポートを設定します．

初期値: `:8080`（ポート8080上のすべてのネットワークインターフェース）．
