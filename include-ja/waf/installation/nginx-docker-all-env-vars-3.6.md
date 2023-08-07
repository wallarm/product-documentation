環境変数 | 説明 | 必要性
--- | ---- | ----
`DEPLOY_USER` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントへのメール。| はい
`DEPLOY_PASSWORD` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントへのパスワード。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com` は米国クラウド用</li><li>`api.wallarm.com` はEUクラウド用</li></ul>デフォルトは `api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block` で悪意のあるリクエストをブロック</li><li>`safe_blocking` で[グレーリストのIPアドレス][graylist-docs]から発せられた悪意のあるリクエストのみをブロック</li><li>`monitoring` でリクエストを解析するがブロックしない</li><li>`off`でトラフィックの分析と処理を無効化</li></ul>デフォルトは `monitoring`。<br>[詳細なフィルタリングモードの説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護対象のアプリケーションの一意の識別子。値は`0`を除く正の整数であることができます。<br><br>デフォルト値（コンテナに変数が渡されない場合）は `-1`で、Wallarm Console → **設定** → **アプリケーション**で表示される**デフォルト**アプリケーションを指します。<br><br>[アプリケーションの設定についての詳細 →][application-configuration]<div class="admonition info"> <p class="admonition-title">変数`WALLARM_APPLICATION`のサポート</p> <p>変数`WALLARM_APPLICATION`のサポートは、Dockerイメージのバージョン `3.4.1-1`以降で利用可能です。</div> | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリの量][allocating-memory-guide]。値は整数または小数（小数点は<code>.</code>で区切られます）にすることができます。デフォルトは0.2ギガバイト。 | いいえ
`DEPLOY_FORCE` | 実行中のコンテナの識別子と名前が一致する既存のWallarmノードがある場合、新しいノードで置き換えます。変数には以下の値を割り当てることができます：<ul><li>`true` でフィルタリングノードを置き換える</li><li>`false` でフィルタリングノードの置き換えを無効にする</li></ul>デフォルト値（変数がコンテナに渡されない場合）は`false`です。<br>Wallarmノードの名前は常に実行中のコンテナの識別子と一致します。フィルタリングノードの置き換えは、Dockerコンテナの識別子が静的であり、フィルタリングノード（例えば、新しいバージョンのイメージがあるコンテナ）を含む別のDockerコンテナを実行しようとしている場合に便利です。この場合、変数の値が`false`であると、フィルタリングノードの作成プロセスが失敗します。 | いいえ
`NGINX_PORT` | <p>Dockerコンテナ内でNGINXが使用するポートを設定します。これにより、Kubernetesクラスタのポッド内でこのDockerコンテナを[サイドカー・コンテナ][about-sidecar-container]として使用する際のポート衝突を避けることができます。</p><p>デフォルト値（変数がコンテナに渡されない場合）は `80`。</p><p>記法は`NGINX_PORT='443'`です。</p> | いいえ