環境変数 | 説明 | 必須
--- | --- | ---
`WALLARM_API_TOKEN` | WallarmのノードまたはAPIトークン。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com`はUSクラウド向け</li><li>`api.wallarm.com`はEUクラウド向け</li></ul>デフォルトは `api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block`は悪意のあるリクエストをブロックする</li><li>`safe_blocking`は[グレーリストに登録されたIPアドレス][graylist-docs]から発生した悪意のあるリクエストのみをブロックする</li><li>`monitoring`はリクエストを分析するがブロックはしない</li><li>`off`はトラフィックの分析と処理を停止する</li></ul>デフォルトは`monitoring`。<br>[フィルタリングモードの詳細説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | 保護されたアプリケーションの一意の識別子。値は`0`を除く正の整数であることができます。<br><br>デフォルトの値（もし変数がコンテナに渡されない場合）は`-1`で、これはWallarm Console → **Settings** → **Application**に表示される**デフォルト**のアプリケーションを示します。<br><br>[アプリケーションの設定についての詳細 →][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられる[メモリの量][allocating-memory-guide]。値は整数または浮動小数点数（<code>.</code>は小数点として扱われます）。デフォルトは 0.2ギガバイト。 | いいえ
`NGINX_PORT` | NGINXがDockerコンテナ内で使用するポートを設定します。<br><br>Dockerイメージ `4.0.2-1`からは、[`wallarm-status`][node-status-docs] サービスは自動的にNGINXと同じポートで実行します。<br><br>デフォルトの値（もし変数がコンテナに渡されない場合）は `80`。<br><br>構文は `NGINX_PORT='443'`。 | いいえ
`DISABLE_IPV6`|  任意の値を持つこの変数は、`listen [::]:80 default_server ipv6only=on;`ラインをNGINX設定ファイルから削除し、NGINXがIPv6接続を処理するのを停止します。<br><br>もし変数が明示的に指定されていない、または空の値`""`を持つ場合、NGINXはIPv6とIPv4の両方の接続を処理します。 | いいえ
`WALLARM_LABELS` | <p>ノード 4.6から利用可能。`WALLARM_API_TOKEN`が`Deploy`ロールを持つ[APIトークン][api-token]に設定されている場合のみ有効。ノードインスタンスのグループ化のために`group`ラベルを設定します。 例:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p><p>...はノードインスタンスを`<GROUP>`インスタンスグループ（既存、または存在しない場合は作成）に配置します。</p> | はい（APIトークンの場合）
