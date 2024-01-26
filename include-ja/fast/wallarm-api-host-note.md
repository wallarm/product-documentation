					!!! warning "Wallarm cloudsの中の一つにFASTノードを接続する"
    FASTノードは、[利用可能なWallarm clouds](../cloud-list.md)の一つと相互作用します。デフォルトでは、FASTノードは、アメリカンクラウドに位在するWallarm APIサーバーと連携して動作します。

    別のクラウドのAPIサーバーを使用するようにFASTノードに指示するには、必要なWallarm APIサーバーのアドレスを指し示す`WALLARM_API_HOST`環境変数をノードコンテナに渡します。

    例（ヨーロピアンクラウドに位置するAPIサーバーを使用するFASTノードの場合）：

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```