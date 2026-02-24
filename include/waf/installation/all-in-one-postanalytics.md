To install postanalytics separately with all-in-one installer, use:

=== "API token"
    If using the x86_64 version:

    ```bash
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.10.1.x86_64-glibc.sh postanalytics
    ```

    If using the ARM64 version:

    ```bash
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.10.1.aarch64-glibc.sh postanalytics
    ```        

    The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

=== "Node token"
    If using the x86_64 version:

    ```bash
    sudo sh wallarm-6.10.1.x86_64-glibc.sh postanalytics
    ```

    If using the ARM64 version:

    ```bash
    sudo sh wallarm-6.10.1.aarch64-glibc.sh postanalytics
    ```