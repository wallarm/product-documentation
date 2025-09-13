!!! info "複数のWallarmノードをデプロイする場合"
    お使いの環境にデプロイされているすべてのWallarmノードは、**同じバージョン**である必要があります。別のサーバーにインストールされているpostanalyticsモジュールも**同じバージョン**である必要があります。

    追加ノードをインストールする前に、そのバージョンが既にデプロイ済みのモジュールのバージョンと一致していることを確認してください。デプロイ済みモジュールのバージョンが[非推奨、または間もなく非推奨となる予定（`4.0`以下）][versioning-policy]の場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同一サーバーにデプロイされているフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには：

    === "Debian"
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
        # Wallarmのフィルタリングノードがインストールされているサーバーで実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーで実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarmのフィルタリングノードがインストールされているサーバーで実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーで実行します
        yum list wallarm-node-tarantool
        ```