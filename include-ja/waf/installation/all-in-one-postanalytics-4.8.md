オールインワンインストーラーを使用してpostanalyticsを個別にインストールする場合は、以下のいずれかを使用してください。

=== "APIトークン"
    ```bash
    # x86_64バージョンを使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh postanalytics

    # ARM64バージョンを使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UIでのノードの論理的なグループ分けに使用されます）。

=== "ノードトークン"
    ```bash
    # x86_64バージョンを使用する場合:
    sudo sh wallarm-4.8.10.x86_64-glibc.sh postanalytics

    # ARM64バージョンを使用する場合:
    sudo sh wallarm-4.8.10.aarch64-glibc.sh postanalytics
    ```