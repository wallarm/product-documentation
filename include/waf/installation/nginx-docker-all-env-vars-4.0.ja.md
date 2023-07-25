環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークンです。<br><div class="admonition info"> <p class="admonition-title">以前の変数によるWallarm Cloudへのアクセス設定</p> <p>バージョン4.0のリリース前は、`WALLARM_API_TOKEN`より前の変数は`DEPLOY_USERNAME`と`DEPLOY_PASSWORD`でした。新しいリリースからは、新しいトークンベースの方式を使ってWallarm Cloudにアクセスすることを推奨します。[新しいノードバージョンへの移行についての詳細はこちら](/updating-migrating/docker-container/)</p></div> | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com`は米国クラウドのためのもの</li><li>`api.wallarm.com`はEUクラウドのためのもの</li></ul>デフォルトは:`api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block`は悪意のあるリクエストをブロック</li><li>`safe_blocking`は[グレーリスト化されたIPアドレス][graylist-docs]からの悪意のあるリクエストのみをブロック</li><li>`monitoring`はリクエストを分析するがブロックしない</li><li>`off`はトラフィックの分析と処理を無効化</li></ul>デフォルトは:`monitoring`。<br>[フィルタリングモードの詳細説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | 保護されるアプリケーションの一意な識別子。この値はWallarm Cloudで使用されます。値は正の整数で、`0`は除く。<br><br>デフォルト値（コンテナに変数が渡されない場合）は`-1`で、これはWallarmコンソール → 設定 → アプリケーションに表示される**デフォルト**のアプリケーションを示します。<br><br>[アプリケーション設定の詳細 →][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられる[メモリの量][allocating-memory-guide]。値は整数または浮動小数（小数点<code>.</code>は十進数の区切り）でなければなりません。デフォルトは: 0.2ギガバイト。 | いいえ
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ `4.0.2-1`から、[`wallarm-status`][node-status-docs]サービスは自動的にNGINXと同じポートで実行されます。<br><br>デフォルト値（コンテナに変数が渡されない場合）は`80`です。<br><br>構文は`NGINX_PORT='443'`です。 | いいえ