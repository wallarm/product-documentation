!!! warning "FASTノードをいずれかのWallarm Cloudに接続"
    FASTノードは、[利用可能なWallarm Cloud](../../cloud-list.md)のいずれかと連携します。既定では、FASTノードは米国のWallarm CloudにあるWallarm APIサーバと動作します。
    
    別のクラウドのAPIサーバを使用するようにFASTノードに指定するには、対象のWallarm APIサーバのアドレスを指す環境変数`WALLARM_API_HOST`をノードコンテナに渡します。
    
    例（欧州のWallarm CloudにあるAPIサーバを使用するFASTノードの場合）:
    
    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```