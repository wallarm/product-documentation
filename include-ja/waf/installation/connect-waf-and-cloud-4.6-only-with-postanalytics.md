WallarmのフィルタリングノードはWallarm Cloudと連携します。ノードをCloudに接続する必要があります。

ノードをCloudに接続する際には、ノード名を設定して、それがWallarm Console UIで表示されるようにしたり、適切な**ノードグループ**にノードを入れることができます（UIでノードを論理的に整理するために使用されます）。

![!グループ化されたノード][img-grouped-nodes]

ノードをCloudに接続するには、適切なタイプの[Wallarm トークン][wallarm-token-types]を使用します：

=== "API トークン"

    1. Wallarm Consoleを開き、**設定** → **API トークン**を選択します [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)もしくは[EU Cloud](https://my.wallarm.com/settings/api-tokens)。
    1. `Deploy`ソースロールを持つAPIトークンを見つけるか作成します。
    1. このトークンをコピーします。
    1. フィルタリングノードをインストールするマシン上で`register-node`スクリプトを実行します：

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```

        * `<TOKEN>`は`Deploy`ロールを持つAPI トークンの複製値です。
        * `--labels 'group=<GROUP>'`パラメーターはノードを `<GROUP>` ノードグループに追加します（既存の場合、または存在しない場合、作成されます）。

=== "ノードトークン"

    1. Wallarm Consoleを開き、 **ノード** を選択します [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)。
    1. 次のいずれかを行います： 
        * **Wallarmノード**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用します - ノードのメニュー  → **トークンをコピー**を使用します。
    1. フィルタリングノードをインストールするマシン上で`register-node`スクリプトを実行します：

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>`はノードトークンの複製値です。

* `-n <HOST_NAME>` パラメーターを追加すると、ノードインスタンスに独自の名前を設定できます。最終的なインスタンス名は次のようになります： `HOST_NAME_NodeUUID`。