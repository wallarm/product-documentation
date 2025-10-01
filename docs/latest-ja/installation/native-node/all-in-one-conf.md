# All-in-Oneインストーラー、Dockerイメージ、AWS AMIでのNative Nodeの設定

All-in-Oneインストーラー、Dockerイメージ、AWS AMIを使用して自己ホスト型の[Wallarm Native Node](../nginx-native-node-internals.md#native-node)をデプロイする際、`.yaml`構成ファイルを作成します。このファイルにノードの設定を記述します。設定可能なすべてのパラメータは本ドキュメントで説明します。

All-in-OneインストーラーまたはAWS AMIでノードを起動した後に設定を変更するには:

1. `/opt/wallarm/etc/wallarm/go-node.yaml`ファイルを更新します。初期構成ファイルはインストール時にこのパスへコピーされます。
1. 変更を反映するためにWallarmサービスを再起動します:

    ```
    sudo systemctl restart wallarm
    ```

ノードをDockerイメージでデプロイしている場合は、ホスト側で構成ファイルを更新し、そのファイルを用いてDockerコンテナを再起動することを推奨します。

## mode (必須)

Wallarmノードの動作モードです。次のいずれかを指定します:

* `connector-server`: MuleSoft [Mule](../connectors/mulesoft.md) または [Flex](../connectors/mulesoft-flex.md) Gateway、[Akamai](../connectors/akamai-edgeworkers.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md)、[IBM DataPower](../connectors/ibm-api-connect.md)の各コネクタ用。
* `tcp-capture`: [TCPトラフィックミラー解析](../oob/tcp-traffic-mirror/deployment.md)用。
* `envoy-external-filter`: Istioで管理されるAPI向けの[gRPCベースの外部処理フィルタ](../connectors/istio.md)用。

=== "connector-server"
    Wallarmコネクタ用にNative Nodeをインストールした場合、基本的な設定は次のとおりです:

    ```yaml
    version: 4

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
      external_health_check:
        enabled: true
        endpoint: /wallarm-external-health
      # per_connection_limits:
        # max_requests: 300
        # max_received_bytes: 640_000
        # max_duration: 1m

    proxy_headers:
      # ルール1: 社内プロキシ
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # ルール2: 外部エッジプロキシ(例: CDN、リバースプロキシ)
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP
    
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
    TCPトラフィックミラー解析用にNative Nodeをインストールした場合、基本的な設定は次のとおりです:

    ```yaml
    version: 4

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

    proxy_headers:
      # ルール1: 社内プロキシ
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # ルール2: 外部エッジプロキシ(例: CDN、リバースプロキシ)
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP
      
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
=== "envoy-external-filter"
    Envoy外部フィルタとしてNative Nodeをインストールした場合、基本的な設定は次のとおりです:

    ```yaml
    version: 4

    mode: envoy-external-filter

    envoy_external_filter:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key

    proxy_headers:
      # ルール1: 社内プロキシ
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # ルール2: 外部エッジプロキシ(例: CDN、リバースプロキシ)
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP

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

コロン(`:`)で区切られた待ち受けIPアドレスとポートを指定します。

他のWallarmプロセスで使用されるため、ポートに`80`、`8080`、`9000`、`3313`を指定しないでください。

=== "IPアドレス:ポート"
    ```yaml
    version: 4

    connector:
      address: '192.158.1.38:5050'
    ```
=== "全IPの特定ポート"
    ```yaml
     version: 4

     connector:
       address: ':5050'
    ```

### connector.tls_cert (必須)

ノードが稼働するドメイン向けに発行されたTLS/SSL証明書(通常は`.crt`または`.pem`ファイル)へのパスです。

安全な通信のため、証明書は信頼された認証局(CA)により発行されている必要があります。

ノードをDockerイメージでデプロイしている場合、このパラメータは不要です。SSL復号は、トラフィックがコンテナ化されたノードに到達する前のロードバランサーレベルで行うべきだからです。

### connector.tls_key (必須)

TLS/SSL証明書に対応する秘密鍵(通常は`.key`ファイル)へのパスです。

ノードをDockerイメージでデプロイしている場合、このパラメータは不要です。SSL復号は、トラフィックがコンテナ化されたノードに到達する前のロードバランサーレベルで行うべきだからです。

### connector.blocking

通常、このパラメータを変更する必要はありません。不正リクエストの具体的なブロック動作は、[`wallarm_mode`](#route_configwallarm_mode)パラメータで制御します。

このパラメータは、リクエストが不正、denylistに登録されたIPからのもの、その他ブロックが必要な条件の場合に、Native Nodeが着信リクエストをブロックできるようにする全体的な機能を有効にします。

デフォルト: `true`。

### connector.allowed_networks

接続を許可するIPネットワークリストです。

デフォルト: `0.0.0.0/0`(すべてのIPネットワークを許可)。

### connector.allowed_hosts

許可するホスト名のリストです。

デフォルト: すべてのホストを許可。

このパラメータはワイルドカードマッチングをサポートします:

* `*` は区切り文字以外の任意の連続文字列にマッチします
* `?` は区切り文字以外の任意の1文字にマッチします
* `'[' [ '^' ] { character-range } ']'`

??? info "ワイルドカードマッチングの構文詳細"
    ```
    // パターン構文:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         区切り文字以外の任意の連続文字列にマッチ
    //		'?'         区切り文字以外の任意の1文字にマッチ
    //		'[' [ '^' ] { character-range } ']'
    //		            文字クラス(空であってはならない)
    //		c           文字cにマッチ(c != '*', '?', '\\', '[')
    //		'\\' c      文字cにマッチ
    //
    //	character-range:
    //		c           文字cにマッチ(c != '\\', '-', ']')
    //		'\\' c      文字cにマッチ
    //		'lo '-' hi  lo <= c <= hi の範囲の文字cにマッチ
    //
    // 一致は部分文字列ではなく、名前全体がパターンにマッチする必要があります。
    ```

例:

```yaml
version: 4

connector:
  allowed_hosts:
    - w.com
    - "*.test.com"
```

### connector.mesh

mesh機能は、`connector-server`モードで複数のノードレプリカがデプロイされている場合に、一貫したトラフィック処理を実現するために使用します。最初に別のレプリカで処理された場合でも、リクエストと対応するレスポンスを同じノードにルーティングします。これは、オートスケーリングやECSでの複数レプリカなど、水平スケーリングの際に重要です。

!!! info "Kubernetes環境"
    Kubernetesでは、[ネイティブWallarmノードのデプロイ用Helmチャート](helm-chart.md)を使用します。オートスケーリングや複数レプリカが検出されると、追加設定なしでmeshが自動的に構成されます。

ECSでmeshを構成するには:

1. サービスディスカバリ(例: [AWS Cloud Map](https://docs.aws.amazon.com/cloud-map/latest/dg/what-is-cloud-map.html)、[Google Cloud DNS](https://cloud.google.com/dns/) など)をセットアップし、mesh内のノードが動的に相互発見・通信できるようにします。

    サービスディスカバリがない場合、ノード同士が見つけられず、トラフィックルーティングの問題が発生するため、meshは正しく機能しません。
1. 次のように構成ファイルで`connector.mesh`パラメータを指定し、Wallarmノードでmeshを使用するように設定します:

```yaml
version: 4

connector:
  mesh:
    discovery: dns
    name: native-node-mesh-discovery
    port: 9093
```

#### discovery

mesh内のノード同士が相互発見する方法を定義します。現在は`dns`のみが利用可能です。

ノードはDNSを用いて相互発見します。DNSレコードは、meshに参加するすべてのノードのIPアドレスに解決される必要があります。

#### name

ノードがmesh内の他ノードのIPアドレスを解決するために使用するDNSドメイン名です。通常、ECSサービス内のすべてのノードインスタンスに解決される値に設定します。

#### port

mesh内のノード間通信に使用する内部ポートを指定します。このポートは外部に公開されず、ECSクラスター内のノード間トラフィック専用です。

### connector.url_normalize

ルート設定の選択およびlibprotonによるデータ解析の前にURL正規化を有効にします。

デフォルト: `true`。

### connector.external_health_check

Wallarm Nodeの可用性を外部システムが検証できるようにする、追加の外部ヘルスチェックエンドポイントを構成します。

エンドポイントはNode(パラメータ`connector.address`)と同じポートで提供され、Nodeが稼働している場合はHTTP 200 OKで応答します。

対応バージョン:

* Native Node 0.13.3以降の0.13.x
* Native Node 0.14.1以降
* AWS AMIでは未対応

```yaml
version: 4

connector:
  external_health_check:
    enabled: true
    endpoint: /wallarm-external-health
```

#### enabled

外部ヘルスチェックエンドポイントを有効/無効にします。`true`の場合、指定したエンドポイントがNodeと同じポートで利用可能になります。

デフォルト: `false`。

#### endpoint

外部ヘルスチェックエンドポイントを提供するURLパスを定義します。先頭は`/`である必要があります。

### connector.per_connection_limits

`keep-alive`接続に対する制限を定義します。指定した制限のいずれかに達すると、Nodeはクライアントに`Connection: Close`HTTPヘッダーを送信し、現在のTCPセッションを終了して以降のリクエストのために新しいセッションを確立するよう促します。

この仕組みにより、アップスケール後にクライアントが単一のNodeインスタンスに接続し続けるのを防ぎ、レベル4の負荷分散に役立ちます。

デフォルトでは制限は適用されません。これはほとんどのユースケースで推奨される設定です。

Native Node 0.13.4以降の0.13.x、および0.15.1以降でサポートされます。

```yaml
version: 4

connector:
  per_connection_limits:
    max_requests: 300
    max_received_bytes: 640_000
    max_duration: 1m
```

#### max_requests

単一の接続でクローズされる前に処理できる最大リクエスト数です。

#### max_received_bytes

接続を通じて受信できる最大バイト数です。

#### max_duration

接続の最大存続時間です(例: `1m`は1分)。

## TCPミラー固有の設定

### goreplay.filter

トラフィックをキャプチャするネットワークインターフェースを指定します。値を指定しない場合、インスタンス上のすべてのネットワークインターフェースからトラフィックをキャプチャします。

値はネットワークインターフェースとポートをコロン(`:`)で区切って指定します。例:

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
=== "全インターフェースの特定ポート"
    ```yaml
    version: 4

    goreplay:
      filter: ':80'
    ```
=== "全インターフェースかつ全ポート"
    ```yaml
    version: 4

    goreplay:
      filter: ':'
    ```

ホストで利用可能なネットワークインターフェースを確認するには、次を実行します:

```
ip addr show
```

### goreplay.extra_args

GoReplayに渡す[追加引数](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md)を指定できます。

* 一般的には、VLANやVXLANなど、解析対象とするミラーリングトラフィックの種類を定義するために使用します。例:

    === "VLANでカプセル化されたミラーリングトラフィック"
        ```yaml
        version: 4

        goreplay:
          extra_args:
            - -input-raw-vlan
            - -input-raw-vlan-vid
            # VLANのVID (例):
            # - 42
        ```
    === "VXLANでカプセル化されたミラーリングトラフィック(AWSで一般的)"
        ```yaml
        version: 4

        goreplay:
          extra_args:
            - -input-raw-engine
            - vxlan
            # カスタムVXLANのUDPポート (例):
            # - -input-raw-vxlan-port 
            # - 4789
            # 特定のVNI(デフォルトではすべてのVNIをキャプチャ) (例):
            # - -input-raw-vxlan-vni
            # - 1
        ```

    ミラーリングされたトラフィックがVLANやVXLANなどの追加プロトコルでカプセル化されていない場合は、`extra_args`の設定を省略できます。非カプセル化トラフィックはデフォルトで解析されます。
* 追加のインターフェースやポートをキャプチャするために、`filter`を`extra_args`で拡張できます:

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

### goreplay.path

GoReplayバイナリファイルへのパスです。通常、このパラメータを変更する必要はありません。

デフォルト: `/opt/wallarm/usr/bin/gor`。

### goreplay.parse_responses

ミラーリングされたレスポンスを解析するかどうかを制御します。これにより、[脆弱性検出](../../about-wallarm/detecting-vulnerabilities.md)や[API discovery](../../api-discovery/overview.md)など、レスポンスデータに依存するWallarmの機能が有効になります。

デフォルト: `true`。

レスポンスミラーリングがWallarmノードが稼働するターゲットインスタンスに向けて構成されていることを確認してください。

Nodeバージョン0.10.1以前では、このパラメータは`middleware.parse_responses`として設定します。

### goreplay.response_timeout

レスポンスを待機する最大時間を指定します。指定時間内にレスポンスが受信できない場合、Wallarmの処理は対応するレスポンスを待つのを停止します。

デフォルト: `5s`。

Nodeバージョン0.10.1以前では、このパラメータは`middleware.response_timeout`として設定します。

### goreplay.url_normalize

ルート設定の選択およびlibprotonによるデータ解析の前にURL正規化を有効にします。

デフォルト: `true`。

Nodeバージョン0.10.1以前では、このパラメータは`middleware.url_normalize`として設定します。

## Envoy外部フィルタ固有の設定

### envoy_external_filter.address (必須)

コロン(`:`)で区切られた待ち受けIPアドレスとポートを指定します。

他のWallarmプロセスで使用されるため、ポートに`80`、`8080`、`9000`、`3313`を指定しないでください。

=== "IPアドレス:ポート"
    ```yaml
    version: 4

    envoy_external_filter:
      address: '192.158.1.38:5080'
    ```
=== "全IPの特定ポート"
    ```yaml
    version: 4

    envoy_external_filter:
      address: ':5080'
    ```

### envoy_external_filter.tls_cert (必須)

ノードが稼働するドメイン向けに発行されたTLS/SSL証明書(通常は`.crt`または`.pem`ファイル)へのパスです。

安全な通信のため、証明書は信頼された認証局(CA)により発行されている必要があります。

ノードをDockerイメージでデプロイしている場合、このパラメータは不要です。SSL復号は、トラフィックがコンテナ化されたノードに到達する前のロードバランサーレベルで行うべきだからです。

### envoy_external_filter.tls_key (必須)

TLS/SSL証明書に対応する秘密鍵(通常は`.key`ファイル)へのパスです。

ノードをDockerイメージでデプロイしている場合、このパラメータは不要です。SSL復号は、トラフィックがコンテナ化されたノードに到達する前のロードバランサーレベルで行うべきだからです。

## 基本設定

### proxy_headers

トラフィックがプロキシやロードバランサを通過する場合に、Native Nodeが元のクライアントIPとホストをどのように抽出するかを設定します。

* `trusted_networks`: 信頼するプロキシのIP範囲(CIDR)。`X-Forwarded-For`などのヘッダーは、リクエストがこれらのネットワークから来た場合にのみ信頼します。

    省略した場合、すべてのネットワークを信頼します(非推奨)。
* `original_host`: プロキシによって`Host`値が変更された場合に、元の`Host`値の取得に使用するヘッダー。
* `real_ip`: 実際のクライアントIPアドレスを抽出するために使用するヘッダー。

異なるプロキシタイプや信頼レベルに対して、複数のルールを定義できます。

!!! info "ルールの評価順序"    
    リクエストごとに最初にマッチしたルールのみが適用されます。

Native Node 0.13.5以降の0.13.x、および0.15.1以降でサポートされます。

例:

```yaml
version: 4

proxy_headers:

  # ルール1: 社内プロキシ
  - trusted_networks:
      - 10.0.0.0/8
      - 192.168.0.0/16
    original_host:
      - X-Forwarded-Host
    real_ip:
      - X-Forwarded-For

  # ルール2: 外部エッジプロキシ(例: CDN、リバースプロキシ)
  - trusted_networks:
      - 203.0.113.0/24
    original_host:
      - X-Real-Host
    real_ip:
      - X-Real-IP
```

[`tcp-capture`](../oob/tcp-traffic-mirror/deployment.md)モードで動作するNode 0.14.1以前では、`http_inspector.real_ip_header`パラメータを使用してください。以降のバージョンでは、`proxy_headers`セクションに置き換えられます。

### route_config

特定のルートに対する設定を指定する構成セクションです。

### route_config.wallarm_application

[WallarmアプリケーションID](../../user-guides/settings/applications.md)。この値は特定のルートで上書きできます。

デフォルト: `-1`。

### route_config.wallarm_mode

一般的なトラフィックの[フィルタリングモード](../../admin-en/configure-wallarm-mode.md): `block`、`safe_blocking`、`monitoring`、`off`。OOBモードではトラフィックブロックはサポートされません。

このモードは[特定のルートで上書き可能](#wallarm_mode)です。

デフォルト: `monitoring`。

### route_config.routes

ルート固有のWallarm設定を行います。WallarmモードやアプリケーションIDを含みます。設定例:

=== "connector-server"
    ```yaml
    version: 4

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
    version: 4

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

ルートのホストを指定します。

このパラメータは、[`connector.allowed_hosts`](#connectorallowed_hosts)と同様のワイルドカードマッチングをサポートします。

例:

=== "connector-server"
    ```yaml
    version: 4

    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
    ```
=== "tcp-capture"
    ```yaml
    version: 4

    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
    ```

#### routes.route or route

特定のルートを定義します。ルートはNGINXに似たプレフィックスで設定できます:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ プレフィックス(正規表現より低い優先度)
        #  |   |   |    ^ プレフィックス(正規表現より高い優先度)
        #  |   |   ^ 正規表現(大文字小文字を区別しない)
        #  |   ^ 正規表現(大文字小文字を区別)
        #  ^ 完全一致
```

例えば、完全一致のみをマッチさせるには:

```yaml
- route: =/api/login
```

正規表現でルートをマッチさせるには:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

[WallarmアプリケーションID](../../user-guides/settings/applications.md)を設定します。特定のエンドポイントに対して`route_config.wallarm_application`を上書きします。

#### wallarm_mode

ホスト固有の[フィルタリングモード](../../admin-en/configure-wallarm-mode.md): `block`、`safe_blocking`、`monitoring`、`off`。OOBモードではトラフィックブロックはサポートされません。

デフォルト: `monitoring`。

### log.pretty

エラーログおよびアクセスログの形式を制御します。可読性の高いログにするには`true`、JSONログにするには`false`を設定します。

デフォルト: `true`。

### log.level

ログレベルです。`debug`、`info`、`warn`、`error`、`fatal`が指定できます。

デフォルト: `info`。

### log.log_file

エラーログの出力先を指定します。`stdout`、`stderr`、またはログファイルへのパスを指定できます。

デフォルト: `stderr`。ただし、ノードは`stderr`を`/opt/wallarm/var/log/wallarm/go-node.log`ファイルへリダイレクトします。

### log.access_log.enabled

アクセスログを収集するかどうかを制御します。

デフォルト: `true`。

### log.access_log.verbose

アクセスログ出力に各リクエストの詳細情報を含めるかどうかを制御します。

デフォルト: `true`。

### log.access_log.log_file

アクセスログの出力先を指定します。`stdout`、`stderr`、またはログファイルへのパスを指定できます。

デフォルト: `stderr`。ただし、ノードは`stderr`を`/opt/wallarm/var/log/wallarm/go-node.log`ファイルへリダイレクトします。

未設定の場合は、[`log.log_file`](#loglog_file)の設定が使用されます。

## 高度な設定

=== "connector-server"
    ```yaml
    version: 4

    input_filters:
      inspect:
      - path: "^/api/v[0-9]+/.*"
        headers:
          Authorization: "^Bearer .+"
      bypass:
      - path: ".*\\.(png|jpg|css|js|svg)$"
      - headers:
          accept: "text/html"
  
    http_inspector:
      workers: auto
      libdetection_enabled: true
      api_firewall_enabled: true
      api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
      wallarm_dir: /opt/wallarm/etc/wallarm
      shm_dir: /tmp
      wallarm_process_time_limit: 1s

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
      namespace: wallarm_gonode

    health_check:
      enabled: true
      listen_address: :8080
    
    drop_on_overload: true
    ```
=== "tcp-capture"
    ```yaml
    version: 4

    input_filters:
      inspect:
      - path: "^/api/v[0-9]+/.*"
        headers:
          Authorization: "^Bearer .+"
      bypass:
      - path: ".*\\.(png|jpg|css|js|svg)$"
      - headers:
          accept: "text/html"
    
    http_inspector:
      workers: auto
      libdetection_enabled: true
      api_firewall_enabled: true
      api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
      wallarm_dir: /opt/wallarm/etc/wallarm
      shm_dir: /tmp
      wallarm_process_time_limit: 1s

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
      namespace: wallarm_gonode

    health_check:
      enabled: true
      listen_address: :8080
    
    drop_on_overload: true
    ```

### input_filters

着信リクエストをNative Nodeで「検査する」か「バイパスする」かを定義します。静的アセットやヘルスチェックなど無関係なトラフィックを無視することでCPU使用率を削減します。

デフォルトでは、すべてのリクエストを検査します。

!!! warning "検査をスキップしたリクエストはWallarm Cloudで解析・送信されません"
    その結果、スキップされたリクエストはメトリクス、API Discovery、API sessions、脆弱性検出などに表示されません。これらにはWallarmの機能は適用されません。

**互換性**

* Native Node 0.13.7以降の0.13.x
* Native Node 0.16.0以降
* AWS AMIでは未対応

**フィルタリングロジック**

フィルタリングロジックは次の2つのリストに基づきます:

* `inspect`: ここで少なくとも1つのフィルターにマッチしたリクエストのみ検査します。

    省略または空の場合、`bypass`で除外されていない限り、すべてのリクエストを検査します。
* `bypass`: ここでいずれかのフィルターにマッチしたリクエストは、`inspect`にマッチしても検査しません。

**フィルター形式**

各フィルターは次を含むオブジェクトです:

* `path` または `url`: リクエストパスに対する正規表現(どちらもサポートされ同等)。
* `headers`: ヘッダー名とその値にマッチさせる正規表現パターンのマップ。

すべての正規表現は[RE2構文](https://github.com/google/re2/wiki/Syntax)に従う必要があります。

**例**

=== "トークンで許可し、静的コンテンツをスキップ"
    この構成は、`Authorization`ヘッダーに`Bearer`トークンを含む、バージョン付きAPIエンドポイント(例: `/api/v1/...`)へのリクエストのみを検査します。
    
    画像・スクリプト・スタイルなどの静的ファイルや、ブラウザ発のHTMLページロードはバイパスします。

    ```yaml
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
    この構成は、`Host: api.example.com`のリクエストのみを検査し、それ以外のリクエストはすべてスキップします。
    
    `/healthz`エンドポイントへのリクエストは、検査対象のホストにマッチしていても常にバイパスします。

    ```yaml
    input_filters:
      inspect:
      - headers:
        host: "^api\\.example\\.com$"
      bypass:
      - path: "^/healthz$"
    ```

### http_inspector.workers

Wallarmワーカー数です。

デフォルト: `auto`。CPUコア数に合わせてワーカー数が設定されます。

### http_inspector.libdetection_enabled

[libdetection](../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)ライブラリを使用してSQL Injection攻撃を追加検証するかどうか。

デフォルト: `true`。

### http_inspector.api_firewall_enabled

[API Specification Enforcement](../../api-specification-enforcement/overview.md)を有効にするかどうかを制御します。この機能を有効化しても、必要なサブスクリプションやWallarm Console UIでの設定に代わるものではない点にご注意ください。

デフォルト: `true`。

### http_inspector.api_firewall_database

[API Specification Enforcement](../../api-specification-enforcement/overview.md)用にアップロードしたAPI仕様を含むデータベースのパスを指定します。このデータベースはWallarm Cloudと同期されます。

通常、このパラメータを変更する必要はありません。

デフォルト: `/opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db`。

### http_inspector.wallarm_dir

ノードの構成ファイルディレクトリパスを指定します。通常、このパラメータを変更する必要はありません。支援が必要な場合は、[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。

デフォルト: `/opt/wallarm/etc/wallarm`。

### http_inspector.shm_dir

HTTPアナライザーの共有ディレクトリです。通常、このパラメータを変更する必要はありません。

デフォルト: `/tmp`。

### http_inspector.wallarm_process_time_limit

Wallarm Native Nodeが1件のHTTPリクエストを処理する最大時間を定義します。

制限を超えた場合、そのリクエストは[`overlimit_res`](../../attacks-vulns-list.md#resource-overlimit)攻撃としてマークされ、ブロックされます。

この制限は本パラメータで設定するか、[Wallarm Console](../../user-guides/rules/configure-overlimit-res-detection.md)から設定できます。Consoleからはブロックの有無も制御できます。Wallarm Consoleの設定はローカル設定より優先されます。

### postanalytics_exporter.address

Wallarmのリクエスト処理における統計分析を担当するpostanalyticsサービスのアドレスを設定します。通常、このパラメータを変更する必要はありません。

デフォルト: `127.0.0.1:3313`。

Nodeバージョン0.12.1以前では、このパラメータは`tarantool_exporter.address`として設定します。

### postanalytics_exporter.enabled

postanalyticsサービスを有効にするかどうかを制御します。Wallarmノードはpostanalyticsサービスなしでは機能しないため、このパラメータは`true`に設定する必要があります。

デフォルト: `true`。

Nodeバージョン0.12.1以前では、このパラメータは`tarantool_exporter.enabled`として設定します。

### log.proton_log_mask

内部トラフィックログのマスクです。通常、このパラメータを変更する必要はありません。

デフォルト: `info@*`。

### metrics.enabled

[Prometheusメトリクス](../../admin-en/configure-statistics-service.md#usage)を有効にするかどうかを制御します。これを`true`に設定しないと、Wallarmノードは正しく動作しません。

デフォルト: `true`。

### metrics.listen_address

Prometheusメトリクスを公開するアドレスとポートを設定します。アクセス時は`/metrics`エンドポイントを使用します。

デフォルト: `:9000`(全ネットワークインターフェースのポート9000)。

### metrics.legacy_status.enabled

[`/wallarm-status`](../../admin-en/configure-statistics-service.md#usage)メトリクスサービスを有効にするかどうかを制御します。これを`true`に設定しないと、Wallarmノードは正しく動作しません。

デフォルト: `true`。

### metrics.legacy_status.listen_address

JSON形式の`/wallarm-status`メトリクスを公開するアドレスとポートを設定します。アクセス時は`/wallarm-status`エンドポイントを使用します。

デフォルト: `127.0.0.1:10246`。

### metrics.namespace

`go-node`バイナリ( Native Nodeのコア処理サービス)が公開するPrometheusメトリクスの接頭辞を定義します。

デフォルト: `wallarm_gonode`。

`go-node`が出力するすべてのメトリクスはこの接頭辞を使用します(例: `wallarm_gonode_requests_total`)。`wstore`や`wcli`などノードの他コンポーネントは、それぞれ固定の接頭辞を使用します。

Native Node 0.13.5以降の0.13.x、および0.15.1以降でサポートされます。

### health_check.enabled

ヘルスチェックエンドポイントを有効にするかどうかを制御します。

デフォルト: `true`。

### health_check.listen_address

`/live`および`/ready`ヘルスチェックエンドポイントのアドレスとポートを設定します。

デフォルト: `:8080`(全ネットワークインターフェースのポート8080)。

### drop_on_overload

処理負荷が処理能力を超えたときに、Nodeが着信リクエストをドロップするかどうかを制御します。

**互換性**

* Native Node 0.16.1以降
* AWS AMIでは未対応
* [Envoyコネクタ](../connectors/istio.md)の場合、挙動は`failure_mode_allow`設定に依存します

    `drop_on_overload`の設定は適用されません。

有効(`true`)にすると、Nodeがリアルタイムでデータを処理できない場合に、過剰な入力をドロップして`503(Service Unavailable)`で応答します。これにより、Nodeが内部キューに未処理のリクエストを蓄積して深刻なパフォーマンス低下やメモリ不足エラーを引き起こすことを防ぎます。

503を返すことで、上流サービスやロードバランサ、クライアントが過負荷状態を検出し、必要に応じてリクエストを再試行できるようになります。

[ブロッキングモード](../../admin-en/configure-wallarm-mode.md)でも、このようなリクエストはブロックされません。

デフォルト: `true`。