1. The request with test [Path Traversal][ptrav-attack-docs] attack to an address of either the load balancer or the machine with the Wallarm node:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    ![Attacks in the interface][attacks-in-ui-image]

    Since Wallarm operates in the monitoring mode, the Wallarm node does not block the attack but registers it.

1. Optionally, [test][link-wallarm-health-check] other aspects of the node functioning.