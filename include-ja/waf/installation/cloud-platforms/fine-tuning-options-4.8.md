デプロイは完了しました。フィルタリングノードはデプロイ後に追加の設定が必要になる場合があります。

Wallarmの設定は、[NGINXディレクティブ][wallarm-nginx-directives]またはWallarm Console UIを使用して定義します。ディレクティブは、Wallarmインスタンス上の次のファイルで設定します：

* `/etc/nginx/sites-enabled/default` はNGINXの構成を定義します
* `/etc/nginx/conf.d/wallarm.conf` はWallarmフィルタリングノードのグローバル構成を定義します
* `/etc/nginx/conf.d/wallarm-status.conf` はフィルタリングノードの監視サービス構成を定義します
* `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool` にはTarantoolデータベースの設定が含まれます

NGINXとWallarmの動作を定義するために、上記のファイルを変更するか、独自の構成ファイルを作成できます。同じ方法での処理が必要なドメインのグループごとに、`server`ブロックを含む個別の構成ファイルの作成を推奨します（例：`example.com.conf`）。NGINXの構成ファイルの扱いに関する詳細は、[NGINXの公式ドキュメント](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

!!! info "構成ファイルの作成"
    カスタム構成ファイルの作成時は、NGINXが未使用のポートで着信接続を待ち受けるようにしてください。

以下は、必要に応じて適用可能な一般的な設定です：

* [Wallarmノードのオートスケーリング][autoscaling-docs]
* [クライアントの実IPの表示][real-ip-docs]
* [Wallarmノードへのリソース割り当て][allocate-memory-docs]
* [単一リクエストの処理時間の制限][limiting-request-processing]
* [サーバーからの応答待ち時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarmノードのログ記録][logs-docs]