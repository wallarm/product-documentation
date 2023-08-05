テストの[SQLI][sqli-attack-docs]攻撃と[XSS][xss-attack-docs]攻撃を含むリクエストを保護されたリソースのアドレスに送信します：

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. [US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)のWallarm Console → **イベント** セクションを開き、攻撃がリストに表示されていることを確認します。   
    ![!UIでの攻撃][attacks-in-ui-image]