環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmのノードトークン。<br><div class="admonition info"> <p class="admonition-title">Wallarm Cloudへの接続を設定する既定の変数</p> <p>バージョン4.0のリリース前は、`WALLARM_API_TOKEN`後の変数は`DEPLOY_USERNAME`および`DEPLOY_PASSWORD`でした。新リリースからは、Wallarm Cloudにアクセスするための新しいトークンベースの手法の使用を推奨します。[新ノードバージョンへの移行の詳細](/updating-migrating/docker-container/)</p></div> | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com`はUSクラウド用</li><li>`api.wallarm.com`はEUクラウド用</li></ul>デフォルトは`api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block`は悪意のあるリクエストをブロック</li><li>`safe_blocking`は[灰色リスト化されたIPアドレス][灰色リスト-文書]から発生した悪意のあるリクエストのみをブロック</li><li>`monitoring`はリクエストを分析するがブロックはしない</li><li>`off`はトラフィックの分析と処理を無効にする</li></ul>デフォルトは`monitoring`。<br>[フィルタリングモードの詳細な説明 →][フィルタリングモード-文書] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護されたアプリケーションの一意の識別子。値は`0`を除く正の整数であることができます。<br><br>デフォルト値（変数がコンテナに渡されなかった場合）は`-1`で、Wallarmコンソール → **設定** → **アプリケーション**に表示される**デフォルト**アプリケーションを指します。<br><br>[アプリケーションの設定の詳細 →][アプリケーション-設定] | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられた[メモリの量][メモリ全部位ガイド]。値は整数または浮動小数点（<code>.</code>は小数点を示します）。デフォルトは0.2ギガバイト。 | いいえ
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`から[`wallarm-status`][ノード-ステータス文書]サービスはNGINXと同じポートで自動的に実行されます。<br><br>デフォルト値（変数がコンテナに渡されなかった場合）は`80`。<br><br>文法は`NGINX_PORT='443'`。 | いいえ
`DISABLE_IPV6`| この変数に空でない任意の値がある場合、`listen [::]:80 default_server ipv6only=on;`行がNGINX設定ファイルから削除され、NGINXがIPv6接続の処理を停止します。<br><br>この変数が明示的に指定されていないか、空の値`""`を持っている場合、NGINXはIPv6とIPv4の両方の接続を処理します。 | いいえ