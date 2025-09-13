1. 保護対象のリソースアドレスに、テスト用の[パストトラバーサル][ptrav-attack-docs]攻撃を伴うリクエストを送信します:

    ```
    curl http://localhost/etc/passwd
    ```

    トラフィックが`example.com`にプロキシされるように設定されている場合、リクエストに`-H "Host: example.com"`ヘッダーを含めます。
1. Wallarm Console → **Attacks**セクションを[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃が一覧に表示されていることを確認します。

    ![インターフェースのAttacks][attacks-in-ui-image]

1. 必要に応じて、ノードの動作の他の側面を[テスト][link-wallarm-health-check]します。