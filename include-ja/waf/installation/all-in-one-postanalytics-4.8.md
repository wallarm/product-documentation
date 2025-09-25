postanalyticsをオールインワンインストーラーで個別にインストールするには、次を使用します：

=== "APIトークン"
    ```bash
    # x86_64バージョンを使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh postanalytics

    # ARM64バージョンを使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UIでノードを論理的にグループ化するために使用します）。

=== "ノードトークン"
    ```bash
    # x86_64バージョンを使用する場合:
    sudo sh wallarm-4.8.10.x86_64-glibc.sh postanalytics

    # ARM64バージョンを使用する場合:
    sudo sh wallarm-4.8.10.aarch64-glibc.sh postanalytics
    ```