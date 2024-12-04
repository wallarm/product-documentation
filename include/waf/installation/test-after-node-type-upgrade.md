1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to the application address:

    ```
    curl http://localhost/etc/passwd
    ```

    If traffic is configured to be proxied to `example.com`, include the `-H "Host: example.com"` header in the request.
1. Make sure the node of the new type processes the request in the same way as the **regular** node did, e.g.:

    * Blocks the request if the appropriate [filtration mode][waf-mode-instr] is configured.
    * Returns the [custom blocking page][blocking-page-instr] if it is configured.
2. Open Wallarm Console → **Attacks** in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and make sure that:

    * The attack is displayed in the list.
    * Hit details display the Wallarm node UUID.

    ![Attacks in the interface][attacks-in-ui-image]

