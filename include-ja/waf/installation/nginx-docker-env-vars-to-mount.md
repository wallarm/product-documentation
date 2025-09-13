環境変数 | 説明| 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントのメールアドレスです。| はい
`DEPLOY_PASSWORD` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントのパスワードです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul>デフォルト：`api.wallarm.com`です。 | いいえ
`DEPLOY_FORCE` | 実行中のコンテナの識別子と既存のWallarmノード名が一致する場合、既存のWallarmノードを新しいものに置き換えます。変数には次の値を設定できます：<ul><li>フィルタリングノードを置き換える場合は`true`</li><li>フィルタリングノードの置換を無効にする場合は`false`</li></ul>デフォルト値（変数がコンテナに渡されない場合）は`false`です。<br>Wallarmノード名は、実行中のコンテナの識別子と常に一致します。環境内のDockerコンテナの識別子が静的で、フィルタリングノードを含む別のDockerコンテナ（例：新しいバージョンのイメージを持つコンテナ）を実行しようとしている場合、フィルタリングノードの置換が役立ちます。この場合、変数の値が`false`の場合は、フィルタリングノードの作成プロセスは失敗します。 | いいえ