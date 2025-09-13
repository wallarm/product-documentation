# TCPトラフィックミラー解析用ノードのデプロイ

Wallarmは、TCPトラフィックのミラー解析に特化したフィルタリングノードのデプロイ用アーティファクトを提供します。本ガイドでは、このフォームファクターでWallarmフィルタリングノードをデプロイおよび構成する方法を説明します。

## ユースケース

サポートされている[アウトオブバンドのデプロイオプション](../../supported-deployment-options.md#out-of-band)の中で、本ソリューションは以下のシナリオに推奨されます。

* ネットワーク層でミラーされたTCPトラフィックを取得し、その特定のトラフィックを分析するセキュリティソリューションが必要な場合。
* NGINXベースのデプロイアーティファクトが利用できない、遅い、またはリソース消費が多い場合。この場合、HTTPトラフィックのミラー解析はリソース負荷が高くなり得ます。TCPトラフィックのミラー解析はWebサーバーから独立して動作するため、これらの問題を回避します。
* レスポンスの解析も行い、レスポンスデータに依存する[脆弱性検出](../../../about-wallarm/detecting-vulnerabilities.md)や[APIディスカバリー](../../../api-discovery/overview.md)などの機能を有効化したい場合。

## 仕組み

このソリューションはアウトオブバンド（OOB）モードで動作し、NGINXのようなWebサーバーとは独立してネットワークインターフェースから直接ミラーされたTCPトラフィックを取得します。取得したトラフィックは解析・再構成され、脅威の有無を分析します。

ミラーのターゲットとして機能し、複数のトラフィックソース間をシームレスに切り替えます。VLAN（802.1q）、VXLAN、またはSPANでタグ付けされたトラフィックをサポートします。

さらに、レスポンスミラーの解析を有効にし、レスポンスデータに依存するWallarmの機能を提供します。これには[脆弱性検出](../../../about-wallarm/detecting-vulnerabilities.md)、[APIディスカバリー](../../../api-discovery/overview.md)などが含まれます。

![!TCPトラフィックミラーの模式図](../../../images/waf-installation/oob/tcp-mirror-analysis.png)

## 前提条件

* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス。
* ノードを実行するマシンは以下の条件を満たす必要があります。

    * Linux OS
    * x86_64/ARM64アーキテクチャ
    * すべてのコマンドをスーパーユーザー（例: `root`）として実行します。
    * Wallarmインストーラーをダウンロードするために`https://meganode.wallarm.com`への外向き接続が許可されていること
    * US Wallarm Cloudで動作するために`https://us1.api.wallarm.com`、EU Wallarm Cloudで動作するために`https://api.wallarm.com`への外向き接続が許可されていること
    * 攻撃検出ルールおよび[API仕様](../../../api-specification-enforcement/overview.md)の更新をダウンロードし、また[許可リスト、拒否リスト、グレーリスト](../../../user-guides/ip-lists/overview.md)に登録した国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスへの外向き接続が許可されていること

        --8<-- "../include/wallarm-cloud-ips.md"
* トラフィックとレスポンスのミラーリングが、送信元とターゲットの双方で構成され、用意したインスタンスがミラーターゲットとして選択されている必要があります。トラフィックミラーリングの構成では、特定のプロトコルを許可するなど、環境固有の要件を満たす必要があります。
* ミラーリングされたトラフィックにはVLAN（802.1q）、VXLAN、またはSPANのタグが付与されている必要があります。

## 手順1: Wallarmトークンの準備

ノードをインストールするには、Wallarm Cloudにノードを登録するためのトークンが必要です。トークンを準備するには:

1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)のWallarm Consoleで、**Settings** → **API tokens**を開きます。
1. 使用タイプが`Node deployment/Deployment`のAPIトークンを探すか作成します。
1. このトークンをコピーします。

## 手順2: Wallarmインストーラーのダウンロード

Wallarmは以下のプロセッサ向けのインストールを提供します。

* x86_64
* ARM64

Wallarmのインストールスクリプトをダウンロードし、実行可能にするには次のコマンドを使用します。

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

## 手順3: 設定ファイルの準備

インスタンス上に`wallarm-node-conf.yaml`ファイルを作成します。本ソリューションでは、ネットワークインターフェースおよびトラフィック形式（例: VLAN、VXLAN）を特定できるよう適切に構成する必要があります。ファイル内容の例:

