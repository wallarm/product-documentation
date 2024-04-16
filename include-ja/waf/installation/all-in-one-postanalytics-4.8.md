all-in-oneインストーラーを使用してpostanalyticsを別途インストールする場合は、以下を使用してください：

=== "APIトークン"
    ```bash
    # x86_64版を使用している場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh postanalytics

    # ARM64版を使用している場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UIでのノードの論理的なグルーピングに使用されます）。

=== "ノードトークン"
    ```bash
    # x86_64版を使用している場合：
    sudo sh wallarm-4.8.10.x86_64-glibc.sh postanalytics

    # ARM64版を使用している場合：
    sudo sh wallarm-4.8.10.aarch64-glibc.sh postanalytics
    ```