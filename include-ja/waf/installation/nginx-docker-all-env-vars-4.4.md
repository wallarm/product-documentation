Environment variable | Description | Required
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークンです。<br><div class="admonition info"> <p class="admonition-title">複数のインストールで1つのトークンを使用する</p> <p>選択されたプラットフォームに関係なく、複数のインストールで1つのトークンを使用できます。Wallarm ConsoleのUI上でノードインスタンスを論理的にグループ化できるようにします。例：開発環境に複数のWallarmノードをデプロイする場合、各ノードは特定の開発者が所有する独立したマシン上に存在します。</p></div> | Yes
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | Yes
`WALLARM_API_HOST` | Wallarm APIサーバです：<ul><li>US Cloudの場合は `us1.api.wallarm.com`</li><li>EU Cloudの場合は `api.wallarm.com`</li></ul>デフォルト：`api.wallarm.com`。 | No
`WALLARM_MODE` | ノードモードです：<ul><li>`block` は悪意のあるリクエストをブロックします</li><li>`safe_blocking` は [graylisted IP addresses][graylist-docs] から発生した悪意のあるリクエストのみをブロックします</li><li>`monitoring` はリクエストを解析しますがブロックはしません</li><li>`off` はトラフィック解析および処理を無効にします</li></ul>デフォルトは `monitoring` です。<br>[フィルトレーションモードの詳細な説明→][filtration-modes-docs] | No
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意の識別子です。値は `0` 以外の正の整数でなければなりません。<br><br>（コンテナに変数が渡されない場合の）デフォルト値は `-1` で、Wallarm Console → **Settings** → **Application** に表示される **デフォルト** アプリケーションを示します。<br><br>[アプリケーションの設定方法の詳細→][application-configuration] | No
`TARANTOOL_MEMORY_GB` | [Tarantoolに割り当てられるメモリ量][allocating-memory-guide] です。値は整数または小数で指定できます（小数点の区切りには<code>.</code>を使用します）。デフォルトは0.2ギガバイトです。 | No
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ `4.0.2-1` 以降では、[`wallarm-status`][node-status-docs] サービスがNGINXと同じポートで自動的に実行されます。<br><br>（コンテナに変数が渡されない場合の）デフォルト値は `80` です。<br><br>構文は `NGINX_PORT='443'` となります。 | No
`WALLARM_STATUS_ALLOW` | Dockerコンテナ外から[`/wallarm-status`エンドポイント][node-status-docs]へのアクセスを許可するカスタムCIDRです。例：`10.0.0.0/8`。複数の値を渡す必要がある場合は、カンマ`,`を区切り文字として使用してください。外部からサービスにアクセスする場合は、DockerコンテナのIPを使用し、`/wallarm-status`のエンドポイントパスを指定してください。 | No
`DISABLE_IPV6` | 値が空でない任意の値を持つこの変数は、NGINXの設定ファイルから `listen [::]:80 default_server ipv6only=on;` 行を削除し、NGINXによるIPv6接続処理を停止します。<br><br>変数が明示的に指定されないか、空の値 `""` の場合、NGINXはIPv6およびIPv4の両方の接続を処理します。 | No