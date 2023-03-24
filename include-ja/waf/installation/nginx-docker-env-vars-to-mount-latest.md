環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークン。<br><div class="admonition info"> <p class="admonition-title">複数のインストールで1つのトークンを使用する</p> <p>選択したプラットフォームに関係なく、複数のインストールで1つのトークンを使用できます。これにより、Wallarm Console UIでノードインスタンスを論理的にグループ化できます。例：開発環境に複数のWallarmノードをデプロイし、各ノードは特定の開発者が所有する独自のマシン上にあります。</p></div> | はい
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com`：USクラウド用</li><li>`api.wallarm.com`：EUクラウド用</li></ul>デフォルト：`api.wallarm.com`。 | いいえ