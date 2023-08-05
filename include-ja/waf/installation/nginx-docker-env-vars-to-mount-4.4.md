環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークン。<br><div class="admonition info"> <p class="admonition-title">複数のインストールに対して一つのトークンを使用する</p> <p>選択したプラットフォームに関係なく、複数のインストールで一つのトークンを使用することができます。これにより、Wallarm Console UIでノードインスタンスを論理的にグループ化することができます。例：開発環境に複数のWallarmノードをデプロイし、各ノードは特定の開発者が所有するマシン上にあります。</p></div> | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com` はUSクラウド用</li><li>`api.wallarm.com` はEUクラウド用</li></ul>デフォルトは `api.wallarm.com`。 | いいえ
