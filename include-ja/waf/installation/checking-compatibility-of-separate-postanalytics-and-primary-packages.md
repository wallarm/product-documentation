!!! info "`wallarm-node-tarantool`パッケージのバージョン"
    `wallarm-node-tarantool`パッケージは、別のサーバーにインストールされているプライマリNGINX-Wallarmモジュールパッケージと同じかそれ以上のバージョンである必要があります。

    バージョンを確認するには:

    === "Debian"
        ```bash
        # プライマリNGINX-Wallarmモジュールがあるサーバーで実行します
        apt list wallarm-node-nginx
        # postanalyticsモジュールがあるサーバーで実行します
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # プライマリNGINX-Wallarmモジュールがあるサーバーで実行します
        apt list wallarm-node-nginx
        # postanalyticsモジュールがあるサーバーで実行します
        apt list wallarm-node-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021xおよびそれ以前"
        ```bash
        # プライマリNGINX-Wallarmモジュールがあるサーバーで実行します
        yum list wallarm-node-nginx
        # postanalyticsモジュールがあるサーバーで実行します
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        # プライマリNGINX-Wallarmモジュールがあるサーバーで実行します
        yum list wallarm-node-nginx
        # postanalyticsモジュールがあるサーバーで実行します
        yum list wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        # プライマリNGINX-Wallarmモジュールがあるサーバーで実行します
        yum list wallarm-node-nginx
        # postanalyticsモジュールがあるサーバーで実行します
        yum list wallarm-node-tarantool
        ```