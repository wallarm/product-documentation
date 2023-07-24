フィルタリングノードはWallarmクラウドと連携します。ノードをクラウドに接続するには：

1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)からWallarm Console→ **ノード**を開き、**Wallarmノード**タイプのノードを作成します。

    ![!Wallarmノード作成][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. フィルタリングノードをインストールするマシン上で `register-node` スクリプトを実行します：
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>` はコピーしたトークンの値です。

    !!! info "複数のインストールで一つのトークンを使う"
        選択した[プラットフォーム][deployment-platform-docs]に関係なく、複数のインストールで一つのトークンを使用することができます。これにより、Wallarm Console UI内でノードインスタンスの論理的なグループ化が可能になります。例：ある開発者が所有する各自のマシンにいくつかのWallarmノードをデプロイします。