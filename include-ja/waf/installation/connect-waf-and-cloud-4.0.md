!!! info "ポストアナリティクスモジュールが別サーバーにインストールされている場合"
    初期トラフィック処理モジュールとポストアナリティクスモジュールを別々のサーバーにインストールしている場合は、同じノードトークンを使用してこれらのモジュールをWallarm Cloudに接続することを推奨します。Wallarm Console UIには、各モジュールが個別のノードインスタンスとして表示されます。例：

    ![複数のインスタンスを持つノード][img-node-with-several-instances]

    Wallarm nodeは、[ポストアナリティクスモジュールの個別インストール][install-postanalytics-instr]の際にすでに作成されています。同じノード認証情報を使用して初期トラフィック処理モジュールをWallarm Cloudに接続するには：

    1. ポストアナリティクスモジュールの個別インストール時に生成されたノードトークンをコピーします。
    1. 以下の一覧の4番目の手順に進みます。

Wallarm nodeはWallarm Cloudと連携します。フィルタリングノードをWallarm Cloudに接続するには：

1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のWallarm Console → **Nodes**を開き、**Wallarm node**タイプのノードを作成します。

    ![Wallarm nodeの作成][img-create-wallarm-node]
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
    
    `<NODE_TOKEN>`は、コピーしたトークン値です。

    !!! info "ポストアナリティクスモジュールが別サーバーにインストールされている場合"
        ポストアナリティクスモジュールが別サーバーにインストールされている場合は、[ポストアナリティクスモジュールの個別インストール][install-postanalytics-instr]で生成されたノードトークンを使用することを推奨します。