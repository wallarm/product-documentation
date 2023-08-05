環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークン。<br><div class="admonition info"> <p class="admonition-title">以前の変数はWallarmクラウドへのアクセスを設定していました</p> <p>バージョン4.0のリリース前、`WALLARM_API_TOKEN` に先行していた変数は `DEPLOY_USERNAME` および `DEPLOY_PASSWORD`でした。新しいリリースからは、Wallarmクラウドへのアクセスに新しいトークンベースのアプローチを使用することを推奨します。 [新しいノードバージョンへの移行に関する詳細](/updating-migrating/docker-container/) </p></div> | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>`us1.api.wallarm.com` はUSクラウド用</li><li>`api.wallarm.com` はEUクラウド用</li></ul> デフォルトは： `api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block` は有害なリクエストをブロックします</li><li>[グレーリストに登録されたIPアドレスから][][graylist-docs]発生した有害なリクエストのみをブロックするには `safe_blocking` を使用します </li><li>`monitoring` はリクエストを分析しますがブロックはしません</li><li>`off` はトラフィックの分析と処理を無効にします</li></ul> デフォルトは： `monitoring`<br>[フィルタリングモードの詳しい説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarmクラウドで使用する保護対象のアプリケーションの一意な識別子。値は `0` を除く正の整数であることができます。<br><br>デフォルトの値（変数がコンテナに渡されない場合）は `-1` で、これはWallarmの **設定**  → **アプリケーション** の **デフォルト** のアプリケーションを示します。<br><br>[アプリケーションの設定に関する詳しい情報 →][application-configuration] | いいえ
`TARANTOOL_MEMORY_GB` | [割り当てられたメモリ量][allocating-memory-guide] のTarantool使用量。値は整数または浮動小数点数（ドット <code>.</code> は小数点として使われる）とすることができます。デフォルトは： 0.2ギガバイト。 | いいえ
`NGINX_PORT` | NGINXがDockerコンテナ内で使用するポートを設定します。<br><br>Dockerイメージ `4.0.2-1`からは、 [`wallarm-status`][node-status-docs]サービスがNGINXと同じポートで自動的に実行されます。<br><br>デフォルトの値（変数がコンテナに渡されない場合）は `80`です。<br><br>構文は `NGINX_PORT='443'`。 | いいえ
`DISABLE_IPV6`| この変数は任意の値を持ち、空でない場合、NGINX設定ファイルから `listen [::]:80 default_server ipv6only=on;` 行が削除され、NGINXによるIPv6接続の処理が停止します。<br><br>変数が明示的に指定されていない場合、または空の値 `""` を持っている場合、NGINXはIPv6およびIPv4の接続を処理します。 | いいえ