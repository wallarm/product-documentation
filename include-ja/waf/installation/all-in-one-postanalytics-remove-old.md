1. Wallarm Console → **Nodes**で該当のpostanalyticsモジュールノードを選択し、**Delete**をクリックして旧postanalyticsモジュールを削除してください。
1. 操作を確認してください。
    
    Cloudからpostanalyticsモジュールノードを削除すると、ご利用のアプリケーションに対するリクエストのフィルタリング処理には関与しなくなります。削除は元に戻せません。postanalyticsモジュールノードはノードの一覧から永久に削除されます。

1. 旧postanalyticsモジュールを搭載したマシンを削除するか、Wallarmのpostanalyticsモジュールのコンポーネントのみを削除してください:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以下"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```