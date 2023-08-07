1. Wallarm Consoleの**Nodes**で、古いpostanalyticsモジュールを選択して**Delete**をクリックすることで、古いpostanalyticsモジュールを削除します。
1. この操作を確認してください。

    postanalyticsモジュールノードがクラウドから削除されると、あなたのアプリケーションへのリクエストのフィルタリングに参加するのを停止します。削除は元に戻すことができません。postanalyticsモジュールノードは、ノードのリストから永久に削除されます。

1. 古いpostanalyticsモジュールがあるマシンを削除するか、Wallarm postanalyticsモジュールのコンポーネントをクリーンにします：

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
    === "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```