環境変数 | 説明| 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントのメールアドレスです。| はい
`DEPLOY_PASSWORD` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントのパスワードです。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul>既定値: `api.wallarm.com`です。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block` は悪意のあるリクエストをブロックします</li><li>`safe_blocking` は[グレーリスト化されたIPアドレス][graylist-docs]から発生した悪意のあるリクエストのみをブロックします</li><li>`monitoring` はリクエストを解析しますが、ブロックしません</li><li>`off` はトラフィックの解析と処理を無効化します</li></ul>既定値: `monitoring`です。<br>[フィルタリングモードの詳細な説明→][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意の識別子です。値は`0`を除く正の整数にできます。<br><br>コンテナに変数が渡されない場合の既定値は`-1`です。これはWallarm Console → **Settings** → **Application**に表示される**デフォルト**のアプリケーションを示します。<br><br>[アプリケーションの設定の詳細→][application-configuration]<div class="admonition info"> <p class="admonition-title">変数`WALLARM_APPLICATION`のサポート</p> <p>変数`WALLARM_APPLICATION`はDockerイメージのバージョン`3.4.1-1`以降でのみサポートされます。</p></div> | いいえ
`TARANTOOL_MEMORY_GB` | [Tarantoolに割り当てるメモリ量][allocating-memory-guide]です。値は整数または浮動小数点数にできます(小数点の区切り文字はドット(<code>.</code>)です)。既定値: 0.2ギガバイトです。 | いいえ
`DEPLOY_FORCE` | 実行中のコンテナの識別子と既存のWallarmノード名が一致する場合、既存のWallarmノードを新しいものに置き換えます。変数には次の値を設定できます:<ul><li>`true` はフィルタリングノードを置き換えます</li><li>`false` はフィルタリングノードの置き換えを無効化します</li></ul>コンテナに変数が渡されない場合の既定値は`false`です。<br>Wallarmノード名は常に、実行中のコンテナの識別子と一致します。フィルタリングノードの置き換えは、環境内のDockerコンテナの識別子が静的で、フィルタリングノードを含む別のDockerコンテナ(たとえば新しいバージョンのイメージを持つコンテナ)を起動しようとしている場合に役立ちます。この場合に変数の値が`false`だと、フィルタリングノードの作成処理は失敗します。 | いいえ
`NGINX_PORT` | <p>NGINXがDockerコンテナ内で使用するポートを設定します。このDockerコンテナをKubernetesクラスターのPod内で[サイドカーコンテナ][about-sidecar-container]として使用する際のポート衝突を回避できます。</p><p>コンテナに変数が渡されない場合の既定値は`80`です。</p><p>構文は`NGINX_PORT='443'`です。</p> | いいえ