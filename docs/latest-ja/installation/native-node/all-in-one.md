```markdown
[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md

# オールインワンインストーラーを使用したNative Nodeのデプロイ

[Wallarm Native Node](../nginx-native-node-internals.md)はNGINXに依存せずに動作し、WallarmコネクタのセルフホストデプロイおよびTCPトラフィックミラー解析用に設計されています。オールインワンインストーラーを用いれば、Linux OSを搭載した仮想マシン上でNative Nodeを実行できます。

## ユースケースとデプロイモード

* セルフホストのLinux OSマシン上において、[MuleSoft](../connectors/mulesoft.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md)向けのコネクタソリューションの一部としてWallarmノードをデプロイする場合、インストーラーを`connector-server`モードで使用します。
* [TCPトラフィックミラー解析](../oob/tcp-traffic-mirror/deployment.md)用のセキュリティソリューションが必要な場合、インストーラーを`tcp-capture`モードで使用します。

## 要件

Native Nodeをオールインワンインストーラーで実行するマシンは、以下の要件を満たす必要があります:

* Linux OS
* x86_64/ARM64アーキテクチャ
* すべてのコマンドをsuperuser（例: `root`）として実行すること
* 外向きのアクセスが必要な先:
    * `https://meganode.wallarm.com`にアクセスし、Wallarmインストーラーをダウンロードします
    * US/EU Wallarm Cloud向けに`https://us1.api.wallarm.com`または`https://api.wallarm.com`にアクセスします
    * 攻撃検出ルールおよび[API仕様書][api-spec-enforcement-docs]の更新をダウンロードし、[allowlisted, denylisted, or graylisted][ip-list-docs]対象の国、地域、またはデータセンター向けの正確なIPアドレスを取得するため、以下のIPアドレスにもアクセス可能である必要があります

        --8<-- "../include/wallarm-cloud-ips.md"
* ノードを`connector-server`モードで実行する際には、そのマシンのドメインに対して発行された**trusted**なSSL/TLS証明書と秘密鍵をマシンにアップロードする必要があります。
* ノードを`tcp-capture`モードで実行する際:
    
    * トラフィックとレスポンスのミラーリングは、ソースおよびターゲットの両方が設定され、準備されたインスタンスがミラー対象として選択されるように構成する必要があります。トラフィックミラーリング構成のために特定のプロトコルの許可など、特定の環境要件を満たす必要があります。
    * ミラーリングされたトラフィックには、VLAN(802.1q)、VXLANまたはSPANのいずれかがタグ付けされます。
* 上記に加え、Wallarm Consoleで**Administrator**ロールが割り当てられている必要があります。

## 制限事項

* オールインワンインストーラーを`connector-server`モードで使用する際は、マシンのドメインに対して**trusted**なSSL/TLS証明書が必要です。セルフサイン証明書はまだサポートされていません。
* [カスタムブロッキングページおよびブロッキングコード](../../admin-en/configuration-guides/configure-block-page-and-code.md)の構成はまだサポートされていません。
* Wallarmルールによる[レートリミティング](../../user-guides/rules/rate-limiting.md)はサポートされていません。
* [マルチテナンシー](../multi-tenant/overview.md)はまだサポートされていません。

## インストール

### 1. Wallarmトークンの用意

ノードをインストールするには、Wallarm Cloudにノードを登録するためのトークンが必要です。トークンの用意方法は以下の通りです:

