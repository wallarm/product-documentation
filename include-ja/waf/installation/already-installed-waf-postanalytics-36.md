!!! info "複数のWallarmノードをデプロイする場合"
    あなたの環境に展開された全てのWallarmノードは**同じバージョン**でなければなりません。別々のサーバーにインストールされたpostanalyticsモジュールも**同じバージョン**でなければなりません。

    追加のノードをインストールする前に、そのバージョンが既にデプロイされているモジュールのバージョンと一致していることを確認してください。デプロイされているモジュールのバージョンが[廃止予定か近く廃止予定(`4.0`以下)][versioning-policy]の場合は、全てのモジュールを最新のバージョンにアップグレードしてください。

    同じサーバーにインストールされているフィルタリングノードとpostanalyticsのインストールされたバージョンを確認するには：

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以下"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    異なるサーバーにインストールされているフィルタリングノードとpostanalyticsのバージョンを確認するには：

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行します
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以下"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行します
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行します
        yum list wallarm-node-tarantool
        ```