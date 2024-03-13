オールインワンインストーラーを使用してpostanalyticsを別々にインストールするには、以下を使用します：

=== "APIトークン"
    ```bash
    # x86_64バージョンを使用する場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.x86_64-glibc.sh postanalytics

    # ARM64バージョンを使用する場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UI内のノードの論理的なグルーピングに使用されます）。

=== "ノードトークン"
    ```bash
    # x86_64バージョンを使用する場合：
    sudo sh wallarm-4.6.16.x86_64-glibc.sh postanalytics

    # ARM64バージョンを使用する場合：
    sudo sh wallarm-4.6.16.aarch64-glibc.sh postanalytics
    ```