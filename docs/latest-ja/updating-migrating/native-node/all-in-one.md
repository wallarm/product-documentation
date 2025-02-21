[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Wallarm Native Nodeをオールインワンインストーラーでアップグレードする

これらの手順は、[オールインワンインストーラーを使用してインストールしたNative Node](../../installation/native-node/all-in-one.md)のアップグレード手順について説明します。

[オールインワンインストーラーのリリース一覧を表示](node-artifact-versions.md)

## 要件

* Linux OS.
* x86_64/ARM64アーキテクチャ.
* すべてのコマンドをスーパーユーザー（例：`root`）として実行します.
* 以下へのアウトバウンドアクセス:
    * Wallarmインストーラーをダウンロードするために`https://meganode.wallarm.com`
    * US/EU Wallarm Cloud向けに`https://us1.api.wallarm.com`または`https://api.wallarm.com`
    * 攻撃検出ルールと[API仕様][api-spec-enforcement-docs]のアップデートをダウンロードし、[許可リスト、拒否リスト、またはグレイリスト][ip-list-docs]に登録された国、地域、またはデータセンターの正確なIPを取得するための以下のIPアドレス

        --8<-- "../include/wallarm-cloud-ips.md"
* さらに、Wallarm Consoleで**Administrator**ロールが割り当てられている必要があります.

## 1. 新しいインストーラーのバージョンをダウンロード

現在のNative Nodeが稼働中のマシンで最新のインストーラーバージョンをダウンロードします:

=== "x86_64版"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.x86_64.sh
    chmod +x aio-native-0.11.0.x86_64.sh
    ```
=== "ARM64版"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.aarch64.sh
    chmod +x aio-native-0.11.0.aarch64.sh
    ```

## 2. 新しいインストーラーを実行

下記のように新しいインストーラーを実行します. 現在稼働中のWallarmサービスが停止され, 新しいバージョンのサービスが自動的に起動されます.

以前生成した[Deployロール用のAPIトークン](../../user-guides/settings/api-tokens.md)およびノードグループ名を再利用できます.

設定ファイルについては, 初回インストール時に使用したものを再利用できます. 必要に応じて新しいパラメータの追加または既存パラメータの変更のみを行ってください―詳細は[サポートされている設定オプション](../../installation/native-node/all-in-one-conf.md)をご参照ください.

=== "コネクタサーバー"
    `connector-server`モードは, [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md)コネクタを使用してセルフホスト型ノードを展開した場合に使用されます.

    x86_64版インストーラーの場合:

    ```bash
    # USクラウド
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EUクラウド
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    ARM64版インストーラーの場合:

    ```bash
    # USクラウド
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EUクラウド
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```

=== "tcpキャプチャ"
    `tcp-capture`モードは, [TCPトラフィック解析](../../installation/oob/tcp-traffic-mirror/deployment.md)用にセルフホスト型ノードを展開した場合に使用されます.

    !!! info "Nodeバージョン0.11.0以上へアップグレードする場合"
        Nodeバージョン0.11.0以上へアップグレードする場合は, 初期設定ファイル（デフォルトのインストール手順に従い`wallarm-node-conf.yaml`）内の`version`値が更新されていることと, 以前`middleware`セクションに設定されていたパラメータが`goreplay`セクションに移動されていることを確認してください:

        ```diff
        -version: 2
        +version: 3

        -middleware:
        +goreplay:
          parse_responses: true
          response_timeout: 5s
          url_normalize: true
        ```

    x86_64版インストーラーの場合のアップグレードコマンド:
        
    ```bash
    # USクラウド
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EUクラウド
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    ARM64版インストーラーの場合のアップグレードコマンド:

    ```bash
    # USクラウド
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EUクラウド
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```

* WALLARM_LABELS変数は, ノードが追加されるグループを設定します（これはWallarm Console UI内でのノードの論理的なグルーピングに使用されます）.
* `<API_TOKEN>`は, Deployロール用に生成されたAPIトークンを指定します.
* `<PATH_TO_CONFIG>`は, 設定ファイルのパスを指定します.

現在の`/opt/wallarm/etc/wallarm/go-node.yaml`、`/opt/wallarm/etc/wallarm/node.yaml`及びログファイルは, `/opt/wallarm/aio-backups/<timestamp>`ディレクトリにバックアップされます.

## 3. アップグレードの検証

ノードが正常に動作していることを検証するには, 以下の手順を実行してください:

1. エラーログを確認します:
    * ログはデフォルトで`/opt/wallarm/var/log/wallarm/go-node.log`に出力されます. ここで確認できます.
    * [Wallarm Cloudへのデータ送信の有無や検出された攻撃等、フィルタリングノードの標準ログ](../../admin-en/configure-logging.md)は, ディレクトリ`/opt/wallarm/var/log/wallarm`に格納されています.
1. 保護されたリソースアドレスに対してテスト用の[Path Traversal][ptrav-attack-docs]攻撃リクエストを送信します:

    ```
    curl http://localhost/etc/passwd
    ```

    トラフィックが`example.com`にプロキシ設定されている場合, リクエストに`-H "Host: example.com"`ヘッダーを含めてください.
1. アップグレードされたノードが前のバージョンと比べて期待通りに動作していることを確認してください.

## 問題が発生した場合

アップグレードまたは再インストールプロセスに問題がある場合は, 以下の手順を実行してください:

1. 現在のインストールを削除します:

    ```
    sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
    ```
1. 通常の手順でノードを再インストールします.[TCPトラフィック解析](../../installation/oob/tcp-traffic-mirror/deployment.md)または[MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)または[Fastly](../../installation/connectors/fastly.md)コネクタの場合も同様です.

    または, 上記のアップグレード手順に従ってください.