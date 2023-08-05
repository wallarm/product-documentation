環境変数 | 説明| 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarm コンソールでの **デプロイ** または **管理者** ユーザーアカウントへのメール。| はい
`DEPLOY_PASSWORD` |Wallarm コンソールでの **デプロイ** または **管理者** ユーザーアカウントへのパスワード。 | はい
`NGINX_BACKEND` | Wallarm ソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>`us1.api.wallarm.com` は米国のクラウドのため</li><li>`api.wallarm.com` は欧州のクラウドのため</li></ul>デフォルト： `api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block`で悪意のあるリクエストをブロック</li><li>`monitoring`でリクエストを分析するだけでブロックしない</li><li>`off` はトラフィックの分析と処理を無効にする</li></ul>デフォルト： `monitoring`。 | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられた[メモリ量][allocating-memory-guide]。値は整数または浮動小数点数（ドット<code>.</code>は小数点セパレータ）になります。デフォルト：0.2ギガバイト。 | いいえ
`WALLARM_ACL_ENABLE` | [デフォルト設定][default-ip-blocking-settings]でIPブロック機能を有効化します。以下の値を変数に設定できます：<ul><li>`true`はIPブロック機能を有効化</li><li>`false`はIPブロック機能を無効化</li></ul>コンテナに変数が渡されない場合のデフォルト値は`false`です。<br>カスタム設定でIPブロック機能を有効にするには、適切なNGINX[ディレクティブ][wallarm-acl-directive]を定義し、定義したディレクティブを含む設定ファイルを[マウント][mount-config-instr]してコンテナを実行する必要があります。<div class="admonition warning"><p class="admonition-title">値 `on` / `enabled` / `ok` / `yes`</p><p>フィルタリングノードイメージのバージョン2.16.0-8以降、この変数に`on` / `enabled` / `ok` / `yes`を設定すると、IPブロック機能が無効化されます。最新のイメージバージョンを現在のドキュメントに記載されているようにデプロイし、この変数に値`true`または`false`を渡すことをお勧めします。</div> | いいえ
`DEPLOY_FORCE` | 実行しているコンテナの識別子が既存のWallarmノード名と一致した場合、新しいもので既存のWallarmノードを置き換えます。以下の値を変数に設定できます：<ul><li>`true`はフィルタリングノードを置き換える</li><li>`false`はフィルタリングノードの置き換えを無効化する</li></ul>コンテナに変数が渡されない場合のデフォルト値は`false`です。<br>Wallarmノード名は常に実行しているコンテナの識別子と一致しています。フィルタリングノードの置き換えは、環境のDockerコンテナ識別子が静的で、新しいイメージバージョンを持つフィルタリングノードのある別のDockerコンテナを実行しようとしている場合に便利です。この場合、変数値が`false`の場合、フィルタリングノード作成プロセスは失敗します。| いいえ