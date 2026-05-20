1. Run downloaded script:

    === "API token"
        If using the x86_64 version:

        ```bash
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.12.2.x86_64-glibc.sh
        ```

        If using the ARM64 version:

        ```bash
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.12.2.aarch64-glibc.sh
        ```        

        The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

    === "Node token"
        If using the x86_64 version:

        ```bash
        sudo sh wallarm-6.12.2.x86_64-glibc.sh
        ```

        If using the ARM64 version:

        ```bash
        sudo sh wallarm-6.12.2.aarch64-glibc.sh
        ```

1. Select [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/), or [ME Cloud](https://me1.my.wallarm.com/).
1. Enter Wallarm token.

??? info "ME Cloud: use batch mode"
    For ME Cloud, the Node does not yet support cloud selection via the interactive installer. Use batch mode instead.

    The command for x86_64:

    ```bash
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.12.2.x86_64-glibc.sh -- --batch -t <TOKEN> -H me1.api.wallarm.com
    ```

    The command for ARM64:

    ```bash
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.12.2.aarch64-glibc.sh -- --batch -t <TOKEN> -H me1.api.wallarm.com
    ```