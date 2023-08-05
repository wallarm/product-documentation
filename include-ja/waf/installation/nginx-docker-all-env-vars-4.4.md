環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードのトークン。<br><div class="admonition info"> <p class="admonition-title">複数のインストールに一つのトークンを使用</p> <p>選択したプラットフォームに関係なく、一つのトークンを複数のインストールで使用することができます。これにより、WallarmコンソールUIでノードのインスタンスを論理的にグループ化できます。例：開発環境に複数のWallarmノードをデプロイします、各ノードは特定の開発者が所有する独自のマシン上にあります。</p></div> | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>`us1.api.wallarm.com`がUSクラウドの場合</li><li>`api.wallarm.com`がEUクラウドの場合</li></ul>デフォルトは`api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block`は悪意のあるリクエストをブロックします</li><li>`safe_blocking`は、[グレーリストに掲載されたIPアドレス][graylist-docs]からの悪意のあるリクエストだけをブロックします</li><li>`monitoring`は、リクエストを分析しますが、ブロックはしません</li><li>`off`は、トラフィックの分析と処理を無効にします</li></ul>デフォルトは`monitoring`。<br>[フィルタモードの詳細説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護アプリケーションの一意の識別子。値は`0`を除く整数であることができます。<br><br>変数がコンテナに渡されない場合のデフォルト値は`-1`で、Wallarm Console → **設定** → **アプリケーション**に表示される**デフォルト**アプリケーションを示します。<br><br>[アプリケーションの設定に関する詳細 →][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられた[メモリの量][allocating-memory-guide]。値は整数または浮動小数点数（ドット<code>.</code>が小数点区切り記号）であることができます。デフォルトは0.2ギガバイト。 | いいえ
`NGINX_PORT` | Docker コンテナ内で NGINX が使用するポートを設定します。<br><br>Docker イメージ `4.0.2-1`から、[`wallarm-status`][node-status-docs]サービスはNGINXと同じポートで自動的に実行されます。<br><br>変数がコンテナに渡されない場合のデフォルト値は`80`。<br><br>文法は `NGINX_PORT='443'`です。 | いいえ
`DISABLE_IPV6`| 空以外の任意の値を持つ変数は、NGINX設定ファイルから`listen [::]:80 default_server ipv6only=on;`行を削除し、NGINXがIPv6接続の処理を停止します。<br><br>変数が明示的に指定されていないか空の値`""`の場合、NGINXはIPv6とIPv4の両方の接続を処理します。 | いいえ