The WallarmノードはWallarm Cloudと連携します。フィルタリングノードをCloudに接続するには、次の手順に従ってください：

1. [別途インストールされたpostanalyticsモジュールの場合][install-postanalytics-instr]:
    1. 別途postanalyticsモジュールのインストール時に生成されたノードトークンをコピーします。
    1. 以下のリストの5番目の手順に進みます。初期トラフィック処理を行うノードとポスト解析を行うノードに同じトークンを使用することを**推奨**します。
1. Wallarm Console の[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で**Nodes**を開き、**Wallarmノード**タイプのノードを作成します。

    ![Wallarmノードの作成][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します：
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    * `<NODE_TOKEN>` はコピーしたトークン値です。
    * `-n <HOST_NAME>` パラメータを追加することによって、ノードインスタンスのカスタム名を設定できます。最終的なインスタンス名は `HOST_NAME_NodeUUID` になります。

!!! info "複数のインストールに1つのトークンを使用する場合"
    選択したデプロイメントオプションにかかわらず、1つのトークンを使用して複数のWallarmノードをCloudに接続できます。このオプションにより、Wallarm Console UI上でノードインスタンスを論理的にグループ化できます：

    ![複数のインスタンスを持つノード][img-node-with-several-instances]
    
    以下は、複数のインストールに対して1つのトークンを使用する場合の例です：
    
    * 開発環境に複数のWallarmノードをデプロイし、各ノードが特定の開発者所有の独自のマシン上にある場合
    * 初期トラフィック処理ノードとpostanalyticsモジュールが別々のサーバーにインストールされている場合、これらのモジュールを同じノードトークンを使用してWallarm Cloudに接続することを**推奨**します.