```markdown
!!! info "複数のWallarmノードを展開する場合"
    お使いの環境にデプロイされたすべてのWallarmノードは、すべて**同じバージョン**である必要があります。分散したサーバにインストールされるpostanalyticsモジュールもすべて**同じバージョン**である必要があります。

    追加ノードのインストール前に、そのバージョンがすでにデプロイされたモジュールのバージョンと一致していることを確認してください。もしデプロイされたモジュールのバージョンが[廃止済みまたは近いうちに廃止される（`4.0`以下）][versioning-policy]場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同一サーバでデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには:

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

    別々のサーバでデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには:

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバで実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバで実行
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバで実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバで実行
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバで実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバで実行
        yum list wallarm-node-tarantool
        ```
```