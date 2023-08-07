フィルタリングノードはWallarm Cloudと対話します。ノードをCloudに接続するには：

1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のWallarmコンソールを開き、**ノード**をクリックして、**Wallarmノード**タイプのノードを作成します。

    ![Wallarmノードの作成][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. フィルタリングノードをインストールしたマシンで`register-node`スクリプトを実行します：
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <ノードトークン> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <ノードトークン>
        ```
    
    `<ノードトークン>`は、コピーしたトークンの値です。

    !!! info "複数のインストールに対して一つのトークンを使用する"
        選択した[プラットフォーム][deployment-platform-docs]に関係なく、複数のインストールで一つのトークンを使用することができます。これにより、Wallarm Console UI内でノードインスタンスの論理的なグルーピングが可能になります。例えば、いくつかのWallarmノードを開発環境にデプロイし、各ノードは特定の開発者が所有する独自のマシン上にあります。