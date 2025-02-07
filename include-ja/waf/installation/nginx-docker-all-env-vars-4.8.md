Environment variable | Description | Required
--- | --- | ---
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークンです。 | 必須
`WALLARM_LABELS` | <p>ノード4.6から利用可能です。`WALLARM_API_TOKEN`が[APIトークン][api-token]（Deployロールを持つ）として設定されている場合にのみ動作します。ノードインスタンスのグループ化のために`group`ラベルを設定します。例えば：</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>…は、ノードインスタンスを`<GROUP>`インスタンスグループに配置します（既存の場合は配置し、存在しない場合は作成されます）。</p> | 必須（for API tokens）
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | 必須
`WALLARM_API_HOST` | Wallarm APIサーバです:<ul><li>`us1.api.wallarm.com`はUS Cloud向け</li><li>`api.wallarm.com`はEU Cloud向け</li></ul>初期値: `api.wallarm.com`。 | 任意
`WALLARM_MODE` | ノードモード:<ul><li>`block`は悪意のあるリクエストをブロックします</li><li>`safe_blocking`は[graylisted IP addresses][graylist-docs]から発生した悪意のあるリクエストのみをブロックします</li><li>`monitoring`はリクエストを解析しますがブロックしません</li><li>`off`はトラフィックの解析と処理を無効にします</li></ul>初期値: `monitoring`。<br>[フィルトレーションモードの詳細説明→][filtration-modes-docs] | 任意
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意識別子です。値は`0`以外の正の整数です。<br><br>（変数がコンテナに渡されない場合の）初期値は`-1`で、Wallarm Console → **Settings** → **Application**に表示される**デフォルト**アプリケーションを示します。<br><br>[アプリケーションの設定に関する詳細→][application-configuration] | 任意
`TARANTOOL_MEMORY_GB` | [allocating-memory-guide]に記載の、Tarantoolに割り当てるメモリ量です。値は整数または小数（小数点はドット<code>.</code>を使用します）。初期値: 1ギガバイトです。 | 任意
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`以降では、[`wallarm-status`][node-status-docs]サービスが自動的にNGINXと同じポートで実行されます。<br><br>（変数がコンテナに渡されない場合の）初期値は`80`です。<br><br>構文は `NGINX_PORT='443'`です。 | 任意
`WALLARM_STATUS_ALLOW` | Dockerコンテナ外部から[`/wallarm-status` endpoint][node-status-docs]へのアクセスを許可するカスタムCIDRです。例: `10.0.0.0/8`。複数の値を渡す必要がある場合は、コンマ`,`を区切り文字として使用してください。外部からサービスにアクセスするには、DockerコンテナのIPを使用し、`/wallarm-status`エンドポイントパスを指定します。 | 任意
`DISABLE_IPV6` | `DISABLE_IPV6`変数に空でない任意の値が設定されると、NGINX設定ファイルから`listen [::]:80 default_server ipv6only=on;`行が削除され、NGINXのIPv6接続処理が停止されます。<br><br>変数が明示的に指定されていない、または空の値`""`の場合、NGINXはIPv6とIPv4の両方の接続を処理します。 | 任意