```yaml
version: 4

mode: tcp-capture

goreplay:
  filter: 'enp7s0:'
  extra_args:
      - -input-raw-engine
      - vxlan
```

[この記事](../../native-node/all-in-one-conf.md)に、サポートされている追加の設定パラメータ一覧があります。

### モードの設定（必須）

TCPトラフィックミラー解析用にソリューションを実行するには、対象のパラメータに`tcp-capture`モードを指定する必要があります。

### リッスンするネットワークインターフェースの選択

トラフィックをキャプチャするネットワークインターフェースを指定するには:

1. ホストで利用可能なネットワークインターフェースを確認します。

    ```
    ip addr show
    ```

1. `filter`パラメータにネットワークインターフェースを指定します。

    値はネットワークインターフェースとポートをコロン（:）で区切った形式である必要があります。フィルターの例は`eth0:`、`eth0:80`、または（すべてのインターフェース上の特定ポートを傍受する）`:80`です。例:

    ```yaml
    version: 4

    mode: tcp-capture

    goreplay:
      filter: 'eth0:'
    ```

### VLANのキャプチャ

ミラーリングされたトラフィックがVLANでラップされている場合は、追加の引数を指定します。

```yaml
version: 4

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
  extra_args:
    - -input-raw-vlan
    - -input-raw-vlan-vid
    # VLANのVIDの例:
    # - 42
```

### VXLANのキャプチャ

ミラーリングされたトラフィックがVXLAN（AWSで一般的）でラップされている場合は、追加の引数を指定します。

```yaml
version: 4

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
  extra_args:
    - -input-raw-engine
    - vxlan
    # カスタムVXLANのUDPポートの例:
    # - -input-raw-vxlan-port 
    # - 4789
    # 特定のVNI（デフォルトではすべてのVNIを捕捉）の例:
    # - -input-raw-vxlan-vni
    # - 1
```

### 元のクライアントIPとHostヘッダーの特定

トラフィックがプロキシやロードバランサーを通過する際、これらが元のクライアントIPアドレスや`Host`ヘッダーを自分自身の値に置き換えることがよくあります。元の情報を保持するため、これらの中間機器は通常、`X-Forwarded-For`、`X-Real-IP`、`X-Forwarded-Host`のようなHTTPヘッダーを追加します。

