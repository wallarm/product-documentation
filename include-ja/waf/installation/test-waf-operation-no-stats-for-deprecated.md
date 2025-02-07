1. [SQLI][sqli-attack-docs]および[XSS][xss-attack-docs]攻撃を含むテストリクエストを保護されたリソースのアドレスへ送信します:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. Wallarm Console → **Attacks**セクションを[US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)で開き、攻撃がリストに表示されていることを確認します。
    ![インターフェース上の攻撃][attacks-in-ui-image]