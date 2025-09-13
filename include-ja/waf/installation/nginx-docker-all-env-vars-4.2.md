環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークンです。<br><div class="admonition info"> <p class="admonition-title">Wallarm Cloudへのアクセスを構成する従来の変数</p> <p>バージョン4.0のリリース前は、`WALLARM_API_TOKEN`の前身となる変数として`DEPLOY_USERNAME`と`DEPLOY_PASSWORD`が使用されていました。新しいリリース以降は、Wallarm Cloudへのアクセスには新しいトークンベースの方式を使用することを推奨します。[新しいノードバージョンへの移行の詳細](/updating-migrating/docker-container/)</p></div> | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメイン名またはIPアドレスです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>US Cloud向け：`us1.api.wallarm.com`</li><li>EU Cloud向け：`api.wallarm.com`</li></ul>デフォルト：`api.wallarm.com`です。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block`: 悪意のあるリクエストをブロックします</li><li>`safe_blocking`: [グレーリスト化されたIPアドレス][graylist-docs]から発生した悪意のあるリクエストのみをブロックします</li><li>`monitoring`: リクエストを解析しますがブロックしません</li><li>`off`: トラフィックの解析と処理を無効にします</li></ul>デフォルト：`monitoring`です。<br>[フィルタリングモードの詳細 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護対象アプリケーションの一意の識別子です。値は`0`を除く正の整数にできます。<br><br>デフォルト値（変数がコンテナに渡されない場合）は`-1`で、Wallarm Console → **Settings** → **Application**に表示されるデフォルトのアプリケーションを示します。<br><br>[アプリケーションの設定に関する詳細 →][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | [Tarantoolに割り当てるメモリ量][allocating-memory-guide]です。値は整数または浮動小数点数にできます（小数点の区切りにはドット（<code>.</code>）を使用します）。デフォルト：0.2ギガバイトです。 | いいえ
`NGINX_PORT` | NGINXがDockerコンテナ内で使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`以降、[`wallarm-status`][node-status-docs]サービスは自動的にNGINXと同じポートで実行されます。<br><br>デフォルト値（変数がコンテナに渡されない場合）は`80`です。<br><br>構文は`NGINX_PORT='443'`です。 | いいえ
`DISABLE_IPV6`| 空でない任意の値が設定されている場合、この変数はNGINXの設定ファイルから`listen [::]:80 default_server ipv6only=on;`の行を削除し、NGINXによるIPv6接続の処理を停止します。<br><br>変数が明示的に指定されていないか、空の値`""`である場合、NGINXはIPv6とIPv4の両方の接続を処理します。 | いいえ