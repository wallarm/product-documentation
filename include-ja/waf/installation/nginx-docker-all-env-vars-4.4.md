環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークンです。<br><div class="admonition info"> <p class="admonition-title">複数のインストールで1つのトークンを使用する</p> <p>選択したプラットフォームに関係なく、複数のインストールで1つのトークンを使用できます。これにより、Wallarm Console UIでノードインスタンスを論理的にグループ化できます。例: 開発環境に複数のWallarmノードをデプロイし、それぞれのノードは特定の開発者が所有する個別のマシン上にあります。</p></div> | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul>デフォルト: `api.wallarm.com`です。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block` 悪意のあるリクエストをブロックします</li><li>`safe_blocking` [グレーリストに登録されたIPアドレス][graylist-docs]に由来する悪意のあるリクエストのみをブロックします</li><li>`monitoring` リクエストを解析しますがブロックしません</li><li>`off` トラフィックの解析および処理を無効にします</li></ul>デフォルト: `monitoring`です。<br>[フィルタリングモードの詳細→][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意の識別子です。値は`0`を除く正の整数を指定できます。<br><br>デフォルト値(変数がコンテナに渡されない場合)は`-1`で、Wallarm Console → **Settings** → **Application**に表示される**デフォルト**のアプリケーションを示します。<br><br>[アプリケーションの設定の詳細→][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | [メモリ割り当て量][allocating-memory-guide]、Tarantoolに割り当てるメモリ量です。値は整数または浮動小数を指定できます(小数点は<code>.</code>です)。デフォルト: 0.2ギガバイトです。 | いいえ
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`以降、[`wallarm-status`][node-status-docs]サービスはNGINXと同じポートで自動的に実行されます。<br><br>デフォルト値(変数がコンテナに渡されない場合)は`80`です。<br><br>書式は`NGINX_PORT='443'`です。 | いいえ
`WALLARM_STATUS_ALLOW` | Dockerコンテナ外部から[`/wallarm-status`エンドポイント][node-status-docs]へアクセスできるように許可するカスタムCIDRです。例の値: `10.0.0.0/8`です。複数の値を渡す必要がある場合は、区切り文字としてカンマ`,`を使用します。サービスに外部からアクセスするには、DockerコンテナのIPを使用し、`/wallarm-status`エンドポイントのパスを指定します。 | いいえ
`DISABLE_IPV6`| 空でない任意の値をこの変数に設定すると、NGINX設定ファイルから`listen [::]:80 default_server ipv6only=on;`の行が削除され、NGINXによるIPv6接続の処理が停止します。<br><br>変数が明示的に指定されていない、または値が空`""`の場合、NGINXはIPv6とIPv4の両方の接続を処理します。 | いいえ