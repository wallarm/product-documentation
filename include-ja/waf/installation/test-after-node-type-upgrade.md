1. テスト用の[パストラバーサル][ptrav-attack-docs]攻撃をアプリケーションのアドレスに送信します：

    ```
    curl http://localhost/etc/passwd
    ```

    トラフィックが`example.com`にプロキシされるように構成されている場合は、リクエストにヘッダー`-H "Host: example.com"`を含めます。
1. 新しいタイプのノードが、**通常の**ノードと同じ方法でリクエストを処理することを確認します。例えば次のとおりです：

    * 適切な[フィルタリングモード][waf-mode-instr]が構成されている場合は、リクエストをブロックします。
    * 設定されている場合は、[カスタムブロッキングページ][blocking-page-instr]を返します。
2. [EU Cloud](https://my.wallarm.com/attacks)または[US Cloud](https://us1.my.wallarm.com/attacks)でWallarm Console → **Attacks**を開き、次のことを確認します：

    * 攻撃が一覧に表示されていること。
    * Hit detailsにWallarmノードUUIDが表示されていること。

    ![インターフェースのAttacks][attacks-in-ui-image]