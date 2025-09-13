デプロイが完了しました。フィルタリングノードは、デプロイ後に追加の設定が必要になる場合があります。

Wallarmの設定は、[NGINXディレクティブ][wallarm-nginx-directives]またはWallarm Console UIを使用して定義します。ディレクティブはWallarmインスタンス上の以下のファイルに設定します:

* `/etc/nginx/sites-enabled/default`はNGINXの設定を定義します
* `/etc/nginx/conf.d/wallarm.conf`はWallarmフィルタリングノードのグローバル設定を定義します
* `/etc/nginx/conf.d/wallarm-status.conf`はフィルタリングノードの監視サービスの設定を定義します
* `/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`はTarantoolデータベースの設定を定義します

NGINXとWallarmの動作を定義するために、上記のファイルを変更するか、独自の設定ファイルを作成できます。同一の方法で処理する必要があるドメインの各グループごとに、`server`ブロックを含む個別の設定ファイル(例: `example.com.conf`)を作成することを推奨します。NGINXの設定ファイルの取り扱いに関する詳細は、[公式のNGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)をご覧ください。

!!! info "設定ファイルの作成"
    独自の設定ファイルを作成する際は、NGINXが空いているポートで受信接続を待ち受けるようにしてください。

以下は必要に応じて適用できる一般的な設定です:

* [Wallarmノードのオートスケーリング][autoscaling-docs]
* [クライアントの実IPアドレスの表示][real-ip-docs]
* [Wallarmノードへのリソース割り当て][allocate-memory-docs]
* [単一リクエストの処理時間の制限][limiting-request-processing]
* [サーバーの応答待機時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarmノードのログ記録][logs-docs]