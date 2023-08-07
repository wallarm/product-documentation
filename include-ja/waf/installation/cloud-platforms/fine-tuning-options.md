デプロイメントは現在完了しております。フィルタリングノードにはデプロイ後に追加で設定を行う必要があるかもしれません。

Wallarmの設定は、[NGINX directives][wallarm-nginx-directives]またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmインスタンスの次のファイルに設定する必要があります:

* `/etc/nginx/sites-enabled/default` は NGINX の設定を定義します
* `/etc/nginx/conf.d/wallarm.conf` は Wallarm フィルタリングノードのグローバル設定を定義します
* `/etc/nginx/conf.d/wallarm-status.conf` はフィルタリングノードの監視サービスの設定を定義します
* `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool`はTarantool データベースの設定をします

上記のファイルを修正したり、NGINXとWallarmの動作を定義するための独自の設定ファイルを作成することができます。同じ方法で処理されるべきドメインのグループごとに `server` ブロックを含む独立した設定ファイルを作成することがお勧めです (例:`example.com.conf`)。NGINX設定ファイルの取り扱いについての詳細な情報が必要な場合は、[公式 NGINX documentation](https://nginx.org/en/docs/beginners_guide.html)をご覧ください。

!!! info "設定ファイルの作成"
    カスタム設定ファイルを作成するときは、NGINXが空きポートで受信接続を聞いていることを確認してください。

以下に、必要に応じて適用できる典型的な設定の一部を示します:

* [Wallarmノードの自動スケーリング][autoscaling-docs]
* [クライアントの実際のIPの表示][real-ip-docs]
* [Wallarmノードのリソース確保][allocate-memory-docs]
* [単一のリクエスト処理時間の制限][limiting-request-processing]
* [サーバ応答待ち時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarmノードのログ記録][logs-docs]