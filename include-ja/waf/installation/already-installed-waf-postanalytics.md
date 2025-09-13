!!! info "複数のWallarmノードをデプロイする場合"
    お使いの環境にデプロイされるすべてのWallarmノードは**同一バージョン**である必要があります。別々のサーバーにインストールされるpostanalyticsモジュールも**同一バージョン**である必要があります。

    追加ノードをインストールする前に、そのバージョンが既にデプロイ済みのモジュールのバージョンと一致していることを確認してください。デプロイ済みのモジュールのバージョンが[非推奨、またはまもなく非推奨になります（`4.0`以下）][versioning-policy]の場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同一サーバーにインストールされたフィルタリングノードとpostanalyticsのバージョンを確認するには:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOSまたはAmazon Linux 2.0.2021xおよびそれ以前"
        ```bash
        yum list wallarm-node
        ```

    異なるサーバーにインストールされたフィルタリングノードとpostanalyticsのバージョンを確認するには:

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーで実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーで実行します
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーで実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーで実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021xおよびそれ以前"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーで実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーで実行します
        yum list wallarm-node-tarantool
        ```