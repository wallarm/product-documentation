1. 保護されたリソースアドレスにテスト[Path Traversal][ptrav-attack-docs]攻撃を送信します:

    ```
    curl http://localhost/etc/passwd
    ```

    もしトラフィックが`example.com`にプロキシされるように設定されている場合，リクエストに`-H "Host: example.com"`ヘッダーを含めます。
2. Wallarm Console → **Attacks**セクションを[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)内で開き，攻撃がリストに表示されることを確認します。
    ![インターフェース内の攻撃][attacks-in-ui-image]