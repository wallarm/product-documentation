環境変数 | 詳細説明 | 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarmコンソールの**Deploy**または**Administrator**ユーザーアカウントへのメール。| はい
`DEPLOY_PASSWORD` | Wallarmコンソールの**Deploy**または**Administrator**ユーザーアカウントへのパスワード。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com` は米国クラウド用</li><li>`api.wallarm.com` はEUクラウド用</li></ul>デフォルトは`api.wallarm.com`。 | いいえ
`DEPLOY_FORCE` | 実行中のコンテナの識別子と既存のWallarmノード名が一致した場合、新しいものに既存のWallarmノードを置き換えます。以下の値が変数に割り当てられます：<ul><li>`true` はフィルタリングノードを置き換えることを示します</li><li>`false` はフィルタリングノードの置き換えを無効化します</li></ul>デフォルト値（コンテナに変数が渡されなかった場合）は `false`です。<br>Wallarmノード名は常に実行中のコンテナの識別子と一致します。フィルタリングノードの置き換えは、Dockerコンテナの識別子が静的であり、フィルタリングノード（例：新しいバージョンのイメージのコンテナ）を持つ別のDockerコンテナを実行しようとしている環境で役立ちます。この場合に変数の値が `false` であると、フィルタリングノードの作成プロセスは失敗します。| いいえ