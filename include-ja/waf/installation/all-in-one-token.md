ノードをインストールするには、[適切なタイプ][wallarm-token-types]のWallarmトークンが必要です。トークンを準備するには:

=== "APIトークン"

    1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)でWallarm Console → **Settings** → **API tokens**を開きます。
    1. 使用タイプが`Node deployment/Deployment`のAPIトークンを見つけるか作成します。
    1. このトークンをコピーします。

=== "ノードトークン"

    1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)でWallarm Console → **Nodes**を開きます。
    1. 次のいずれかを実行します: 
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用します - ノードのメニュー → **Copy token**からトークンをコピーします。