!!! info "複数のWallarmノードをデプロイする場合"
    お使いの環境にデプロイされるすべてのWallarmノードは**同一バージョン**である必要があります。別サーバーにインストールされているpostanalyticsモジュールも**同一バージョン**である必要があります。

    追加ノードをインストールする前に、そのバージョンが既にデプロイ済みのモジュールのバージョンと一致していることを確認してください。デプロイ済みのモジュールのバージョンが[非推奨、またはまもなく非推奨になる予定（`4.0`以下）][versioning-policy]の場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同一サーバーにデプロイされているフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには、以下を実行します。

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

    異なるサーバーにデプロイされているフィルタリングノードとpostanalyticsモジュールのバージョンを確認するには、以下を実行します。

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行します
        apt list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行します
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        # Wallarmフィルタリングノードがインストールされたサーバーから実行します
        yum list wallarm-node-nginx
        # postanalyticsがインストールされたサーバーから実行します
        yum list wallarm-node-tarantool
        ```