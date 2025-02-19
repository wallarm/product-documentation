デプロイメントが完了しました。デプロイ後、フィルタリングノードは追加の設定が必要な場合があります。

Wallarmの設定は[NGINX directives][wallarm-nginx-directives]またはWallarm Console UIを使用して定義されます。Wallarmインスタンス上の次のファイルにディレクティブを設定してください:

* `/etc/nginx/sites-enabled/default`はNGINXの設定を定義します。
* `/etc/nginx/conf.d/wallarm.conf`はWallarmフィルタリングノードのグローバル設定を定義します。
* `/etc/nginx/conf.d/wallarm-status.conf`はフィルタリングノードの監視サービスの設定を定義します。
* Tarantoolデータベース設定を含む`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`

これらのファイルを変更するか独自の設定ファイルを作成してNGINXとWallarmの動作を定義することができます。同一の方法で処理すべき各グループのドメインごとに、`server`ブロックを含む別々の設定ファイルを作成することを推奨します（例：`example.com.conf`）。NGINX設定ファイルの取り扱いに関する詳細な情報については[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)をご参照ください。

!!! info "設定ファイルの作成"
    カスタム設定ファイルを作成する場合、NGINXが使用可能なポートで受信接続をリッスンすることを確認してください。

以下は必要に応じて適用できる典型的な設定例です:

* [Wallarmノードの自動スケーリング][autoscaling-docs]
* [クライアントの実際のIPの表示][real-ip-docs]
* [Wallarmノードへのリソース割り当て][allocate-memory-docs]
* [単一リクエスト処理時間の制限][limiting-request-processing]
* [サーバの応答待ち時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarmノードのログ記録][logs-docs]