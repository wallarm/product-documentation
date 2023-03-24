環境変数 | 説明 | 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarmコンソールの**Deploy**または**Administrator**ユーザーアカウントへのメール。| はい
`DEPLOY_PASSWORD` | Wallarmコンソールの**Deploy**または**Administrator**ユーザーアカウントのパスワード。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>米国クラウドの場合：`us1.api.wallarm.com`</li><li>EUクラウドの場合：`api.wallarm.com`</li></ul>デフォルトは`api.wallarm.com`です。 | いいえ
`DEPLOY_FORCE` | 既存のWallarmノードの名前が実行中のコンテナの識別子と一致する場合、新しいWallarmノードで置き換えます。以下の値を変数に割り当てることができます。<ul><li>フィルタリングノードを置き換える場合は`true`</li><li>フィルタリングノードの置き換えを無効にする場合は`false`</li></ul>デフォルト値（コンテナに変数が渡されない場合）は`false`です。<br>Wallarmノード名は常に実行中のコンテナの識別子と一致します。フィルタリングノードの置き換えは、環境内のDockerコンテナ識別子が静的であり、別のDockerコンテナ（例：新しいバージョンのイメージがあるコンテナ）でフィルタリングノードを実行しようとしている場合に便利です。この場合、変数の値が`false`の場合、フィルタリングノードの作成プロセスに失敗します。 | いいえ