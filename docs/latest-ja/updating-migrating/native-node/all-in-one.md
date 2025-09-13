[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# all-in-oneインストーラーを使用したWallarm Native Nodeのアップグレード

この手順では、[all-in-oneインストーラーでインストールされたNative Node](../../installation/native-node/all-in-one.md)をアップグレードする手順を説明します。

[all-in-oneインストーラーのリリース一覧を表示](node-artifact-versions.md)

## 要件

* Linux OS。
* x86_64/ARM64アーキテクチャ。
* すべてのコマンドをスーパーユーザー（例: `root`）として実行します。
* 以下へのアウトバウンドアクセス:
    * `https://meganode.wallarm.com`（Wallarmインストーラーのダウンロード用）
    * US/EU Wallarm Cloud向けの`https://us1.api.wallarm.com`または`https://api.wallarm.com`
    * 攻撃検知ルールおよび[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、さらに[allowlisted、denylisted、graylisted][ip-list-docs]の国・地域・データセンターの正確なIPを取得するために必要な、以下のIPアドレス

        --8<-- "../include/wallarm-cloud-ips.md"
* さらに、Wallarm Consoleで**Administrator**ロールが割り当てられている必要があります。

## 1. 新しいインストーラーバージョンをダウンロードする

現在のNative Nodeが稼働しているマシンに最新のインストーラーバージョンをダウンロードします。

=== "x86_64版"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.17.1.x86_64.sh
    chmod +x aio-native-0.17.1.x86_64.sh
    ```
=== "ARM64版"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.17.1.aarch64.sh
    chmod +x aio-native-0.17.1.aarch64.sh
    ```

## 2. 新しいインストーラーを実行する

以下のとおり新しいインストーラーを実行します。現在稼働中のWallarmサービスを停止し、その後新バージョンのサービスを自動的に起動します。

以前に生成した[`Node deployment/Deployment`使用タイプのAPIトークン](../../user-guides/settings/api-tokens.md)とノードグループ名を再利用できます。

構成ファイルについては、初回インストール時に使用したものを再利用できます。必要な場合のみ新しいパラメーターを追加するか既存のものを変更してください。[サポートされている構成オプション](../../installation/native-node/all-in-one-conf.md)を参照してください。

=== "connector-server"
    `connector-server`モードは、MuleSoftの[Mule](../../installation/connectors/mulesoft.md)または[Flex](../../installation/connectors/mulesoft-flex.md) Gateway、[Akamai](../../installation/connectors/akamai-edgeworkers.md)、[CloudFront](../../installation/connectors/aws-lambda.md)、[Cloudflare](../../installation/connectors/cloudflare.md)、[Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)、[Fastly](../../installation/connectors/fastly.md)、[IBM DataPower](../../installation/connectors/ibm-api-connect.md)コネクタとともに自己ホスト型ノードをデプロイした場合に使用します。

    !!! info "Nodeバージョン0.12.x以下からアップグレードする場合"
        Nodeバージョン0.12.x以下からアップグレードする場合は、初期構成ファイル（デフォルトのインストール手順に従い`wallarm-node-conf.yaml`）の`version`値が更新されていること、また（明示的に指定している場合は）セクション`tarantool_exporter`が`postanalytics_exporter`に名前変更されていることを確認してください:
        ```diff
        -version: 2
        +version: 4

        -tarantool_exporter:
        +postanalytics_exporter:
          address: 127.0.0.1:3313
          enabled: true
        
        ...
        ```

    x86_64インストーラー版の場合:
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    ARM64インストーラー版の場合:
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
=== "tcp-capture"
    自己ホスト型ノードを[TCPトラフィック解析](../../installation/oob/tcp-traffic-mirror/deployment.md)用にデプロイした場合に`tcp-capture`モードを使用します。

    !!! info "Nodeバージョン0.12.1以下からアップグレードする場合"
        Nodeバージョン0.12.0以下からアップグレードする場合は、初期構成ファイル（デフォルトのインストール手順に従い`wallarm-node-conf.yaml`）の`version`値が更新されていること、また以前に`middleware`セクションで設定していたパラメーターを`goreplay`セクションに移動していることを確認してください:
        ```diff
        -version: 2
        +version: 4

        -middleware:
        +goreplay:
          parse_responses: true
          response_timeout: 5s
          url_normalize: true
        
        ...
        ```

    x86_64インストーラー版のアップグレードコマンド:
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    ARM64インストーラー版のアップグレードコマンド:
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
=== "envoy-external-filter"
    `envoy-external-filter`モードは、Istioで管理されるAPI向けの[gRPCベースの外部処理フィルター](../../installation/connectors/istio.md)に使用します。

    x86_64インストーラー版のアップグレードコマンド:
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    ARM64インストーラー版のアップグレードコマンド:
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```

* `WALLARM_LABELS`変数は、ノードが追加されるgroupを設定します（Wallarm Console UIでのノードの論理的なグルーピングに使用されます）。
* `<API_TOKEN>`は、`Node deployment/Deployment`使用タイプで生成したAPIトークンを指定します。
* `<PATH_TO_CONFIG>`は、構成ファイルへのパスを指定します。

現在の`/opt/wallarm/etc/wallarm/go-node.yaml`、`/opt/wallarm/etc/wallarm/node.yaml`およびログファイルは、ディレクトリ`/opt/wallarm/aio-backups/<timestamp>`にバックアップされます。

## 3. アップグレードを検証する

ノードが正しく動作していることを確認するには、次を実行します。

1. ログにエラーがないか確認します:
    * デフォルトでは`/opt/wallarm/var/log/wallarm/go-node.log`にログが書き込まれます。そこで確認できます。
    * データがWallarm Cloudに送信されているか、検出された攻撃など、フィルタリングノードの[標準ログ](../../admin-en/configure-logging.md)はディレクトリ`/opt/wallarm/var/log/wallarm`にあります。
1. 保護対象リソースのアドレスにテスト用の[パストラバーサル][ptrav-attack-docs]攻撃リクエストを送信します:
    ```
    curl http://localhost/etc/passwd
    ```
    トラフィックが`example.com`へのプロキシに構成されている場合は、リクエストに`-H "Host: example.com"`ヘッダーを含めます。
1. アップグレードしたノードが前のバージョンと比較して期待どおりに動作していることを確認します。

## 問題が発生した場合

アップグレードまたは再インストールの過程で問題が発生した場合:

1. 現在のインストールを削除します:
    ```
    sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
    ```
1. [TCPトラフィック解析](../../installation/oob/tcp-traffic-mirror/deployment.md)用、またはMuleSoftの[Mule](../../installation/connectors/mulesoft.md)や[Flex](../../installation/connectors/mulesoft-flex.md) Gateway、[Akamai](../../installation/connectors/akamai-edgeworkers.md)、[CloudFront](../../installation/connectors/aws-lambda.md)、[Cloudflare](../../installation/connectors/cloudflare.md)、[Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)、[Fastly](../../installation/connectors/fastly.md)、[IBM DataPower](../../installation/connectors/ibm-api-connect.md)の各コネクタ向けに、通常どおりノードを再インストールします。

    または、上記のアップグレード手順に従ってください。