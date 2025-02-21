Environment variable | Description | Required
--- | --- | ---
`DEPLOY_USER` | Wallarm Console内の**Deploy**または**Administrator**ユーザーアカウントのメールアドレスです。 | Yes
`DEPLOY_PASSWORD` | Wallarm Console内の**Deploy**または**Administrator**ユーザーアカウントのパスワードです。 | Yes
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | Yes
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>US Cloudの場合は<code>us1.api.wallarm.com</code></li><li>EU Cloudの場合は<code>api.wallarm.com</code></li></ul>デフォルト値：<code>api.wallarm.com</code>。 | No
`WALLARM_MODE` | ノードモード：<ul><li>悪意のあるリクエストをブロックします：<code>block</code></li><li>[graylisted IP addresses][graylist-docs]から発信された悪意のあるリクエストのみをブロックします：<code>safe_blocking</code></li><li>リクエストを解析するだけでブロックはしません：<code>monitoring</code></li><li>トラフィックの解析と処理を無効化します：<code>off</code></li></ul>デフォルト値：<code>monitoring</code>。<br>[フィルトレーションモードの詳細説明→][filtration-modes-docs] | No
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意の識別子です。値は<code>0</code>以外の正の整数である必要があります。<br><br>（コンテナに変数が渡されない場合のデフォルト値は<code>-1</code>で、これはWallarm Console→**Settings**→**Application**に表示される**default**アプリケーションを示します。）<br><br>[アプリケーションの設定の詳細→][application-configuration]
<div class="admonition info">
  <p class="admonition-title">変数<code>WALLARM_APPLICATION</code>のサポート</p>
  <p>変数<code>WALLARM_APPLICATION</code>はDockerイメージのバージョン<code>3.4.1-1</code>以降でのみサポートされています。</p>
</div> | No
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリ量][allocating-memory-guide]です。値は整数または浮動小数点数（小数点区切りはピリオド<code>.</code>です）である必要があります。デフォルト値：0.2 gygabytes。 | No
`DEPLOY_FORCE` | 実行中のコンテナの識別子と既存のWallarmノード名が一致する場合、既存のWallarmノードを新しいノードに置き換えます。変数には以下の値を割り当てることができます：<ul><li>フィルタリングノードを置き換えます：<code>true</code></li><li>フィルタリングノードの置き換えを無効化します：<code>false</code></li></ul>（コンテナに変数が渡されない場合のデフォルト値は<code>false</code>です。）<br>Wallarmノード名は常に実行中のコンテナの識別子と一致します。Dockerコンテナの識別子が静的であり、新しいバージョンのイメージを含むコンテナなど、フィルタリングノードで別のDockerコンテナを実行しようとしている場合、フィルタリングノードの置き換えは有用です。この場合、変数の値が<code>false</code>の場合、フィルタリングノードの作成プロセスは失敗します。 | No