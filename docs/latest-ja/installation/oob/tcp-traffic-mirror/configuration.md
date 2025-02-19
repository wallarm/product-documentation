# TCPトラフィックミラー解析の設定

TCPトラフィックミラー解析用Wallarmノードのデプロイに使用する設定ファイル（[deployment instructions](deployment.md)に記載の通り`wallarm-node-conf.yaml`）において、導入されるソリューションを詳細に調整できます。

## 基本設定

```yaml
version: 2

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

Wallarmノードの動作モードです。TCPトラフィックミラー解析の場合、`tcp-capture`である必要があります。

### goreplay.filter

トラフィックキャプチャに使用するネットワークインターフェースを指定します。値が指定されない場合、インスタンス上のすべてのネットワークインターフェースからトラフィックをキャプチャします。

値はコロン（`:`）で区切られたネットワークインターフェースとポートである必要があります。例：

=== "インターフェース:ポート"
    ```yaml
    version: 2

    goreplay:
      filter: 'eth0:80'
    ```

複数のインターフェースおよびポートからトラフィックをキャプチャするには、`goreplay.filter`と共に`goreplay.extra_args`を使用します。例：

```yaml
version: 2

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

この`filter`は`-input-raw`引数でGoReplayを設定し、`extra_args`を使用することで追加の`-input-raw`入力を指定できます。

=== "インターフェース上の全ポート"
    ```yaml
    version: 2

    goreplay:
      filter: 'eth0:'
    ```
=== "すべてのインターフェースで特定のポート"
    ```yaml
    version: 2

    goreplay:
      filter: ':80'
    ```
=== "すべてのインターフェースとポート"
    ```yaml
    version: 2

    goreplay:
      filter: ':'
    ```

ホストで利用可能なネットワークインターフェースを確認するには、次のコマンドを実行します：

```
ip addr show
```

### goreplay.extra_args

このパラメータは、GoReplayに渡す[追加引数](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md)を指定できます。

* 通常、VLANやVXLANなど、解析対象のミラーリングトラフィックの種類を定義するために使用します。例：

    === "VLANでラップされたミラーリングトラフィック"
        ```yaml
        version: 2

        goreplay:
          extra_args:
            - -input-raw-vlan
            - -input-raw-vlan-vid
            # VLANのVID、例：
            # - 42
        ```
    === "VXLANでラップされたミラーリングトラフィック（AWSで一般的）"
        ```yaml
        version: 2

        goreplay:
          extra_args:
            - -input-raw-engine
            - vxlan
            # カスタムVXLAN UDPポート、例：
            # - -input-raw-vxlan-port 
            # - 4789
            # 特定のVNI（デフォルトではすべてのVNIがキャプチャされます）、例：
            # - -input-raw-vxlan-vni
            # - 1
        ```

    ミラーリングされたトラフィックがVLANやVXLANなどの追加プロトコルでラップされていない場合、`extra_args`設定は省略できます。カプセル化されていないトラフィックはデフォルトで解析されます。
* また、追加のインターフェースおよびポートをキャプチャするために`filter`に`extra_args`を拡張して使用できます：

    ```yaml
    version: 2

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

    この`filter`は`-input-raw`引数でGoReplayを設定し、`extra_args`を使用することで追加の`-input-raw`入力を指定できます。

### route_config

特定のルートに対する設定を指定する構成セクションです。

### route_config.wallarm_application

[WallarmアプリケーションID](../../../user-guides/settings/applications.md)です。この値は特定のルートごとに上書きできます。

### route_config.routes

ルート固有のWallarm設定を指定します。WallarmモードやアプリケーションIDが含まれます。構成例：

```yaml
version: 2

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

ルートホストを指定します。

このパラメータはワイルドカードによるマッチングをサポートします：

* `*`は区切り文字以外の任意のシーケンスにマッチします
* `?`は区切り文字以外の任意の単一文字にマッチします
* `'[' [ '^' ] { character-range } ']'`

