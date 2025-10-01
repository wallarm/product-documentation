環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークンです。<br><div class="admonition info"> <p class="admonition-title">Wallarm Cloudへのアクセス構成に使用されていた以前の変数</p> <p>バージョン4.0のリリース前は、`WALLARM_API_TOKEN`の代わりに`DEPLOY_USERNAME`と`DEPLOY_PASSWORD`が使用されていました。新しいリリース以降は、Wallarm Cloudへのアクセスにはトークンベースの新しい方式を使用することを推奨します。 [新しいノードバージョンへの移行の詳細](/updating-migrating/docker-container/)</p></div> | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>US Cloud向けは`us1.api.wallarm.com`</li><li>EU Cloud向けは`api.wallarm.com`</li></ul>デフォルト: `api.wallarm.com`です。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block` 悪意のあるリクエストをブロックします</li><li>`safe_blocking` [グレーリスト化されたIPアドレス][graylist-docs]からの悪意のあるリクエストのみをブロックします</li><li>`monitoring` リクエストを解析しますがブロックはしません</li><li>`off` トラフィックの解析と処理を無効にします</li></ul>デフォルト: `monitoring`です。<br>[フィルタリングモードの詳細 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護対象アプリケーションの一意の識別子です。値には`0`を除く正の整数を指定できます。<br><br>デフォルト値（コンテナに変数が渡されない場合）は`-1`です。これはWallarm Console → **Settings** → **Application**に表示される**デフォルト**アプリケーションを示します。<br><br>[アプリケーションの設定の詳細 →][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリ容量][allocating-memory-guide]です。値は整数または浮動小数点数です（小数点の区切りはドット<code>.</code>です）。デフォルト: 0.2ギガバイトです。 | いいえ
`NGINX_PORT` | NGINXがDockerコンテナ内で使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`以降、[`wallarm-status`][node-status-docs]サービスはNGINXと同じポートで自動的に実行されます。<br><br>デフォルト値（コンテナに変数が渡されない場合）は`80`です。<br><br>構文は`NGINX_PORT='443'`です。 | いいえ