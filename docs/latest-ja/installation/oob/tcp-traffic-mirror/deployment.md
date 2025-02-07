# TCPトラフィックミラー解析用ノードのデプロイ

Wallarmは、TCPトラフィックミラー解析専用に設計されたフィルタリングノードをデプロイするためのアーティファクトを提供します。本ガイドでは、このフォームファクターのWallarmフィルタリングノードをデプロイおよび設定する方法について説明します。

## ユースケース

すべてのサポートされている [out-of-band deployment options](../../supported-deployment-options.md#out-of-band) の中で、以下のシナリオに対して本ソリューションを推奨します：

* ネットワーク層でミラーされたTCPトラフィックのキャプチャを希望し、この特定のトラフィックを解析するセキュリティソリューションを必要とする場合。
* NGINXまたはEnvoyベースのデプロイメントアーティファクトが利用できない、遅すぎる、またはリソースを過剰に消費する場合。このとき、HTTPトラフィックミラー解析を実施することはリソースを大量に消費する可能性があります。TCPトラフィックミラー解析はウェブサーバから独立して実行されるため、これらの問題を回避できます。
* レスポンスデータに依存する[脆弱性検出](../../../about-wallarm/detecting-vulnerabilities.md)や[APIディスカバリー](../../../api-discovery/overview.md)などの機能が有効となる、レスポンス解析も行うセキュリティソリューションを必要とする場合。

## 動作の仕組み

本ソリューションは、ウェブサーバ（NGINXなど）から独立して、ネットワークインターフェースから直接ミラーされたTCPトラフィックをキャプチャするout-of-band (OOB) モードで動作します。キャプチャしたトラフィックは解析され、再構築された後、脅威が検出されます。

ノードはミラーターゲットとして機能し、複数のトラフィックソース間でシームレスに切り替えます。このソリューションは、VLAN (802.1q)、VXLAN、またはSPANでタグ付けされたトラフィックをサポートします。

さらに、本ソリューションはレスポンスミラーパース解析を有効にし、Wallarmの機能である[脆弱性検出](../../../about-wallarm/detecting-vulnerabilities.md)や[APIディスカバリー](../../../api-discovery/overview.md)など、レスポンスデータに依存する機能を提供します。

![!TCP traffic mirror scheme](../../../images/waf-installation/oob/tcp-mirror-analysis.png)

## 要件

* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleにおいて、**Administrator**ロールを持つアカウントへのアクセスを有すること。
* ノードを実行する予定のマシンは、以下の要件を満たしている必要があります：

    * Linux OS
    * x86_64/ARM64アーキテクチャ
    * すべてのコマンドをスーパーユーザー（例：`root`）として実行すること
    * Wallarmインストーラをダウンロードするために`https://meganode.wallarm.com`へのアウトゴーイング接続が許可されていること
    * US Wallarm Cloudを利用する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを利用する場合は`https://api.wallarm.com`へのアウトゴーイング接続が許可されていること
    * 攻撃検出ルールおよび[API仕様](../../../api-specification-enforcement/overview.md)の更新のダウンロード、ならびに[allowlisted, denylisted, or graylisted](../../../user-guides/ip-lists/overview.md)な国、地域、またはデータセンターの正確なIPを取得するため、下記のIPアドレスへのアウトゴーイング接続が許可されていること

        --8<-- "../include/wallarm-cloud-ips.md"
* トラフィックおよびレスポンスミラーリングは、送信元とターゲットの両方を設定し、準備されたインスタンスをミラータゲットとして選択する必要があります。特定の環境要件（トラフィックミラーリング設定に関して特定のプロトコルを許可するなど）を満たす必要があります。
* ミラーされたトラフィックは、VLAN (802.1q)、VXLAN、またはSPANのいずれかでタグ付けされます。

## Step 1: Wallarmトークンの準備

ノードをインストールするには、Wallarm Cloudにノードを登録するためのトークンが必要です。トークンの準備手順は下記の通りです：

1. Wallarm Console → **Settings** → **API tokens** をUS Cloudの[Wallarm Console](https://us1.my.wallarm.com/settings/api-tokens)またはEU Cloudの[Wallarm Console](https://my.wallarm.com/settings/api-tokens)で開きます。
1. `Deploy`ソースロールのAPIトークンを作成または選択します。
1. このトークンをコピーします。

## Step 2: Wallarmインストーラーのダウンロード

Wallarmは、以下のプロセッサ向けのインストールを推奨します：

* x86_64
* ARM64

Wallarmインストールスクリプトをダウンロードし、実行可能にするには、以下のコマンドを使用します：

=== "x86_64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.x86_64.sh
    chmod +x aio-native-0.11.0.x86_64.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.aarch64.sh
    chmod +x aio-native-0.11.0.aarch64.sh
    ```

## Step 3: 設定ファイルの準備

インスタンス上に`wallarm-node-conf.yaml`ファイルを作成します。本ソリューションでは、ネットワークインターフェースとトラフィックフォーマット（例：VLAN、VXLAN）を識別するための適切な設定が必要です。ファイルのサンプル内容は以下の通りです：

```yaml
version: 3

mode: tcp-capture

goreplay:
  filter: 'enp7s0:'
  extra_args:
      - -input-raw-engine
      - vxlan
```

[記事](../../native-node/all-in-one-conf.md)には、他のサポートされる設定パラメータの一覧が記載されています。

### モードの設定（必須）

TCPトラフィックミラー解析のために、本ソリューションを実行するには、対応するパラメータに`tcp-capture`モードを指定する必要があります。

### リスニングするネットワークインターフェースの選択

トラフィックをキャプチャするためのネットワークインターフェースを指定するには：

1. ホスト上で利用可能なネットワークインターフェースを確認します：

    ```
    ip addr show
    ```

1. `filter`パラメータにネットワークインターフェースを指定します。

    値はネットワークインターフェースとポートがコロン（`:`）で区切られた形式である必要があります。フィルターの例としては、`eth0:`, `eth0:80`, または全インターフェース上の特定のポートを傍受するための`:80`などが挙げられます。例：

    ```yaml
    version: 3

    mode: tcp-capture

    goreplay:
      filter: 'eth0:'
    ```

### VLANのキャプチャ

ミラーされたトラフィックがVLANでラップされている場合は、追加の引数を指定します：

```yaml
version: 3

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
  extra_args:
    - -input-raw-vlan
    - -input-raw-vlan-vid
    # VLANのVID、例：
    # - 42
```

### VXLANのキャプチャ

ミラーされたトラフィックがVXLAN（AWSで一般的）でラップされている場合は、追加の引数を指定します：

```yaml
version: 3

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
  extra_args:
    - -input-raw-engine
    - vxlan
    # カスタムVXLAN UDPポート、例：
    # - -input-raw-vxlan-port 
    # - 4789
    # 特定のVNI (デフォルトではすべてのVNIがキャプチャ対象)、例：
    # - -input-raw-vxlan-vni
    # - 1
```

### 元のクライアントIPアドレスの識別

デフォルトでは、WallarmはネットワークパケットのIPヘッダーから送信元IPアドレスを読み取ります。しかし、プロキシやロードバランサが自身のIPに変更する可能性があります。

実際のクライアントIPを保持するために、これらの中継機はしばしばHTTPヘッダー（例：`X-Real-IP`、`X-Forwarded-For`）を追加します。`real_ip_header`パラメータは、元のクライアントIPを抽出するためにWallarmが使用するヘッダーを指定します。例：

```yaml
version: 3

mode: tcp-capture

http_inspector:
  real_ip_header: "X-Real-IP"
```

## Step 4: Wallarmインストーラーの実行

TCPトラフィックミラー解析用のWallarmノードをインストールするため、以下のコマンドを実行します：

=== "x86_64 version"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "ARM64 version"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* 変数`WALLARM_LABELS`は、ノードが追加されるグループを設定します（Wallarm Console UI上でのノードの論理的なグルーピングに使用されます）。
* `<API_TOKEN>`は、`Deploy`ロール用に生成されたAPIトークンを指定します。
* `<PATH_TO_CONFIG>`は、前もって準備した設定ファイルのパスを指定します。

提供された設定ファイルは、`/opt/wallarm/etc/wallarm/go-node.yaml`にコピーされます。

必要に応じて、インストール完了後にコピーされたファイルを変更できます。変更を適用するには、`sudo systemctl restart wallarm`でWallarmサービスを再起動する必要があります。

## Step 5: ソリューションのテスト

ミラーソースのアドレスに対して、[Path Traversal](../../../attacks-vulns-list.md#path-traversal)攻撃のテストを送信します。`<MIRROR_SOURCE_ADDRESS>`の部分を、実際のインスタンスのIPアドレスまたはDNS名に置き換えてください：

```
curl http://<MIRROR_SOURCE_ADDRESS>/etc/passwd
```

TCPトラフィックミラー解析用のWallarmソリューションはout-of-bandで動作するため、攻撃をブロックするのではなく、攻撃を登録するのみです。

攻撃が登録されていることを確認するには、Wallarm Consoleの**Events**に進んでください：

![!Attacks in the interface](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## ノード動作の検証

* キャプチャ対象のネットワークインターフェースにトラフィックがあるか確認するには、以下のコマンドを実行してください：

    ```
    sudo tcpdump -i <INTERFACE_NAME>
    ```
* ノードがトラフィックを検出しているかを検証するには、ログを確認してください：

    * Native Nodeのログはデフォルトで`/opt/wallarm/var/log/wallarm/go-node.log`に出力されます。
    * Wallarm Cloudへのデータ送信、攻撃の検出など、フィルタリングノードの[標準ログ](../../../admin-en/configure-logging.md)は`/opt/wallarm/var/log/wallarm`ディレクトリにあります。

追加のデバッグには、[`log.level`](../../native-node/all-in-one-conf.md#loglevel)パラメータを`debug`に設定してください。

## インストーラー起動オプション

* all-in oneスクリプトをダウンロードしたら、以下のコマンドで**ヘルプ**を表示できます：

    === "x86_64 version"
        ```
        sudo ./aio-native-0.11.0.x86_64.sh -- --help
        ```
    === "ARM64 version"
        ```
        sudo ./aio-native-0.11.0.aarch64.sh -- --help
        ```
* **interactive**モードでインストーラーを実行し、最初のステップで`tcp-capture`モードを選択することも可能です：

    === "x86_64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh
        ```
    === "ARM64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh
        ```
* ノードをAPIディスカバリー専用モードで使用することもできます（バージョン0.11.0から利用可能）。このモードでは、ノードの組み込みメカニズムや追加設定を要する認証情報の流出、API仕様違反の試み、ブルートフォースなどにより検出された攻撃は、Wallarm Cloudへはエクスポートされず、ローカルに[ログ](../../../admin-en/configure-logging.md)として記録されます。Cloud上に攻撃データが存在しないため、[Threat Replay Testing](../../../vulnerability-detection/threat-replay-testing/overview.md)は機能しません。

    一方で、[APIディスカバリー](../../../api-discovery/overview.md)、[APIセッション追跡](../../../api-sessions/overview.md)、および[セキュリティ脆弱性検出](../../../about-wallarm/detecting-vulnerabilities.md)は、関連するセキュリティエンティティの検出とCloudへのアップロードにより、引き続き完全に機能します。

    このモードは、まずAPIインベントリを確認し、重要なデータを特定した上で、制御された攻撃データエクスポートを計画する場合に利用されます。ただし、攻撃エクスポートを無効にするケースは稀であり、Wallarmは攻撃データを安全に処理し、必要に応じて[センシティブな攻撃データマスキング](../../../user-guides/rules/sensitive-data-rule.md)も提供します。

    APIディスカバリー専用モードを有効にするには：

    1. `/etc/wallarm-override/env.list`ファイルを作成または変更します：

        ```
        sudo mkdir /etc/wallarm-override
        sudo vim env.list
        ```

        以下の変数を追加します：

        ```
        WALLARM_APID_ONLY=true
        ```
    
    1. [Step 1: Wallarmトークンの準備](#step-1-prepare-wallarm-token)の手順に従ってノードをインストールします。

## アップグレードと再インストール

* ノードのアップグレードには、[こちらの手順](../../../updating-migrating/native-node/all-in-one.md)に従ってください。
* アップグレードまたは再インストールプロセスに問題がある場合：

    1. 現在のインストールを削除します：

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. 上記のインストール手順に従って、通常通りノードを再インストールします。

## 制限事項

* 本ソリューションは、実際のトラフィックフローとは独立してトラフィックを解析するout-of-band (OOB)動作であるため、以下のような固有の制限があります：

    * 悪意あるリクエストを即座にブロックすることはできません。Wallarmは攻撃を観測し、Wallarm Consoleに[詳細](../../../user-guides/events/check-attack.md)を提供するのみです。
    * 対象サーバーへの負荷を制限することが不可能なため、[レートリミッティング](../../../user-guides/rules/rate-limiting.md)はサポートされません。
    * [IPアドレスによるフィルタリング](../../../user-guides/ip-lists/overview.md)はサポートされません。
* 本ソリューションは、暗号化されていないHTTPトラフィックのみに対して、生のTCP上で解析を行い、暗号化されたHTTPSトラフィックは解析しません。
* 現在、HTTPキープアライブ接続上のレスポンス解析はサポートされていません。