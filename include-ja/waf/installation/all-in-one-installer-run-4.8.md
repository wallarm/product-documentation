1. ダウンロードしたスクリプトを実行してください：

    === "API トークン"
        ```bash
        # x86_64 バージョンを使用する場合：
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.x86_64-glibc.sh

        # ARM64 バージョンを使用する場合：
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS` 変数は、ノードが追加されるグループを設定します（Wallarm Console UI でノードを論理的にグループ化するために使用されます）。

    === "ノード トークン"
        ```bash
        # x86_64 バージョンを使用する場合：
        sudo sh wallarm-4.8.9.x86_64-glibc.sh

        # ARM64 バージョンを使用する場合：
        sudo sh wallarm-4.8.9.aarch64-glibc.sh
        ```

1. [US クラウド](https://us1.my.wallarm.com/) または [EU クラウド](https://my.wallarm.com/) を選択してください。
1. Wallarm トークンを入力してください。