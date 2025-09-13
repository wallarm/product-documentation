# TCPトラフィックミラー解析の設定

TCPトラフィックミラー解析用のWallarmノードをデプロイするために作成する設定ファイル（[デプロイ手順](deployment.md)で指定されている`wallarm-node-conf.yaml`）では、デプロイされたソリューションを詳細に調整できます。

## 基本設定

```yaml
version: 4

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
  extra_args:
    - -input-raw-engine
    - vxlan

route_config:
  wallarm_application: 10
  routes:
    - route: /example/api/v1
      wallarm_mode: off
    - route: /example/extra_api
      wallarm_application: 2
    - route: /example/testing
      wallarm_mode: off

http_inspector:
  real_ip_header: "X-Real-IP"

log:
  pretty: true
  level: debug
  log_file: stderr
  access_log:
    enabled: true
    verbose: true
    log_file: stderr
```

### mode（必須）

Wallarmノードの動作モードです。TCPトラフィックミラー解析には`tcp-capture`を指定します。

### goreplay.filter

トラフィックをキャプチャするネットワークインターフェースを指定します。値を指定しない場合、インスタンス上のすべてのネットワークインターフェースからトラフィックをキャプチャします。

値はインターフェース名とポートをコロン（`:`）で区切って指定します。例:

=== "インターフェース:ポート"
    ```yaml
    version: 4

    goreplay:
      filter: 'eth0:80'
    ```

    複数のインターフェースやポートからトラフィックをキャプチャするには、`goreplay.filter`に加えて`goreplay.extra_args`を使用します。例:

    ```yaml
    version: 4

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

    `filter`はGoReplayに`-input-raw`引数を設定し、`extra_args`で追加の`-input-raw`入力を指定できます。
=== "インターフェース上の全ポート"
    ```yaml
    version: 4

    goreplay:
      filter: 'eth0:'
    ```
=== "すべてのインターフェース上の特定のポート"
    ```yaml
    version: 4

    goreplay:
      filter: ':80'
    ```
=== "すべてのインターフェースとポート"
    ```yaml
    version: 4

    goreplay:
      filter: ':'
    ```

ホストで使用可能なネットワークインターフェースを確認するには、次を実行します:

```
ip addr show
```

### goreplay.extra_args

このパラメータでは、GoReplayに渡す[追加引数](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md)を指定できます。

* 一般的には、VLANやVXLANなど、解析が必要なミラートラフィックの種類を定義するために使用します。例:

    === "VLANでラップされたミラートラフィック"
        ```yaml
        version: 4

        goreplay:
          extra_args:
            - -input-raw-vlan
            - -input-raw-vlan-vid
            # 使用するVLANのVID。例:
            # - 42
        ```
    === "VXLANでラップされたミラートラフィック（AWSで一般的）"
        ```yaml
        version: 4

        goreplay:
          extra_args:
            - -input-raw-engine
            - vxlan
            # カスタムVXLAN UDPポート。例:
            # - -input-raw-vxlan-port 
            # - 4789
            # 特定のVNI（デフォルトではすべてのVNIをキャプチャ）。例:
            # - -input-raw-vxlan-vni
            # - 1
        ```

    ミラートラフィックがVLANやVXLANなどの追加プロトコルでラップされていない場合、`extra_args`の設定は省略できます。非カプセル化トラフィックはデフォルトで解析されます。
* 追加のインターフェースやポートをキャプチャするために、`extra_args`で`filter`を拡張できます:

    ```yaml
    version: 4

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

    `filter`はGoReplayに`-input-raw`引数を設定し、`extra_args`で追加の`-input-raw`入力を指定できます。

### route_config

特定のルートに対する設定を指定するセクションです。

### route_config.wallarm_application

[WallarmアプリケーションID](../../../user-guides/settings/applications.md)です。この値は特定のルートで上書きできます。

### route_config.routes

ルートごとのWallarm設定を定義します。WallarmモードやアプリケーションIDを含みます。設定例:

