1. ダウンロードしたスクリプトを実行します：

    === "API トークン"
        ```bash
        # x86_64 バージョンを使用している場合：
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.x86_64-glibc.sh

        # ARM64 バージョンを使用している場合：
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS` 変数は、ノードを追加するグループを設定します（Wallarm コンソール UI でノードを論理的にグループ化するために使用されます）。

    === "ノード トークン"
        ```bash
        # x86_64 バージョンを使用している場合：
        sudo sh wallarm-4.6.16.x86_64-glibc.sh

        # ARM64 バージョンを使用している場合：
        sudo sh wallarm-4.6.16.aarch64-glibc.sh
        ```

1. [US クラウド](https://us1.my.wallarm.com/) または [EU クラウド](https://my.wallarm.com/) を選択します。
1. Wallarm トークンを入力します。