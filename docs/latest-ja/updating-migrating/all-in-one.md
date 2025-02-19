[statistics-service-all-parameters]:        ../admin-en/configure-statistics-service.md  
[img-attacks-in-interface]:                 ../images/admin-guides/test-attacks-quickstart.png  
[tarantool-status]:                         ../images/tarantool-status.png  
[configure-proxy-balancer-instr]:           ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md  
[ptrav-attack-docs]:                        ../attacks-vulns-list.md#path-traversal

# Wallarm NGINXノードのAll-in-Oneインストーラーを使用したアップグレード

本手順は、[all-in-one installer](../installation/nginx/all-in-one.md)を使用してインストールされたWallarmノード4.xをバージョン5.0へアップグレードする手順について説明します。

!!! info "Wallarmサービスの再インストールが必要です"
    4.xバージョンから[all-in-one installer](../installation/nginx/all-in-one.md)を使用してアップグレードする場合、新規インストールを実施することを推奨します。安全な手順としては、新しいマシンに新しいノードをインストールし、トラフィックを新マシンにリダイレクトした上で、古いマシンを削除する方法です。
    
    もしくは、現在のマシン上でサービスを停止して削除し、その後ノードを再インストールすることも可能ですが、この方法ではダウンタイムが発生する可能性があるため、推奨されません。

    本記事では、最も安全な移行方法について説明します。

## 要件

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

<!-- ## Upgrade procedure

The upgrade procedure differs depending on how filtering node and postanalytics modules are installed:

* [On the same server](#filtering-node-and-postanalytics-on-the-same-server): modules are upgraded altogether
* [On different servers](#filtering-node-and-postanalytics-on-different-servers): **first** upgrade the postanalytics module and **then** the filtering module -->

<!-- ## Filtering node and postanalytics on the same server

Use the procedure below to upgrade altogether the filtering node and postanalytics modules installed using all-in-one installer on the same server. -->

## Step 1: クリーンなマシンに新しいノードバージョンをインストールする

最新バージョンのノードを**新規マシン**に、最新バージョンのNGINXと共にインストールしてください。ガイドに従ってください。ガイドではマシンの要件についても説明しています。

* [同一サーバー上のFilteringおよびpostanalyticsモジュール](../installation/nginx/all-in-one.md)
* [異なるサーバー上のFilteringおよびpostanalyticsモジュール](../admin-en/installation-postanalytics-en.md)

インストール中に、前のノードで使用していた設定ファイルを引き継いで使用できます。ノードの設定には変更がありません。

その後、新しいノードで処理するために、トラフィックを新マシンにリダイレクトしてください。

## Step 2: 古いノードを削除する

1. トラフィックが新マシンにリダイレクトされ、クラウドに保存されたデータ（ルール、IPリスト）が同期されたら、テスト攻撃を実施しルールが期待通りに動作することを確認してください。
2. Wallarm Consoleの**Nodes**で対象のノードを選択し、**Delete**をクリックして古いノードを削除してください。
3. 操作を確認してください。
    
    ノードがクラウドから削除されると、アプリケーションへのリクエストのフィルタリングが停止します。Filteringノードの削除は元に戻せません。ノードはノード一覧から恒久的に削除されます。

4. 古いノードがインストールされているマシンを削除するか、Wallarmノードのコンポーネントだけを削除してください:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```