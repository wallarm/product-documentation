ダウンロード完了後すぐに、以下のコマンドでスクリプトに関するヘルプを参照できます：

```
sudo sh ./wallarm-4.10.2.x86_64-glibc.sh -- -h
```

これにより、以下の出力が得られます：

```
...
使用法: setup.sh [オプション]... [引数]... [フィルタリング/ポストアナリティクス]

オプション                      説明
-b, --batch                 バッチモード、非対話型インストール。
    --install-only          オールインワンインストーラーの第一段階をバッチモードで開始します。必要な設定、ファイル、バイナリをコピーし、クラウドの登録とアクティベーションをバイパスして、ノードのインストールのためにNGINXを設定します。--batchが必要です。
    --skip-ngx-config       バッチモードの--install-onlyステージ中に自動的に発生するNGINX設定の変更を避けます。後で手動で調整を好むユーザーに適しています。--install-onlyと一緒に使用すると、NGINXの設定を変更せずに必要な設定のみをコピーします。--batchが必要です。
    --register-only         バッチモードでオールインワンインストーラーの第二段階を開始します。クラウドにノードを登録し、サービスを開始することでセットアップを完了します。--batchが必要です。
-t, --token TOKEN           ノードトークン、バッチモードでは必須。
-c, --cloud CLOUD           Wallarm Cloud、US/EUのいずれか、デフォルトはEU、バッチモードでのみ使用します。
-H, --host HOST             Wallarm APIアドレス、例えば、api.wallarm.com または us1.api.wallarm.com、バッチモードでのみ使用します。
-P, --port PORT             Wallarm APIポート、例えば、443。
    --no-ssl                Wallarm APIアクセスのSSLを無効にします。
    --no-verify             SSL証明書の検証を無効にします。
-f, --force                 同じ名前のノードが存在する場合、新しいインスタンスを作成します。
-h, --help
    --version
```

### バッチモード

`--batch` オプションは **バッチ（非対話型）** モードをトリガーします。このモードでは、スクリプトは `--token` と `--cloud` フラグを介して、必要に応じて `WALLARM_LABELS` 環境変数を含む設定オプションを要求します。このモードでは、デフォルトモードのようにユーザーにデータ入力をステップバイステップで求めることはなく、代わりに明示的なコマンドを要求します。

以下は、スクリプトがすでに[ダウンロード][download-aio-step]されていると仮定して、ノードのインストールをバッチモードで実行するコマンドの例です：

=== "US Cloud"
    ```bash
    # x86_64バージョンを使用している場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64バージョンを使用している場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # x86_64バージョンを使用している場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64バージョンを使用している場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### ノードインストールの段階を個別に実行する

クラウドインフラストラクチャ用にオールインワンインストーラーを使用して独自のマシンイメージを準備する場合、この記事で概説された標準のインストールプロセスだけでは十分ではありません。代わりに、マシンイメージの作成と展開の要件に対応するため、オールインワンインストーラーの特定の段階を個別に実行する必要があります：

1. マシンイメージの構築：この段階では、フィルタリングノードのバイナリ、ライブラリ、および設定ファイルをダウンロードし、それらに基づいてマシンイメージを作成する必要があります。`--install-only` フラグを使用して、必要なファイルをコピーし、ノードの動作のためにNGINX設定を変更します。手動で調整を行いたい場合は、`--skip-ngx-config` フラグを使用してNGINXファイルの変更をバイパスできます。
1. クラウドインスタンスをcloud-initで初期化する：インスタンスの初期化中、クラウド登録とサービス開始のブートストラップフェーズはcloud-initスクリプトを利用して実行できます。この段階は構築段階から独立して実行でき、ビルド段階でコピーされた `/opt/wallarm/setup.sh` スクリプトに `--register-only` フラグを適用することで行います。

この機能は、バージョン4.10.0からバッチモードのオールインワンインストーラーでサポートされています。以下のコマンドにより、概説されたステップの順次実行が可能です：

=== "US Cloud"
    ```bash
    # x86_64バージョンを使用している場合：
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.2.x86_64-glibc.sh
    sudo sh wallarm-4.10.2.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64バージョンを使用している場合：
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.2.aarch64-glibc.sh
    sudo sh wallarm-4.10.2.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```
    # x86_64バージョンを使用している場合：
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.2.x86_64-glibc.sh
    sudo sh wallarm-4.10.2.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64バージョンを使用している場合：
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.2.aarch64-glibc.sh
    sudo sh wallarm-4.10.2.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

最後に、インストールを完了するためには、[Wallarmがトラフィックを分析するように有効にする][enable-traffic-analysis-step]必要があり、[NGINXを再起動][restart-nginx-step]する必要があります。

### フィルタリングノードとポストアナリティックスノードの個別インストール

フィルタリング/ポストアナリティクススイッチは、[別々に][separate-postanalytics-installation-aio]ポストアナリティックスモジュールをインストールするオプションを提供します。このスイッチがない場合、デフォルトではフィルタリングとポストアナリティクスの両方のコンポーネントが一緒にインストールされます。