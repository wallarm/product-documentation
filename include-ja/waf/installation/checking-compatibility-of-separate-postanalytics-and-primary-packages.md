!!! info "「wallarm-node-tarantool」パッケージのバージョン"
    「wallarm-node-tarantool」パッケージは、別サーバーにインストールされた主要なNGINX-Wallarmモジュールパッケージと同じかそれ以上のバージョンでなければなりません。

    バージョンを確認するには:

    === "Debian"
        ```bash
        # 主要なNGINX-Wallarmモジュールがあるサーバーで実行
        apt list wallarm-node-nginx
        # postanalyticsモジュールがあるサーバーで実行
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # 主要なNGINX-Wallarmモジュールがあるサーバーで実行
        apt list wallarm-node-nginx
        # postanalyticsモジュールがあるサーバーで実行
        apt list wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        # 主要なNGINX-Wallarmモジュールがあるサーバーで実行
        yum list wallarm-node-nginx
        # postanalyticsモジュールがあるサーバーで実行
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        # 主要なNGINX-Wallarmモジュールがあるサーバーで実行
        yum list wallarm-node-nginx
        # postanalyticsモジュールがあるサーバーで実行
        yum list wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        # 主要なNGINX-Wallarmモジュールがあるサーバーで実行
        yum list wallarm-node-nginx
        # postanalyticsモジュールがあるサーバーで実行
        yum list wallarm-node-tarantool
        ```