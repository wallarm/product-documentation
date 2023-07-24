環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmのノードトークン。<br><div class="admonition info"> <p class="admonition-title">Wallarm Cloudへのアクセスを設定するための以前の変数</p> <p>バージョン4.0のリリース前は、`WALLARM_API_TOKEN`の前の変数は`DEPLOY_USERNAME`と`DEPLOY_PASSWORD`でした。新しいリリースから始めて、新しいトークンベースのアプローチを使用してWallarm Cloudにアクセスすることを推奨します。[新しいノードバージョンへの移行についての詳細情報](/updating-migrating/docker-container/)</p></div> | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com` はUSクラウド用</li><li>`api.wallarm.com` はEUクラウド用</li></ul>デフォルトは `api.wallarm.com`。 | いいえ