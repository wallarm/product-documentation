					!!! info "複数のWallarmノードをデプロイする場合"
    環境にデプロイされているすべてのWallarmノードは **同じバージョン** でなければなりません。また、別々のサーバーにインストールされているpostanalyticsモジュールも **同じバージョン** でなければなりません。

    追加ノードのインストール前に、そのバージョンが既にデプロイされているモジュールのバージョンと一致していることを確認してください。既にデプロイされているモジュールのバージョンが[廃止予定または近日中に廃止予定 (`4.0` 以下)][versioning-policy]である場合、すべてのモジュールを最新版にアップグレードしてください。

    同じサーバーにデプロイされているフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには：

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

    異なるサーバーにデプロイされているフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには：

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行します
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行します
        yum list wallarm-node-tarantool
        ```