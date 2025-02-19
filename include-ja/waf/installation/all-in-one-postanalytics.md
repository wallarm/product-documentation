全体インストーラでpostanalyticsを別個にインストールするには、次のコマンドを使用します：

=== "APIトークン"
    ```bash
    # x86_64版を使用している場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh postanalytics

    # ARM64版を使用している場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh postanalytics
    ```        

=== "Nodeトークン"
    ```bash
    # x86_64版を使用している場合:
    sudo sh wallarm-5.3.0.x86_64-glibc.sh postanalytics

    # ARM64版を使用している場合:
    sudo sh wallarm-5.3.0.aarch64-glibc.sh postanalytics
    ```