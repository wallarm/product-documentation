1. ダウンロードしたスクリプトを実行します:

    === "APIトークン"
        ```bash
        # x86_64バージョンをご利用の場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh

        # ARM64バージョンをご利用の場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UIでノードの論理的なグループ化に使用されます）。

    === "ノードトークン"
        ```bash
        # x86_64バージョンをご利用の場合:
        sudo sh wallarm-4.8.10.x86_64-glibc.sh

        # ARM64バージョンをご利用の場合:
        sudo sh wallarm-4.8.10.aarch64-glibc.sh
        ```

1. [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)を選択します。
1. Wallarmトークンを入力します。