The WallarmフィルタリングノードはWallarm Cloudと連携します。ノードをCloudに接続する必要があります。

ノードをCloudに接続する際、Wallarm Console UIに表示されるノード名を設定でき、適切な**ノードグループ**にノードを登録できます。

![グループ化されたノード][img-grouped-nodes]

ノードをCloudに接続するには、[適切な種類][wallarm-token-types]のWallarmトークンを使用してください。

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens**を[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
    1. `Deploy`ロールのAPI tokenを探すか作成します。
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
        
        * `<TOKEN>`は、`Deploy`ロールのAPI tokenのコピー済みの値です。
        * `--labels 'group=<GROUP>'`パラメータは、ノードを`<GROUP>`ノードグループに登録します（既存の場合はそのグループに、存在しない場合は作成されます）。

=== "Node token"

    1. Wallarm Console → **Nodes**を[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開きます。
    1. 次のいずれかを実行します:
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループの場合は、ノードのメニューの**Copy token**を使用してトークンをコピーします。
    1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>`は、ノードトークンのコピー済みの値です。

* ノードインスタンスのカスタム名を設定する場合は、`-n <HOST_NAME>`パラメータを追加することができます。最終的なインスタンス名は`HOST_NAME_NodeUUID`となります。