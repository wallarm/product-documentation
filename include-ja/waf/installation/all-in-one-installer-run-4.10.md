1. ダウンロードしたスクリプトを実行します：

    === "API token"
        ```bash
        # もしx86_64バージョンを使用している場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh

        # もしARM64バージョンを使用している場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh
        ```        

        WALLARM_LABELS変数は、Wallarm Console UI内でノードを論理的にグループ化するために使用されるグループにノードを追加する設定を行います。

    === "Node token"
        ```bash
        # もしx86_64バージョンを使用している場合:
        sudo sh wallarm-4.10.13.x86_64-glibc.sh

        # もしARM64バージョンを使用している場合:
        sudo sh wallarm-4.10.13.aarch64-glibc.sh
        ```

1. [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)を選択します。
1. Wallarmトークンを入力します。