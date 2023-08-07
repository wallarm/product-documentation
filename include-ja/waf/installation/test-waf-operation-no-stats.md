1. テストの[Path Traversal][ptrav-attack-docs]攻撃を保護されたリソースアドレスにリクエストとして送信します：

    ```
    curl http://localhost/etc/passwd
    ```
2. Wallarmコンソールを開いて、[US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)の **Events** セクションを開き、攻撃がリストに表示されていることを確認してください。
    ![!インターフェースの攻撃][attacks-in-ui-image]