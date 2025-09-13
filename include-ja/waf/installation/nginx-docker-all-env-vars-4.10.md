環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークンです。 | はい
`WALLARM_LABELS` | <p>ノード4.6以降で利用可能です。`WALLARM_API_TOKEN`が`Deploy`ロールを持つ[APIトークン][api-token]に設定されている場合にのみ機能します。ノードインスタンスのグルーピング用に`group`ラベルを設定します。例えば:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...は、ノードインスタンスを`<GROUP>`インスタンスグループ（既存、または存在しない場合は作成されます）に配置します。</p> | はい（APIトークンの場合）
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>US Cloud向けは`us1.api.wallarm.com`</li><li>EU Cloud向けは`api.wallarm.com`</li></ul>デフォルト: `api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block` 不正リクエストをブロックします</li><li>`safe_blocking` [グレーリストに登録されたIPアドレス][graylist-docs]から発生した不正リクエストのみをブロックします</li><li>`monitoring` リクエストを解析しますがブロックしません</li><li>`off` トラフィックの解析と処理を無効化します</li></ul>デフォルト: `monitoring`。<br>[フィルタリングモードの詳細な説明→][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意の識別子です。値は`0`を除く正の整数です。<br><br>デフォルト値（変数がコンテナに渡されない場合）は`-1`で、Wallarm Console → **Settings** → **Application**に表示される**デフォルト**アプリケーションを示します。<br><br>[アプリケーションの設定の詳細→][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリ量][allocating-memory-guide]です。値は整数または浮動小数点数（小数点はドット<code>.</code>）にできます。デフォルト: 1ギガバイト。 | いいえ
`NGINX_PORT` | NGINXがDockerコンテナ内で使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`以降、[`wallarm-status`][node-status-docs]サービスはNGINXと同じポートで自動的に実行されます。<br><br>デフォルト値（変数がコンテナに渡されない場合）は`80`です。<br><br>構文は`NGINX_PORT='443'`です。 | いいえ
<a name="wallarm-status-allow-env-var"></a>`WALLARM_STATUS_ALLOW` | Dockerコンテナ外部から[`/wallarm-status`エンドポイント][node-status-docs]へアクセスできるカスタムCIDRです。値の例: `10.0.0.0/8`。複数の値を渡す必要がある場合は、区切り文字としてカンマ`,`を使用してください。サービスへ外部からアクセスするには、`/wallarm-status`エンドポイントのパスを指定し、DockerコンテナのIPを使用してください。 | いいえ
`DISABLE_IPV6`| 空でない任意の値が設定されている場合、NGINX設定ファイルから`listen [::]:80 default_server ipv6only=on;`行を削除し、NGINXによるIPv6接続の処理を停止します。<br><br>この変数が明示的に指定されていない、または空の値`""`の場合、NGINXはIPv6とIPv4の両方の接続を処理します。 | いいえ
`WALLARM_APIFW_ENABLE` | この設定はリリース4.10以降で利用可能な[API仕様の強制][api-policy-enf-docs]をオンまたはオフに切り替えます。なお、この機能を有効化しても、必要なサブスクリプションおよびWallarm Console UIでの設定の代替にはなりません。<br><br>デフォルト値は`true`で、機能を有効にします。 | いいえ