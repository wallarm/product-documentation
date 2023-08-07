環境変数 | 説明 | 必要性
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードのトークン。<br><div class="admonition info"> <p class="admonition-title">Wallarm Cloudへのアクセスを設定する以前の変数</p> <p>バージョン4.0のリリース以前には、`WALLARM_API_TOKEN` に先行する変数は `DEPLOY_USERNAME` と `DEPLOY_PASSWORD` でした。新リリースからは、Wallarm Cloudへのアクセスに新しいトークンベースの方式を使用することを推奨します。[新しいノードバージョンへの移行の詳細](/updating-migrating/docker-container/)。</p></div> | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm API サーバー：<ul><li>`us1.api.wallarm.com` は US Cloud 向け</li><li>`api.wallarm.com` は EU Cloud 向け</li></ul>デフォルトは：`api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードのモード：<ul><li>`block` は悪意のあるリクエストをブロックする</li><li>`safe_blocking` は[グレーリストに挙がっているIPアドレス][graylist-docs]からの悪意のあるリクエストのみをブロックする</li><li>`monitoring` はリクエストを分析するがブロックはしない</li><li>`off` はトラフィックの分析と処理を無効にする</li></ul>デフォルトは：`monitoring`。<br>[フィルタリングモードの詳細説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護対象のアプリケーションの固有識別子。値は `0` 以外の正の整数であることができます。<br><br>デフォルト値（この変数がコンテナに渡されない場合）は、Wallarm コンソール → **設定** → **アプリケーション** に表示されている **デフォルト** のアプリケーションを指す `-1` です。<br><br>[アプリケーションの設定詳細 →][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリの量][allocating-memory-guide]。値は整数または浮動小数点数（小数点の `<code>.</code>` は小数部分を区切る）であることができます。デフォルトは：0.2ギガバイト。 | いいえ
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ `4.0.2-1` から、[`wallarm-status`][node-status-docs] サービスがNGINXと同じポートで自動的に実行されます。<br><br>デフォルト値（この変数がコンテナに渡されない場合）は `80` です。<br><br>構文： `NGINX_PORT='443'`。 | いいえ