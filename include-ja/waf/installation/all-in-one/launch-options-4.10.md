all-in-oneスクリプトをダウンロードしたら、次のコマンドでヘルプを表示できます:

```
sudo sh ./wallarm-4.10.13.x86_64-glibc.sh -- -h
```

次の内容が表示されます:

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

`--batch`オプションはバッチ（非対話型）モードを有効にします。このモードでは、必要に応じて`WALLARM_LABELS`環境変数に加え、`--token`と`--cloud`フラグで設定オプションを指定する必要があります。デフォルトモードのように段階的に入力を促すことはなく、代わりに明示的なコマンド指定が必要です。

以下は、スクリプトをすでに[ダウンロード済み][download-aio-step]であることを前提に、ノードをインストールするためにバッチモードでスクリプトを実行するコマンド例です。

=== "USクラウド"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EUクラウド"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### ノードインストール段階の個別実行

クラウドインフラ向けのall-in-oneインストーラーを用いて独自のマシンイメージを作成する場合、本記事で説明している標準のインストール手順だけでは不十分なことがあります。その場合、マシンイメージの作成とデプロイの要件に合わせて、all-in-oneインストーラーの特定の段階を個別に実行する必要があります:

1. マシンイメージのビルド: この段階では、フィルタリングノードのバイナリ、ライブラリ、設定ファイルをダウンロードし、それらに基づいてマシンイメージを作成する必要があります。`--install-only`フラグを使用すると、スクリプトは必要なファイルをコピーし、ノードの動作に合わせてNGINXの設定を変更します。手動で調整したい場合は、`--skip-ngx-config`フラグを使用してNGINX設定ファイルの変更をスキップできます。
1. cloud-initでクラウドインスタンスを初期化: インスタンスの初期化中に、cloud-initスクリプトを使用してブートストラップ段階（Cloudへの登録とサービスの開始）を実行できます。ビルド段階でコピーされた`/opt/wallarm/setup.sh`スクリプトに`--register-only`フラグを指定することで、この段階をビルド段階とは独立して実行できます。

この機能は、バッチモードのall-in-oneインストーラーのバージョン4.10.0以降でサポートされています。以下のコマンドで、上記の各段階を順に実行できます:

=== "USクラウド"
    ```bash
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.x86_64-glibc.sh
    sudo sh wallarm-4.10.13.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.aarch64-glibc.sh
    sudo sh wallarm-4.10.13.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EUクラウド"
    ```
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.x86_64-glibc.sh
    sudo sh wallarm-4.10.13.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.aarch64-glibc.sh
    sudo sh wallarm-4.10.13.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

最後に、インストールを完了するには、[Wallarmによるトラフィック解析を有効化][enable-traffic-analysis-step]し、[NGINXを再起動][restart-nginx-step]する必要があります。

### フィルタリングノードとpostanalyticsノードの個別インストール

filtering/postanalyticsスイッチを使用すると、postanalyticsモジュールを[別々にインストール][separate-postanalytics-installation-aio]できます。このスイッチを使用しない場合は、フィルタリングとpostanalyticsの両コンポーネントがデフォルトで併せてインストールされます。