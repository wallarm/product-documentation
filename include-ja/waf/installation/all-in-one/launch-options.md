オールインワンスクリプトをダウンロードしたら、次のコマンドでヘルプを表示できます:

```
sudo sh ./wallarm-6.4.1.x86_64-glibc.sh -- -h
```

次の出力になります:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 Batch mode, non-interactive installation.
    --install-only          Initiates the first stage of the all-in-one installer in batch mode. Copies essential configurations, including files and binaries, and sets up NGINX for node installation, bypassing Cloud registration and activation. Requires --batch.
    --skip-ngx-config       Avoids automatic NGINX configuration changes that occur during the --install-only stage in batch mode, suitable for users who prefer manual adjustments later. When used with --install-only, it ensures only essential configurations are copied without altering NGINX settings. Requires --batch.
    --register-only         Initiates the second stage of the all-in-one installer in batch mode, completing the setup by registering the node in the Cloud and starting its service. Requires --batch.
-t, --token TOKEN           Node token, required in a batch mode.
-c, --cloud CLOUD           Wallarm Cloud, one of US/EU, default is EU, only used in a batch mode.
-H, --host HOST             Wallarm API address, for example, api.wallarm.com or us1.api.wallarm.com, only used in a batch mode.
-P, --port PORT             Wallarm API pot, for example, 443.
    --no-ssl                Disable SSL for Wallarm API access.
    --no-verify             Disable SSL certificates verification.
-f, --force                 If there is a node with the same name, create a new instance.
-h, --help
    --version
```

### バッチモード

`--batch`オプションはバッチ(非対話)モードを有効にします。このモードでは、必要に応じて`--token`と`--cloud`フラグ、さらに環境変数`WALLARM_LABELS`で設定値を指定します。デフォルトモードのように対話的に入力を促されることはなく、明示的なコマンド指定が必要です。

以下は、ノードをインストールするためにバッチモードでスクリプトを実行するコマンド例です。スクリプトはすでに[ダウンロード済み][download-aio-step]であると仮定します:

=== "US Cloud"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### ノードインストール段階の個別実行

クラウドインフラ用のマシンイメージをall-in-oneインストーラーで準備する場合、本記事の標準インストール手順だけでは不十分なことがあります。マシンイメージの作成とデプロイ要件に対応するため、all-in-oneインストーラーの特定の段階を個別に実行する必要があります:

1. マシンイメージの作成: この段階では、フィルタリングノードのバイナリ、ライブラリ、設定ファイルをダウンロードし、それらに基づいてマシンイメージを作成します。`--install-only`フラグを使用すると、スクリプトは必要なファイルをコピーし、ノード稼働のためにNGINXの構成を変更します。手動で調整したい場合は、`--skip-ngx-config`フラグを使用してNGINXファイルの変更をスキップできます。
1. cloud-initでクラウドインスタンスを初期化: インスタンスの初期化時に、ブートストラップフェーズ(Cloudへの登録とサービス起動)をcloud-initスクリプトで実行できます。この段階は、ビルド段階でコピーされた`/opt/wallarm/setup.sh`スクリプトに`--register-only`フラグを指定することで、ビルド段階とは独立して実行できます。

この機能は、バッチモードのall-in-oneインストーラーのバージョン4.10.0以降でサポートされています。以下のコマンドで、段階的に手順を実行できます:

=== "US Cloud"
    ```bash
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/6.4/wallarm-6.4.1.x86_64-glibc.sh
    sudo sh wallarm-6.4.1.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/6.4/wallarm-6.4.1.aarch64-glibc.sh
    sudo sh wallarm-6.4.1.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/6.4/wallarm-6.4.1.x86_64-glibc.sh
    sudo sh wallarm-6.4.1.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/6.4/wallarm-6.4.1.aarch64-glibc.sh
    sudo sh wallarm-6.4.1.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

最後に、インストールを完了するには、[Wallarmによるトラフィック解析を有効化][enable-traffic-analysis-step]し、[NGINXを再起動][restart-nginx-step]します。

### フィルタリングノードとポストアナリティクスノードの個別インストール

filtering/postanalyticsスイッチを使用すると、postanalyticsモジュールを[個別に][separate-postanalytics-installation-aio]インストールできます。このスイッチを使用しない場合、フィルタリングとpostanalyticsの両コンポーネントはデフォルトで同時にインストールされます。

### API Discoveryのみのモード

ノードはAPI Discoveryのみのモード(バージョン5.3.7以降で利用可能)で使用できます。このモードでは、ノードの組み込み機構で検知されるもの、および追加設定が必要なもの(例: クレデンシャルスタッフィング、API仕様違反の試行、拒否リスト化・グレーリスト化されたIPからの不正活動)を含む攻撃は、ローカルで(有効化されていれば)検知・ブロックされますが、Wallarm Cloudへはエクスポートされません。Cloudに攻撃データがないため、[Threat Replay Testing][threat-replay-testing-docs]は動作しません。ホワイトリスト化されたIPからのトラフィックは許可されます。

一方で、[API Discovery][api-discovery-docs]、[API session tracking][api-sessions-docs]、[セキュリティ脆弱性検出][vuln-detection-docs]は引き続き完全に機能し、関連するセキュリティエンティティを検出して可視化のためにCloudへアップロードします。

このモードは、まずAPIインベントリを確認して機微データを特定し、そのうえで攻撃データのエクスポートを統制して計画したい方に適しています。ただし、Wallarmは攻撃データを安全に処理し、必要に応じて[機微な攻撃データのマスキング][masking-sensitive-data-rule]を提供するため、攻撃データのエクスポートを無効化することは稀です。

API Discoveryのみのモードを有効化するには:

1. `/etc/wallarm-override/env.list`ファイルを作成または編集します:

    ```
    sudo mkdir /etc/wallarm-override
    sudo vim /etc/wallarm-override/env.list
    ```

    次の変数を追加します:

    ```
    WALLARM_APID_ONLY=true
    ```

1. [ノードのインストール手順](#requirements)に従います。

API Discoveryのみのモードが有効な場合、`/opt/wallarm/var/log/wallarm/wcli-out.log`ログには次のメッセージが出力されます:

```json
{"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
```