1. Wallarm Console → **Settings** → **API tokens** を[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
1. `Deploy`ソースロールを持つAPIトークンを見つけるか、新たに作成してください。
1. このトークンをコピーしてください。

### 2. Wallarmインストーラーのダウンロード

Wallarmインストールスクリプトをダウンロードし、実行可能にします:

=== "x86_64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.x86_64.sh
    chmod +x aio-native-0.11.0.x86_64.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.aarch64.sh
    chmod +x aio-native-0.11.0.aarch64.sh
    ```

### 3. 設定ファイルの準備

マシン上に`wallarm-node-conf.yaml`ファイルを作成し、以下の最小構成を記述してください:

=== "connector-server"
    ```yaml
    version: 2

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
    ```

    `connector.tls_cert`および`connector.tls_key`には、マシンのドメインに対して発行された**trusted**証明書と秘密鍵のパスを指定します。
=== "tcp-capture"
    ```yaml
    version: 3

    mode: tcp-capture

    goreplay:
      filter: 'enp7s0:'
      extra_args:
        - -input-raw-engine
        - vxlan
    ```

    `goreplay.filter`パラメータには、トラフィックをキャプチャするネットワークインターフェースを指定します。ホスト上の利用可能なネットワークインターフェースを確認するには:

    ```
    ip addr show
    ```

[すべての設定パラメータ](all-in-one-conf.md)

### 4. インストーラーの実行

=== "connector-server"
    x86_64版インストーラーの場合:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    ARM64版インストーラーの場合:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "tcp-capture"
    x86_64版インストーラーの場合:
        
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    ARM64版インストーラーの場合:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* `WALLARM_LABELS`変数は、Wallarm Console UIでノードの論理グループ化に使用されるグループを設定します。
* `<API_TOKEN>`は`Deploy`ロール用に生成されたAPIトークンを指定します。
* `<PATH_TO_CONFIG>`は前述の設定ファイルのパスを指定します。

提供された設定ファイルは`/opt/wallarm/etc/wallarm/go-node.yaml`にコピーされます。

必要に応じて、インストール完了後にコピーされたファイルを変更できます。変更を適用するには、`sudo systemctl restart wallarm`でWallarmサービスを再起動してください。

### 5. インストールの完了

=== "connector-server"
    ノードをデプロイした後、次のステップはデプロイされたノードにトラフィックを迂回させるため、WallarmコードをAPI管理プラットフォームまたはサービスに適用することです。

    1. sales@wallarm.comまで連絡して、コネクタ向けのWallarmコードバンドルを入手します。
    1. 各プラットフォーム固有の手順に従って、API管理プラットフォームにバンドルを適用してください:

        * [MuleSoft](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
=== "tcp-capture"
    [デプロイテストの実施](../oob/tcp-traffic-mirror/deployment.md#step-5-test-the-solution)を行ってください。

## ノード動作の検証

ノードがトラフィックを検出しているか確認するには、ログをチェックしてください:

* デフォルトでは、Native Nodeのログは`/opt/wallarm/var/log/wallarm/go-node.log`に出力されます。
* フィルタリングノードの[標準ログ](../../admin-en/configure-logging.md)（データがWallarm Cloudに送信されたか、攻撃が検出されたか等）は`/opt/wallarm/var/log/wallarm`ディレクトリに配置されます。

追加のデバッグには、[`log.level`](all-in-one-conf.md#loglevel)パラメータを`debug`に設定してください。

## インストーラー起動オプション

* オールインワンスクリプトをダウンロードしたら、**help**を表示するには以下のコマンドを使用できます:

    === "x86_64 version"
        ```
        sudo ./aio-native-0.11.0.x86_64.sh -- --help
        ```
    === "ARM64 version"
        ```
        sudo ./aio-native-0.11.0.aarch64.sh -- --help
        ```
* また、インストーラーを**interactive**モードで実行し、最初のステップで必要なモードを選択することもできます:

    === "x86_64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh
        ```
    === "ARM64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh
        ```
* <a name="apid-only-mode"></a>API Discoveryのみモード（バージョン0.11.0以降で利用可能）でノードを使用できます。このモードでは、ノードの組込み機構で検出される攻撃や、追加設定が必要な攻撃（例：クレデンシャルスタッフィング、API仕様違反試行、denylistedやgraylisted IPからの悪意あるアクティビティ等）をローカルで検出し（有効な場合はブロック）、Wallarm Cloudへはエクスポートされません。Cloud上に攻撃データが存在しないため、[Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md)は機能しません。ホワイトリストに登録されたIPからのトラフィックは許可されます.

    一方、[API Discovery](../../api-discovery/overview.md)、[API session tracking](../../api-sessions/overview.md)、および[security vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md)は完全に機能し、関連するセキュリティエンティティを検出し、可視化のためにCloudへアップロードします.

    このモードは、まずAPIインベントリを見直し、センシティブなデータを特定して、その後に制御された攻撃データのエクスポートを計画するユーザー向けです。ただし、攻撃エクスポートの無効化は稀であり、Wallarmは攻撃データを安全に処理し、必要に応じて[sensitive attack data masking](../../user-guides/rules/sensitive-data-rule.md)を提供します.

    API Discoveryのみモードを有効にするには:

    1. `/etc/wallarm-override/env.list`ファイルを作成または編集します:

        ```
        sudo mkdir /etc/wallarm-override
        sudo vim env.list
        ```

        以下の変数を追加します:

        ```
        WALLARM_APID_ONLY=true
        ```
    
    1. [ノードのインストール手順](#installation)に従ってください.

    API Discoveryのみモードが有効な場合、`/opt/wallarm/var/log/wallarm/wcli-out.log`のログに以下のメッセージが表示されます:

    ```json
    {"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
    ```

## アップグレードと再インストール

* ノードをアップグレードするには、[手順](../../updating-migrating/native-node/all-in-one.md)に従ってください.
* アップグレードまたは再インストールの過程で問題が発生した場合:

    1. 現在のインストールを削除します:

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. 上記のインストール手順に従って、通常通りノードをインストールしてください.
```