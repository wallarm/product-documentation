```markdown
!!! warning "Wallarmクラウドの1つにFASTノードを接続する方法"
    FASTノードは[利用可能なWallarmクラウド](../../cloud-list.md)のいずれかと連携します。デフォルトでは、FASTノードはアメリカのクラウドに配置されているWallarm APIサーバーを利用します。
    
    別のクラウドのAPIサーバーを使用するようFASTノードに指示するには、ノードコンテナに必要なWallarm APIサーバーのアドレスを指定する`WALLARM_API_HOST`環境変数を渡します。
    
    例（ヨーロッパのWallarmクラウドに配置されているAPIサーバーを使用するFASTノードの場合）:

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```
```