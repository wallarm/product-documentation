1. テスト用の[SQLインジェクション][sqli-attack-docs]および[XSS][xss-attack-docs]攻撃を含むリクエストを保護されたリソースのアドレスに送信します：

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. [US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)でWallarm Console → **Attacks**セクションを開き、攻撃が一覧に表示されていることを確認します。
    ![インターフェースのAttacks][attacks-in-ui-image]