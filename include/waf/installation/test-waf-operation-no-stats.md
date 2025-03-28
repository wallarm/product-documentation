1. Send the request with test [Path Traversal][ptrav-attack-docs] attack to a protected resource address:

    ```
    curl http://localhost/etc/passwd
    ```

    If traffic is configured to be proxied to `example.com`, include the `-H "Host: example.com"` header in the request.
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/search) or [EU Cloud](https://my.wallarm.com/search) and make sure the attack is displayed in the list.

    ![Attacks in the interface][attacks-in-ui-image]

1. Optionally, [test][link-wallarm-health-check] other aspects of the node functioning.