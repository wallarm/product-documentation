!!! info "いくつかのWallarmノードをデプロイする場合"
    環境にデプロイされたすべてのWallarmノードは、**同じバージョン**である必要があります。別々のサーバーにインストールされたpostanalyticsモジュールも**同じバージョン**である必要があります。

    追加ノードのインストール前に、そのバージョンが既にデプロイされているモジュールのバージョンと一致することを確認してください。デプロイされたモジュールのバージョンが[廃止または間もなく廃止される予定（`4.0`以下）][versioning-policy]の場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同じサーバーにインストールされたフィルタリングノードとpostanalyticsのバージョンを確認するには：

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以前"
        ```bash
        yum list wallarm-node
        ```

    異なるサーバーにインストールされたフィルタリングノードとpostanalyticsのバージョンを確認するには：

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以前"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行
        yum list wallarm-node-tarantool
        ```