??? info "ワイルドカードマッチング構文の詳細"
    ```
    // パターン構文は：
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         区切り文字以外の任意のシーケンスにマッチします
    //		'?'         区切り文字以外の任意の単一文字にマッチします
    //		'[' [ '^' ] { character-range } ']' 文字クラス（空であってはならない）
    //		c           文字cにマッチします (c != '*', '?', '\\', '[')
    //		'\\' c      文字cにマッチします
    //
    //	character-range:
    //		c           文字cにマッチします (c != '\\', '-', ']')
    //		'\\' c      文字cにマッチします
    //		lo '-' hi   lo <= c <= hiの範囲の文字cにマッチします
    //
    // マッチは部分文字列ではなく、名前全体に対してパターンが一致する必要があります。
    ```

例：

```yaml
version: 2

route_config:
  wallarm_application: 10
  routes:
    - host: "*.host.com"
```

#### routes.routeまたはroute

特定のルートを定義します。ルートはNGINX風のプレフィックスで構成できます：

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ プレフィックス（正規表現より低い優先度）
        #  |   |   |    ^ プレフィックス（正規表現より高い優先度）
        #  |   |   ^ re（大文字小文字を区別しない）
        #  |   ^ re（大文字小文字を区別する）
        #  ^ 正確な一致
```

例えば、正確に一致するルートのみをマッチさせるには：

```yaml
- route: =/api/login
```

正規表現でルートをマッチさせるには：

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

[WallarmアプリケーションID](../../../user-guides/settings/applications.md)を設定します。特定のエンドポイントに対して`route_config.wallarm_application`を上書きします。

#### wallarm_mode

トラフィックの[フィルトレーションモード](../../../admin-en/configure-wallarm-mode.md)：`monitoring`または`off`です。OOBモードでは、トラフィックブロッキングはサポートされません。
デフォルト：`monitoring`です。

### http_inspector.real_ip_header

デフォルトでは、WallarmはネットワークパケットのIPヘッダーから送信元IPアドレスを読み取ります。しかし、プロキシやロードバランサーがこれを自身のIPアドレスに変更する場合があります。

実際のクライアントIPを保持するため、これらの中間機器はしばしばHTTPヘッダー（例：`X-Real-IP`、`X-Forwarded-For`）を追加します。`real_ip_header`パラメータは、元のクライアントIPの抽出に使用するヘッダーをWallarmに通知します。

### log.pretty

エラーおよびアクセスログの形式を制御します。人間が読みやすいログにするには`true`、JSONログにするには`false`に設定します。
デフォルト：`true`です。

### log.level

ログレベルです。`debug`、`info`、`warn`、`error`、`fatal`のいずれかです。
デフォルト：`info`です。

### log.log_file

エラーログ出力先を指定します。オプションは`stdout`、`stderr`、またはログファイルへのパスです。
デフォルト：`stderr`です。ただし、ノードは`stderr`を`/opt/wallarm/var/log/wallarm/go-node.log`にリダイレクトします。

### log.access_log (バージョン0.5.1以降)

#### enabled

アクセスログの収集を制御します。
デフォルト：`true`です。

#### verbose

アクセスログ出力に各リクエストの詳細情報を含めるかどうかを制御します。
デフォルト：`true`です。

#### log_file

アクセスログ出力先を指定します。オプションは`stdout`、`stderr`、またはログファイルへのパスです。
デフォルト：`stderr`です。ただし、ノードは`stderr`を`/opt/wallarm/var/log/wallarm/go-node.log`にリダイレクトします。

未設定の場合、[`log.log_file`](#loglog_file)の設定が使用されます。

## 詳細設定

```yaml
version: 2

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

### goreplay.path

GoReplayバイナリファイルへのパスを指定します。通常、このパラメータを変更する必要はありません。
デフォルト：`/opt/wallarm/usr/bin/gor`です。

### middleware.parse_responses

ミラーリングされたレスポンスを解析するかどうかを制御します。これにより、[脆弱性検出](../../../about-wallarm/detecting-vulnerabilities.md)や[API検出](../../../api-discovery/overview.md)など、レスポンスデータに依存するWallarm機能が有効になります。
デフォルトは`true`です。
レスポンスミラーリングがWallarmノードを用いるターゲットインスタンスに対して環境内で構成されていることを確認してください。

