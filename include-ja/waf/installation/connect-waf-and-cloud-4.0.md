!!! info "もしpostanalyticsモジュールが別サーバーにインストールされている場合"
    最初のトラフィック処理モジュールとpostanalyticsモジュールが別々のサーバーにインストールされている場合、これらのモジュールをWallarm Cloudに同じnode tokenを使用して接続することを推奨します。Wallarm Console UI上では各モジュールが別々のノードインスタンスとして表示されます。例:

    ![複数のインスタンスを持つノード][img-node-with-several-instances]

    Wallarm nodeは既に[別のpostanalyticsモジュールのインストール][install-postanalytics-instr]の際に作成済みです。同じnode資格情報を使用して初期トラフィック処理モジュールをCloudに接続するには:

    1. 別のpostanalyticsモジュールのインストール時に生成されたnode tokenをコピーします。
    1. 以下のリストの4番目のステップに進みます。

Wallarm nodeはWallarm Cloudと連携します。フィルタリングノードをCloudに接続するには:

1. Wallarm Console → **Nodes** を[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開き、**Wallarm node**タイプのノードを作成します。

    ![Wallarm nodeの作成][img-create-wallarm-node]
1. 生成されたtokenをコピーします。
1. フィルタリングノードをインストールしたマシン上で`register-node`スクリプトを実行します:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>`はコピーしたtoken値です。

!!! info "もしpostanalyticsモジュールが別サーバーにインストールされている場合"
    もしpostanalyticsモジュールが別サーバーにインストールされている場合は、[別のpostanalyticsモジュールのインストール][install-postanalytics-instr]の際に生成されたnode tokenを使用することを推奨します。