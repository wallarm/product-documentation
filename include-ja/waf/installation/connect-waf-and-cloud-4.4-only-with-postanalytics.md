フィルタリングノードはWallarm Cloudと連携します。ノードをCloudに接続するには:

1. Wallarm Console → **Nodes** を[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開いて、**Wallarm node**タイプのノードを作成します。

    ![Wallarm node creation][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>`はコピーしたトークン値です。

    !!! info "1つのトークンを複数のインストールで使用"
        選択した[platform][deployment-platform-docs]に関係なく、1つのトークンを複数のインストールで使用できます。これにより、Wallarm Console UIでノードインスタンスを論理的にグループ化できます。例: 複数のWallarmノードを開発環境にデプロイする場合、各ノードは特定の開発者が所有する個別のマシン上に配置されます。