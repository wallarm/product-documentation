WallarmのフィルターノードはWallarmクラウドと対話します。ノードをクラウドに接続する必要があります。

ノードをクラウドに接続する際、表示されるノード名を設定し、適切な**ノードグループ**にノードを配置することができます（UIでノードを論理的に整理するために使用します）。

![Grouped nodes][img-grouped-nodes]

ノードをクラウドに接続するには、[適切なタイプ][wallarm-token-types]のWallarmトークンを使用します。

=== "APIトークン"

    1. Wallarmコンソールを開き、→**設定**→**APIトークン**を [USクラウド](https://us1.my.wallarm.com/settings/api-tokens) または [EUクラウド](https://my.wallarm.com/settings/api-tokens)で開きます。
    1. `Deploy`のソースロールを持つAPIトークンを探すか、作成します。
    1. このトークンをコピーします。
    1. フィルタリングノードをインストールするマシンで `register-node` スクリプトを実行します。

        === "USクラウド"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "EUクラウド"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>`は、 `Deploy`ロールのAPIトークンのコピーされた値です。
        * `--labels 'group=<GROUP>'`パラメーターは、ノードを `<GROUP>`ノードグループ（既存のもの、または存在しない場合は作成）に配置します。フィルタリングモジュールとポストアナリティクスモジュールを[別々に][install-postanalytics-instr]インストールする場合、同じグループに配置することを推奨します。

=== "ノードトークン"

    1. Wallarmコンソールを開き、→**ノード**を [USクラウド](https://us1.my.wallarm.com/nodes) または [EUクラウド](https://my.wallarm.com/nodes)で開きます。
    1. 次のいずれかを実施します。
        * **Wallarmノード**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用 - ノードのメニュー→**トークンをコピー**を使用してトークンをコピーします。
    1. フィルタリングノードをインストールするマシンで `register-node` スクリプトを実行します。

        === "USクラウド"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EUクラウド"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>`は、ノードトークンのコピーされた値です。フィルタリングモジュールとポストアナリティクスモジュールを[別々に][install-postanalytics-instr]インストールする場合、同じノードトークンを使用して同じグループに配置することを推奨します。

* `-n <HOST_NAME>`パラメータを追加すると、ノードインスタンスにカスタム名を設定できます。最終的なインスタンス名は次のようになります: `HOST_NAME_NodeUUID`.