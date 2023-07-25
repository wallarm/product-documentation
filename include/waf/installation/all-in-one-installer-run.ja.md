ダウンロードしたスクリプトを実行します：

=== "APIトークン"
        ```bash
         # x86_64バージョンを使用している場合：
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.12.x86_64-glibc.sh

        # ARM64バージョンを使用している場合：
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.12.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS`変数は、WallarmのコンソールUIでノードの論理的なグループ化に使用される、ノードが追加されるグループを設定します。

=== "ノードトークン"
        ```bash
        # x86_64バージョンを使用している場合：
        sudo sh wallarm-4.6.12.x86_64-glibc.sh

        # ARM64バージョンを使用している場合：
        sudo sh wallarm-4.6.12.aarch64-glibc.sh
        ```

1. [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)を選択します。
1. Wallarmトークンを入力します。