```yaml
version: 4

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

ルートのホストを指定します。

このパラメータはワイルドカードマッチングをサポートします:

* `*` は区切り文字以外の任意の連続した文字列にマッチします
* `?` は区切り文字以外の任意の1文字にマッチします
* `'[' [ '^' ] { character-range } ']'`

??? info "ワイルドカードマッチング構文の詳細"
    ```
    // パターン構文は次のとおりです:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         区切り文字以外の任意の連続した文字列にマッチ
    //		'?'         区切り文字以外の任意の1文字にマッチ
    //		'[' [ '^' ] { character-range } ']'
    //		            文字クラス（空であってはならない）
    //		c           文字cにマッチ（c != '*', '?', '\\', '['）
    //		'\\' c      文字cにマッチ
    //
    //	character-range:
    //		c           文字cにマッチ（c != '\\', '-', ']'）
    //		'\\' c      文字cにマッチ
    //		lo '-' hi   lo <= c <= hi の範囲の文字cにマッチ
    //
    // マッチは部分一致ではなく、名前全体に対してパターンが一致することが必要です。
    ```

例:

```yaml
version: 4

route_config:
  wallarm_application: 10
  routes:
    - host: "*.host.com"
```

#### routes.routeまたはroute

特定のルートを定義します。ルートはNGINX風の接頭辞で設定できます:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ プレフィックス（正規表現より低い優先度）
        #  |   |   |    ^ プレフィックス（正規表現より高い優先度）
        #  |   |   ^ re（大文字小文字を区別しない）
        #  |   ^ re（大文字小文字を区別する）
        #  ^ 完全一致
```

例えば、完全一致のみをマッチさせるには:

```yaml
- route: =/api/login
```

正規表現でルートにマッチさせるには:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

[WallarmアプリケーションID](../../../user-guides/settings/applications.md)を設定します。特定のエンドポイントでは`route_config.wallarm_application`を上書きします。

#### wallarm_mode

トラフィックの[フィルタリングモード](../../../admin-en/configure-wallarm-mode.md)です。`monitoring`または`off`を指定します。OOBモードではトラフィックのブロックはサポートされません。

デフォルト: `monitoring`。

### http_inspector.real_ip_header

デフォルトでは、WallarmはネットワークパケットのIPヘッダーから送信元IPアドレスを読み取ります。ただし、プロキシやロードバランサーはこれを自分自身のIPに変更することがあります。

実クライアントIPを保持するために、これらの中間機器はしばしばHTTPヘッダー（例: `X-Real-IP`、`X-Forwarded-For`）を追加します。`real_ip_header`パラメータは、元のクライアントIPを抽出するために使用するヘッダーをWallarmに指示します。

### log.pretty

エラーログとアクセスログのフォーマットを制御します。人が読みやすい形式にするには`true`、JSONログにするには`false`を設定します。

デフォルト: `true`。

### log.level

ログレベルです。`debug`、`info`、`warn`、`error`、`fatal`を指定できます。

デフォルト: `info`。

### log.log_file

エラーログの出力先を指定します。`stdout`、`stderr`、またはログファイルへのパスを指定できます。

デフォルト: `stderr`。ただし、ノードは`stderr`を`/opt/wallarm/var/log/wallarm/go-node.log`にリダイレクトします。

### log.access_log（バージョン0.5.1以降）

#### enabled

アクセスログを収集するかどうかを制御します。

デフォルト: `true`。

#### verbose

アクセスログ出力に各リクエストの詳細情報を含めるかどうかを制御します。

デフォルト: `true`。

#### log_file

アクセスログの出力先を指定します。`stdout`、`stderr`、またはログファイルへのパスを指定できます。

デフォルト: `stderr`。ただし、ノードは`stderr`を`/opt/wallarm/var/log/wallarm/go-node.log`にリダイレクトします。

