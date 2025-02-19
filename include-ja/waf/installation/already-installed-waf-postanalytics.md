```markdown
!!! info "複数のWallarmノードをデプロイする場合"
    お客様の環境にデプロイされた全てのWallarmノードは、**同じバージョン**でなければなりません。分離されたサーバにインストールされたpostanalyticsモジュールも、**同じバージョン**でなければなりません。

    追加ノードをインストールする前に、追加ノードのバージョンが既にデプロイされたモジュールのバージョンと一致していることを確認してください。もし、デプロイされたモジュールのバージョンが[サポート対象外または間もなくサポート終了になる(`4.0`以下)][versioning-policy]場合、全てのモジュールを最新バージョンにアップグレードしてください。

    同じサーバにインストールされたフィルタリングノードとpostanalyticsのバージョンを確認するには:

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

    別サーバにインストールされたフィルタリングノードとpostanalyticsのバージョンを確認するには:

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバから実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバから実行します
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバから実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバから実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以下"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバから実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバから実行します
        yum list wallarm-node-tarantool
        ```
```