```markdown
環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークンです。<br><div class="admonition info"> <p class="admonition-title">Wallarm Cloudへのアクセスを構成していた以前の変数</p> <p>バージョン4.0のリリース前は、`WALLARM_API_TOKEN`以前の変数は`DEPLOY_USERNAME`および`DEPLOY_PASSWORD`でした。新しいリリース以降は、Wallarm Cloudへのアクセスにトークンベースの新しい方式を使用することを推奨します。 [ノードの新バージョンへの移行に関する詳細](/updating-migrating/docker-container/)</p></div> | Yes
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレスです。 | Yes
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com`はUS Cloud用です</li><li>`api.wallarm.com`はEU Cloud用です</li></ul>デフォルト: `api.wallarm.com`です。 | No
`WALLARM_MODE` | ノードモード:<ul><li>`block`は悪意のあるリクエストをブロックします。</li><li>`safe_blocking`は[グレイリストに登録されたIPアドレス][graylist-docs]から発信された悪意のあるリクエストのみをブロックします。</li><li>`monitoring`はリクエストを解析しますが、ブロックはしません。</li><li>`off`はトラフィックの解析および処理を無効にします。</li></ul>デフォルト: `monitoring`です。<br>[フィルトレーションモードの詳細説明 →][filtration-modes-docs] | No
`WALLARM_APPLICATION` | Wallarm Cloudで使用する保護対象アプリケーションの一意の識別子です。値は0を除く正の整数です。<br><br>コンテナに変数が渡されない場合のデフォルト値は`-1`で、これはWallarm Console → **Settings** → **Application**に表示される**デフォルト**アプリケーションを示します。<br><br>[アプリケーションの設定に関する詳細 →][application-configuration] | No
`TARANTOOL_MEMORY_GB` | [Tarantoolに割り当てられるメモリ量][allocating-memory-guide]です。値は整数または小数で指定でき（小数点はドット<code>.</code>です）。デフォルト: 0.2ギガバイトです。 | No
`NGINX_PORT` | Dockerコンテナ内でNGINXが使用するポートを設定します。<br><br>Dockerイメージ`4.0.2-1`以降、[`wallarm-status`][node-status-docs]サービスは自動的にNGINXと同じポートで実行されます。<br><br>コンテナに変数が渡されない場合のデフォルト値は`80`です。<br><br>構文は`NGINX_PORT='443'`です。 | No
`DISABLE_IPV6` | この変数に空でない任意の値が設定されると、NGINX構成ファイルから`listen [::]:80 default_server ipv6only=on;`行が削除され、NGINXのIPv6接続処理が停止します。<br><br>変数が明示的に指定されないか、空の値`""`の場合、NGINXはIPv6およびIPv4の両方の接続を処理します。 | No
```