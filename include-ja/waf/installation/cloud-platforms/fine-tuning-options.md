デプロイメントが完了しました。フィルタリングノードには、デプロイ後に追加の設定が必要な場合があります。

Wallarmの設定は[NGINX directives][wallarm-nginx-directives]またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmインスタンス内の次のファイルに設定する必要があります:

* `/etc/nginx/sites-enabled/default` はNGINXの設定を定義します
* `/etc/nginx/conf.d/wallarm.conf` はWallarmフィルタリングノードのグローバル設定を定義します
* `/etc/nginx/conf.d/wallarm-status.conf` はフィルタリングノードの監視サービス設定を定義します
* `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool` はTarantoolデータベースの設定を定義します

一覧のファイルを修正するか、独自の設定ファイルを作成してNGINXとWallarmの動作を定義できます。同一の処理が必要なドメイングループ毎に、`server`ブロックを含む個別の設定ファイル（例: `example.com.conf`）を作成することを推奨します。NGINXの設定ファイルの詳細情報については、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)をご覧ください。

!!! info "構成ファイルの作成"
    カスタム構成ファイルを作成する際は、NGINXが使用可能なポートでの接続を受け付けることを確認してください。

以下は、必要に応じて適用可能な典型的な設定のいくつかです:

* [Wallarmノードの自動スケーリング][autoscaling-docs]
* [クライアントの実際のIPの表示][real-ip-docs]
* [Wallarmノードのリソース割り当て][allocate-memory-docs]
* [単一リクエスト処理時間の制限][limiting-request-processing]
* [サーバーの応答待ち時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarmノードのログ記録][logs-docs]