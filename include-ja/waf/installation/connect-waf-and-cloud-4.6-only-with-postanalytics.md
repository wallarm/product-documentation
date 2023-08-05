WallarmフィルタリングノードはWallarmクラウドと連携します。ノードをクラウドに接続する必要があります。

ノードをクラウドに接続する際に、ノードの名前を設定し、それがWallarm Console UIに表示されるようにすることができ、ノードを適切な**ノードグループ** (UIでノードを論理的に整理するために使用されます) に配置することができます。

![!グループ化されたノード][img-grouped-nodes]

ノードをクラウドに接続するためには、[適切なタイプ][wallarm-token-types]のWallarmトークンを使用します：

=== "APIトークン"

    1. Wallarmコンソールを開く → **設定** → **APIトークン** を[USクラウド](https://us1.my.wallarm.com/settings/api-tokens)または[EUクラウド](https://my.wallarm.com/settings/api-tokens)で開きます。
    1. `Deploy` ソースロールを持つAPIトークンを探すか、作成します。
    1. このトークンをコピーします。
    1. フィルタリングノードをインストールするマシン上で `register-node` スクリプトを実行します：

        === "USクラウド"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "EUクラウド"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>` は、 `Deploy` ロールのAPIトークンのコピーバリューです。
        * `--labels 'group=<GROUP>'` パラメーターは、ノードを `<GROUP>` ノードグループに配置します (既存の場合、または存在しない場合は作成されます)。

=== "ノードトークン"

    1. Wallarmコンソールを開く → **ノード** を[USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)で開きます。
    1. 次のいずれかを行います： 
        * **Wallarmノード**タイプのノードを作成して生成されたトークンをコピーします。
        * 既存のノードグループを使用します - ノードのメニューから**トークンをコピー**します。
    1. フィルタリングノードをインストールするマシン上で `register-node` スクリプトを実行します：

        === "USクラウド"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EUクラウド"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>` はノードトークンのコピーバリューです。

* ノードインスタンスのカスタム名を設定するために `-n <HOST_NAME>` パラメーターを追加することができます。 最終的なインスタンス名は `HOST_NAME_NodeUUID` になります。