いくつかのWallarmノードをデプロイする場合
:   お使いの環境にデプロイされたすべてのWallarmノードは、**同じバージョン**でなければなりません。別々のサーバーにインストールされたpostanalyticsモジュールも**同じバージョン**でなければなりません。

    追加ノードのインストール前に、そのバージョンがすでにデプロイされているモジュールのバージョンと一致していることを確認してください。デプロイされたモジュールのバージョンが[廃止予定または間もなく廃止予定(`4.0`以下)][versioning-policy]である場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同じサーバーにデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認する方法：

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    別々のサーバーにデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認する方法：

    === "Debian"
        ```bash
        # インストールされたWallarmフィルタリングノードのサーバーから実行します
        apt list wallarm-node-nginx
        # インストールされたpostanalyticsのサーバーから実行します
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # インストールされたWallarmフィルタリングノードのサーバーから実行します
        apt list wallarm-node-nginx
        # インストールされたpostanalyticsのサーバーから実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # インストールされたWallarmフィルタリングノードのサーバーから実行します
        yum list wallarm-node-nginx
        # インストールされたpostanalyticsのサーバーから実行します
        yum list wallarm-node-tarantool
        ```