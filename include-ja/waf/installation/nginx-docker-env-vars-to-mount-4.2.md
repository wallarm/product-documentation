```markdown
環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークンです。<br><div class="admonition info"> <p class="admonition-title">Wallarm Cloudへのアクセス設定に使用していた従来の変数</p> <p>バージョン4.0のリリース以前は、`WALLARM_API_TOKEN`より前に設定されていた変数は`DEPLOY_USERNAME`および`DEPLOY_PASSWORD`でした。新しいリリース以降は、Wallarm Cloudへのアクセスに新しいトークンベースのアプローチの使用が推奨です。[新しいノードバージョンへの移行に関する詳細](/updating-migrating/docker-container/)</p></div> | はい
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com` (US Cloud向け)</li><li>`api.wallarm.com` (EU Cloud向け)</li></ul>デフォルトでは`api.wallarm.com`です。 | いいえ
```