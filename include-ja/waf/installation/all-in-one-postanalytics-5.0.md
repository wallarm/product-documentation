postanalyticsをall-in-oneインストーラーで個別にインストールするには、次を使用してください:

=== "APIトークン"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.x86_64-glibc.sh postanalytics

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UIでノードを論理的にグループ化するために使用されます）。

=== "ノードトークン"
    ```bash
    # x86_64版を使用する場合:
    sudo sh wallarm-5.3.19.x86_64-glibc.sh postanalytics

    # ARM64版を使用する場合:
    sudo sh wallarm-5.3.19.aarch64-glibc.sh postanalytics
    ```