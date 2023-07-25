デプロイメントが完了しました。フィルタリングノードはデプロイメント後に追加の設定を必要とする場合があります。

Wallarmの設定は、[NGINX directives][wallarm-nginx-directives]またはWallarm Console UIを使用して定義されます。ディレクティブはWallarmインスタンス上の以下のファイルで設定するべきです:

* `/etc/nginx/sites-enabled/default`はNGINXの設定を定義します。
* `/etc/nginx/conf.d/wallarm.conf`はWallarmフィルタリングノードの全体設定を定義します。
* `/etc/nginx/conf.d/wallarm-status.conf`はフィルタリングノード監視サービス設定を定義します。
* `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool` はTarantoolデータベース設定を持ちます。

これらのファイルを変更するか、自身の設定ファイルを作成してNGINXとWallarmの操作を定義することができます。同様に処理すべきドメインの各グループに対して`server`ブロックを持つ別の設定ファイルを作成することをお勧めします(例えば `example.com.conf`)。NGINX設定ファイルの操作についての詳細は、 [公式のNGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)に進んでください。

!!! info "設定ファイルの作成"
    カスタム設定ファイルを作る際には、NGINXが空きポートでの接続をリッスンするようにしてください。

以下に、必要に応じて適用できる典型的な設定をいくつか示します:

* [Wallarmノードの自動スケーリング][autoscaling-docs]
* [クライアントの実際のIPの表示][real-ip-docs]
* [Wallarmノードへのリソースの割り当て][allocate-memory-docs]
* [単一のリクエストの処理時間の制限][limiting-request-processing]
* [サーバ応答待ち時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarmノードのログ作成][logs-docs]
