すべてを一つにまとめたインストーラーを使ってpostanalyticsを別々にインストールするには、以下を使用します：

=== "APIトークン"
    ```bash
    # x86_64バージョンを使用する場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.12.x86_64-glibc.sh postanalytics

    # ARM64バージョンを使用する場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.12.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UIでのノードの論理的なグループ化に使用されます）。

=== "ノードトークン"
    ```bash
    # x86_64バージョンを使用する場合：
    sudo sh wallarm-4.6.12.x86_64-glibc.sh postanalytics

    # ARM64バージョンを使用する場合：
    sudo sh wallarm-4.6.12.aarch64-glibc.sh postanalytics
    ```