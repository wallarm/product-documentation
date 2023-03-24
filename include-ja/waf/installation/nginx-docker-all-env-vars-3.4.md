環境変数 | 説明 | 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントへのメール。| はい
`DEPLOY_PASSWORD` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントへのパスワード。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com`：米国クラウド用</li><li>`api.wallarm.com`：欧州クラウド用</li></ul>デフォルト：`api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block`：悪意のあるリクエストをブロックする</li><li>`safe_blocking`：[グレーリスト化されたIPアドレス][graylist-docs]からの悪意のあるリクエストのみをブロックする</li><li>`monitoring`：リクエストを解析するがブロックしない</li><li>`off`：トラフィックの解析と処理を無効にする</li></ul>デフォルト：`monitoring`。<br>[フィルタリングモードの詳細説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護されたアプリケーションの一意の識別子。値は`0`以外の正の整数にすることができます。<br><br>デフォルト値（コンテナに変数が渡されない場合）は`-1`で、Wallarm Console → **Settings** → **Application**に表示される**default**アプリケーションを示します。<br><br>[アプリケーションの設定に関する詳細 →][application-configuration]<div class="admonition info"> <p class="admonition-title">変数`WALLARM_APPLICATION`のサポート</p> <p>変数`WALLARM_APPLICATION`は、Dockerイメージのバージョン`3.4.1-1`からサポートされています。</div> | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられた[メモリの量][allocating-memory-guide]。値は整数または浮動小数点数（小数点は<code>.</code>です）になります。デフォルト：0.2ギガバイト。 | いいえ
`DEPLOY_FORCE` | 既存のWallarmノードの名前が実行中のコンテナの識別子と一致する場合、新しいWallarmノードに置き換えます。変数には以下の値が割り当てられます：<ul><li>`true`：フィルタリングノードを置き換える</li><li>`false`：フィルタリングノードの置き換えを無効にする</li></ul>デフォルト値（コンテナに変数が渡されない場合）は`false`です。<br>Wallarmノード名は常に実行中のコンテナの識別子と一致します。環境中のDockerコンテナ識別子が静的であり、別のDockerコンテナをフィルタリングノード付きで実行しようとしている場合（例：イメージの新しいバージョンが含まれたコンテナ）、フィルタリングノードの置き換えが役立ちます。この場合、変数の値が`false`の場合、フィルタリングノードの作成プロセスが失敗します。 | いいえ