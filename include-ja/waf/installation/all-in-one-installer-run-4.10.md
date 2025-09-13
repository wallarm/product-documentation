1. ダウンロードしたスクリプトを実行します：

    === "APIトークン"
        ```bash
        # x86_64版を使用する場合：
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh

        # ARM64版を使用する場合：
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UIでノードを論理的にグループ化するために使用します）。

    === "ノードトークン"
        ```bash
        # x86_64版を使用する場合：
        sudo sh wallarm-4.10.13.x86_64-glibc.sh

        # ARM64版を使用する場合：
        sudo sh wallarm-4.10.13.aarch64-glibc.sh
        ```

1. [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)を選択します。
1. Wallarmトークンを入力します。