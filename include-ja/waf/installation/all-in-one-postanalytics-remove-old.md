1. Wallarm Consoleの**Nodes**でpostanalyticsモジュールノードを選択し、**Delete**をクリックして古いpostanalyticsモジュールを削除します。  
1. アクションを確認します。  

    Cloudからpostanalyticsモジュールノードが削除されると、対象アプリケーションへのリクエストフィルタリングへの参加が停止します。削除は元に戻せません。postanalyticsモジュールノードはノード一覧から完全に削除されます。  

1. 古いpostanalyticsモジュールがインストールされたマシンを削除するか、もしくはWallarm postanalyticsモジュールのコンポーネントのみをクリーンアップします:  

    === "Debian"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```