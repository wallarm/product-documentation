オールインワンインストーラーをダウンロードしたら、次のコマンドでヘルプを表示できます:

```
sudo sh ./wallarm-5.3.19.x86_64-glibc.sh -- -h
```

次のように表示されます:

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

`--batch`オプションは非対話のバッチモードを起動します。このモードでは、必要に応じて`WALLARM_LABELS`環境変数に加え、`--token`と`--cloud`フラグを通じて設定オプションを指定する必要があります。デフォルトモードのように段階的に入力を促すことはせず、明示的なコマンド指定で操作します。

以下は、すでにスクリプトを[ダウンロード済み][download-aio-step]であることを前提に、ノードをバッチモードでインストールするコマンド例です。

=== "US Cloud"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### ノードインストール各段階の個別実行

クラウドインフラ向けのオールインワンインストーラーを用いて独自のマシンイメージを準備する場合、本記事に記載の標準的なインストール手順だけでは不十分なことがあります。その場合は、マシンイメージの作成と展開の要件に合わせて、オールインワンインストーラーの特定の段階を個別に実行する必要があります:

1. マシンイメージをビルド: この段階では、フィルタリングノードのバイナリ、ライブラリ、設定ファイルをダウンロードし、それらに基づいてマシンイメージを作成する必要があります。`--install-only`フラグを使用すると、スクリプトが必要なファイルをコピーし、ノードが動作するようにNGINXの設定を変更します。手動で調整したい場合は、`--skip-ngx-config`フラグを使用してNGINXファイルの変更をスキップできます。
1. cloud-initでクラウドインスタンスを初期化: インスタンスの初期化時に、cloud-initスクリプトを使用してブートストラップ段階（Cloudへの登録とサービスの起動）を実行できます。この段階は、ビルド段階でコピーされた`/opt/wallarm/setup.sh`スクリプトに`--register-only`フラグを付与することで、ビルド段階とは独立して実行できます。

この機能は、バッチモードのオールインワンインストーラーのバージョン4.10.0以降でサポートされています。以下のコマンドで、前述のステップを順番に実行できます:

=== "US Cloud"
    ```bash
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.19.x86_64-glibc.sh
    sudo sh wallarm-5.3.19.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.19.aarch64-glibc.sh
    sudo sh wallarm-5.3.19.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.19.x86_64-glibc.sh
    sudo sh wallarm-5.3.19.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.19.aarch64-glibc.sh
    sudo sh wallarm-5.3.19.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

最後に、インストールを完了するため、[Wallarmによるトラフィック解析を有効化][enable-traffic-analysis-step]し、[NGINXを再起動][restart-nginx-step]する必要があります。

### フィルタリングノードとポストアナリティクスノードの個別インストール

filtering/postanalyticsスイッチを使用すると、ポストアナリティクスモジュールを[個別にインストール][separate-postanalytics-installation-aio]できます。このスイッチを使用しない場合、デフォルトでフィルタリングコンポーネントとポストアナリティクスコンポーネントが同時にインストールされます。

### API Discoveryのみモード

ノードをAPI Discoveryのみモード（バージョン5.3.7以降で利用可能）で使用できます。このモードでは、ノードの組み込み機構で検出される攻撃や追加の設定を要する攻撃（例: クレデンシャルスタッフィング、API仕様違反の試行、拒否リストおよびグレーリストのIPによる悪意ある活動）をローカルで検出し、（有効にしている場合は）ブロックしますが、Wallarm Cloudへはエクスポートしません。Cloudに攻撃データが存在しないため、[Threat Replay Testing][threat-replay-testing-docs]は動作しません。許可リストのIPからのトラフィックは許可されます。

一方で、[API Discovery][api-discovery-docs]、[API session tracking][api-sessions-docs]、[脆弱性検出][vuln-detection-docs]は完全に機能し、関連するセキュリティエンティティを検出して可視化のためにCloudへアップロードします。

このモードは、まずAPI資産を見直して機微データを特定し、そのうえで攻撃データのエクスポートを計画的に制御したい方に適しています。ただし、Wallarmは攻撃データを安全に処理し、必要に応じて[機微な攻撃データのマスキング][masking-sensitive-data-rule]も提供しているため、攻撃データのエクスポートを無効化するケースはまれです。

API Discoveryのみモードを有効にするには:

1. `/etc/wallarm-override/env.list`ファイルを作成または更新します:

    ```
    sudo mkdir /etc/wallarm-override
    sudo vim /etc/wallarm-override/env.list
    ```

    次の変数を追加します:

    ```
    WALLARM_APID_ONLY=true
    ```

1. [ノードのインストール手順](#requirements)に従います。

API Discoveryのみモードを有効にすると、`/opt/wallarm/var/log/wallarm/wcli-out.log`ログに次のメッセージが出力されます:

```json
{"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
```