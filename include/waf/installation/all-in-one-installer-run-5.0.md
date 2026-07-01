1. Run downloaded script:

    === "API token"
        If using the x86_64 version:

        ```bash
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.x86_64-glibc.sh
        ```

        If using the ARM64 version:

        ```bash
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.aarch64-glibc.sh
        ```        

        The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

    === "Node token"
        If using the x86_64 version:

        ```bash
        sudo sh wallarm-5.3.19.x86_64-glibc.sh
        ```

        If using the ARM64 version:

        ```bash
        sudo sh wallarm-5.3.19.aarch64-glibc.sh
        ```

1. Select [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
1. Enter Wallarm token.