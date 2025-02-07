[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]:             ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[oob-docs]:                         ../installation//oob/overview.md
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../installation/oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md

# Wallarm NGINXモジュールのアップグレード

本手順は、個別パッケージからインストールされたWallarm NGINXモジュール4.xをバージョン5.0にアップグレードするための手順を説明します。これらのモジュールは、以下のいずれかの手順に従ってインストールされたものです。

* NGINX stable用の個別パッケージ
* NGINX Plus用の個別パッケージ
* ディストリビューション提供のNGINX用の個別パッケージ

!!! info "all-in-one installerを使用したアップグレード"
    バージョン4.10以降、個別Linuxパッケージが非推奨となったため、アップグレードはWallarmの[all-in-one installer](../installation/nginx/all-in-one.md)を使用して行います。この方法は、以前の手法と比較して、アップグレードプロセスおよび運用展開の保守を簡素化します。
    
    インストーラーは自動的に以下の操作を実行します：

    1. OSおよびNGINXバージョンのチェック
    1. 検出されたOSおよびNGINXバージョン向けのWallarmリポジトリの追加
    1. これらのリポジトリからWallarmパッケージのインストール
    1. インストールされたWallarmモジュールをNGINXに接続
    1. 提供されたトークンを用いて、フィルタリングノードをWallarm Cloudに接続

    ![手動方式との比較](../images/installation-nginx-overview/manual-vs-all-in-one.png)

サポート終了のノード (3.6以下) をアップグレードするには、[こちらの別の手順](older-versions/nginx-modules.md)を使用してください。

## 必要条件

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## アップグレード手順

* 同じサーバーにフィルタリングノードとpostanalyticsモジュールがインストールされている場合は、以下の手順に従ってすべてをアップグレードしてください。クリーンなマシンでall-in-one installerを使用して最新版のノードを起動し、動作確認後、従来のノードを停止し、トラフィックを従来のマシンではなく新しいマシンに流すように構成する必要があります。

* フィルタリングノードとpostanalyticsモジュールが異なるサーバーにインストールされている場合は、**最初に**postanalyticsモジュールをアップグレードし、その後に[こちらの手順](../updating-migrating/separate-postanalytics.md)に従ってフィルタリングノードをアップグレードしてください。

## ステップ1：クリーンなマシンの準備

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## ステップ2：最新のNGINXおよび依存関係のインストール

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## ステップ3：Wallarmトークンの準備

--8<-- "../include/waf/installation/all-in-one-token.md"

## ステップ4：all-in-one Wallarmインストーラーのダウンロード

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## ステップ5：all-in-one Wallarmインストーラーの実行

### 同一サーバー上のフィルタリングノードとpostanalytics

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

### 異なるサーバー上のフィルタリングノードとpostanalytics

!!! warning "フィルタリングノードとpostanalyticsモジュールのアップグレード手順の順序"
    フィルタリングノードとpostanalyticsモジュールが異なるサーバーにインストールされている場合、フィルタリングノードパッケージの更新前にpostanalyticsパッケージのアップグレードが必要です。

1. [こちらの手順](separate-postanalytics.md)に従ってpostanalyticsモジュールをアップグレードしてください。
1. フィルタリングノードをアップグレードしてください：

    === "APIトークン"
        ```bash
        # x86_64バージョンを使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # ARM64バージョンを使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```        

        WALLARM_LABELS変数は、ノードが追加されるグループを設定します（Wallarm Console UIにおけるノードの論理グルーピングに使用されます）。

    === "ノードトークン"
        ```bash
        # x86_64バージョンを使用する場合:
        sudo sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # ARM64バージョンを使用する場合:
        sudo sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```

## ステップ6：古いノードマシンから新しいノードマシンへのNGINXおよびpostanalytics構成の転送

古いマシン上の構成ファイルから新しいマシン上のファイルへ、ノードに関連するNGINX構成およびpostanalytics構成を転送します。必要なディレクティブをコピーすることで実施できます。

**ソースファイル**

古いマシンでは、OSおよびNGINXのバージョンに応じて、NGINX構成ファイルが異なるディレクトリに存在し、名前も異なる場合があります。最も一般的なものは次の通りです：

* `/etc/nginx/conf.d/default.conf` (NGINX設定)
* `/etc/nginx/conf.d/wallarm-status.conf` (Wallarmノード監視設定。詳細は[リンク][wallarm-status-instr]に記載)

また、postanalyticsモジュールの構成（Tarantoolデータベース設定）は通常、以下の場所にあります：

* `/etc/default/wallarm-tarantool`または
* `/etc/sysconfig/wallarm-tarantool`

**ターゲットファイル**

all-in-one installerはOSおよびNGINXのバージョンの組み合わせに応じて動作するため、新しいマシン上の[ターゲットファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)は名前が異なったり、異なるディレクトリに配置される場合があります。

## ステップ7：NGINXの再起動

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## ステップ8：Wallarmノードの動作確認

新しいノードの動作確認を行うには：

1. テスト用の[SQLI][sqli-attack-docs]および[XSS][xss-attack-docs]攻撃を保護対象リソースのアドレスに送信してください：

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Wallarm Consoleの→ **Attacks** セクション（[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)）を開き、攻撃がリストに表示されていることを確認してください。
1. Cloudに保存されているデータ（ルール、IPリスト）が新しいノードと同期されたら、テスト攻撃を実施し、ルールが期待通りに動作することを確認してください。

## ステップ9：Wallarmノードへのトラフィック送信の設定

使用している展開手法に応じて、以下の設定を実施してください：

=== "インライン"
    ロードバランサーのターゲットを更新し、トラフィックをWallarmインスタンスに送信するよう設定してください。詳細はお使いのロードバランサーのドキュメントを参照してください。

    トラフィックを新しいノードに完全にリダイレクトする前に、部分的にリダイレクトし、新しいノードが期待通りに動作するかを確認することを推奨します。

=== "Out-of-Band"
    ウェブサーバまたはプロキシサーバ（例：NGINX, Envoy）を構成し、受信トラフィックをWallarmノードにミラーリングしてください。構成の詳細についてはお使いのウェブまたはプロキシサーバのドキュメントを参照することを推奨します。

    [リンク][web-server-mirroring-examples]内に、最も普及しているウェブおよびプロキシサーバ（NGINX, Traefik, Envoy）のサンプル構成例が記載されています。

## ステップ10：古いノードの削除

1. Wallarm Consoleの→ **Nodes** で、対象ノードを選択し**Delete**をクリックして古いノードを削除してください。
1. 操作を確認してください。
    
    ノードがCloudから削除されると、アプリケーションへのリクエストのフィルタリングが停止します。フィルタリングノードの削除は元に戻せません。ノードはノードリストから永久に削除されます。

1. 古いノードが存在するマシンを削除するか、またはWallarmノードコンポーネントのみを削除してください：

    === "Debian"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```