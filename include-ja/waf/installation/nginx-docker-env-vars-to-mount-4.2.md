環境変数 | 説明 | 必要
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードのトークン。<br><div class="admonition info"> <p class="admonition-title">Wallarm Cloudへのアクセスを設定する以前の変数</p> <p>バージョン4.0のリリース前までは、`WALLARM_API_TOKEN`を前にして`DEPLOY_USERNAME`と`DEPLOY_PASSWORD`という変数がありました。新たなリリース以降は、Wallarm Cloudにアクセスするためには新たなトークンベースの方法の使用が推奨されます。[新しいノードバージョンへの移行についての詳細](/updating-migrating/docker-container/)</p></div> | はい
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>`us1.api.wallarm.com`はUS Cloudのため</li><li>`api.wallarm.com`はEU Cloudのため</li></ul>デフォルトでは：`api.wallarm.com` | いいえ