1. Test [SQLI][sqli-attack-docs] ve [XSS][xss-attack-docs] saldırıları ile talebi korunan kaynak adresine gönderin:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. Wallarm Konsolu'nu açın → [US Cloud](https://us1.my.wallarm.com/search) veya [EU Cloud](https://my.wallarm.com/search)'daki **Olaylar** bölümü ve saldırıların listelenmiş olmasını sağlayın.
    ![Arayüzdeki saldırılar][attacks-in-ui-image]