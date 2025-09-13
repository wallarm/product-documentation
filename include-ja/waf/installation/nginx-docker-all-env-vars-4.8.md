環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークンです。 | はい
`WALLARM_LABELS` | <p>ノード4.6以降で利用可能です。`WALLARM_API_TOKEN`に`Deploy`ロールを持つ[APIトークン][api-token]が設定されている場合にのみ動作します。ノードインスタンスのグルーピング用に`group`ラベルを設定します。例:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...はノードインスタンスを`<GROUP>`インスタンスグループに配置します（既存のグループがある場合はそれに、存在しない場合は作成されます）。</p> | はい（APIトークンの場合）
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul>既定値: `api.wallarm.com`です。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block` 悪意のあるリクエストをブロックします</li><li>`safe_blocking` [グレーリストに登録されたIPアドレス][graylist-docs]からの悪意のあるリクエストのみをブロックします</li><li>`monitoring` リクエストを解析しますがブロックしません</li><li>`off` トラフィックの解析と処理を無効にします</li></ul>既定値: `monitoring`です。<br>[フィルタリングモードの詳細説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意の識別子です。値は`0`を除く正の整数にできます。<br><br>既定値（変数がコンテナに渡されない場合）は`-1`で、Wallarm Console → **Settings** → **Application**に表示される**既定**のアプリケーションを示します。<br><br>[アプリケーションの設定の詳細 →][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | [Tarantoolに割り当てるメモリ量][allocating-memory-guide]です。値は整数または浮動小数点数（小数点記号はドット<code>.</code>）にできます。既定値: 1ギガバイトです。 | いいえ
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`以降、[`wallarm-status`][node-status-docs]サービスはNGINXと同じポートで自動的に実行されます。<br><br>既定値（変数がコンテナに渡されない場合）は`80`です。<br><br>構文は`NGINX_PORT='443'`です。 | いいえ
`WALLARM_STATUS_ALLOW` | Dockerコンテナの外部から[`/wallarm-status`エンドポイント][node-status-docs]にアクセスできるように許可するカスタムCIDRです。例: `10.0.0.0/8`。複数の値を渡す必要がある場合は、区切り文字としてカンマ`,`を使用してください。サービスへ外部からアクセスするには、DockerコンテナのIPを使用し、`/wallarm-status`エンドポイントのパスを指定します。 | いいえ
`DISABLE_IPV6`| 空でない任意の値が設定されている場合、この変数はNGINXの設定ファイルから`listen [::]:80 default_server ipv6only=on;`の行を削除し、NGINXによるIPv6接続の処理を停止します。<br><br>変数が明示的に指定されていない、または空の値`""`である場合、NGINXはIPv6とIPv4の両方の接続を処理します。 | いいえ