フィルタリングノードはWallarm Cloudと連携します。ノードをWallarm Cloudに接続するには、次の手順を実行します：

1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarm Console → Nodesを開き、**Wallarm node**タイプのノードを作成します。

    ![Wallarm nodeの作成][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. フィルタリングノードをインストールするマシン上で`register-node`スクリプトを実行します：
    
    === "USクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>`はコピーしたトークンの値です。

    !!! info "複数のインストールで1つのトークンを使用します"
        選択した[プラットフォーム][deployment-platform-docs]に関係なく、1つのトークンを複数のインストールで使用できます。これにより、Wallarm Console UIでノードインスタンスを論理的にグループ化できます。例：開発環境に複数のWallarmノードをデプロイします。各ノードは、それぞれ特定の開発者が所有するマシン上にあります。