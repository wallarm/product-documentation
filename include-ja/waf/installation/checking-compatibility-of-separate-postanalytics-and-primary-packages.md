					!!! info "`wallarm-node-tarantool` パッケージのバージョン"
    `wallarm-node-tarantool` パッケージは、別のサーバーにインストールされた主要な NGINX-Wallarm モジュールパッケージと同じかそれ以上のバージョンでなければなりません。

    バージョンを確認するには:

    === "Debian"
        ```bash
        # 主要な NGINX-Wallarm モジュールを持つサーバーから実行します
        apt list wallarm-node-nginx
        # postanalytics モジュールを持つサーバーから実行します
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # 主要な NGINX-Wallarm モジュールを持つサーバーから実行します
        apt list wallarm-node-nginx
        # postanalytics モジュールを持つサーバーから実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOS または Amazon Linux 2.0.2021x 及びそれ以下"
        ```bash
        # 主要な NGINX-Wallarm モジュールを持つサーバーから実行します
        yum list wallarm-node-nginx
        # postanalytics モジュールを持つサーバーから実行します
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux、Rocky Linux または Oracle Linux 8.x"
        ```bash
        # 主要な NGINX-Wallarm モジュールを持つサーバーから実行します
        yum list wallarm-node-nginx
        # postanalytics モジュールを持つサーバーから実行します
        yum list wallarm-node-tarantool
        ```