1. ダウンロードしたスクリプトを実行します:

    === "APIトークン"
        ```bash
        # x86_64バージョンを使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.x86_64-glibc.sh

        # ARM64バージョンを使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS`変数は、ノードが追加されるgroupを設定します（Wallarm Console UIでのノードの論理的なグループ化に使用します）。

    === "ノードトークン"
        ```bash
        # x86_64バージョンを使用する場合:
        sudo sh wallarm-6.4.1.x86_64-glibc.sh

        # ARM64バージョンを使用する場合:
        sudo sh wallarm-6.4.1.aarch64-glibc.sh
        ```

1. [USクラウド](https://us1.my.wallarm.com/) または [EUクラウド](https://my.wallarm.com/) を選択します。
1. Wallarmトークンを入力します。