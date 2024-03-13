環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm ノードまたは API トークン。 | はい
`WALLARM_LABELS` | <p>ノード 4.6 から利用可能。`WALLARM_API_TOKEN` が `Deploy` 役割を持つ [API トークン][api-token] に設定されている場合にのみ機能します。ノードインスタンスのグルーピングのための `group` ラベルを設定します。例えば：</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...はノードインスタンスを `<GROUP>` インスタンスグループに配置します（存在する場合、または、存在しない場合は作成されます）。</p> | API トークンには必須
`NGINX_BACKEND` | Wallarm ソリューションで保護するリソースのドメインまたは IP アドレス。 | はい
`WALLARM_API_HOST` | Wallarm API サーバー：<ul><li>`us1.api.wallarm.com` アメリカ クラウド用</li><li>`api.wallarm.com` ヨーロッパ クラウド用</li></ul>デフォルト：`api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block` 不正なリクエストをブロックする</li><li>`safe_blocking` [グレイリストに登録された IP アドレス][graylist-docs] からの不正なリクエストのみをブロックする</li><li>`monitoring` リクエストを分析するがブロックしない</li><li>`off` トラフィックの分析および処理を無効にする</li></ul>デフォルト: `monitoring`。<br>[フィルタリングモードの詳細説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloud で使用される保護されたアプリケーションのユニークな識別子。値は `0` を除く正の整数であることができます。<br><br>デフォルト値（変数がコンテナに渡されない場合）は `-1` で、Wallarm Console → **Settings** → **Application** に表示される **デフォルト** アプリケーションを示します。<br><br>[アプリケーション設定の詳細 →][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | Tarantool に割り当てられる [メモリの量][allocating-memory-guide]。値は整数または浮動小数点数(小数点は <code>.</code> で区切ります) です。デフォルト：0.2 ギガバイト。 | いいえ
`NGINX_PORT` | Docker コンテナ内で NGINX が使用するポートを設定します。<br><br>Docker イメージ `4.0.2-1` から、[`wallarm-status`][node-status-docs] サービスは NGINX と同じポートで自動的に実行されます。<br><br>デフォルト値（変数がコンテナに渡されない場合）は `80` です。<br><br>構文は `NGINX_PORT='443'` です。 | いいえ
`WALLARM_STATUS_ALLOW` | Docker コンテナの外から [`/wallarm-status` エンドポイント][node-status-docs] にアクセスできるカスタムCIDR。例の値：`10.0.0.0/8`。複数の値を渡す必要がある場合は、カンマ `,` を区切り文字として使用してください。サービスに外部からアクセスするには、Docker コンテナの IP を使用し、`/wallarm-status` エンドポイントパスを指定します。 | いいえ
`DISABLE_IPV6`| 任意の値（空でない場合）を持つ変数は、NGINX 設定ファイルから `listen [::]:80 default_server ipv6only=on;` 行を削除し、NGINX による IPv6 接続の処理を停止します。<br><br>変数が明示的に指定されていない場合や空の値 `""` を持っている場合、NGINX は IPv6 と IPv4 の接続を両方処理します。 | いいえ