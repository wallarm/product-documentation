					!!! info "ポストアナリティクスモジュールが別のサーバーにインストールされている場合"
    初期トラフィック処理モジュールとポストアナリティクスモジュールが別々のサーバーにインストールされている場合、これらのモジュールを同じノードトークンを使用してWallarmクラウドに接続することをお勧めします。WallarmコンソールUIでは、各モジュールが別々のノードインスタンスとして表示されます。例：

    ![複数のインスタンスを持つノード][img-node-with-several-instances]

    Wallarmノードは[別途ポストアナリティクスモジュールインストール][install-postanalytics-instr]の間に既に作成されています。同じノード資格情報を使用して初期トラフィック処理モジュールをクラウドに接続するには：

    1. 別途ポストアナリティクスモジュールのインストール中に生成されたノードトークンをコピーします。
    1. 下記のリストで4番目のステップに進みます。

WallarmノードはWallarmクラウドとやり取りします。フィルタリングノードをクラウドに接続するには：

1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)でWallarmコンソール → **ノード**を開き、**Wallarmノード**タイプのノードを作成します。

    ![Wallarmノードの作成][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します。
    
    === "USクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>`はコピーされたトークンの値です。

    !!! info "ポストアナリティクスモジュールが別のサーバーにインストールされている場合"
        ポストアナリティクスモジュールが別のサーバーにインストールされている場合、[別途ポストアナリティクスモジュールインストール][install-postanalytics-instr]の間に生成されたノードトークンを使用することを推奨します。