環境変数 | 説明 | 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarmコンソールの**Deploy**または**Administrator**ユーザーアカウントへのメール。| はい
`DEPLOY_PASSWORD` | Wallarmコンソールの**Deploy**または**Administrator**ユーザーアカウントのパスワード。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com`：米国クラウド用</li><li>`api.wallarm.com`：欧州クラウド用</li></ul>デフォルト：`api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block`：悪意のあるリクエストをブロックするため</li><li>`monitoring`：リクエストを解析するがブロックしないため</li><li>`off`：トラフィックの分析と処理を無効にするため</li></ul>デフォルト：`monitoring`。 | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリ容量][allocating-memory-guide]。 この値は整数または小数（小数点として<code>.</code>を使用）であることができます。 デフォルト：0.2ギガバイト。| いいえ
`WALLARM_ACL_ENABLE` | [デフォルト設定][default-ip-blocking-settings]でIPブロッキング機能を有効にします。 変数に割り当てることができる値：<ul><li>`true`：IPブロッキング機能を有効にするため</li><li>`false`：IPブロッキング機能を無効にするため</li></ul>変数がコンテナに渡されない場合のデフォルト値は `false` です。<br>カスタム設定でIPブロッキング機能を有効にするには、適切なNGINX[ディレクティブ][wallarm-acl-directive]を定義し、定義されたディレクティブを含む設定ファイルを[マウント][mount-config-instr]し、コンテナを実行する必要があります。<div class="admonition warning"> <p class="admonition-title">Values `on` / `enabled` / `ok` / `yes`</p> <p>フィルタリングノードイメージのバージョン2.16.0-8以降、この変数に`on` / `enabled` / `ok` / `yes`の値が割り当てられると、IPブロック機能が無効になります。 最新のイメージバージョンを現在のドキュメントに記載されているようにデプロイし、この変数に`true`または`false`の値を渡すことをお勧めします。</div> | いいえ
`DEPLOY_FORCE` | 既存のWallarmノードの名前が実行しているコンテナの識別子と一致する場合、新しいWallarmノードで既存のWallarmノードを置き換えます。 変数に割り当てることができる値：<ul><li>`true`：フィルタリングノードを置き換えるため</li><li>`false`：フィルタリングノードの置き換えを無効にするため</li></ul> 変数がコンテナに渡されない場合のデフォルト値は `false` です。<br>Wallarmノード名は常に実行しているコンテナの識別子と一致します。 フィルタリングノードの置き換えは、環境でDockerコンテナ識別子が静的であり、フィルタリングノードを含む別のDockerコンテナを実行しようとしている場合（たとえば、イメージの新しいバージョンを持つコンテナ）に役立ちます。 この場合、変数の値が`false`であると、フィルタリングノードの作成プロセスが失敗します。 | いいえ