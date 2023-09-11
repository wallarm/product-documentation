次の手順に従って、テスト用の [Path Traversal][ptrav-attack-docs] 攻撃のリクエストをアプリケーションのアドレスに送信します:

    ```
    curl http://localhost/etc/passwd
    ```

新型のノードが**通常の**ノードと同様にリクエストを処理することを確認します。例えば、

   * 適切な [フィルタリングモード][waf-mode-instr] が設定されている場合、リクエストはブロックされます。
   * [カスタムブロックページ][blocking-page-instr] が設定されている場合はそれが返されます。

次に、[EU Cloud](https://my.wallarm.com/search) または [US Cloud](https://us1.my.wallarm.com/search) の Wallarm Console → **イベント** を開き、以下を確認します:

   * 攻撃がリストに表示されていること。
   * ヒットの詳細に Wallarm ノードの UUID が表示されていること。

    ![インターフェースの攻撃][attacks-in-ui-image]
