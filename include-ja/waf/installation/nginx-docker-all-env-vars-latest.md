```markdown
環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークンです。 | 必須
`WALLARM_LABELS` | <p>4.6ノード以降で利用可能です。`WALLARM_API_TOKEN`が[API token][api-token]に`Deploy`ロール付きで設定されている場合にのみ動作します。ノードインスタンスのグループ化のために`group`ラベルを設定します。たとえば：</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>…は、ノードインスタンスを`<GROUP>`インスタンスグループ（既存の場合、存在しなければ作成されます）に配置します。</p> | APIトークンの場合必須
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | 必須
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>`us1.api.wallarm.com`（US Cloud用）</li><li>`api.wallarm.com`（EU Cloud用）</li></ul>デフォルト値：`api.wallarm.com`。 | 任意
`WALLARM_MODE` | ノードモード：<ul><li>`block`は悪意のあるリクエストをブロックします</li><li>`safe_blocking`は[graylisted IP addresses][graylist-docs]からの悪意のあるリクエストのみをブロックします</li><li>`monitoring`はリクエストを解析するもののブロックしません</li><li>`off`はトラフィックの解析および処理を無効にします</li></ul>デフォルト値：`monitoring`。<br>[フィルトレーションモードの詳細説明 →][filtration-modes-docs] | 任意
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意の識別子です。値は`0`以外の正の整数でなければなりません。<br><br>変数がコンテナに渡されなかった場合のデフォルト値は`-1`で、これはWallarm Console → **Settings** → **Application**に表示される**デフォルト**のアプリケーションを示します。<br><br>[アプリケーションの設定方法の詳細 →][application-configuration] | 任意
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられた[メモリの量][allocating-memory-guide]です。値は整数または浮動小数点数（小数点記号としてピリオド<code>.</code>を使用）で指定できます。デフォルト値：1 gygabytes。 | 任意
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`以降、[`wallarm-status`][node-status-docs]サービスは自動的にNGINXと同じポートで実行されます。<br><br>変数がコンテナに渡されなかった場合のデフォルト値は`80`です。<br><br>構文は`NGINX_PORT='443'`です。 | 任意
<a name="wallarm-status-allow-env-var"></a>`WALLARM_STATUS_ALLOW` | Dockerコンテナ外から[`/wallarm-status` endpoint][node-status-docs]にアクセスすることを許可するカスタムCIDRです。例：`10.0.0.0/8`。複数の値を渡す必要がある場合は、カンマ`,`で区切ってください。サービスに外部からアクセスするには、DockerコンテナのIPを使用し、`/wallarm-status` endpointのパスを指定してください。 | 任意
`DISABLE_IPV6` | 空でない任意の値を持つ変数は、NGINX構成ファイルから`listen [::]:80 default_server ipv6only=on;`行を削除し、NGINXによるIPv6接続の処理を停止します。<br><br>変数が明示的に指定されていないか、空の値`""`の場合、NGINXはIPv6およびIPv4の両方の接続を処理します。 | 任意
`WALLARM_APIFW_ENABLE` | この設定は、リリース4.10以降で利用可能な[API Specification Enforcement][api-policy-enf-docs]をオンまたはオフに切り替えます。この機能を有効にしてもWallarm Console UIで必要なサブスクリプションおよび構成の代わりにはなりませんのでご注意ください。<br><br>デフォルト値は`true`で、機能が有効になっています。 | 任意
```