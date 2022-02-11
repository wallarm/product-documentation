1. Send the request with test [SQLI][sqli-attack-desc] and [XSS][xss-attack-desc] attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. Open the Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in the interface][img-test-attacks-in-ui]
