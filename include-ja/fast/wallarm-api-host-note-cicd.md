!!! warning "WallarmのクラウドのいずれかにFASTノードを接続する"
    FASTノードは、[利用可能なWallarmクラウド](../../CLOUD-LIST.md)のいずれかと対話します。デフォルトでは、FASTノードはアメリカクラウドに位置するWallarm APIサーバーと動作します。
    
    FASTノードに別のクラウドのAPIサーバーを使用するように指示するには、ノードコンテナに必要なWallarm APIサーバーのアドレスを指す`WALLARM_API_HOST`環境変数を渡します。
    
    例えば（ヨーロッパのWallarmクラウドに位置するAPIサーバーを使用するFASTノード向け）：

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```