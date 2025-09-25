オールインワンスクリプトをダウンロードしたら、次のコマンドでヘルプを確認できます:

```
sudo sh ./wallarm-4.8.10.x86_64-glibc.sh -- -h
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

`--batch`オプションは非対話のバッチモードを有効にします。このモードでは、必要に応じて環境変数`WALLARM_LABELS`とともに`--token`および`--cloud`フラグで設定値を指定する必要があります。デフォルトモードのように段階的に入力を求めるプロンプトは表示されず、明示的なコマンド指定が必要です。

以下は、スクリプトをバッチモードで実行してノードをインストールするコマンド例です。スクリプトがすでに[ダウンロード済み][download-aio-step]であることを前提とします。

=== "USクラウド"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EUクラウド"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### ノードインストール各段階の個別実行

クラウドインフラストラクチャ向けにオールインワンインストーラーを用いて独自のマシンイメージを準備する場合、本記事で説明する標準のインストール手順だけでは十分でないことがあります。この場合、マシンイメージの作成とデプロイの要件に合わせて、オールインワンインストーラーの特定の段階を個別に実行する必要があります:

1. マシンイメージの構築: この段階では、フィルタリングノードのバイナリ、ライブラリ、設定ファイルをダウンロードし、それらに基づいてマシンイメージを作成します。`--install-only`フラグを使用すると、スクリプトは必要なファイルをコピーし、ノードの動作に向けてNGINXの設定を行います。手動で調整したい場合は、`--skip-ngx-config`フラグを使用してNGINXファイルの変更をスキップできます。
1. cloud-initによるCloudインスタンスの初期化: インスタンス初期化時に、ブートストラップフェーズ（Cloudへの登録とサービス開始）をcloud-initスクリプトで実行できます。この段階は、ビルド段階でコピーされた`/opt/wallarm/setup.sh`スクリプトに`--register-only`フラグを付けることで、ビルド段階とは独立して実行できます。

この機能は、バッチモードのオールインワンインストーラーのバージョン4.8.8以降でサポートしています。以下のコマンドで、上記の各ステップを順に実行できます:

=== "USクラウド"
    ```bash
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.x86_64-glibc.sh
    sudo sh wallarm-4.8.10.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.aarch64-glibc.sh
    sudo sh wallarm-4.8.10.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EUクラウド"
    ```
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.x86_64-glibc.sh
    sudo sh wallarm-4.8.10.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.aarch64-glibc.sh
    sudo sh wallarm-4.8.10.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

最後に、インストールを完了するには、[Wallarmによるトラフィック解析を有効化する][enable-traffic-analysis-step]および[NGINXを再起動する][restart-nginx-step]必要があります。

### フィルタリングノードとpostanalyticsノードの個別インストール

filtering/postanalyticsスイッチを使用すると、postanalyticsモジュールを[個別にインストール][separate-postanalytics-installation-aio]できます。このスイッチを指定しない場合は、デフォルトでフィルタリングとpostanalyticsの両コンポーネントが一緒にインストールされます。