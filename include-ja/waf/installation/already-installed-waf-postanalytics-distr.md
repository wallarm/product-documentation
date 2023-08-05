					!!! info "もし複数のWallarmノードをデプロイする場合"
    あなたの環境にデプロイされる全てのWallarmノードは**同じバージョン**でなければなりません。また、個々のサーバーにインストールされたpostanalyticsモジュールも同じバージョンである必要があります。

    追加のノードをインストールする前に、そのバージョンが既にデプロイされているモジュールのバージョンと一致することを確認してください。デプロイされたモジュールのバージョンが[廃止予定または近いうちに廃止予定(`4.0`以下)][versioning-policy]である場合、全てのモジュールを最新バージョンにアップグレードしてください。

    同一サーバーにデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには：

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    異なるサーバーにデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには：

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行
        yum list wallarm-node-tarantool
        ```