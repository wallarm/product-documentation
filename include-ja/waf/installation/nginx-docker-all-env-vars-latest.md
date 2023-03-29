環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークン。<br><div class="admonition info"> <p class="admonition-title">複数のインストールに1つのトークンを使用する</p> <p>選択したプラットフォームに関係なく、複数のインストールで1つのトークンを使用できます。これにより、Wallarm Console UIでノードインスタンスを論理的にグループ化できます。例：開発環境に複数のWallarmノードをデプロイし、各ノードは特定の開発者が所有する独自のマシンにあります。</p></div> | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm API サーバー:<ul><li>`us1.api.wallarm.com` 米国クラウド向け</li><li>`api.wallarm.com` EUクラウド向け</li></ul>デフォルト: `api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block` 悪意のあるリクエストをブロックする</li><li>`safe_blocking` [グレーリストにあるIPアドレス][graylist-docs]から発生した悪意のあるリクエストのみをブロックする</li><li>`monitoring` リクエストを分析するがブロックしない</li><li>`off` トラフィックの分析および処理を無効にする</li></ul>デフォルト: `monitoring`。<br>[フィルタリングモードの詳細説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護対象アプリケーションの一意の識別子。値は `0` を除く正の整数であることができます。<br><br>デフォルト値（コンテナに変数が渡されない場合）は `-1` で、Wallarm Console → **設定** → **アプリケーション** に表示される**デフォルト**アプリケーションを示します。<br><br>[アプリケーションの設定方法の詳細 →][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられる[メモリの量][allocating-memory-guide]。値は整数または小数（デシマルセパレータには<code>.</code>を使用）であることができます。デフォルト: 0.2 ギガバイト。 | いいえ
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ `4.0.2-1`からは、[`wallarm-status`][node-status-docs] サービスがNGINXと同じポートで自動的に実行されます。<br><br>デフォルト値（コンテナに変数が渡されない場合）は `80` です。<br><br>構文は `-e NGINX_PORT='443'` です。 | いいえ
`DISABLE_IPV6`| この変数に空でない値が設定されている場合、`listen [::]:80 default_server ipv6only=on;` 行はNGINX設定ファイルから削除され、NGINXはIPv6接続処理を停止します。<br><br>変数が明示的に指定されていない場合、または空の値 `""` を持っている場合、NGINXはIPv6とIPv4の両方の接続を処理します。| いいえ