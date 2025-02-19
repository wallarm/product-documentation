```
オールインワンスクリプトをダウンロード後、以下のコマンドでヘルプを確認できます:

```
sudo sh ./wallarm-4.10.13.x86_64-glibc.sh -- -h
```

以下の情報が返されます:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 バッチモード、非対話型インストールです。
    --install-only          バッチモードでオールインワンインストーラーの最初の段階を開始します。ファイルやバイナリを含む基本的な設定をコピーし、NGINXのノードインストールの設定を行い、Cloudへの登録やアクティベーションを省略します。--batchが必要です。
    --skip-ngx-config       バッチモードの--install-only段階で自動的に変更されるNGINX設定の変更を回避します。後で手動で調整する場合に適しています。--install-onlyと併用すると、NGINXの設定を変更せずに基本的な設定のみをコピーします。--batchが必要です。
    --register-only         バッチモードでオールインワンインストーラーの第二段階を開始し、Cloudにノードを登録しサービスを開始してセットアップを完了します。--batchが必要です。
-t, --token TOKEN           ノードトークンで、バッチモードで必要です。
-c, --cloud CLOUD           Wallarm Cloudで、US/EUのいずれかです。デフォルトはEUで、バッチモードのみ使用されます。
-H, --host HOST             Wallarm APIアドレスです。例：api.wallarm.comまたはus1.api.wallarm.com、バッチモードのみ使用されます。
-P, --port PORT             Wallarm APIポートです。例：443。
    --no-ssl                Wallarm APIアクセスのためのSSLを無効にします。
    --no-verify             SSL証明書の検証を無効にします。
-f, --force                 同じ名前のノードが存在する場合、新しいインスタンスを作成します。
-h, --help
    --version
```

### バッチモード

`--batch`オプションは**バッチ（非対話型）**モードを起動します。このモードでは、スクリプトは`--token`および`--cloud`フラグ、必要に応じて`WALLARM_LABELS`環境変数を通して設定オプションを指定する必要があります。このモードでは、デフォルトモードのようにステップごとにユーザーからの入力を促すことなく、明示的なコマンド入力を必要とします。

次に、スクリプトがすでに[ダウンロード済み][download-aio-step]であることを前提として、ノードインストールのためにバッチモードでスクリプトを実行する例を示します:

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

クラウドインフラ向けにオールインワンインストーラーを使用して独自のマシンイメージを作成する場合、本記事に記載の標準インストールプロセスでは対応できない場合があります。その際は、マシンイメージの作成・展開要件に合わせ、オールインワンインストーラーの特定の段階を個別に実行する必要があります:

1. マシンイメージの作成: この段階では、フィルタリングノードのバイナリ、ライブラリ、および設定ファイルをダウンロードし、それらをベースにマシンイメージを作成する必要があります。`--install-only`フラグを利用して、スクリプトは必要なファイルをコピーし、ノード動作用にNGINX設定を変更します。手動で調整したい場合は、`--skip-ngx-config`フラグを使用してNGINX設定の変更を回避できます。
1. cloud-initを用いたクラウドインスタンスの初期化: インスタンス初期化時に、ブートストラップフェーズ（クラウド登録およびサービス開始）をcloud-initスクリプトで実行できます。この段階は、ビルドフェーズとは独立して、ビルド段階でコピーされた`/opt/wallarm/setup.sh`スクリプトに`--register-only`フラグを適用することで実行可能です。

この機能は、バッチモードのオールインワンインストーラーのバージョン4.10.0以降でサポートされています。以下のコマンドにより、上述の手順を連続して実行できます:

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
    ```bash
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.x86_64-glibc.sh
    sudo sh wallarm-4.10.13.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.aarch64-glibc.sh
    sudo sh wallarm-4.10.13.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

最後に、インストールを完了するためには、[Wallarmによるトラフィック解析の有効化][enable-traffic-analysis-step]および[NGINXの再起動][restart-nginx-step]が必要です。

### フィルタリングノードとpostanalyticsノードの個別インストール

フィルタリング/postanalyticsスイッチにより、postanalyticsモジュールを[個別に][separate-postanalytics-installation-aio]インストールするオプションが提供されます。このスイッチを使用しない場合、フィルタリングおよびpostanalyticsコンポーネントはデフォルトで一緒にインストールされます。
```