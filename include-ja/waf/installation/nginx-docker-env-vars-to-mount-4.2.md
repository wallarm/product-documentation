環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークンです。<br><div class="admonition info"> <p class="admonition-title">Wallarm Cloudへのアクセスを構成する以前の変数</p> <p>バージョン4.0のリリース前は、`WALLARM_API_TOKEN`の代わりに`DEPLOY_USERNAME`と`DEPLOY_PASSWORD`を使用していました。新しいリリース以降は、Wallarm Cloudへのアクセスには新しいトークンベースの方式を使用することを推奨します。 [新しいノードバージョンへの移行の詳細](/updating-migrating/docker-container/)</p></div> | はい
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com`はUS Cloud向けです</li><li>`api.wallarm.com`はEU Cloud向けです</li></ul>デフォルト：`api.wallarm.com`です。 | いいえ