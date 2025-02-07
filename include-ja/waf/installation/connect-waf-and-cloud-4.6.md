The WallarmフィルタリングノードはWallarm Cloudと連携します。Cloudにノードを接続する必要があります。

Cloudにノードを接続するとき、Wallarm Console UIに表示されるノード名を設定でき、UIでノードを論理的に整理するために使用される適切な**node group**にノードを配置できます。

![Grouped nodes][img-grouped-nodes]

Cloudにノードを接続するには、[適切なタイプ][wallarm-token-types]のWallarmトークンを使用します：

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens** を [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) または [EU Cloud](https://my.wallarm.com/settings/api-tokens) で開きます。
    1. `Deploy`ソースロールを持つAPIトークンを探すか作成します。
    1. このトークンをコピーします。
    1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します：

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>` は`Deploy`ロールを持つAPIトークンのコピーした値です。
        * `--labels 'group=<GROUP>'`パラメーターは、ノードを既存または存在しない場合は作成される`<GROUP>`ノードグループに配置します。フィルタリングおよびpostanalyticsモジュールを[個別に][install-postanalytics-instr]インストールする場合は、同じグループに配置することを推奨します。

=== "Node token"

    1. Wallarm Console → **Nodes** を [US Cloud](https://us1.my.wallarm.com/nodes) または [EU Cloud](https://my.wallarm.com/nodes) で開きます。
    1. 以下のいずれかを実行します：
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用するには、ノードのメニューから**Copy token**を選択してトークンをコピーします。
    1. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します：

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>` はノードトークンのコピーした値です。フィルタリングおよびpostanalyticsモジュールを[個別に][install-postanalytics-instr]インストールする場合は、同じノードトークンを使用して同じグループに配置することを推奨します。
    * `-n <HOST_NAME>`パラメーターを追加してノードインスタンスのカスタム名を設定できます。最終的なインスタンス名は`HOST_NAME_NodeUUID`となります。