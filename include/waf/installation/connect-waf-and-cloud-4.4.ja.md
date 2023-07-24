Wallarm ノードは Wallarm クラウドと対話します。フィルタリングノードをクラウドに接続するには：

1. [postanalytics モジュールが別々にインストールされている][install-postanalytics-instr]場合：

    1. 別々の postanalytics モジュールのインストール中に生成されたノードトークンをコピーします。
    1. 下記のリストの5番目のステップに進みます。初期トラフィックを処理するノードと、ポスト解析を実行するノードの両方に1つのトークンを使用することが**推奨**されています。
1. WallarmアカウントにWallarm Consoleで**Administrator**ロールが有効になっていることを確認してください。

    あなたは、[USクラウド](https://us1.my.wallarm.com/settings/users)または[EUクラウド](https://my.wallarm.com/settings/users) のユーザーリストに移動して、設定を確認できます。
    
    ![!Wallarm consoleのユーザーリスト][img-wl-console-users]
1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes) のWallarm Console → **Nodes** を開いて、**Wallarm node**タイプのノードを作成します。

    ![!Wallarm node作成][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. フィルタリングノードがあるシステムで `register-node` スクリプトを実行します：

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
   * `<NODE_TOKEN>` はコピーされたトークン値です。
   * ノードインスタンスにカスタム名を設定するには、`-n <HOST_NAME>` パラメータを追加できます。最終インスタンス名は、`HOST_NAME_NodeUUID` になります。

!!! info "1つのトークンを複数のインストールに使用する"
    選択したデプロイオプションに関係なく、1つのトークンを使用して複数の Wallarm ノードをクラウドに接続できます。このオプションにより、Wallarm Console UIでノードインスタンスの論理的なグループ化が可能になります。

    ![!複数のインスタンスを持つノード][img-node-with-several-instances]

    以下は、1つのトークンを複数のインストールに使用する場合のいくつかの例です：

    * いくつかの Wallarm ノードを開発環境にデプロイする場合で、各ノードは特定の開発者が所有する独自のマシン上にある。
    * 初期トラフィック処理用のノードと postanalytics モジュールが別々のサーバーにインストールされている場合 - これらのモジュールを Wallarm クラウドに同じノードトークンを使用して接続することが**推奨**されています。