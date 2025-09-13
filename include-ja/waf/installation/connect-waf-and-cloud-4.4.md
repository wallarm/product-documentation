Wallarm nodeはWallarm Cloudと連携します。フィルタリングノードをWallarm Cloudに接続するには:

1. [postanalyticsモジュールを個別にインストールしている場合][install-postanalytics-instr]:

    1. postanalyticsモジュールの個別インストール時に生成されたノードトークンをコピーします。
    1. 以下のリストの5番目の手順に進みます。初期トラフィックを処理するノードとpostanalyticsを実行するノードで同じトークンを使用することを**推奨**します。
1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarm Console → **Nodes**を開き、**Wallarm node**タイプのノードを作成します。

    ![Wallarm nodeの作成][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します:
    
    === "USクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    * `<NODE_TOKEN>`はコピーしたトークンの値です。
    * ノードインスタンスのカスタム名を設定するために`-n <HOST_NAME>`パラメータを追加できます。最終的なインスタンス名は`HOST_NAME_NodeUUID`になります。

!!! info "複数のインストールで1つのトークンを使用する"
    選択したデプロイオプションに関係なく、1つのトークンを使用して複数のWallarm nodeをWallarm Cloudに接続できます。この方法により、Wallarm ConsoleのUI内でノードインスタンスを論理的にグループ化できます:

    ![複数のインスタンスを持つノード][img-node-with-several-instances]
    
    複数のインストールで1つのトークンを使用することを選択できる例を以下に示します:

    * 開発環境に複数のWallarm nodeをデプロイしており、各ノードが特定の開発者の所有する個別のマシン上にある場合です。
    * 初期トラフィック処理用ノードとpostanalyticsモジュールが別々のサーバーにインストールされている場合です。これらのモジュールは同じノードトークンを使用してWallarm Cloudに接続することを**推奨**します。