!!! info "複数のWallarmノードをデプロイする場合"
    お使いの環境にデプロイされたすべてのWallarmノードは、**同じバージョン**でなければなりません。分散されたサーバにインストールされたpostanalyticsモジュールも、**同じバージョン**でなければなりません。

    追加ノードをインストールする前に、そのノードのバージョンが既にデプロイされたモジュールのバージョンと一致していることを確認してください。もし、デプロイされているモジュールのバージョンが[非推奨または近日中に非推奨になる（`4.0`以下）][versioning-policy]場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同一サーバ上にデプロイされたフィルタリングノードおよびpostanalyticsモジュールのバージョンを確認するには:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    異なるサーバ上にデプロイされたフィルタリングノードおよびpostanalyticsモジュールのバージョンを確認するには:

    === "Debian"
        ```bash
        # run from the server with installed Wallarm filtering node
        apt list wallarm-node-nginx
        # run from the server with installed postanalytics
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # run from the server with installed Wallarm filtering node
        yum list wallarm-node-nginx
        # run from the server with installed postanalytics
        yum list wallarm-node-tarantool
        ```