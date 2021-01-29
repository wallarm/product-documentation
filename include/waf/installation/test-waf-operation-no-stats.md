1. Send the request with test [SQLI](../attacks-vulns-list.md#sql-injection) and [XSS](../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    If the WAF node works in the `block` mode, the request will be blocked and the code `403 Forbidden` will be returned.
2. Open the Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in the interface](../images/admin-guides/test-attacks.png)
