WallarmのフィルタリングノードはWallarm Cloudと連携します。ノードをWallarm Cloudに接続する必要があります。

ノードをWallarm Cloudに接続する際に、Wallarm Console UIに表示されるノード名を設定し、適切な**node group**にノードを配置できます（UI上でノードを論理的に整理するために使用します）。

![グループ化されたノード][img-grouped-nodes]

ノードをWallarm Cloudに接続するには、[適切な種類][wallarm-token-types]のWallarmトークンを使用します:

=== "APIトークン"

    1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)のWallarm Console → **Settings** → **API tokens**を開きます。
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
        
        * `<TOKEN>`は、`Deploy`ロールを持つAPIトークンのコピーした値です。
        * `--labels 'group=<GROUP>'`パラメータは、ノードを`<GROUP>`のnode groupに配置します（既存のものがあればそれに、存在しない場合は作成されます）。

=== "ノードトークン"

    1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のWallarm Console → **Nodes**を開きます。
    1. 次のいずれかを実行します: 
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存の**node group**を使用する場合は、ノードのメニュー → **Copy token**からトークンをコピーします。
    1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>`は、コピーしたノードトークンの値です。

* ノードインスタンスに任意の名前を設定するために、`-n <HOST_NAME>`パラメータを追加できます。最終的なインスタンス名は: `HOST_NAME_NodeUUID`になります。