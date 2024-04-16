全てインワンスクリプトをダウンロードしたら、以下の方法でヘルプを得ることができます：

```
sudo sh ./wallarm-4.8.10.x86_64-glibc.sh -- -h
```

それにより、以下が返されます：

```
...
使用法: setup.sh [オプション]... [引数]... [フィルタリング/ポストアナリティクス]

オプション                      説明
-b, --batch                 バッチモード、非対話型インストール。
    --install-only          バッチモードでのオールインワンインストーラーの最初の段階を開始します。重要な設定、ファイルおよびバイナリのコピーと、クラウド登録とアクティベーションのバイパスを行い、NGINXのノードインストールのセットアップを行います。--batchが必要です。
    --skip-ngx-config       バッチモードの--install-onlyステージで発生する自動NGINX設定変更を回避します。後で手動調整を好むユーザーに適しています。--install-onlyと一緒に使うと、NGINX設定を変更せずに必要な設定のみがコピーされることを保証します。--batchが必要です。
    --register-only         バッチモードのオールインワンインストーラーの第二段階を開始し、クラウドにノードを登録し、そのサービスを開始し、セットアップを完了します。--batchが必要です。
-t, --token TOKEN           ノードトークン、バッチモードで必要です。
-c, --cloud CLOUD           Wallarm Cloud、US/EUのいずれか、デフォルトはEU、バッチモードでのみ使用。
-H, --host HOST             Wallarm APIアドレス、たとえば、api.wallarm.com または us1.api.wallarm.com、バッチモードでのみ使用。
-P, --port PORT             Wallarm APIポート、たとえば、443。
    --no-ssl                Wallarm APIアクセスのSSLを無効にします。
    --no-verify             SSL証明書の検証を無効にします。
-f, --force                 同じ名前のノードが存在する場合、新しいインスタンスを作成します。
-h, --help
    --version
```

### バッチモード

`--batch`オプションは、**バッチ（非対話型）** モードをトリガーし、スクリプトは `--token` および `--cloud` フラグを介して設定オプションを必要とし、必要に応じて `WALLARM_LABELS` 環境変数も同様です。このモードでは、デフォルトモードのようにスクリプトが一歩ずつユーザーにデータ入力を促すことはありません。代わりに、明示的なコマンドが対話のために必要です。

以下は、ノードのインストールのためにバッチモードでスクリプトを実行するコマンドの例です。この時、スクリプトは既に[ダウンロードされています][download-aio-step]：

=== "US Cloud"
    ```bash
    # x86_64バージョンを使用する場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64バージョンを使用する場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # x86_64バージョンを使用する場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64バージョンを使用する場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### ノードインストールの段階を個別に実行する

クラウドインフラのためのオールインワンインストーラーを使用して自分のマシンイメージを準備するとき、この記事で説明されている標準的なインストールプロセスでは十分でない場合があります。代わりに、マシンイメージの作成および展開の要件に適応するために、オールインワンインストーラーの特定の段階を個別に実行する必要があります：

1. マシンイメージのビルド：この段階では、フィルタリングノードのバイナリ、ライブラリ、および設定ファイルをダウンロードし、それに基づいてマシンイメージを作成する必要があります。`--install-only`フラグを使用して、スクリプトは必要なファイルをコピーし、ノードの操作に必要なNGINX設定を変更します。手動で調整したい場合は、`--skip-ngx-config`フラグを使用してNGINXファイルの変更をバイパスできます。
1. クラウドインスタンスの初期化：インスタンスの初期化中、クラウド登録とサービスの開始段階は、cloud-initスクリプトを使用して実行できます。この段階は、ビルド段階から独立して実行でき、ビルド段階でコピーされた`/opt/wallarm/setup.sh`スクリプトに`--register-only`フラグを適用して実行します。

この機能は、バッチモードでのオールインワンインストーラーのバージョン4.8.8からサポートされています。以下のコマンドは、概説されたステップの連続実行を可能にします：

=== "US Cloud"
    ```bash
    # x86_64バージョンを使用する場合：
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.x86_64-glibc.sh
    sudo sh wallarm-4.8.10.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64バージョンを使用する場合：
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.aarch64-glibc.sh
    sudo sh wallarm-4.8.10.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```
    # x86_64バージョンを使用する場合：
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.x86_64-glibc.sh
    sudo sh wallarm-4.8.10.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64バージョンを使用する場合：
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.aarch64-glibc.sh
    sudo sh wallarm-4.8.10.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

最後に、インストールを完了するために、[Wallarmにトラフィックの分析を有効にする][enable-traffic-analysis-step] と [NGINXを再起動する][restart-nginx-step] 必要があります。

### フィルタリングとポストアナリティクスノードの個別インストール

フィルタリング/ポストアナリティクスの切り替えは、ポストアナリティクスモジュールを[別に][separate-postanalytics-installation-aio]インストールするオプションを提供します。この切り替えがない場合、デフォルトではフィルタリングとポストアナリティクスのコンポーネントが一緒にインストールされます。