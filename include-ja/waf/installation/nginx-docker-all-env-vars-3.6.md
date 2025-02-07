```markdown
環境変数 | 説明 | 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントに使用するメールアドレスです。 | Yes
`DEPLOY_PASSWORD` | Wallarm Consoleの**Deploy**または**Administrator**ユーザーアカウントに使用するパスワードです。 | Yes
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | Yes
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com`はUS Cloud向けです</li><li>`api.wallarm.com`はEU Cloud向けです</li></ul>既定値: `api.wallarm.com`。 | No
`WALLARM_MODE` | ノードモード:<ul><li>`block` は悪意のあるリクエストをブロックします</li><li>`safe_blocking` は[graylisted IP addresses][graylist-docs]から発生した悪意のあるリクエストのみをブロックします</li><li>`monitoring` はリクエストを解析するだけでブロックしません</li><li>`off` はトラフィックの解析および処理を無効にします</li></ul>既定値: `monitoring`。<br>[詳細なフィルトレーションモードの説明→][filtration-modes-docs] | No
`WALLARM_APPLICATION` | Wallarm Cloudで利用する保護対象アプリケーションの一意識別子です。値は`0`以外の正の整数でなければなりません。<br><br>コンテナに変数が渡されなかった場合の既定値は`-1`で、これはWallarm Console → **Settings** → **Application**に表示される**default**アプリケーションを示します。<br><br>[アプリケーション設定の詳細→][application-configuration]<div class="admonition info"> <p class="admonition-title">変数`WALLARM_APPLICATION`のサポート</p> <p>変数`WALLARM_APPLICATION`はDockerイメージのバージョン`3.4.1-1`からサポートします。</p></div> | No
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリサイズ][allocating-memory-guide]です。値は整数または浮動小数点数（小数点はドット<code>.</code>です）で指定できます。既定値: 0.2ギガバイトです。 | No
`DEPLOY_FORCE` | 現在実行中のコンテナの識別子と一致するWallarmノード名が存在する場合、その既存のWallarmノードを新しいものに置き換えます。変数には次の値を設定できます：<ul><li>`true` … フィルタリングノードを置き換えます</li><li>`false` … フィルタリングノードの置き換えを無効にします</li></ul>コンテナに変数が渡されなかった場合の既定値は`false`です。<br>Wallarmノード名は常に実行中のコンテナの識別子と一致します。Dockerコンテナ識別子が固定されており、新しいバージョンのDockerイメージを使用して別のDockerコンテナでフィルタリングノードを実行しようとする場合、変数の値が`false`だとフィルタリングノードの作成が失敗します。 | No
`NGINX_PORT` | <p>Dockerコンテナ内でNGINXが使用するポートを設定します。これにより、Kubernetesクラスタのポッド内でこのDockerコンテナを[sidecar container][about-sidecar-container]として使用する際にポートの競合を回避できます。</p><p>コンテナに変数が渡されなかった場合の既定値は`80`です。</p><p>構文は`NGINX_PORT='443'`です。</p> | No
```