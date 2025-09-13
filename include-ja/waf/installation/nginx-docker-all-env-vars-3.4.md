環境変数 | 説明| 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントのメールアドレスです。| はい
`DEPLOY_PASSWORD` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントのパスワードです。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com`（US Cloud向け）</li><li>`api.wallarm.com`（EU Cloud向け）</li></ul>デフォルト: `api.wallarm.com`です。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block` 悪意のあるリクエストをブロックします。</li><li>`safe_blocking` [グレーリストのIPアドレス][graylist-docs]からの悪意のあるリクエストのみをブロックします。</li><li>`monitoring` リクエストを解析しますがブロックしません。</li><li>`off` トラフィックの解析と処理を無効にします。</li></ul>デフォルト: `monitoring`です。<br>[フィルタリングモードの詳細 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意の識別子です。値は`0`を除く正の整数にできます。<br><br>デフォルト値（変数がコンテナに渡されない場合）は`-1`です。これはWallarm Console → **Settings** → **Application**に表示される**default**アプリケーションを示します。<br><br>[アプリケーションの設定の詳細 →][application-configuration]<div class="admonition info"> <p class="admonition-title">変数`WALLARM_APPLICATION`のサポート</p> <p>変数`WALLARM_APPLICATION`は、バージョン`3.4.1-1`以降のDockerイメージでのみサポートされます。</p></div> | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリ容量][allocating-memory-guide]です。値は整数または浮動小数点数（小数点は<code>.</code>）にできます。デフォルト: 0.2ギガバイトです。 | いいえ
`DEPLOY_FORCE` | 実行中のコンテナの識別子と既存のWallarmノード名が一致する場合、既存のWallarmノードを新しいノードに置き換えます。変数には次の値を設定できます:<ul><li>`true` フィルタリングノードを置き換えます。</li><li>`false` フィルタリングノードの置き換えを無効にします。</li></ul>デフォルト値（変数がコンテナに渡されない場合）は`false`です。<br>Wallarmノード名は、実行中のコンテナの識別子と常に一致します。お使いの環境でDockerコンテナの識別子が固定で、フィルタリングノードを含む別のDockerコンテナ（たとえば、新しいバージョンのイメージを持つコンテナ）を実行しようとしている場合、フィルタリングノードの置き換えが役立ちます。この場合に変数の値が`false`だと、フィルタリングノードの作成処理は失敗します。 | いいえ