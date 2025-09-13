環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークンです。 | はい
`WALLARM_LABELS` | <p>ノード4.6以降で利用可能です。`WALLARM_API_TOKEN`が`Deploy`ロールを持つ[APIトークン][api-token]に設定されている場合にのみ機能します。ノードインスタンスのグルーピング用に`group`ラベルを設定します。例:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...はノードインスタンスを`<GROUP>`インスタンスグループに配置します（既存、または存在しない場合は作成されます）。</p> | はい（APIトークンの場合）
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com`（US Cloud向け）</li><li>`api.wallarm.com`（EU Cloud向け）</li></ul>デフォルト: `api.wallarm.com`です。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block` は悪意のあるリクエストをブロックします</li><li>`safe_blocking` は[グレーリスト化されたIPアドレス][graylist-docs]からの悪意のあるリクエストのみをブロックします</li><li>`monitoring` はリクエストを解析しますが、ブロックしません</li><li>`off` はトラフィックの解析と処理を無効化します</li></ul>デフォルト: `monitoring`です。<br>[フィルタリングモードの詳細 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意の識別子です。値は`0`を除く正の整数を指定できます。<br><br>デフォルト値（変数がコンテナに渡されない場合）は`-1`で、Wallarm Console → **Settings** → **Application**に表示される**デフォルト**のアプリケーションを示します。<br><br>[アプリケーションの設定に関する詳細 →][application-configuration] | いいえ
`SLAB_ALLOC_ARENA` (`TARANTOOL_MEMORY_GB` [NGINX Node 5.x以前][what-is-new-wstore]) | wstoreに割り当てる[メモリ容量][allocating-memory-guide]です。値は浮動小数点数を指定できます（小数点はドット<code>.</code>です）。デフォルト: 1.0（1ギガバイト）です。 | いいえ
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`以降、[`wallarm-status`][node-status-docs]サービスはNGINXと同じポートで自動的に起動します。<br><br>デフォルト値（変数がコンテナに渡されない場合）は`80`です。<br><br>構文は`NGINX_PORT='443'`です。 | いいえ
<a name="wallarm-status-allow-env-var"></a>`WALLARM_STATUS_ALLOW` | Dockerコンテナ外部から[``/wallarm-status``エンドポイント][node-status-docs]へアクセスを許可するカスタムCIDRです。例: `10.0.0.0/8`。複数の値を渡す必要がある場合は、区切り文字としてカンマ`,`を使用します。サービスへ外部からアクセスするには、DockerコンテナのIPを使用し、`/wallarm-status`エンドポイントのパスを指定します。 | いいえ
`DISABLE_IPV6`| 空でない任意の値が設定されたこの変数は、NGINXの設定ファイルから`listen [::]:80 default_server ipv6only=on;`の行を削除し、NGINXによるIPv6接続の処理を停止します。<br><br>変数が明示的に指定されていない、または空値`""`の場合、NGINXはIPv6とIPv4の両方の接続を処理します。 | いいえ
`WALLARM_APIFW_ENABLE` | この設定は、リリース4.10以降で利用可能な[API Specification Enforcement][api-policy-enf-docs]の有効/無効を切り替えます。なお、この機能を有効化しても、必要なサブスクリプションおよびWallarm Console UIからの設定の代替にはなりません。<br><br>デフォルト値は`true`で、有効になっています。 | いいえ
`WALLARM_APID_ONLY`（5.3.7以降） | このモードでは、トラフィックで検出された攻撃は、ノードによってローカルでブロックされます（[有効][filtration-modes]な場合）が、Wallarm Cloudにはエクスポートされません。一方で、[API Discovery][api-discovery-docs]やその他の一部の機能は引き続き完全に機能し、APIインベントリを検出して可視化のためにWallarm Cloudへアップロードします。このモードは、まずAPIインベントリを確認し機微データを特定したうえで、計画的に攻撃データのエクスポートを行いたい方のためのものです。ただし、攻撃のエクスポートを無効にすることはまれです。Wallarmは攻撃データを安全に処理し、必要に応じて[機微な攻撃データのマスキング][sensitive-data-rule]を提供します。[詳細][apid-only-mode-details]<br>デフォルト: `false`です。 | いいえ
`APIFW_METRICS_ENABLED`（6.4.1以降） | API Specification EnforcementモジュールのPrometheusメトリクスを有効にします。<br>デフォルト: `false`（無効）です。 | いいえ
`APIFW_METRICS_HOST`（6.4.1以降） | API Specification Enforcementがメトリクスを公開するホストとポートを定義します。<br>デフォルト: `:9010`です。 | いいえ
`APIFW_METRICS_ENDPOINT_NAME`（6.4.1以降） | API Specification EnforcementのメトリクスエンドポイントのHTTPパスを定義します。<br>デフォルト: `metrics`です。 | いいえ