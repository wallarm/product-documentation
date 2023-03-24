!!! info "いくつかのWallarmノードをデプロイする場合"
    あなたの環境にデプロイされたすべてのWallarmノードは、**同じバージョン**でなければなりません。別のサーバーにインストールされたPostanalyticsモジュールも**同じバージョン**でなければなりません。

    追加ノードのインストール前に、そのバージョンが既にデプロイされたモジュールのバージョンと一致することを確認してください。デプロイされたモジュールのバージョンが[廃止されるかもしれない（`4.0`以下）][versioning-policy]場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同じサーバーにインストールされたフィルタリングノードとPostanalyticsのインストール済みバージョンを確認するには：

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x 以降"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    異なるサーバーにインストールされたフィルタリングノードとPostanalyticsのバージョンを確認するには：

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行する
        apt list wallarm-node-nginx
        # Postanalyticsがインストールされたサーバーから実行する
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行する
        apt list wallarm-node-nginx
        # Postanalyticsがインストールされたサーバーから実行する
        apt list wallarm-node-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x 以降"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行する
        yum list wallarm-node-nginx
        # Postanalyticsがインストールされたサーバーから実行する
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行する
        yum list wallarm-node-nginx
        # Postanalyticsがインストールされたサーバーから実行する
        yum list wallarm-node-tarantool
        ```