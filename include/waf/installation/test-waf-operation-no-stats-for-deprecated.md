1. Send the request with test [SQLI][sqli-attack-docs] and [XSS][xss-attack-docs] attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. Open the Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and ensure attacks are displayed in the list.
    ![Attacks in the interface][attacks-in-ui-image]
