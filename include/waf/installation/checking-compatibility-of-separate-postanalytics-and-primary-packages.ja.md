					!!! info "`wallarm-node-tarantool` パッケージのバージョン"
    `wallarm-node-tarantool`パッケージは、別のサーバーにインストールされた主要なNGINX-Wallarmモジュールのパッケージと同じかそれ以上のバージョンである必要があります。

    バージョンを確認するには：

    === "Debian"
        ```bash
        # 主要なNGINX-Wallarmモジュールのサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsモジュールのサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # 主要なNGINX-Wallarmモジュールのサーバーから実行
        apt list wallarm-node-nginx
        # postanalyticsモジュールのサーバーから実行
        apt list wallarm-node-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以前"
        ```bash
        # 主要なNGINX-Wallarmモジュールのサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsモジュールのサーバーから実行
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
        ```bash
        # 主要なNGINX-Wallarmモジュールのサーバーから実行
        yum list wallarm-node-nginx
        # postanalyticsモジュールのサーバーから実行
        yum list wallarm-node-tarantool
        ```