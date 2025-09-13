WallarmフィルタリングノードはWallarm Cloudと連携します。ノードをWallarm Cloudに接続する必要があります。

ノードをWallarm Cloudに接続する際、Wallarm Console UIに表示されるノード名を設定でき、適切な**node group**（UIでノードを論理的に整理するために使用）に配置できます。

![グループ化されたノード][img-grouped-nodes]

ノードをWallarm Cloudに接続するには、[適切な種類][wallarm-token-types]のWallarmトークンを使用します:

=== "APIトークン"

    1. Wallarm Consoleで[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)の**Settings** → **API tokens**を開きます。
    1. 使用タイプが`Node deployment/Deployment`のAPIトークンを見つけるか作成します。
    1. このトークンをコピーします。
    1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>`は、`Deploy`ロールのAPIトークンをコピーした値です。
        * `--labels 'group=<GROUP>'`パラメータはノードを`<GROUP>`のnode groupに入れます（既存のグループがある場合はそこに、存在しない場合は作成されます）。フィルタリングモジュールとpostanalyticsモジュールを[別々に][install-postanalytics-instr]インストールする場合は、同じグループに入れることを推奨します。

=== "ノードトークン"

    1. Wallarm Consoleで[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)の**Nodes**を開きます。
    1. 次のいずれかを実行します: 
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のnode groupを使用する場合は、ノードのメニュー → **Copy token**からトークンをコピーします。
    1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>`は、コピーしたノードトークンの値です。フィルタリングモジュールとpostanalyticsモジュールを[別々に][install-postanalytics-instr]インストールする場合は、同じノードトークンを使用して同じグループに入れることを推奨します。

* ノードインスタンスに任意の名前を設定するために`-n <HOST_NAME>`パラメータを追加できます。最終的なインスタンス名は`HOST_NAME_NodeUUID`になります。