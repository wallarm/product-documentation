1. アプリケーションのアドレスにテスト用の[パストラバーサル][ptrav-attack-docs]攻撃を送信します:

    ```
    curl http://localhost/etc/passwd
    ```

    もしトラフィックが`example.com`にプロキシされるように設定されている場合は、リクエストに`-H "Host: example.com"`ヘッダーを含めます。
1. 新しいタイプのノードが、**通常**のノードと同様にリクエストを処理することを確認します。例としては:

    * 該当の[フィルトレーションモード][waf-mode-instr]が設定されている場合はリクエストをブロックします。
    * 設定されている場合は[カスタムブロッキングページ][blocking-page-instr]を返します。
2. Wallarm Console → **Attacks**を開き、[EU Cloud](https://my.wallarm.com/search)または[US Cloud](https://us1.my.wallarm.com/search)で次の点を確認します:

    * 攻撃がリストに表示されます。
    * ヒットの詳細にWallarmノードUUIDが表示されます。

    ![インターフェース内の攻撃][attacks-in-ui-image]