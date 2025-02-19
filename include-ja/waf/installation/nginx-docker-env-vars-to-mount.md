```markdown
環境変数 | 説明 | 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントのメールアドレスです。 | はい
`DEPLOY_PASSWORD` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントのパスワードです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>US Cloudの場合、`us1.api.wallarm.com`</li><li>EU Cloudの場合、`api.wallarm.com`</li></ul>デフォルトは`api.wallarm.com`です。 | いいえ
`DEPLOY_FORCE` | 実行中のコンテナの識別子と一致する既存のWallarmノードがある場合に新しいものに置換します。変数には以下の値を設定できます：<ul><li>フィルタリングノードを置換する場合は`true`</li><li>フィルタリングノードの置換を無効にする場合は`false`</li></ul>（変数がコンテナに渡されない場合）デフォルト値は`false`です。<br>Wallarmノード名は常に実行中のコンテナの識別子と一致します。フィルタリングノードの置換は、環境内のDockerコンテナ識別子が静的であり、フィルタリングノードを持つ別のDockerコンテナ（たとえば、新しいバージョンのイメージを持つコンテナ）の実行を試みる場合に有用です。この場合、変数の値が`false`だとフィルタリングノード作成プロセスが失敗します。 | いいえ
```