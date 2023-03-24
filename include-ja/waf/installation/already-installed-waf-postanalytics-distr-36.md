!!! info "複数のWallarmノードをデプロイする場合"
    環境にデプロイされたすべてのWallarmノードは、**同じバージョン**でなければなりません。別々のサーバーにインストールされたpostanalyticsモジュールも**同じバージョン**でなければなりません。

    追加ノードのインストール前に、そのバージョンがすでにデプロイされているモジュールのバージョンと一致していることを確認してください。デプロイされているモジュールのバージョンが[廃止されるかもしれない（`4.0`以下）][versioning-policy]場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同じサーバーにデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには：

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux, Rocky Linux, Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    異なるサーバーにデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには：

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux, Oracle Linux 8.x"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行
        yum list wallarm-node-tarantool
        ```