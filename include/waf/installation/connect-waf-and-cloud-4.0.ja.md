					!!! info "ポストアナリティクスモジュールが別のサーバーにインストールされている場合"
    初期トラフィック処理およびポストアナリティクスモジュールが別々のサーバーにインストールされている場合、これらのモジュールを同じノードトークンを使用してWallarm Cloudに接続することが推奨されます。Wallarm Console UIでは、各モジュールが別のノードインスタンスとして表示されます。例えば：

    ![!Node with several instances][img-node-with-several-instances]

    Wallarmノードはすでに[separate postanalytics module installation][install-postanalytics-instr]の間に作成されています。初期トラフィック処理モジュールを同じノードの認証情報を使用してクラウドに接続するには：

    1. 別々のポストアナリティクスモジュールのインストール中に生成されたノードトークンをコピーします。
    1. 下記リストの4番目の手順に進みます。

WallarmノードはWallarm Cloudと対話します。フィルタリングノードをCloudに接続するには：

1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)でWallarm Console → **Nodes**を開き、**Wallarm node**タイプのノードを作成します。

    ![!Wallarm node creation][img-create-wallarm-node]
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

    `<NODE_TOKEN>` はコピーしたトークンの値です。

    !!! info "ポストアナリティクスモジュールが別のサーバーにインストールされている場合"
        ポストアナリティクスモジュールが別のサーバーにインストールされている場合、[separate postanalytics module installation][install-postanalytics-instr]の間に生成されたノードトークンを使用することが推奨されます。