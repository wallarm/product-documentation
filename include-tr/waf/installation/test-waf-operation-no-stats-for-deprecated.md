1. Korunan kaynak adresine test [SQLI][sqli-attack-docs] ve [XSS][xss-attack-docs] saldırıları ile istek gönderin:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/search) veya [EU Cloud](https://my.wallarm.com/search) içerisinde açın ve saldırıların listede görüntülendiğinden emin olun.
    ![Attacks in the interface][attacks-in-ui-image]