設定しない場合は、[`log.log_file`](#loglog_file)の設定が使用されます。

## 高度な設定

```yaml
version: 4

goreplay:
  path: /opt/wallarm/usr/bin/gor

middleware:
  parse_responses: true
  response_timeout: 5s

http_inspector:
  workers: auto
  libdetection_enabled: true
  api_firewall_enabled: true
  api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
  wallarm_dir: /opt/wallarm/etc/wallarm
  shm_dir: /tmp

postanalytics_exporter:
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

### goreplay.path

GoReplayバイナリのパスです。通常、このパラメータを変更する必要はありません。

デフォルト: `/opt/wallarm/usr/bin/gor`。

### middleware.parse_responses

ミラーされたレスポンスを解析するかどうかを制御します。[脆弱性検出](../../../about-wallarm/detecting-vulnerabilities.md)や[APIディスカバリー](../../../api-discovery/overview.md)など、レスポンスデータに依存するWallarmの機能を有効にします。

デフォルトでは`true`です。

環境で、Wallarmノードを搭載した対象インスタンスにレスポンスのミラーリングが構成されていることを確認してください。

### middleware.response_timeout

レスポンスを待機する最大時間を指定します。この時間内にレスポンスが受信されない場合、Wallarmのプロセスは該当するレスポンスの待機を停止します。

デフォルト: `5s`。

### http_inspector.workers

Wallarmのワーカー数です。

デフォルト: `auto`。CPUコア数に合わせてワーカー数が自動設定されます。

### http_inspector.libdetection_enabled

[libdetection](../../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)ライブラリを使用してSQLインジェクション攻撃を追加検証するかどうかです。

デフォルト: `true`。

### http_inspector.api_firewall_enabled

[API Specification Enforcement](../../../api-specification-enforcement/overview.md)を有効にするかどうかを制御します。この機能を有効化しても、必要なサブスクリプションやWallarm Console UIでの設定の代替にはなりません。

デフォルト: `true`。

### http_inspector.api_firewall_database

[API Specification Enforcement](../../../api-specification-enforcement/overview.md)用にアップロードしたAPI仕様を含むデータベースのパスを指定します。このデータベースはWallarm Cloudと同期します。

通常、このパラメータを変更する必要はありません。

デフォルト: `/opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db`。

### http_inspector.wallarm_dir

ノードの設定ファイル用ディレクトリのパスを指定します。通常、このパラメータを変更する必要はありません。支援が必要な場合は、[Wallarmサポートチーム](mailto:support@wallarm.com)にご連絡ください。

デフォルト: `/opt/wallarm/etc/wallarm`。

### http_inspector.shm_dir

HTTPアナライザーの共有ディレクトリです。通常、このパラメータを変更する必要はありません。

デフォルト: `/tmp`。

### postanalytics_exporter.address

Wallarmのリクエスト処理で統計的なリクエスト解析を行うpostanalyticsサービスのアドレスを設定します。通常、このパラメータを変更する必要はありません。

デフォルト: `127.0.0.1:3313`。

Node 0.12.x以前では、このパラメータは[`tarantool_exporter.address`](../../../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)として設定されます。アップグレード時には名称変更が必要です。

### postanalytics_exporter.enabled

postanalyticsサービスを有効にするかどうかを制御します。Wallarmノードはpostanalyticsサービスなしでは動作しないため、このパラメータは`true`に設定する必要があります。

デフォルト: `true`。

Node 0.12.x以前では、このパラメータは[`tarantool_exporter.enabled`](../../../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)として設定されます。アップグレード時には名称変更が必要です。

### log.proton_log_mask

内部トラフィックのロギング用マスクです。通常、このパラメータを変更する必要はありません。

デフォルト: `info@*`。

### metrics.enabled

[Prometheusメトリクス](../../../admin-en/configure-statistics-service.md#usage)を有効にするかどうかを制御します。これを無効にするとWallarmノードが正しく動作しないため、このパラメータは`true`に設定する必要があります。

デフォルト: `true`。

### metrics.listen_address

Prometheusメトリクスを公開するアドレスとポートを設定します。これらのメトリクスにアクセスするには`/metrics`エンドポイントを使用します。

デフォルト: `:9000`（ポート9000の全ネットワークインターフェース）。

### metrics.legacy_status.enabled

[`/wallarm-status`](../../../admin-en/configure-statistics-service.md#usage)メトリクスサービスを有効にするかどうかを制御します。これを無効にするとWallarmノードが正しく動作しないため、このパラメータは`true`に設定する必要があります。

デフォルト: `true`。

### metrics.legacy_status.listen_address

`/wallarm-status`メトリクス（JSON形式）を公開するアドレスとポートを設定します。これらのメトリクスにアクセスするには`/wallarm-status`エンドポイントを使用します。

デフォルト: `127.0.0.1:10246`。

### health_check.enabled

ヘルスチェックエンドポイントを有効にするかどうかを制御します。

デフォルト: `true`。

### health_check.listen_address

`/live`および`/ready`ヘルスチェックエンドポイントのアドレスとポートを設定します。

デフォルト: `:8080`（ポート8080の全ネットワークインターフェース）。