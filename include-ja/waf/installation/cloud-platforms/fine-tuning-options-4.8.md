デプロイメントが完了しました。フィルタリングノードは、デプロイメント後に追加の設定が必要になる場合があります。

Wallarmの設定は、[NGINX指示文][wallarm-nginx-directives]またはWallarmコンソールUIを使用して定義されます。指示文は、Wallarmインスタンス上の以下のファイルに設定されるべきです：

* `/etc/nginx/sites-enabled/default` はNGINXの設定を定義します
* `/etc/nginx/conf.d/wallarm.conf` はWallarmフィルタリングノードのグローバル設定を定義します
* `/etc/nginx/conf.d/wallarm-status.conf` はフィルタリングノードの監視サービス設定を定義します
* `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool` はTarantoolデータベースの設定を持ちます

NGINXとWallarmの動作を定義するために、上記のファイルを変更したり、独自の設定ファイルを作成することができます。同じ方法で処理すべきドメインのグループごとに `server` ブロックを含む別の設定ファイルを作成することをお勧めします（例：`example.com.conf`）。NGINX設定ファイルの詳細な情報については、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

!!! info "設定ファイルの作成"
    カスタム設定ファイルを作成する際は、NGINXが空いているポートでの受信接続をリッスンするようにしてください。

以下に、必要に応じて適用可能な典型的な設定をいくつか示します：

* [Wallarmノードの自動スケーリング][autoscaling-docs]
* [クライアントのリアルIPの表示][real-ip-docs]
* [Wallarmノード用のリソースの割り当て][allocate-memory-docs]
* [単一リクエストの処理時間の制限][limiting-request-processing]
* [サーバーの応答待ち時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarmノードのログの記録][logs-docs]