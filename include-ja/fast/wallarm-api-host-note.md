!!! 警告 "Wallarmクラウドの1つにFASTノードを接続する"
    FASTノードは、[利用可能なWallarmクラウド](../cloud-list.md)のいずれかと相互作用します。デフォルトでは、FASTノードはアメリカのクラウドにあるWallarm APIサーバーと連携します。
    
    別のクラウドのAPIサーバーを使用するようFASTノードに指示するには、必要なWallarm APIサーバーのアドレスを示す`WALLARM_API_HOST`環境変数をノードコンテナに渡します。

    例（ヨーロッパのWallarmクラウドにあるAPIサーバーを使用するFASTノードの場合）:

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```