### middleware.response_timeout

レスポンスを待機する最大時間を指定します。この時間内にレスポンスが受信されない場合、Wallarmプロセスは該当するレスポンスの待機を停止します。
デフォルト：`5s`です。

### http_inspector.workers

Wallarmのワーカー数です。
デフォルト：`auto`（ワーカー数がCPUコア数に設定されます）。

### http_inspector.libdetection_enabled

[libdetection](../../../about-wallarm/protecting-against-attacks.md#libdetection-overview)ライブラリを使用してSQLインジェクション攻撃の追加検証を行うかどうかを指定します。
デフォルト：`true`です。

### http_inspector.api_firewall_enabled

[API Specification Enforcement](../../../api-specification-enforcement/overview.md)が有効かどうかを制御します。この機能を有効にしても、Wallarm Console UIによる必要なサブスクリプションと構成の代替にはならないことに注意してください。
デフォルト：`true`です。

### http_inspector.api_firewall_database

アップロードした[API Specification Enforcement](../../../api-specification-enforcement/overview.md)用のAPI仕様を含むデータベースへのパスを指定します。このデータベースはWallarm Cloudと同期されます。
通常、このパラメータを変更する必要はありません。
デフォルト：`/opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db`です。

### http_inspector.wallarm_dir

ノード設定ファイルのディレクトリパスを指定します。通常、このパラメータを変更する必要はありません。サポートが必要な場合は[Wallarm support team](mailto:support@wallarm.com)までお問い合わせください。
デフォルト：`/opt/wallarm/etc/wallarm`です。

### http_inspector.shm_dir

HTTPアナライザー用共有ディレクトリです。通常、このパラメータを変更する必要はありません。
デフォルト：`/tmp`です。

### tarantool_exporter.address

Wallarmのリクエスト処理における統計的リクエスト解析を担当するpostanalyticsサービスのアドレスを設定します。通常、このパラメータを変更する必要はありません。
デフォルト：`127.0.0.1:3313`です。

### tarantool_exporter.enabled

postanalyticsサービスが有効かどうかを制御します。Wallarmノードはpostanalyticsサービスなしでは動作しないため、このパラメータは`true`に設定する必要があります。
デフォルト：`true`です。

### log.proton_log_mask

内部トラフィックのログ記録用マスクを指定します。通常、このパラメータを変更する必要はありません。
デフォルト：`info@*`です。

### metrics.enabled

[Prometheus metrics](../../../admin-en/configure-statistics-service.md#usage)が有効かどうかを制御します。Wallarmノードが正しく動作するためには、このパラメータは`true`に設定する必要があります。
デフォルト：`true`です。

### metrics.listen_address

Prometheusメトリクスが公開されるアドレスとポートを設定します。これらのメトリクスにアクセスするには、`/metrics`エンドポイントを使用してください。
デフォルト：`:9000`（ポート9000のすべてのネットワークインターフェース）。

### metrics.legacy_status.enabled

[`/wallarm-status`](../../../admin-en/configure-statistics-service.md#usage)メトリクスサービスが有効かどうかを制御します。Wallarmノードが正しく動作するためには、このパラメータは`true`に設定する必要があります。
デフォルト：`true`です。

### metrics.legacy_status.listen_address

`/wallarm-status`メトリクス（JSON形式）が公開されるアドレスとポートを設定します。これらのメトリクスにアクセスするには、`/wallarm-status`エンドポイントを使用してください。
デフォルト：`127.0.0.1:10246`です。

### health_check.enabled

ヘルスチェックエンドポイントが有効かどうかを制御します。
デフォルト：`true`です。

### health_check.listen_address

`/live`および`/ready`ヘルスチェックエンドポイントが公開されるアドレスとポートを設定します。
デフォルト：`:8080`（ポート8080のすべてのネットワークインターフェース）。