デプロイが完了しました。フィルタリングノードは、デプロイ後に追加の設定が必要になる場合があります。

Wallarmの設定は、[NGINXディレクティブ][wallarm-nginx-directives]またはWallarm Console UIを使用して定義します。ディレクティブはWallarmインスタンス上の次のファイルで設定します:

* `/etc/nginx/sites-enabled/default` はNGINXの設定を定義します
* `/etc/nginx/conf.d/wallarm.conf` はWallarmフィルタリングノードのグローバル設定を定義します
* `/etc/nginx/conf.d/wallarm-status.conf` はフィルタリングノードの監視サービス設定を定義します
* `/opt/wallarm/wstore/wstore.yaml` はpostanalyticsサービス（wstore）の設定を定義します

上記のファイルを変更するか、独自の設定ファイルを作成して、NGINXとWallarmの動作を定義できます。同じ方法で処理する必要があるドメイングループごとに、`server`ブロックを含む個別の設定ファイル（例: `example.com.conf`）を作成することを推奨します。NGINXの設定ファイルの扱いに関する詳細は、[公式のNGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

!!! info "設定ファイルの作成"
    カスタム設定ファイルを作成する際は、NGINXが空きポートで受信接続を待ち受けるように設定されていることを確認してください。

以下は、必要に応じて適用できる一般的な設定の例です:

* [Wallarmノードのオートスケーリング][autoscaling-docs]
* [クライアントの実IPの表示][real-ip-docs]
* [Wallarmノードへのリソース割り当て][allocate-memory-docs]
* [単一リクエストの処理時間の制限][limiting-request-processing]
* [サーバー応答待機時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [リクエスト最大サイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarmノードのログ記録][logs-docs]