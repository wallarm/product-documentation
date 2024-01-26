					!!! warning "Wallarmのクラウドの1つにFASTノードを接続する"
    FASTノードは、利用可能な[Wallarmのクラウド](../../cloud-list.md)の1つと対話します。デフォルトでは、FASTノードはアメリカのクラウドに位置するWallarm APIサーバーと連携します。
    
    FASTノードに別のクラウドのAPIサーバーを使用するよう指示するには、ノードコンテナに必要なWallarm APIサーバーのアドレスを指す`WALLARM_API_HOST`環境変数を渡します。

    例（ヨーロッパのWallarmクラウドに位置するAPIサーバーを使用するFASTノード用）：

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```