ノードをインストールするには、[適切なタイプ][wallarm-token-types]のWallarmトークンが必要です。トークンを準備するためには：

=== "API トークン"

    1. Wallarmコンソールを開き、**設定** → **APIトークン**を選択します。[USクラウド](https://us1.my.wallarm.com/settings/api-tokens)、または [EUクラウド](https://my.wallarm.com/settings/api-tokens)。
    1. `Deploy`ソースロールを持つAPIトークンを見つけるか、作成します。
    1. このトークンをコピーします。

=== "ノードトークン"

    1. Wallarmコンソールを開き、**ノード**を選択します。[USクラウド](https://us1.my.wallarm.com/nodes)、または [EUクラウド](https://my.wallarm.com/nodes)。
    1. 次のいずれかを実行します：
        * **Wallarmノード** タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用 - ノードのメニュー → **トークンをコピー**を使用してトークンをコピーします。