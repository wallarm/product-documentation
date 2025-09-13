!!! info "複数のWallarmノードをデプロイする場合"
    環境にデプロイされるすべてのWallarmノードは、**同じバージョン**である必要があります。別々のサーバーにインストールされたpostanalyticsモジュールも**同じバージョン**である必要があります。

    追加ノードをインストールする前に、そのバージョンが既にデプロイ済みのモジュールのバージョンと一致していることを確認してください。デプロイ済みのモジュールのバージョンが[非推奨、または間もなく非推奨になる場合（`4.0`以下）][versioning-policy]、すべてのモジュールを最新バージョンにアップグレードしてください。

    同一サーバーにインストールされているフィルタリングノードとpostanalyticsのバージョンを確認するには、次を実行します:

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
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    異なるサーバーにインストールされているフィルタリングノードとpostanalyticsのバージョンを確認するには、次を実行します:

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーで実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーで実行
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーで実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーで実行
        apt list wallarm-node-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以下"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーで実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーで実行
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーで実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーで実行
        yum list wallarm-node-tarantool
        ```