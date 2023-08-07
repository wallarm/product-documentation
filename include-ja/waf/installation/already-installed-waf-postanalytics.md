					!!! info "複数のWallarmノードをデプロイする場合"
    あなたの環境にデプロイされるすべてのWallarmノードは、全て**同じバージョン**である必要があります。分散したサーバーにインストールされたpostanalyticsモジュールも、**同じバージョン**でなければなりません。

    追加ノードのインストール前に、すでにデプロイされているモジュールのバージョンと一致することを確認してください。デプロイ済みモジュールのバージョンが[非推奨、または近く非推奨になる(`4.0`以下)][versioning-policy]場合、すべてのモジュールを最新バージョンにアップグレードしてください。

    同じサーバーにインストールされたフィルタリングノードとpostanalyticsのインストールバージョンを確認するには：

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

    別のサーバーにインストールされたフィルタリングノードとpostanalyticsのバージョンを確認するには：

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以下"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行
        yum list wallarm-node-tarantool
        ```
