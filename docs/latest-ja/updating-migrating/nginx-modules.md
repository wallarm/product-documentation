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

本手順では、個別パッケージからインストールされたWallarm NGINXモジュール4.xをバージョン6.xにアップグレードする手順を説明します。以下のいずれかの手順に従ってインストールされたモジュールが対象です:

* NGINX stable向けの個別パッケージ
* NGINX Plus向けの個別パッケージ
* ディストリビューション提供のNGINX向けの個別パッケージ

!!! info "all-in-one installerでのアップグレード"
    バージョン4.10以降、個別のLinuxパッケージは非推奨となり、Wallarmの[all-in-one installer](../installation/nginx/all-in-one.md)を使用してアップグレードします。この方法は、以前のアプローチと比べて、アップグレード作業と継続的なデプロイ運用を簡素化します。
    
    インストーラーは次の処理を自動で実行します:

    1. OSとNGINXのバージョンを確認します。
    1. 検出されたOSおよびNGINXのバージョンに対応するWallarmリポジトリを追加します。
    1. これらのリポジトリからWallarmパッケージをインストールします。
    1. インストール済みのWallarmモジュールをNGINXに接続します。
    1. 提供されたトークンを使用してフィルタリングノードをWallarm Cloudに接続します。

    ![手動手順とAll-in-oneの比較](../images/installation-nginx-overview/manual-vs-all-in-one.png)

サポート終了のノード(3.6以下)をアップグレードする場合は、[別の手順](older-versions/nginx-modules.md)を使用してください。

## 要件

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## アップグレード手順

* フィルタリングノードとpostanalyticsモジュールが同一サーバーにインストールされている場合は、以下の手順に従って両方をアップグレードしてください。

    クリーンなマシンでall-in-one installerを使用して新しいバージョンのノードを起動し、動作をテストしたうえで、旧ノードを停止し、トラフィックが旧マシンではなく新マシンを経由するように構成する必要があります。

* フィルタリングノードとpostanalyticsモジュールが別サーバーにインストールされている場合は、[こちらの手順](../updating-migrating/separate-postanalytics.md)に従い、最初にpostanalyticsモジュールを、次にフィルタリングモジュールをアップグレードしてください。

## 手順1: クリーンなマシンを準備する

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## 手順2: 最新のNGINXと依存関係をインストールする

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## 手順3: Wallarmトークンを準備する

--8<-- "../include/waf/installation/all-in-one-token.md"

## 手順4: Wallarmのall-in-one installerをダウンロードする

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## 手順5: Wallarmのall-in-one installerを実行する

### 同一サーバー上のフィルタリングノードとpostanalytics

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

### 別サーバー上のフィルタリングノードとpostanalytics

!!! warning "フィルタリングノードとpostanalyticsモジュールをアップグレードする手順の順序"
    フィルタリングノードとpostanalyticsモジュールが別サーバーにインストールされている場合は、フィルタリングノードのパッケージを更新する前に、postanalyticsのパッケージをアップグレードする必要があります。

1. [こちらの手順](separate-postanalytics.md)に従ってpostanalyticsモジュールをアップグレードします。
1. フィルタリングノードをアップグレードします:

    === "APIトークン"
        ```bash
        # x86_64版を使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.x86_64-glibc.sh filtering

        # ARM64版を使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します(Wallarm Console UIでのノードの論理グルーピングに使用します)。

    === "ノードトークン"
        ```bash
        # x86_64版を使用する場合:
        sudo sh wallarm-6.4.1.x86_64-glibc.sh filtering

        # ARM64版を使用する場合:
        sudo sh wallarm-6.4.1.aarch64-glibc.sh filtering
        ```

## 手順6: 旧ノードのマシンから新しいマシンへNGINXとpostanalyticsの設定を移行する

必要なディレクティブやファイルをコピーして、旧マシンから新マシンへノード関連のNGINXおよびpostanalyticsの設定を移行します:

* `/etc/nginx/conf.d/default.conf` または `/**etc/nginx/nginx.conf**` のhttpレベルに関するNGINX設定

    フィルタリングノードとpostanalyticsノードが別サーバーにある場合は、フィルタリングノードのマシン上の`/etc/nginx/nginx.conf`の`http`ブロック内で、`wallarm_tarantool_upstream`を[`wallarm_wstore_upstream`](../admin-en/configure-parameters-en.md#wallarm_wstore_upstream)にリネームします。
* `/etc/nginx/sites-available/default` トラフィックルーティングのためのNGINXおよびWallarm設定
* `/etc/nginx/conf.d/wallarm-status.conf` → 新しいマシン上の `/etc/nginx/wallarm-status.conf` にコピーします

    詳細は[リンク][wallarm-status-instr]内にあります。
* `/etc/wallarm/node.yaml` → 新しいマシン上の `/opt/wallarm/etc/wallarm/node.yaml` にコピーします

    別のpostanalyticsサーバーでカスタムのホストとポートを使用している場合は、postanalyticsノードのマシン上でコピーしたファイル内の`tarantool`セクションを`wstore`にリネームします。

## 手順7: NGINXを再起動する

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## 手順8: Wallarmノードの動作をテストする

新しいノードの動作をテストするには、次を実行します:

1. テスト用の[SQLインジェクション][sqli-attack-docs]および[クロスサイトスクリプティング(XSS)][xss-attack-docs]を含むリクエストを保護対象のリソースアドレスに送信します:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. US CloudまたはEU CloudのWallarm Console → **Attacks**セクションを開き、攻撃が一覧に表示されていることを確認します。
1. Cloudに保存されているデータ(ルール、IP lists)が新しいノードと同期されたら、いくつかテスト攻撃を実行してルールが期待どおりに動作することを確認します。

## 手順9: トラフィックをWallarmノードへ送信するよう構成する

ロードバランサーの転送先を更新して、トラフィックをWallarmインスタンスへ送信するようにします。詳細は、使用しているロードバランサーのドキュメントを参照してください。

トラフィックを新しいノードへ完全に切り替える前に、まず一部のみをリダイレクトし、新しいノードが期待どおりに動作することを確認することを推奨します。

## 手順10: 旧ノードを削除する

1. Wallarm Console → **Nodes**で対象のノードを選択し、**Delete**をクリックして旧ノードを削除します。
1. 操作を確認します。
    
    Cloudからノードを削除すると、アプリケーションへのリクエストのフィルタリングは停止します。フィルタリングノードの削除は元に戻せません。ノードはノード一覧から完全に削除されます。

1. 旧ノードが動作しているマシンを削除するか、Wallarmノードのコンポーネントのみを削除します:

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