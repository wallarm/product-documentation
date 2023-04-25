1. Send the request with test [Path Traversal][ptrav-attack-docs] attack to a protected resource address:

    ```
    curl http://localhost/etc/passwd
    ```
2. Open Wallarm Console → **Events** section in the [US Cloud](https://us1.my.wallarm.com/search) or [EU Cloud](https://my.wallarm.com/search) and make sure the attack is displayed in the list.
    ![!Attacks in the interface][attacks-in-ui-image]

Since the Wallarm proxy operates in the monitoring filtration mode by default, the Wallarm node will not block the attack but will register it.