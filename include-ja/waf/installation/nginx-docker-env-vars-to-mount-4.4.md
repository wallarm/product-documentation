環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm nodeのトークンです。<br><div class="admonition info"> <p class="admonition-title">複数のインストールで1つのトークンを使用する</p> <p>選択したプラットフォームに関係なく、複数のインストールで1つのトークンを使用できます。これにより、Wallarm Console UIでWallarm nodeインスタンスを論理的にグループ化できます。例: 開発環境に複数のWallarm nodeをデプロイし、各Wallarm nodeが特定の開発者の所有する個別のマシン上で稼働しているケースです。</p></div> | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul>デフォルト: `api.wallarm.com`です。 | いいえ