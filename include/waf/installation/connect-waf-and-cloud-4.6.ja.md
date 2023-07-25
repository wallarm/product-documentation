WallarmのフィルタリングノードはWallarm Cloudと対話します。ノードをCloudに接続する必要があります。

ノードをCloudに接続する際、それがWallarm Console UIに表示されるノード名を設定したり、**ノードグループ** にノードを配置することができます（UI内でノードを論理的に整理するために使用されます）。

![!グループ化されたノード][img-grouped-nodes]

ノードをCloudに接続するには、 [適切なタイプの][wallarm-token-types] Wallarmトークンを使用します。

=== "APIトークン"

1. Wallarm Console を開き、**設定** → ** APIトークン** を[米国Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)でクリックします。
2. `Deploy`ソースロールを持つAPIトークンを見つけるか、作成します。
3. このトークンをコピーします。
4. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します:

    === "米国Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
        ```

    * `<TOKEN>`は `Deploy`ロールのAPIトークンのコピーされた値です。
    * `--labels 'group=<GROUP>'`パラメータは、ノードを`<GROUP>`ノードグループに配置します（既存の場合、または存在しない場合、作成されます）。フィルタリングとポストアナリティクスモジュールを[個別に][install-postanalytics-instr]インストールしている場合、それらを同一のグループに配置することを推奨します。

=== "ノードトークン"

1. Wallarm Consoleを開き、**ノード**を[米国Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)でクリックします。
2. 次のうちの一つを行います: 
    * **Wallarmノード**タイプのノードを作成し、生成されたトークンをコピーします。
    * 既存ノードグループのトークンを、ノードのメニュー → **トークンをコピー** を使用してコピーします。
3. フィルタリングノードをインストールするマシンで`register-node`スクリプトを実行します。

    === "米国Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN>
        ```

    * `<TOKEN>`は、ノードトークンのコピーされた値です。フィルタリングとポストアナリティクスモジュールを[個別に][install-postanalytics-instr]インストールする場合、同じノードトークンを使用して同じグループに配置することが推奨されます。

* `-n <HOST_NAME>`パラメータを追加して、ノードインスタンスにカスタム名を設定することができます。最終的なインスタンス名は、`HOST_NAME_NodeUUID`となります。