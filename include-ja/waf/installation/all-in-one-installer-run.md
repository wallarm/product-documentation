1. ダウンロードしたスクリプトを実行します:

    === "APIトークン"
        ```bash
        # x86_64バージョンを使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh

        # ARM64バージョンを使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UIでノードを論理的にグループ化するために使用されます）。

    === "ノードトークン"
        ```bash
        # x86_64バージョンを使用する場合:
        sudo sh wallarm-5.3.0.x86_64-glibc.sh

        # ARM64バージョンを使用する場合:
        sudo sh wallarm-5.3.0.aarch64-glibc.sh
        ```

1. [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)を選択します。
1. Wallarmトークンを入力します。