オールインワンスクリプトをダウンロード後、以下のコマンドでヘルプを表示できます:

```
sudo sh ./wallarm-4.8.10.x86_64-glibc.sh -- -h
```

以下のような出力が返されます:

```
...
Usage: setup.sh [オプション]... [引数]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 バッチモード、非対話式インストールです。
    --install-only          バッチモードにおいてオールインワンインストーラーの第一段階を開始します。ファイルやバイナリを含む必要な設定をコピーし、Cloud登録や有効化を省略してNGINXのノードインストール用設定を行います。--batchが必要です。
    --skip-ngx-config       バッチモードの--install-only段階で自動的に行われるNGINX設定変更を回避します。後で手動調整を希望するユーザーに適しており、--install-onlyと併用するとNGINX設定を変更せず必要な設定のみをコピーすることを保証します。--batchが必要です。
    --register-only         バッチモードにおいてオールインワンインストーラーの第二段階を開始し、Cloudにノード登録してサービスを起動することでセットアップを完了します。--batchが必要です。
-t, --token TOKEN           バッチモードで必要なノードトークンです。
-c, --cloud CLOUD           Wallarm Cloud。US/EUのいずれかで、デフォルトはEUです。バッチモードでのみ使用します。
-H, --host HOST             Wallarm APIアドレス。例: api.wallarm.comまたはus1.api.wallarm.com。バッチモードでのみ使用します。
-P, --port PORT             Wallarm APIポート。例: 443。
    --no-ssl                Wallarm APIアクセス時にSSLを無効にします。
    --no-verify             SSL証明書の検証を無効にします。
-f, --force                 同じ名前のノードが存在する場合、新規インスタンスを作成します。
-h, --help
    --version
```

### バッチモード

`--batch`オプションは**バッチ（非対話式）**モードを起動します。このモードでは、スクリプトは必要な設定オプションを`--token`および`--cloud`フラグ、必要に応じ`WALLARM_LABELS`環境変数を通じて受け取ります。このモードでは、デフォルトモードのように1ステップずつユーザーに入力を促すことなく、明示的なコマンドでのやり取りを行う必要があります。

以下は、スクリプトをバッチモードでノードインストールするためのコマンド例です。なお、スクリプトは既に[ダウンロード済み][download-aio-step]であるものとします。

=== "USクラウド"
    ```bash
    # x86_64版を使用している場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64版を使用している場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EUクラウド"
    ```bash
    # x86_64版を使用している場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64版を使用している場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### ノードインストールステージの個別実行

クラウドインフラ向けにオールインワンインストーラーを使用して独自のマシンイメージを作成する際、この記事に記載の標準インストールプロセスでは不十分な場合があります。その際、マシンイメージの作成および展開要件に合わせて、オールインワンインストーラーの特定のステージを個別に実行する必要があります。

1. マシンイメージの構築: この段階では、フィルタリングノードのバイナリ、ライブラリ、および設定ファイルをダウンロードし、それに基づいてマシンイメージを作成する必要があります。`--install-only`フラグを利用すると、スクリプトは必要なファイルをコピーし、ノード動作用のNGINX設定を変更します。手動調整を希望する場合は、`--skip-ngx-config`フラグを使用してNGINXファイルの修正を回避することも可能です。
2. cloud-initを使用したクラウドインスタンスの初期化: インスタンス初期化時、ブートストラップフェーズ（Cloud登録およびサービス起動）はcloud-initスクリプトを使用して実行できます。この段階は、ビルド段階でコピーされた`/opt/wallarm/setup.sh`スクリプトに`--register-only`フラグを適用することで、ビルドフェーズとは独立して実行できます。

この機能は、バッチモードにおけるオールインワンインストーラーのバージョン4.8.8以降でサポートされています。以下のコマンドにより、記載された手順を順次実行できます:

=== "USクラウド"
    ```bash
    # x86_64版を使用している場合:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.x86_64-glibc.sh
    sudo sh wallarm-4.8.10.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64版を使用している場合:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.aarch64-glibc.sh
    sudo sh wallarm-4.8.10.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EUクラウド"
    ```bash
    # x86_64版を使用している場合:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.x86_64-glibc.sh
    sudo sh wallarm-4.8.10.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64版を使用している場合:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.aarch64-glibc.sh
    sudo sh wallarm-4.8.10.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

最後にインストールを完了するには、[Wallarmによるトラフィック解析を有効にする][enable-traffic-analysis-step]および[NGINXの再起動][restart-nginx-step]が必要です。

### フィルタリングおよびpostanalyticsノードの個別インストール

filtering/postanalyticsスイッチにより、postanalyticsモジュールを[個別に][separate-postanalytics-installation-aio]インストールするオプションが提供されます。このスイッチが指定されていない場合、フィルタリングおよびpostanalyticsの両コンポーネントはデフォルトで同時にインストールされます。