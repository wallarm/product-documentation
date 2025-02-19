ノードをインストールするには、[appropriate type][wallarm-token-types]のWallarmトークンが必要です。トークンの準備は以下の手順に従ってください。

=== "APIトークン"

    1. Wallarm Console → **Settings** → **API tokens**を[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
    1. `Deploy` source roleのAPI tokenを見つけるか、新規作成します。
    1. このトークンをコピーします。

=== "ノードトークン"

    1. Wallarm Console → **Nodes**を[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開きます。
    1. 次のいずれかの操作を行います: 
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用する場合は、ノードのメニュー→**Copy token**を使用してトークンをコピーします。