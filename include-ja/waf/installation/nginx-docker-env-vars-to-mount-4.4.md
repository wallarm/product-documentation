Environment variable | Description | Required
--- | --- | ---
`WALLARM_API_TOKEN` | Wallarmノードトークン。<br><div class="admonition info"> <p class="admonition-title">1つのトークンを複数のインストールで使用する場合</p> <p>選択されたプラットフォームに関係なく、1つのトークンを複数のインストールで使用できます。Wallarm Console UI内でノードインスタンスを論理的にグループ化することができます。例: 開発環境に複数のWallarmノードを展開し、各ノードは特定の開発者が所有するそれぞれのマシンに配置される場合の利用例です。</p></div> | はい
`WALLARM_API_HOST` | Wallarm APIサーバ:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>既定値: `api.wallarm.com`. | いいえ