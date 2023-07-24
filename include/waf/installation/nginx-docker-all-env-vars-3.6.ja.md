環境変数 | 説明 | 必要
--- | ---- | ----
`DEPLOY_USER` | Wallarmコンソール内の **Deploy** 又は **Administrator** ユーザーアカウントへのメール。 | はい
`DEPLOY_PASSWORD` | Wallarmコンソール内の **Deploy** 又は **Administrator** ユーザーアカウントへのパスワード。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com` は、US Cloud向け</li><li>`api.wallarm.com` は、EU Cloud向け</li></ul>デフォルトでは`api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block` は、有害なリクエストをブロック</li><li>`safe_blocking` は、［グレーリストに記載されたIPアドレスから発生した］有害なリクエストのみをブロック</li><li>`monitoring` は、リクエストを解析するがブロックしない</li><li>`off` は、トラフィックの解析と処理を無効にする</li></ul>デフォルトでは`monitoring`。<br>[フィルタリングモードの詳細説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護対象アプリケーションの一意の識別子。 値は`0`以外の正の整数にすることができます。<br><br>デフォルト値（もし変数がコンテナーに渡されていない場合）は`-1`で、Wallarm Console → **Settings** → **Application**に表示される**default**アプリケーションを示します。<br><br>[アプリケーションの設定に関する詳細 →][application-configuration]<div class="admonition info"> <p class="admonition-title">変数`WALLARM_APPLICATION`のサポート</p> <p>変数`WALLARM_APPLICATION`はバージョン`3.4.1-1`のDockerイメージからサポートされています。</div> | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられる[メモリの量][allocating-memory-guide]。 値は整数または浮動小数点数（小数点は`<code>.</code>`）にすることができます。デフォルトでは、0.2ギガバイト。 | いいえ
`DEPLOY_FORCE` | 実行中のコンテナの識別子と一致する既存のWallarmノード名がある場合、新しいものと置き換えます。 以下の値を変数に割り当てることができます:<ul><li>`true`は、フィルタリングノードを置き換えます</li><li>`false`は、フィルタリングノードの置き換えを無効にします</li></ul>デフォルト値（もし変数がコンテナーに渡されていない場合）は`false`です。<br>Wallarmノード名は常に実行中のコンテナの識別子と一致します。フィルタリングノードの置き換えは、環境中のDockerコンテナ識別子が静的で、フィルタリングノードを持つ別のDockerコンテナ（たとえば、新しいバージョンのイメージを持つコンテナ）を実行しようとしている場合に有用です。この場合、変数の値が`false`の場合、フィルタリングノードの作成プロセスは失敗します。 | いいえ
`NGINX_PORT` | <p>Dockerコンテナ内でNGINXが使用するポートを設定します。 これにより、Kubernetesクラスタのポッド内でこのDockerコンテナを[サイドカーコンテナ][about-sidecar-container]として使用するときにポート衝突を回避できます。</p><p>デフォルト値（もし変数がコンテナーに渡されていない場合）は`80`です。</p><p>構文は`NGINX_PORT='443'`です。</p> | いいえ