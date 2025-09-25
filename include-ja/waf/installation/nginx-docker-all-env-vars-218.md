環境変数 | 説明| 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントのメールアドレスです。| はい
`DEPLOY_PASSWORD` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントのパスワードです。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com` はUS Cloud向け</li><li>`api.wallarm.com` はEU Cloud向け</li></ul>デフォルト: `api.wallarm.com`です。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block` は不正リクエストをブロックします</li><li>`monitoring` はリクエストを解析しますがブロックしません</li><li>`off` はトラフィックの解析および処理を無効にします</li></ul>デフォルト: `monitoring`です。 | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリ量][allocating-memory-guide]です。値は整数または浮動小数点数です（小数点の区切り文字はドット<code>.</code>です）。デフォルト: 0.2ギガバイトです。 | いいえ
`WALLARM_ACL_ENABLE` | デフォルト設定でIPブロッキング機能を有効にします。変数には次の値を指定できます:<ul><li>`true` はIPブロッキング機能を有効にします</li><li>`false` はIPブロッキング機能を無効にします</li></ul>デフォルト値（変数がコンテナに渡されない場合）は`false`です。<br>カスタム設定でIPブロッキング機能を有効にするには、適切なNGINXの[ディレクティブ][wallarm-acl-directive]を定義し、定義したディレクティブを含む構成ファイルを[マウント][mount-config-instr]してコンテナを実行する必要があります。<div class="admonition warning"> <p class="admonition-title">値 `on` / `enabled` / `ok` / `yes`</p> <p>フィルタリングノードイメージのバージョン2.16.0-8以降では、この変数に`on` / `enabled` / `ok` / `yes`の値を設定するとIPブロッキング機能が無効になります。本ドキュメントの説明に従って最新のイメージバージョンをデプロイし、この変数には`true`または`false`の値を渡すことを推奨します。</div> | いいえ 
`DEPLOY_FORCE` | 既存のWallarmノード名が実行中のコンテナの識別子と一致する場合、既存のWallarmノードを新しいノードに置き換えます。変数には次の値を指定できます:<ul><li>`true` はフィルタリングノードを置き換えます</li><li>`false` はフィルタリングノードの置き換えを無効にします</li></ul>デフォルト値（変数がコンテナに渡されない場合）は`false`です。<br>Wallarmノード名は常に実行中のコンテナの識別子と一致します。環境内のDockerコンテナ識別子が静的で、フィルタリングノードを持つ別のDockerコンテナ（例: 新しいバージョンのイメージを含むコンテナ）を実行しようとしている場合、フィルタリングノードの置き換えが役立ちます。この場合に変数の値が`false`であると、フィルタリングノードの作成処理は失敗します。 | いいえ