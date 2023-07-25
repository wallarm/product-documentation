1. [適切なタイプ][wallarm-token-types]のWallarmトークンを取得します：

   === "APIトークン"

       1. Wallarmコンソールを開きます → **設定** → **APIトークン**を[USクラウド](https://us1.my.wallarm.com/settings/api-tokens)または[EUクラウド](https://my.wallarm.com/settings/api-tokens)で開きます。
       1. `Deploy`というソースロールを持つAPIトークンを見つける、または作成します。
       1. このトークンをコピーします。

   === "ノードトークン"

       1. Wallarmコンソールを開きます → **ノード**を[USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)で開きます。
       1. 次のいずれかを行います: 
           * **Wallarmノード**タイプのノードを作成し、生成されたトークンをコピーします。
           * 既存のノードグループを使用する - ノードのメニューからトークンをコピーします → **トークンをコピー**。