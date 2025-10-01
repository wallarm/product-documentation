[statistics-service-all-parameters]:        ../admin-en/configure-statistics-service.md
[img-attacks-in-interface]:                 ../images/admin-guides/test-attacks-quickstart.png
[configure-proxy-balancer-instr]:           ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../attacks-vulns-list.md#path-traversal

# All‑in‑Oneインストーラーを使用したWallarm NGINXノードのアップグレード

この手順では、[All‑in‑Oneインストーラー](../installation/nginx/all-in-one.md)でインストールしたWallarmノードを最新のバージョン6.xにアップグレードする手順を説明します。

!!! info "Wallarmサービスの再インストールが必要です"
    安全にアップグレードするために、新しいマシンに新しいノードをインストールし、トラフィックを新しいマシンにリダイレクトしてから、古いマシンを削除します。
    
    代替案として、現在のマシン上のサービスを停止して削除し、その後ノードを再インストールすることもできます。ただし、この方法ではダウンタイムが発生する可能性があるため、推奨しません。

    本記事では、最も安全な移行方法を説明します。

## ステップ1: クリーンなマシンに新しいノードバージョンをインストールします

1. 5.x以前からのアップグレードで、postanalyticsモジュールを別途インストールしている場合は、[Tarantoolからwstoreへの置き換え](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)を反映するように既存の設定をコピーして更新します:

    * フィルタリングノードのマシンでは、/etc/nginx/nginx.confの`http`ブロック内で、`wallarm_tarantool_upstream`を[`wallarm_wstore_upstream`](../admin-en/configure-parameters-en.md#wallarm_wstore_upstream)に名前を変更します。
    * postanalyticsマシン（カスタムのホストとポートを使用している場合）は、/opt/wallarm/etc/wallarm/node.yamlで、`tarantool`セクションを`wstore`に名前を変更します。
1. 以下のガイドのいずれかに従って、新しいマシンにノードの最新バージョンを、最新のNGINXと並行してインストールします。各ガイドにはマシンの要件も記載しています。

    * [同一サーバー上のフィルタリングモジュールとpostanalyticsモジュール](../installation/nginx/all-in-one.md) - 以前の設定ファイルを移行して再利用できます。
    * [別サーバー上のフィルタリングモジュールとpostanalyticsモジュール](../admin-en/installation-postanalytics-en.md) - ステップ1で更新した設定ファイルを使用します。
1. トラフィックを新しいマシンにルーティングし、新しいノードで処理させます。

## ステップ2: 古いノードを削除します

1. トラフィックが新しいマシンにルーティングされ、Wallarm Cloudに保存されたデータ（ルール、IPリスト）が同期されたら、ルールが期待どおりに動作することを確認するためにいくつかのテスト攻撃を実施します。
1. Wallarm Console → **Nodes**で対象のノードを選択し、**Delete**をクリックして古いノードを削除します。
1. 操作を確認します。
    
    ノードをWallarm Cloudから削除すると、アプリケーションへのリクエストのフィルタリングは停止します。フィルタリングノードの削除は元に戻せません。ノードはノード一覧から完全に削除されます。

1. 古いノードが動作しているマシンを削除するか、Wallarmノードコンポーネントのみを削除してクリーンアップします:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```