```markdown
Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm nodeトークン。<br><div class="admonition info"> <p class="admonition-title">Wallarm Cloudへのアクセスを設定していた従来の変数</p> <p>バージョン4.0リリース以前は、`WALLARM_API_TOKEN`以前の変数として`DEPLOY_USERNAME`と`DEPLOY_PASSWORD`がありました。新しいリリース以降は、Wallarm Cloudへのアクセスにトークンベースの新方式を使用することを推奨します。[新しいノードバージョンへの移行に関する詳細](/updating-migrating/docker-container/)</p></div> | Yes
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | Yes
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul>デフォルトは `api.wallarm.com`。 | No
`WALLARM_MODE` | ノードモード：<ul><li>`block`：悪意のあるリクエストをブロック</li><li>`safe_blocking`：[graylisted IP addresses][graylist-docs]からの悪意のあるリクエストのみをブロック</li><li>`monitoring`：リクエストを解析するがブロックしない</li><li>`off`：トラフィック解析と処理を無効化</li></ul>デフォルトは`monitoring`。<br>[フィルトレーションモードの詳細説明 →][filtration-modes-docs] | No
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護アプリケーションの一意の識別子。値は`0`を除く正の整数です。<br><br>変数がコンテナに渡されない場合のデフォルト値は`-1`で、これはWallarm Console → **Settings** → **Application**に表示される**デフォルト**アプリケーションを示します。<br><br>[アプリケーションの設定に関する詳細 →][application-configuration] | No
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリの量][allocating-memory-guide]です。値は整数または浮動小数点数で、小数点はドット<code>.</code>を使用します。デフォルトは0.2 gygabytesです。 | No
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`以降、[`wallarm-status`][node-status-docs]サービスは自動的にNGINXと同じポートで動作します。<br><br>変数がコンテナに渡されない場合のデフォルト値は`80`です。<br><br>構文は`NGINX_PORT='443'`です。 | No
```