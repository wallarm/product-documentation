オールインワンインストーラーを使用してpostanalyticsを個別にインストールするには、以下を使用します：

=== "APIトークン"
    ```bash
    # x86_64版を使用している場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh postanalytics

    # ARM64版を使用している場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh postanalytics
    ```        

    WALLARM_LABELS変数は、ノードが追加されるグループを設定します（Wallarm Console UIでノードの論理的グループ化に使用されます）。

=== "ノードトークン"
    ```bash
    # x86_64版を使用している場合:
    sudo sh wallarm-4.10.13.x86_64-glibc.sh postanalytics

    # ARM64版を使用している場合:
    sudo sh wallarm-4.10.13.aarch64-glibc.sh postanalytics
    ```