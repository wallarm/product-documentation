```markdown
!!! info "複数のWallarmノードを導入する場合"
    お客様の環境に導入されたすべてのWallarmノードは、**同一のバージョン**でなければなりません。別々のサーバーにインストールされたpostanalyticsモジュールも、**同一のバージョン**でなければなりません。

    追加ノードのインストール前に、そのバージョンがお客様の環境に既にデプロイされているモジュールのバージョンと一致していることを確認してください。もしもデプロイ済みのモジュールのバージョンが[廃止済みまたは近い将来に廃止される予定（`4.0`以下）][versioning-policy]の場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

    同一サーバーにインストールされたフィルタリングノードおよびpostanalyticsのバージョンを確認するには:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    異なるサーバーにインストールされたフィルタリングノードおよびpostanalyticsのバージョンを確認するには:

    === "Debian"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        # Wallarmフィルタリングノードがインストールされているサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsがインストールされているサーバーから実行
        yum list wallarm-node-tarantool
        ```
```