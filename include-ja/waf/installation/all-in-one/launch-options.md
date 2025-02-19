```
all-in-oneスクリプトをダウンロードしたら、次のコマンドでヘルプをご確認ください:

```
sudo sh ./wallarm-5.3.0.x86_64-glibc.sh -- -h
```

実行すると、以下の出力が表示されます:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 バッチモード、非対話型インストールです。
    --install-only          バッチモードでall-in-oneインストーラの最初の段階を開始します。ファイルやバイナリを含む必須設定をコピーし、クラウドへの登録とアクティベーションをバイパスしてノードインストール用にNGINXを設定します。--batchが必要です。
    --skip-ngx-config       バッチモードの--install-only段階で発生する自動NGINX設定変更を回避します。後に手動で調整を希望するユーザーに適しています。--install-onlyと併用する場合、NGINX設定を変更することなく必須設定のみをコピーします。--batchが必要です。
    --register-only         バッチモードでall-in-oneインストーラの第二段階を開始し、ノードをCloudに登録しサービスを起動してセットアップを完了します。--batchが必要です。
-t, --token TOKEN           ノードトークン、バッチモードで必須です。
-c, --cloud CLOUD           Wallarm Cloud。USまたはEUのいずれかで、デフォルトはEUです。バッチモードでのみ使用されます。
-H, --host HOST             Wallarm APIアドレス。例として、api.wallarm.comまたはus1.api.wallarm.comがあり、バッチモードでのみ使用されます。
-P, --port PORT             Wallarm APIポート。例として、443があります。
    --no-ssl                Wallarm APIアクセス時にSSLを無効にします。
    --no-verify             SSL証明書の検証を無効にします。
-f, --force                 同じ名前のノードが存在する場合、新しいインスタンスを作成します。
-h, --help
    --version
```

### バッチモード

`--batch`オプションを指定すると、**バッチ（非対話型）**モードが有効となり、スクリプトは`--token`および`--cloud`フラグ、必要に応じて`WALLARM_LABELS`環境変数で設定オプションを指定する必要があります。このモードでは、通常モードのようにステップバイステップでユーザーにデータ入力を促すことはなく、明示的なコマンドによる指示が必要です。

以下は、スクリプトが既に[ダウンロード済み][download-aio-step]である前提で、ノードインストール時にバッチモードで実行するコマンドの例です:

=== "US Cloud"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### ノードインストール段階の個別実行

クラウドインフラ用のall-in-oneインストーラを使用して独自のマシンイメージを作成する場合、本記事で説明される標準インストールプロセスだけでは不十分なことがあります。そのため、マシンイメージの作成と展開の要件に対応するため、all-in-oneインストーラの特定の段階を個別に実行する必要があります:

1. マシンイメージの構築: この段階では、フィルタリングノードのバイナリ、ライブラリ、設定ファイルをダウンロードし、それらに基づいてマシンイメージを作成する必要があります。`--install-only`フラグを利用して、必要なファイルをコピーし、ノード運用用にNGINX設定を変更します。手動で調整を行いたい場合は、`--skip-ngx-config`フラグを使用することでNGINXファイルの変更を回避できます。
1. cloud-initを使用したクラウドインスタンスの初期化: インスタンスの初期化時に、ブートストラップフェーズ（クラウド登録とサービス起動）をcloud-initスクリプトで実行できます。この段階は、ビルドフェーズとは独立して実行可能で、ビルド段階でコピーされた`/opt/wallarm/setup.sh`スクリプトに`--register-only`フラグを適用することで実行されます。

この機能は、all-in-oneインストーラのバッチモードがバージョン4.10.0からサポートしています。以下のコマンドにより、上記の手順を順次実行できます:

=== "US Cloud"
    ```bash
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.x86_64-glibc.sh
    sudo sh wallarm-5.3.0.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.aarch64-glibc.sh
    sudo sh wallarm-5.3.0.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # x86_64版を使用する場合:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.x86_64-glibc.sh
    sudo sh wallarm-5.3.0.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64版を使用する場合:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.aarch64-glibc.sh
    sudo sh wallarm-5.3.0.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

最後に、インストールを完了するためには、[Wallarmにトラフィックの解析を有効にする][enable-traffic-analysis-step]と[NGINXを再起動する][restart-nginx-step]必要があります。

### フィルタリングとポストアナリティクスノードの個別インストール

フィルタリング/ポストアナリティクススイッチを使用すると、postanalyticsモジュールを[個別に][separate-postanalytics-installation-aio]インストールするオプションが提供されます。このスイッチが指定されていない場合、既定ではフィルタリングとpostanalyticsの両方のコンポーネントが一緒にインストールされます。
```