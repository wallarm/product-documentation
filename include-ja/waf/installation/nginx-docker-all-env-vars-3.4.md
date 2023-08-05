環境変数 | 説明| 必須
--- | ---- | ----
`DEPLOY_USER` | Wallarmコンソールの**Deploy**または**Administrator**ユーザーアカウントのメール。| はい
`DEPLOY_PASSWORD` | Wallarmコンソールの**Deploy**または**Administrator**ユーザーアカウントのパスワード。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | WallarmのAPIサーバ:<ul><li>`us1.api.wallarm.com` はUSクラウド用</li><li>`api.wallarm.com` はEUクラウド用</li></ul>デフォルトは `api.wallarm.com`です。 | いいえ
`WALLARM_MODE` | ノードモード:<ul><li>`block`で悪意のあるリクエストをブロック</li><li>`safe_blocking`は[グレーリストのIPアドレス][graylist-docs]から発生した悪意のあるリクエストのみブロック</li><li>`monitoring`でリクエストを分析するだけでブロックしない</li><li>`off`でトラフィックの分析と処理を無効にする</li></ul>デフォルトは `monitoring`です。<br>[フィルターモードの詳しい説明 →][filtration-modes-docs] | いいえ
`WALLARM_APPLICATION` | Wallarm Cloudで使用される保護対象アプリケーションの一意の識別子。値は `0`以外の正の整数であることが可能です。<br><br>デフォルト値(もし変数がコンテナに渡されない場合) は `-1`で、Wallarmコンソールー＞設定ー＞アプリケーションに表示される **デフォルト**のアプリケーションを示します。<br><br>[アプリケーションの設定に関する詳細 →][application-configuration]<div class="admonition info"> <p class="admonition-title">変数 `WALLARM_APPLICATION` のサポート </p> <p>`WALLARM_APPLICATION`変数のサポートはDockerイメージのバージョン `3.4.1-1`から開始されます。</div> | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられる[メモリの量][allocating-memory-guide]です。値は整数または浮動小数点数(ピリオド<code>.</code>が10進数区切りとなる) です。デフォルトは0.2ギガバイトです。 | いいえ
`DEPLOY_FORCE` | 実行しているコンテナの識別子と一致する既存のWallarmノード名がある場合、新しいものに置き換えます。以下の値を変数に割り当てることができます：<ul><li>`真`でフィルタリングノードを置き換える</li><li>`偽`でフィルタリングノードの置換を無効にする</li></ul>デフォルト値(もし変数がコンテナに渡されない場合) は `偽`です。<br>Wallarmノード名は常に実行しているコンテナの識別子と一致します。Dockerコンテナの識別子が環境で静的であり、フィルタリングノードがある別のDockerコンテナを実行しようとしている場合、フィルタリングノードの置き換えが有用です（例えば、新しいバージョンのイメージがあるコンテナ）。このケースでは変数の値が `偽`だと、フィルタリングノードの作成プロセスが失敗します。 | いいえ