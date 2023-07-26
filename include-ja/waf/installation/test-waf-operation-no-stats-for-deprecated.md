1. テスト [SQLI][sqli-attack-docs] および [XSS][xss-attack-docs] 攻撃を含むリクエストを保護されたリソースアドレスに送信します：

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. Wallarmコンソールを開き、[USクラウド](https://us1.my.wallarm.com/search)又は[EUクラウド](https://my.wallarm.com/search)の**イベント**セクションを確認し、攻撃がリストに表示されていることを確認します。
    ![!インターフェースに表示される攻撃][attacks-in-ui-image]