Native Nodeが元のクライアントおよび対象ホストを正しく特定できるようにするには、[`proxy_headers`](../../native-node/all-in-one-conf.md#proxy_headers)設定ブロックを使用します。例:

```yaml
version: 4

mode: tcp-capture

proxy_headers:
  # ルール1: 社内プロキシ
  - trusted_networks:
      - 10.0.0.0/8
      - 192.168.0.0/16
    original_host:
      - X-Forwarded-Host
    real_ip:
      - X-Forwarded-For

  # ルール2: 外部エッジプロキシ（例: CDN、リバースプロキシ）
  - trusted_networks:
      - 203.0.113.0/24
    original_host:
      - X-Real-Host
    real_ip:
      - X-Real-IP
```

## 手順4: Wallarmインストーラーの実行

TCPトラフィックミラー解析用のWallarmノードをインストールするには、次のコマンドを実行します。

=== "x86_64版"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "ARM64版"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* `WALLARM_LABELS`変数は、このノードが追加されるグループを設定します（Wallarm Console UIでのノードの論理的なグルーピングに使用します）。
* `<API_TOKEN>`は、使用タイプ`Node deployment/Deployment`で生成したAPIトークンを指定します。
* `<PATH_TO_CONFIG>`は、事前に用意した設定ファイルへのパスを指定します。

指定した設定ファイルは/opt/wallarm/etc/wallarm/go-node.yamlにコピーされます。

必要に応じて、インストール完了後にコピーされたファイルを変更できます。変更を反映するには、`sudo systemctl restart wallarm`でWallarmサービスを再起動する必要があります。

## 手順5: ソリューションのテスト

`<MIRROR_SOURCE_ADDRESS>`をインスタンスの実IPアドレスまたはDNS名に置き換えて、ミラーの送信元アドレスへテスト用の[パストラバーサル](../../../attacks-vulns-list.md#path-traversal)攻撃を送信します。

```
curl http://<MIRROR_SOURCE_ADDRESS>/etc/passwd
```

TCPトラフィックミラー解析用のWallarmソリューションはアウトオブバンドで動作するため、攻撃をブロックせず、記録のみを行います。

攻撃が記録されたことを確認するには、Wallarm Console → **Events**に進みます。

![!インターフェースでの攻撃](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## ノードの動作確認

* キャプチャ対象のネットワークインターフェースにトラフィックがあるか確認するには、マシン上で次のコマンドを実行します。

    ```
    sudo tcpdump -i <INTERFACE_NAME>
    ```
* ノードがトラフィックを検出しているか確認するには、ログを確認できます。

    * デフォルトでは、Native Nodeのログは`/opt/wallarm/var/log/wallarm/go-node.log`に出力されます。
    * データがWallarm Cloudに送信されているか、攻撃が検出されたかなどの[標準ログ](../../../admin-en/configure-logging.md)は、`/opt/wallarm/var/log/wallarm`ディレクトリにあります。

追加のデバッグには、[`log.level`](../../native-node/all-in-one-conf.md#loglevel)パラメータを`debug`に設定します。

## インストーラーの起動オプション

* all-in-oneスクリプトをダウンロードしたら、次で**ヘルプ**を表示できます。

    === "x86_64版"
        ```
        sudo ./aio-native-0.17.1.x86_64.sh -- --help
        ```
    === "ARM64版"
        ```
        sudo ./aio-native-0.17.1.aarch64.sh -- --help
        ```
* **対話**モードでインストーラーを実行し、最初のステップで`tcp-capture`モードを選択することもできます。

    === "x86_64版"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh
        ```
    === "ARM64版"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh
        ```
* ノードをAPIディスカバリー専用モード（バージョン0.12.1以降で利用可能）で使用できます。このモードでは、ノードの組み込みメカニズムで検出された攻撃や、追加の設定を要する攻撃（例: 資格情報詰め込み、API仕様違反の試行、ブルートフォース）を含む攻撃は検出され、[ローカルにログ記録されます](../../../admin-en/configure-logging.md)が、Wallarm Cloudにはエクスポートされません。Wallarm Cloudに攻撃データがないため、[脅威リプレイテスト](../../../vulnerability-detection/threat-replay-testing/overview.md)は動作しません。

    一方で、[APIディスカバリー](../../../api-discovery/overview.md)、[APIセッション追跡](../../../api-sessions/overview.md)、および[脆弱性検出](../../../about-wallarm/detecting-vulnerabilities.md)は引き続き完全に機能し、該当するセキュリティエンティティを検出して可視化のためにWallarm Cloudへアップロードします。

    このモードは、まずAPI資産を見直して機密データを特定し、その上で攻撃データのエクスポートを計画的に行いたい方に適しています。ただし、攻撃データのエクスポートを無効にするケースはまれです。Wallarmは攻撃データを安全に処理し、必要に応じて[機密攻撃データのマスキング](../../../user-guides/rules/sensitive-data-rule.md)を提供します。

    APIディスカバリー専用モードを有効にするには:

    1. `/etc/wallarm-override/env.list`ファイルを作成するか変更します。

        ```
        sudo mkdir /etc/wallarm-override
        sudo vim /etc/wallarm-override/env.list
        ```

        次の変数を追加します。

        ```
        WALLARM_APID_ONLY=true
        ```
    
    1. [手順1のノードインストール手順](#step-1-prepare-wallarm-token)に従います。

## アップグレードと再インストール

* ノードをアップグレードするには、[手順](../../../updating-migrating/native-node/all-in-one.md)に従います。
* アップグレードまたは再インストールで問題がある場合:

    1. 現在のインストールを削除します。

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. 上記のインストール手順に従って通常どおりノードをインストールします。

## 制限事項

* 実際のフローとは独立してトラフィックを分析するアウトオブバンド（OOB）動作のため、いくつかの制約があります。

    * 悪意のあるリクエストを即時にブロックしません。Wallarmは攻撃を観測し、[Wallarm Consoleでの詳細](../../../user-guides/events/check-attack.md)を提供します。
    * 宛先サーバーの負荷を制限できないため、[レート制限](../../../user-guides/rules/rate-limiting.md)はサポートしていません。
    * [IPアドレスによるフィルタリング](../../../user-guides/ip-lists/overview.md)はサポートしていません。
* 本ソリューションは生のTCP上の平文HTTPトラフィックのみを分析し、暗号化されたHTTPSトラフィックは対象外です。
* 現時点ではHTTP keep-alive接続上のレスポンス解析をサポートしていません。