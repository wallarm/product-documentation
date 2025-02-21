1. ダウンロードしたスクリプトを実行します:

    === "APIトークン"
        ```bash
        # x86_64バージョンを使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh

        # ARM64バージョンを使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh
        ```        

        WALLARM_LABELS変数はノードが追加されるグループを設定します（Wallarm Console UIのノードの論理グループ分けに使用します）.

    === "ノードトークン"
        ```bash
        # x86_64バージョンを使用する場合:
        sudo sh wallarm-4.8.10.x86_64-glibc.sh

        # ARM64バージョンを使用する場合:
        sudo sh wallarm-4.8.10.aarch64-glibc.sh
        ```

1. [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)を選択します.
1. Wallarmトークンを入力します.