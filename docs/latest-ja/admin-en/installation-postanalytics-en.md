[tarantool-status]:           ../images/tarantool-status.png
[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# 別サーバーにおけるポストアナリティクスモジュールのインストール

Wallarmのリクエスト処理では、統計的なリクエスト分析を行うポストアナリティクス段階を含む2つの段階が関与しています。ポストアナリティクスはメモリ集約型であるため、最適なパフォーマンスを発揮するには専用サーバーで実行する必要がある場合があります。本記事では、別サーバーにおいてポストアナリティクスモジュールをインストールする方法について説明します。

## 概要

Wallarmノードでのリクエスト処理は、以下の2つの段階で構成されています：

* NGINX-Wallarmモジュールでのプライマリ処理。これはメモリ負荷が低く、フロントエンドサーバー上で実行可能であり、サーバー要件を変更する必要はありません。
* ポストアナリティクスモジュールにおける、処理済みリクエストの統計的分析。こちらはメモリ負荷が高いです。

以下の図は、NGINX-Wallarmとポストアナリティクスのモジュール間の相互作用を、同一サーバー上にインストールした場合と別々のサーバー上にインストールした場合で示しています。

=== "NGINX-Wallarmとポストアナリティクスを同一サーバー上で実行"
    ![ポストアナリティクスとNGINX-Wallarm間のトラフィックの流れ](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-the-same-server.png)
=== "NGINX-Wallarmとポストアナリティクスを別サーバー上で実行"
    ![ポストアナリティクスとNGINX-Wallarm間のトラフィックの流れ](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-different-servers.png)

## 必要条件

--8<-- "../include/waf/installation/all-in-one/separate-postanalytics-reqs.md"

## ステップ1: all-in-one Wallarmインストーラーのダウンロード

all-in-one Wallarmインストールスクリプトをダウンロードするには、以下のコマンドを実行します：

=== "x86_64バージョン"
    ```bash
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.x86_64-glibc.sh
    ```
=== "ARM64バージョン"
    ```bash
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.aarch64-glibc.sh
    ```

## ステップ2: Wallarmトークンの準備

ノードをインストールするには、[該当タイプ][wallarm-token-types]のWallarmトークンが必要です。トークンの準備は以下の手順で行います：

=== "APIトークン"

    1. Wallarm Console → **Settings** → **API tokens** を、[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
    2. `Deploy`ソースロールを持つAPIトークンを見つけるか新規に作成します。
    3. このトークンをコピーします。

=== "ノードトークン"

    1. Wallarm Console → **Nodes** を、[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開きます。
    2. 以下のいずれかを実行します：
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用する場合は、ノードのメニューから**Copy token**を選択してトークンをコピーします。

## ステップ3: all-in-one Wallarmインストーラーを実行してポストアナリティクスをインストール

all-in-oneインストーラーを使用してポストアナリティクスを別にインストールするには、以下を実行します：

=== "APIトークン"
    ```bash
    # x86_64バージョンを使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh postanalytics

    # ARM64バージョンを使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh postanalytics
    ```        

    WALLARM_LABELS変数は、Wallarm Console UIにおけるノードの論理的なグループ化に用いる、ノードが追加されるグループを設定します。

=== "ノードトークン"
    ```bash
    # x86_64バージョンを使用する場合:
    sudo sh wallarm-5.3.0.x86_64-glibc.sh postanalytics

    # ARM64バージョンを使用する場合:
    sudo sh wallarm-5.3.0.aarch64-glibc.sh postanalytics
    ```

## ステップ4: ポストアナリティクスモジュールの設定

### リソースとメモリ

Tarantoolが使用するメモリ量を変更するには、`/opt/wallarm/env.list`ファイル内の`SLAB_ALLOC_ARENA`設定を確認してください。デフォルトでは1GBに設定されています。必要に応じて、Tarantoolが実際に必要とするメモリ量に合わせて数値を調整してください。設定値についての推奨事項は、[こちら](configuration-guides/allocate-resources-for-node.md)を参照してください。

割り当てられたメモリを変更するには：

1. `/opt/wallarm/env.list`ファイルを編集のために開きます：

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
2. `SLAB_ALLOC_ARENA`属性をメモリサイズに設定します。値は整数または小数（小数点`.`を使用）で指定可能です。例：

    ```
    SLAB_ALLOC_ARENA=2.0
    ```

### ホストとポート

デフォルトでは、ポストアナリティクスモジュールはホストの全IPv4アドレス（0.0.0.0）上でポート3313を介して接続を受け入れるように設定されています。変更が必要でない限り、デフォルト設定のままにすることを推奨します。

しかし、デフォルト構成を変更する必要がある場合：

1. `/opt/wallarm/env.list`ファイルを編集のために開きます：

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
2. 必要に応じて`HOST`および`PORT`の値を更新します。まだ`PORT`変数が指定されていない場合は定義してください。例：

    ```bash
    # tarantool
    HOST=0.0.0.0
    PORT=3300
    ```
3. `/opt/wallarm/etc/wallarm/node.yaml`ファイルを編集のために開きます：

    ```bash
    sudo vim /opt/wallarm/etc/wallarm/node.yaml
    ```
4. 以下のようにして、`tarantool`パラメーターの新しい`host`および`port`の値を入力します：

    ```yaml
    hostname: <name of postanalytics node>
    uuid: <UUID of postanalytics node>
    secret: <secret key of postanalytics node>
    tarantool:
        host: '0.0.0.0'
        port: 3300
    ```

## ステップ5: ポストアナリティクスモジュール用のインバウンド接続を有効化

ポストアナリティクスモジュールはデフォルトでポート3313を使用しますが、一部のクラウドプラットフォームではこのポートへのインバウンド接続がブロックされる場合があります。

統合を保証するために、ポート3313またはカスタムポートへのインバウンド接続を許可してください。このステップは、別々にインストールされたNGINX-WallarmモジュールがTarantoolインスタンスに接続するために必須です。

## ステップ6: Wallarmサービスの再起動

必要な変更を実施した後、ポストアナリティクスモジュールをホストするマシン上でWallarmサービスを再起動し、更新内容を適用します：

```
sudo systemctl restart wallarm.service
```

## ステップ7: 別サーバーにNGINX-Wallarmモジュールをインストール

別サーバーにポストアナリティクスモジュールをインストールした後：

1. 異なるサーバーに[こちらのガイド](../installation/nginx/all-in-one.md)に従ってNGINX-Wallarmモジュールをインストールします。
2. 別サーバーでNGINX-Wallarmモジュールのインストールスクリプトを起動する際、`filtering`オプションを含めます。例：

    === "APIトークン"
        ```bash
        # x86_64バージョンを使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # ARM64バージョンを使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```        

        WALLARM_LABELS変数は、Wallarm Console UIにおけるノードの論理的なグループ化に用いる、ノードが追加されるグループを設定します。

    === "ノードトークン"
        ```bash
        # x86_64バージョンを使用する場合:
        sudo sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # ARM64バージョンを使用する場合:
        sudo sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```

## ステップ8: NGINX-Wallarmモジュールをポストアナリティクスモジュールに接続

NGINX-Wallarmモジュールがインストールされているマシンで、NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)内にポストアナリティクスモジュールのサーバーアドレスを指定します：

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* 各upstream Tarantoolサーバーごとに`max_conns`値を指定し、過剰な接続の作成を防ぐ必要があります。
* `keepalive`値はTarantoolサーバーの数未満にしてはなりません。

設定ファイルを変更したら、NGINX-Wallarmモジュールが稼働しているサーバーでNGINX/NGINX Plusを再起動します：

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## ステップ9: NGINX‑Wallarmおよび別サーバーにおけるポストアナリティクスモジュールの連携を確認

NGINX‑Wallarmと別サーバーにおけるポストアナリティクスモジュールの連携を確認するには、保護対象アプリケーションのアドレスにテスト攻撃リクエストを送信します：

```bash
curl http://localhost/etc/passwd
```

NGINX‑Wallarmと別サーバーにおけるポストアナリティクスモジュールが正しく構成されている場合、攻撃はWallarm Cloudにアップロードされ、Wallarm Consoleの**Attacks**セクションに表示されます：

![インターフェース上の攻撃](../images/admin-guides/test-attacks-quickstart.png)

攻撃がCloudにアップロードされなかった場合、各サービスの動作にエラーがないか確認してください：

* ポストアナリティクスモジュールのログを解析します

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/tarantool-out.log
    ```

    もし`SystemError binary: failed to bind: Cannot assign requested address`のような記録があれば、指定されたアドレスとポートでサーバーが接続を受け入れているか確認してください。
* NGINX‑Wallarmモジュールがインストールされているサーバーで、NGINXのログを解析します：

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    もし`[error] wallarm: <address> connect() failed`のような記録があれば、NGINX‑Wallarmモジュールの設定ファイルに別サーバーのポストアナリティクスモジュールのアドレスが正しく指定され、該当するアドレスとポートで接続が受け入れられているか確認してください。
* NGINX‑Wallarmモジュールがインストールされているサーバーで、以下のコマンドを使用して処理済みリクエストの統計情報を取得し、`tnt_errors`の値が0であることを確認してください：

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [統計サービスによって返されるすべてのパラメーターの説明 →](configure-statistics-service.md)

## ポストアナリティクスモジュールの保護

!!! warning "インストールされたポストアナリティクスモジュールの保護"
    新たにインストールされたWallarmポストアナリティクスモジュールをファイアウォールで保護することを**強く推奨します**。そうしない場合、サービスへの不正アクセスのリスクがあり、以下の事態が発生する可能性があります：
    
    * 処理済みリクエストに関する情報の漏洩
    * 任意のLuaコードやオペレーティングシステムコマンドの実行可能性
   
    なお、ポストアナリティクスモジュールを同一サーバー上でNGINX-Wallarmモジュールと共に展開する場合、このようなリスクは存在しないことにご留意ください。なぜなら、ポストアナリティクスモジュールはポート`3313`で待ち受けるためです。
    
    **別途インストールされたポストアナリティクスモジュールに適用すべきファイアウォール設定は以下の通りです：**
    
    * Wallarm APIサーバーとの通信が可能となるように、HTTPSトラフィックをWallarm APIサーバーとの間で許可します：
        * `us1.api.wallarm.com`はUS Wallarm Cloud内のAPIサーバーです。
        * `api.wallarm.com`はEU Wallarm Cloud内のAPIサーバーです。
    * WallarmフィルタリングノードのIPアドレスからの接続のみを許可することで、TCPおよびUDPプロトコル経由での`3313` Tarantoolポートへのアクセスを制限します。

## Tarantoolトラブルシューティング

[Tarantoolトラブルシューティング](../faq/tarantool.md)