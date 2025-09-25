1. Test [SQLI][sqli-attack-docs] ve [XSS][xss-attack-docs] saldırılarını içeren isteği korunan kaynağın adresine gönderin:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içinde Wallarm Console → **Attacks** bölümünü açın ve saldırıların listede görüntülendiğinden emin olun.
    ![Arayüzdeki Attacks][attacks-in-ui-image]