1. テスト [Path Traversal][ptrav-attack-docs] 攻撃を保護されたリソースアドレスにリクエストを送信します。

    ```
    curl http://localhost/etc/passwd
    ```
2. Wallarm コンソールを開いて [US クラウド](https://us1.my.wallarm.com/search) または [EU クラウド](https://my.wallarm.com/search) の **イベント** セクションを開き、攻撃がリストに表示されていることを確認します。
    ![!インターフェイスの攻撃][attacks-in-ui-image]