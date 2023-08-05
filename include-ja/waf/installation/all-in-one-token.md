ノードをインストールするには、[適切なタイプ][wallarm-token-types]のWallarmトークンが必要です。トークンを準備するには：

=== "APIトークン"

    1. Wallarmコンソールを開きます → **設定** → **APIトークン** [USクラウド](https://us1.my.wallarm.com/settings/api-tokens) または [EUクラウド](https://my.wallarm.com/settings/api-tokens) .
    1. `Deploy`ソースロールに対応するAPIトークンを探すか、新規作成します。
    1. このトークンをコピーしてください。

=== "ノードトークン"

    1. Wallarmコンソールを開きます → **ノード** [USクラウド](https://us1.my.wallarm.com/nodes) または [EUクラウド](https://my.wallarm.com/nodes) .
    1. 次のいずれかを行ってください： 
        * **Wallarmノード**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用 - ノードのメニュー → **トークンをコピー** を使用して、トークンをコピーします。