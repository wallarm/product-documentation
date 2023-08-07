Wallarmノードは、Wallarm Cloudと対話します。フィルタリングノードをCloudに接続するには：

1. [postanalyticsモジュールが別途インストールされている場合][install-postanalytics-instr]:

    1. 別途インストールされたpostanalyticsモジュールの実行中に生成されたノードトークンをコピーします。
    1. 以下のリストの5番目のステップに進みます。初期のトラフィック処理を行うノードと、ポスト分析を行うノードで同じトークンを使用することを**推奨**します。
1. Wallarm Consoleを開き、[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で**Nodes** を選択し、**Wallarmノード**タイプのノードを作成します。

    ![Wallarmノードの作成][img-create-wallarm-node]
1. 生成したトークンをコピーします。
1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します：
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    * `<NODE_TOKEN>` はコピーしたトークンの値です。
    *  `-n <HOST_NAME>` パラメータを追加して、ノードインスタンスにカスタム名を設定することができます。最終的なインスタンス名は次のようになります： `HOST_NAME_NodeUUID`。

!!! info "複数のインストールで一つのトークンを使用する"
    選択したデプロイメントオプションに関係なく、一つのトークンを使用して複数のWallarmノードをCloudに接続することができます。このオプションでは、Wallarm Console UIでノードインスタンスの論理的なグループ化が可能になります：

    ![複数のインスタンスを持つノード][img-node-with-several-instances]
    
    以下は、複数のインストールで一つのトークンを選択して使用することが可能な例です：

    * 開発環境に複数のWallarmノードをデプロイし、それぞれのノードは特定の開発者が所有する独自のマシン上にあります
    * 初期のトラフィック処理用のノードと、ポストアナリティクスモジュールが別のサーバーにインストールされている場合 - これらのモジュールを同じノードトークンを使用してWallarm Cloudに接続することを**推奨**します