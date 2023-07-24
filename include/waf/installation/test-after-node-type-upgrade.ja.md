次のWallarmのドキュメントの英語から日本語への翻訳：

1. テスト [パス トラバーサル][ptrav-attack-docs] 攻撃をアプリケーションアドレスにリクエストとして送信します：

    ```
    curl http://localhost/etc/passwd
    ```
1. 新しいタイプのノードが、**通常**のノードと同じ方法でリクエストを処理していることを確認してください。例えば：

    * 適切な[フィルタリングモード][waf-mode-instr]が設定されている場合、リクエストをブロックします。
    * カスタムブロックページ[blocking-page-instr]が設定されている場合、それを返します。
2. [EUクラウド](https://my.wallarm.com/search) または [USクラウド](https://us1.my.wallarm.com/search) で Wallarm コンソール → **イベント** を開き、次のことを確認します。

    * 攻撃がリストに表示されます。
    * ヒットの詳細には、WallarmノードのUUIDが表示されます。

    ![!インターフェイスの攻撃][attacks-in-ui-image]