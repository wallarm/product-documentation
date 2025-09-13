[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md

# AWS AMIでNative Nodeをデプロイする

[Wallarm Native Node](../nginx-native-node-internals.md)はNGINXに依存せずに動作し、Wallarmコネクターのセルフホスト型デプロイやTCPトラフィックミラー解析のために設計されています。[AWS AMI](https://aws.amazon.com/marketplace/pp/prodview-3d5ne4ruxm6j6)を使用してAWSインスタンス上でNative Nodeを実行できます。

AMIはDebian 12をベースとしており、all-in-oneインストーラーを同梱しています。このインストーラーはノードのデプロイと設定に使用するWallarmのスクリプトです。AMIからインスタンスを起動後、このスクリプトを実行してインストールを完了します。

AWS上でAMIからWallarm Nodeをデプロイする作業は、通常約10分で完了します。

!!! info "セキュリティに関する注意"
    このソリューションはAWSのセキュリティベストプラクティスに従うよう設計されています。デプロイにはAWSのルートアカウントの使用を避け、必要最小限の権限のみを付与したIAMユーザーまたはロールを使用することを推奨します。

    デプロイプロセスは最小権限の原則を前提としており、Wallarmコンポーネントのプロビジョニングと運用に必要な最小限のアクセス権のみを付与します。

このデプロイのAWSインフラコスト見積もりについては、[AWSへのWallarmデプロイのコストガイダンス](../cloud-platforms/aws/costs.md)を参照してください。

## ユースケースとデプロイモード

* AWS上で、MuleSoft [Mule](../connectors/mulesoft.md) Gateway、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md)向けコネクターソリューションの一部としてWallarmノードをデプロイする場合

    イメージを`connector-server`モードで実行します。
* [TCPトラフィックミラー解析](../oob/tcp-traffic-mirror/deployment.md)用のセキュリティソリューションが必要で、インフラがAWS上にある場合
    
    イメージを`tcp-capture`モードで実行します。

    !!! info "`tcp-capture`モードの制限事項"
        * このソリューションは生のTCP上の暗号化されていないHTTPトラフィックのみを解析し、暗号化されたHTTPSトラフィックは対象外です。
        * HTTP keep-alive接続上のレスポンス解析はまだサポートしていません。

## 要件

* AWSアカウント
* AWS EC2およびSecurity Groupの理解
* 任意のAWSリージョン（Wallarmノードのデプロイに特定のリージョン制約はありません）

    Wallarmは単一アベイラビリティーゾーン（AZ）およびマルチAZでのデプロイをサポートします。マルチAZ構成では、Wallarm Nodeを別々のAZに起動し、高可用性のためにロードバランサーの背後に配置できます。
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス
* すべてのコマンドをWallarmのEC2インスタンス上でスーパーユーザー（例: `root`）として実行すること
* `connector-server`モードでノードを実行する場合、マシンのドメインに対して発行された**信頼済み**SSL/TLS証明書を秘密鍵とともにマシンへアップロードしておくこと
* `tcp-capture`モードでノードを実行する場合:
    
    * トラフィックおよびレスポンスミラーリングがソースとターゲットの両方で構成され、準備したインスタンスがミラーターゲットとして選択されていること。トラフィックミラーリング構成で許可すべきプロトコルなど、特定の環境要件を満たす必要があります。
    * ミラートラフィックがVLAN（802.1q）、VXLAN、またはSPANのいずれかでタグ付けされていること。
    * 生のTCP上の暗号化されていないHTTPトラフィックであること（暗号化されたHTTPSトラフィックは不可）。

## 制限事項

* `connector-server`モードでNodeを使用する場合、マシンのドメインに対する**信頼済み**SSL/TLS証明書が必要です。自己署名証明書はまだサポートしていません。
* [カスタムのブロックページとブロックコード](../../admin-en/configuration-guides/configure-block-page-and-code.md)はまだサポートしていません。
* Wallarmルールによる[レート制限](../../user-guides/rules/rate-limiting.md)はサポートしていません。
* [マルチテナンシー](../multi-tenant/overview.md)はまだサポートしていません。

## インストール

### 1. Wallarm Nodeインスタンスを起動する

[Wallarm Native Node AMI](https://aws.amazon.com/marketplace/pp/prodview-3d5ne4ruxm6j6)を使用してEC2インスタンスを起動します。

推奨構成:

* 入手可能な最新の[AMIバージョン](../../updating-migrating/native-node/node-artifact-versions.md#amazon-machine-image-ami)
* 任意のAWSリージョン
* EC2インスタンスタイプ: `t3.medium`または`t3.large`（詳細は[コストガイダンス](../cloud-platforms/aws/costs.md)を参照）
* インフラに応じた適切な[VPCとサブネット](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
* [Security Group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html)のインバウンドで、[ノード設定](#5-prepare-the-configuration-file)で定義したポートへのアクセス
* [Security Group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html)のアウトバウンドで以下へのアクセス:

    * Wallarmインストーラーをダウンロードするための`https://meganode.wallarm.com`
    * US/EUのWallarm Cloudへ接続するための`https://us1.api.wallarm.com`または`https://api.wallarm.com`
    * 攻撃検出ルールや[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、また[allowlisted、denylisted、graylisted][ip-list-docs]の国・地域・データセンターの正確なIPを取得するための以下のIPアドレス

        --8<-- "../include/wallarm-cloud-ips.md"
* インスタンスへアクセスするためのSSHキーペア

### 2. SSHでノードインスタンスへ接続する

稼働中のEC2インスタンスへ接続するには、[選択したSSHキー](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html)を使用します:

```bash
ssh -i <your-key.pem> admin@<your-ec2-public-ip>
```

インスタンスへ接続するにはユーザー名`admin`を使用します。

### 3. Wallarmトークンを準備する

ノードをWallarm Cloudに登録するにはAPIトークンが必要です:

1. Wallarm Console → **Settings** → **API tokens**（[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)）を開きます。
1. 使用タイプが`Node deployment/Deployment`のAPIトークンを見つけるか作成します。
1. このトークンをコピーします。

### 4. TLS証明書をアップロードする

`connector-server`モード用に、インスタンスのドメインに対して**信頼済み**TLS証明書と秘密鍵を発行してください。これらのファイルはインスタンス内からアクセスでき、以降の設定で参照される必要があります。

証明書と鍵ファイルは`scp`、`rsync`などでEC2インスタンスにアップロードします。例:

```
scp -i <your-key.pem> tls-cert.crt tls-key.key admin@<your-ec2-public-ip>:~
```

### 5. 設定ファイルを準備する

EC2インスタンス上で`wallarm-node-conf.yaml`という名前のファイルを作成し、以下の最小構成のいずれかを記述します:

=== "コネクタサーバー"
    ```yaml
    version: 4

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
    ```

    `connector.tls_cert`および`connector.tls_key`には、マシンのドメイン用に発行された**信頼済み**証明書と秘密鍵のパスを指定します。
=== "TCPキャプチャ"
    ```yaml
    version: 4

    mode: tcp-capture

    goreplay:
      filter: 'enp7s0:'
      extra_args:
        - -input-raw-engine
        - vxlan
    ```

    `goreplay.filter`パラメータには、トラフィックをキャプチャするネットワークインターフェイスを指定します。ホストで利用可能なネットワークインターフェイスを確認するには次を実行します:

    ```
    ip addr show
    ```

[すべての設定パラメータ](all-in-one-conf.md)

### 6. ノードのインストールスクリプトを実行する

EC2インスタンス上でインストーラーを実行します:

=== "コネクタサーバー"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=./wallarm-node-conf.yaml --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=./wallarm-node-conf.yaml --host api.wallarm.com
    ```
=== "TCPキャプチャ"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=./wallarm-node-conf.yaml --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=./wallarm-node-conf.yaml --host api.wallarm.com
    ```

* `WALLARM_LABELS`変数は、ノードを追加するgroup（Wallarm Console UI上でノードを論理的にグルーピングするため）を設定します。
* `<API_TOKEN>`には、使用タイプが`Node deployment/Deployment`の生成済みAPIトークンを指定します。
* `--go-node-config`には、事前に用意した設定ファイルのパスを指定します。

指定した設定ファイルは`/opt/wallarm/etc/wallarm/go-node.yaml`にコピーされます。

必要に応じて、インストール完了後にコピーされたファイルを変更できます。変更を反映するには、`sudo systemctl restart wallarm`でWallarmサービスを再起動します。

### 7. インストールを完了する

=== "コネクタサーバー"
    ノードのデプロイ後、次の手順として、デプロイ済みノードへトラフィックをルーティングするために、API管理プラットフォームまたはサービスへWallarmコードを適用します。

    1. sales@wallarm.comへ連絡し、使用するコネクターのWallarmコードバンドルを入手します。
    1. プラットフォーム別の手順に従って、API管理プラットフォームへバンドルを適用します:

        * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly) 
=== "TCPキャプチャ"
    [デプロイのテストに進みます](../oob/tcp-traffic-mirror/deployment.md#step-5-test-the-solution)。

## ノード動作の検証

ノードがトラフィックを検出しているかを確認するには、ログを確認します:

* Native Nodeのログは既定で`/opt/wallarm/var/log/wallarm/go-node.log`に書き込まれます。
* データがWallarm Cloudへ送信されたか、攻撃が検出されたかなど、フィルタリングノードの[標準ログ](../../admin-en/configure-logging.md)は`/opt/wallarm/var/log/wallarm`ディレクトリにあります。
* 追加のデバッグには、[`log.level`](all-in-one-conf.md#loglevel)パラメータを`debug`に設定します。

また、`http://<NODE_IP>:9000/metrics.`で公開されている[Prometheusメトリクス](../../admin-en/native-node-metrics.md)を確認してノードの動作を検証できます。

## インストーラーの起動オプション

AMIには次の起動オプションを持つインストーラスクリプトが含まれています:

* スクリプトの**ヘルプ**を表示:

    ```
    sudo ./aio-native-0.14.0.x86_64.sh -- --help
    ```
* インストーラーを**対話**モードで実行し、最初のステップで必要なモードを選択:

    ```
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh
    ```
* <a name="apid-only-mode"></a>ノードをAPI Discoveryのみモードで使用できます。このモードでは、ノードの組み込み機構で検出される攻撃や追加構成が必要な攻撃（例: クレデンシャルスタッフィング、API仕様違反試行、denylistedおよびgraylisted IPからの悪意ある活動）を含む攻撃はローカルで検出・ブロック（有効化時）されますが、Wallarm Cloudへはエクスポートされません。Cloudに攻撃データが存在しないため、[Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md)は動作しません。whitelisted IPからのトラフィックは許可されます。

    一方で、[API Discovery](../../api-discovery/overview.md)、[APIセッション追跡](../../api-sessions/overview.md)、[セキュリティ脆弱性の検出](../../about-wallarm/detecting-vulnerabilities.md)は引き続き完全に機能し、関連するセキュリティエンティティを検出してCloudへアップロードし、可視化します。

    このモードは、まずAPIインベントリのレビューと機微なデータの特定を行い、その後に攻撃データのエクスポートを計画的に行いたい方を対象としています。ただし、Wallarmは攻撃データを安全に処理し、必要に応じて[機微な攻撃データのマスキング](../../user-guides/rules/sensitive-data-rule.md)を提供しているため、攻撃のエクスポートを無効化するケースは稀です。

    API Discoveryのみモードを有効にするには:

    1. `/etc/wallarm-override/env.list`ファイルを作成または修正します:

        ```
        sudo mkdir /etc/wallarm-override
        sudo vim /etc/wallarm-override/env.list
        ```

        次の変数を追加します:

        ```
        WALLARM_APID_ONLY=true
        ```
    
    1. [ノードのインストール手順](#installation)に従います。

    API Discoveryのみモードが有効な場合、`/opt/wallarm/var/log/wallarm/wcli-out.log`には次のメッセージが出力されます:

    ```json
    {"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
    ```

<!-- ## Upgrade and reinstallation

To upgrade the node, follow the [instructions](../../updating-migrating/native-node/all-in-one.md). -->