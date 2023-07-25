!!! 警告 "FAST ノードを Wallarm のクラウドのいずれかに接続する"
    FAST ノードは、[利用可能な Wallarm のクラウド](../CLOUD-LIST.ja.md)のいずれかと対話します。デフォルトでは、FAST ノードはアメリカのクラウドに位置する Wallarm API サーバーと連携します。

    別のクラウドからの API サーバーを使用するように FAST ノードに指示するには、必要な Wallarm API サーバーのアドレスを指定する `WALLARM_API_HOST` 環境変数をノードコンテナに渡します。

    例（ヨーロッパの Wallarm クラウドに位置する API サーバーを使用する FAST ノードの場合）：

    ```
    WALLARM_API_HOST=api.wallarm.com
    ```