					!!! info "もし複数のWallarmノードをデプロイする場合"
    あなたの環境にデプロイされたすべてのWallarmノードは**同じバージョン**でなければなりません。別々のサーバーにインストールされたpostanalyticsモジュールも**同じバージョン**でなければなりません。

    追加のノードのインストール前に、そのバージョンがすでにデプロイされたモジュールのバージョンと一致していることを確認してください。もしデプロイされたモジュールのバージョンが[廃止予定、または近日中に廃止予定（`4.0`以下）][versioning-policy]であれば、すべてのモジュールを最新のバージョンにアップグレードしてください。

    同じサーバーにデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには：

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    別々のサーバーにデプロイされたフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには：

    === "Debian"
        ```bash
        # Wallarm filtering nodeがインストールされたサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarm filtering nodeがインストールされたサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        # Wallarm filtering nodeがインストールされたサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行
        yum list wallarm-node-tarantool
        ```