[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md

# All-in-OneインストーラによるNative Nodeのデプロイ

[Wallarm Native Node](../nginx-native-node-internals.md)はNGINXから独立して動作し、Wallarmコネクターのセルフホスト型デプロイおよびTCPトラフィックミラー解析向けに設計されています。All-in-Oneインストーラを使用して、Linux OSを搭載した仮想マシン上でNative Nodeを実行できます。

## ユースケースとデプロイモード

* セルフホストのLinux OSマシン上で、MuleSoft [Mule](../connectors/mulesoft.md)または[Flex](../connectors/mulesoft-flex.md) Gateway、[Akamai](../connectors/akamai-edgeworkers.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md)、[IBM DataPower](../connectors/ibm-api-connect.md)向けコネクターソリューションの一部としてWallarmノードをデプロイする場合。

    インストーラを`connector-server`モードで使用します。
* [TCPトラフィックミラー解析](../oob/tcp-traffic-mirror/deployment.md)のためのセキュリティソリューションが必要な場合。
    
    インストーラを`tcp-capture`モードで使用します。
* Istioで管理されるAPI向けの[gRPCベースの外部処理フィルター](../connectors/istio.md)が必要な場合。
    
    インストーラを`envoy-external-filter`モードで使用します。

## 要件

All-in-OneインストーラでNative Nodeを実行するマシンは、次の条件を満たす必要があります。

* Linux OS。
* x86_64/ARM64アーキテクチャ。
* すべてのコマンドをスーパーユーザー（例: `root`）で実行できること。
* 以下へのアウトバウンドアクセス:

    * Wallarmインストーラをダウンロードするための`https://meganode.wallarm.com`
    * US/EUのWallarm Cloud用の`https://us1.api.wallarm.com`または`https://api.wallarm.com`
    * 攻撃検知ルールおよび[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、さらに[許可リスト、拒否リスト、またはグレーリスト][ip-list-docs]に登録した国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレス

        --8<-- "../include/wallarm-cloud-ips.md"
* ノードを`connector-server`または`envoy_external_filter`モードで実行する場合は、そのマシンのドメインに対して**信頼された**SSL/TLS証明書を発行し、秘密鍵とともにマシンに配置する必要があります。
* ノードを`tcp-capture`モードで実行する場合:
    
    * トラフィックおよびレスポンスのミラーリングを、送信元と宛先の両方を設定して構成し、準備したインスタンスをミラーの宛先として選択する必要があります。たとえばトラフィックミラーリングの構成では、特定のプロトコルの許可など、特定の環境要件を満たす必要があります。
    * ミラーされたトラフィックにはVLAN（802.1q）、VXLAN、またはSPANのいずれかのタグが付与されます。
* さらに、Wallarm ConsoleでAdministratorロールが割り当てられている必要があります。

## 制限事項

* All-in-Oneインストーラを`connector-server`または`envoy_external_filter`モードで使用する場合、マシンのドメインには**信頼された**SSL/TLS証明書が必要です。自己署名証明書はまだサポートされていません。
* [カスタムのブロックページおよびブロックコード](../../admin-en/configuration-guides/configure-block-page-and-code.md)の構成はまだサポートしていません。
* Wallarmルールによる[レート制限](../../user-guides/rules/rate-limiting.md)はサポートしていません。
* [マルチテナンシー](../multi-tenant/overview.md)はまだサポートしていません。

## インストール

### 1. Wallarmトークンを準備する

ノードをインストールするには、Wallarm Cloudにノードを登録するためのトークンが必要です。トークンを準備するには次の手順に従います。

1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)のWallarm Console → **Settings** → **API tokens**を開きます。
1. 使用タイプが`Node deployment/Deployment`のAPIトークンを探すか作成します。
1. このトークンをコピーします。

### 2. Wallarmインストーラをダウンロードする

Wallarmインストールスクリプトをダウンロードして実行可能にします。

=== "x86_64版"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.17.1.x86_64.sh
    chmod +x aio-native-0.17.1.x86_64.sh
    ```
=== "ARM64版"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.17.1.aarch64.sh
    chmod +x aio-native-0.17.1.aarch64.sh
    ```

### 3. 構成ファイルを準備する

次の最小構成で、マシン上に`wallarm-node-conf.yaml`ファイルを作成します。

=== "connector-server"
    ```yaml
    version: 4

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
    ```

    `connector.tls_cert`および`connector.tls_key`には、そのマシンのドメインに対して発行された**信頼された**証明書と秘密鍵へのパスを指定します。
=== "tcp-capture"
    ```yaml
    version: 4

    mode: tcp-capture

    goreplay:
      filter: 'enp7s0:'
      extra_args:
        - -input-raw-engine
        - vxlan
    ```

    `goreplay.filter`パラメータには、トラフィックをキャプチャするネットワークインターフェースを指定します。ホストで利用可能なネットワークインターフェースを確認するには次を実行します。

    ```
    ip addr show
    ```
=== "envoy-external-filter"
    ```yaml
    version: 4

    mode: envoy-external-filter

    envoy_external_filter:
      address: ":5080"
      tls_cert: "/path/to/cert.crt"
      tls_key: "/path/to/cert.key"
    ```

    `envoy_external_filter.tls_cert`および`envoy_external_filter.tls_key`には、そのマシンのドメインに対して発行された**信頼された**証明書と秘密鍵へのパスを指定します。

[すべての構成パラメータ](all-in-one-conf.md)

### 4. インストーラを実行する

=== "connector-server"
    x86_64版インストーラの場合:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    ARM64版インストーラの場合:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "tcp-capture"
    x86_64版インストーラの場合:
        
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    ARM64版インストーラの場合:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "envoy-external-filter"
    x86_64版インストーラの場合:
        
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    ARM64版インストーラの場合:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* 変数`WALLARM_LABELS`は、ノードが追加されるグループを設定します（Wallarm ConsoleのUIでノードを論理的にグルーピングするために使用します）。
* `<API_TOKEN>`は、使用タイプが`Node deployment/Deployment`の生成済みAPIトークンを指定します。
* `<PATH_TO_CONFIG>`は、前項で準備した構成ファイルへのパスを指定します。

指定した構成ファイルは、`/opt/wallarm/etc/wallarm/go-node.yaml`にコピーされます。

必要に応じて、インストール完了後にコピー済みファイルを変更できます。変更を反映するには、`sudo systemctl restart wallarm`でWallarmサービスを再起動します。

### 5. インストールを完了する

=== "connector-server"
    ノードをデプロイしたら、次のステップとして、トラフィックをデプロイ済みノードへルーティングするためにWallarmコードをお使いのAPI管理プラットフォームまたはサービスに適用します。

    1. コネクター用のWallarmコードバンドルを入手するには、sales@wallarm.comにご連絡ください。
    1. プラットフォーム固有の手順に従って、API管理プラットフォームにバンドルを適用します。

        * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [MuleSoft Flex Gateway](../connectors/mulesoft-flex.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [Akamai](../connectors/akamai-edgeworkers.md#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
        * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)
=== "tcp-capture"
    [デプロイのテストに進みます](../oob/tcp-traffic-mirror/deployment.md#step-5-test-the-solution)。
=== "envoy-external-filter"
    ノードをデプロイしたら、次のステップとして、トラフィックをノードへ転送するように[Envoyの設定を更新](../connectors/istio.md#2-configure-envoy-to-proxy-traffic-to-the-wallarm-node)します。

## ノードの動作確認

ノードがトラフィックを検知しているか確認するには、ログを確認します。

* Native Nodeのログは、デフォルトで`/opt/wallarm/var/log/wallarm/go-node.log`に出力されます。
* データがWallarm Cloudへ送信されたか、検知した攻撃など、フィルタリングノードの[標準ログ](../../admin-en/configure-logging.md)は`/opt/wallarm/var/log/wallarm`ディレクトリにあります。
* 追加のデバッグには、[`log.level`](all-in-one-conf.md#loglevel)パラメータを`debug`に設定します。

また、`http://<NODE_IP>:9000/metrics.`で公開される[Prometheusメトリクス](../../admin-en/native-node-metrics.md)を確認することでも、ノードの動作を検証できます。

## インストーラの起動オプション

* All-in-Oneスクリプトをダウンロードしたら、次で**ヘルプ**を表示できます。

    === "x86_64版"
        ```
        sudo ./aio-native-0.17.1.x86_64.sh -- --help
        ```
    === "ARM64版"
        ```
        sudo ./aio-native-0.17.1.aarch64.sh -- --help
        ```
* インストーラを**対話**モードで起動し、最初のステップで必要なモードを選択することもできます。

    === "x86_64版"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh
        ```
    === "ARM64版"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh
        ```
* <a name="apid-only-mode"></a>ノードはAPI Discovery専用モード（バージョン0.12.1以降で利用可能）で使用できます。このモードでは、ノードの組み込みメカニズムで検知される攻撃や、追加の設定が必要な攻撃（例: クレデンシャルスタッフィング、API仕様違反の試行、拒否リストおよびグレーリストのIPからの悪意ある活動）を検知し、（有効化されていれば）ローカルでブロックしますが、Wallarm Cloudにはエクスポートしません。Cloudに攻撃データがないため、[Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md)は機能しません。許可リストのIPからのトラフィックは許可されます。

    一方で、[API Discovery](../../api-discovery/overview.md)、[API sessions](../../api-sessions/overview.md)、および[security vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md)は引き続き完全に機能し、関連するセキュリティエンティティを検知してCloudへアップロードし、可視化します。

    このモードは、まずAPI資産を見直して機微なデータを特定し、その後で攻撃データのエクスポートを計画的に行いたい方に適しています。ただし、Wallarmは攻撃データを安全に処理し、必要に応じて[機微な攻撃データのマスキング](../../user-guides/rules/sensitive-data-rule.md)も提供するため、攻撃データのエクスポートを無効化するケースはまれです。

    API Discovery専用モードを有効化するには:

    1. `/etc/wallarm-override/env.list`ファイルを作成または編集します。

        ```
        sudo mkdir /etc/wallarm-override
        sudo vim /etc/wallarm-override/env.list
        ```

        次の変数を追加します。

        ```
        WALLARM_APID_ONLY=true
        ```
    
    1. [ノードのインストール手順](#installation)に従います。

    API Discovery専用モードが有効な場合、`/opt/wallarm/var/log/wallarm/wcli-out.log`には次のメッセージが記録されます。

    ```json
    {"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
    ```

## アップグレードと再インストール

* ノードのアップグレードは、[こちらの手順](../../updating-migrating/native-node/all-in-one.md)に従います。
* アップグレードまたは再インストールの過程で問題が発生した場合:

    1. 現在のインストールを削除します。

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. 上記のインストール手順に従って、通常どおりノードをインストールします。