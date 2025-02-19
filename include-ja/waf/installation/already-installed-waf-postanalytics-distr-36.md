!!! info "複数のWallarmノードを展開する場合"
    お使いの環境に展開されたすべてのWallarmノードは**同じバージョン**でなければなりません。別のサーバーにインストールされたpostanalyticsモジュールも**同じバージョン**である必要があります。

    追加ノードのインストール前に、そのバージョンがすでに展開されたモジュールのバージョンと一致していることを確認してください。展開されたモジュールのバージョンが[非推奨または近日中に非推奨になる（`4.0`以下）][versioning-policy]場合、すべてのモジュールを最新バージョンにアップグレードしてください。

    同じサーバーに展開されたフィルタリングノードおよびpostanalyticsモジュールのバージョンを確認するには:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    別々のサーバーに展開されたフィルタリングノードおよびpostanalyticsモジュールのバージョンを確認するには:

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーで実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーで実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーで実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーで実行します
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーで実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーで実行します
        yum list wallarm-node-tarantool
        ```