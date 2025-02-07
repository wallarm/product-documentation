1. [適切なタイプ][wallarm-token-types]のWallarmトークンを取得します

    === "API token"

        1. Wallarm Consoleで**Settings**→**API tokens**を開いて、[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で操作してください。
        1. `Deploy`ソースロールのあるAPIトークンを探すか作成してください。
        1. このトークンをコピーしてください。

    === "Node token"

        1. Wallarm Consoleで**Nodes**を開いて、[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で操作してください。
        1. 以下のいずれかを実施してください:
            * **Wallarm node**タイプのノードを作成して、生成されたトークンをコピーしてください。
            * 既存のノードグループを使用する場合は、ノードのメニューから**Copy token**を選択してトークンをコピーしてください。