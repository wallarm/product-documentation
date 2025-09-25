!!! info "複数のWallarmノードをデプロイする場合"
    環境にデプロイされたすべてのWallarmノードは**同一バージョン**である必要があります。異なるサーバーにインストールされたpostanalyticsモジュールも**同一バージョン**である必要があります。

    追加ノードをインストールする前に、そのバージョンが既にデプロイ済みのモジュールのバージョンと一致していることを確認してください。デプロイ済みモジュールのバージョンが[非推奨、または近日中に非推奨となる（`4.0`以下）][versioning-policy]場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同一サーバーにデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには:

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

    異なるサーバーにデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには:

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーで実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーで実行します
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーで実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーで実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーで実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーで実行します
        yum list wallarm-node-tarantool
        ```