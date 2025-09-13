postanalyticsをオールインワンインストーラーで別途インストールするには、次のコマンドを実行します：

=== "APIトークン"
    ```bash
    # x86_64版を使用する場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.x86_64-glibc.sh postanalytics

    # ARM64版を使用する場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UIでノードを論理的にグループ化するために使用します）。

=== "ノードトークン"
    ```bash
    # x86_64版を使用する場合：
    sudo sh wallarm-6.4.1.x86_64-glibc.sh postanalytics

    # ARM64版を使用する場合：
    sudo sh wallarm-6.4.1.aarch64-glibc.sh postanalytics
    ```