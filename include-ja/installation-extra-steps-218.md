## 追加設定

フィルタリングノードはインストール後に追加の設定が必要な場合があります。

以下の文書は、必要に応じて適用できる典型的なセットアップのいくつかを示します。

他の利用可能な設定に関する詳細は、[Administrator’s guide](admin-intro-en.md)の**Configuration**セクションをご参照ください。

### クライアントの実際のIPの表示設定

フィルタリングノードがプロキシサーバまたはロードバランサの背後に配置され、追加の設定を行わない場合、リクエストの送信元アドレスは実際のクライアントのIPアドレスと一致しない可能性があります。代わりに、プロキシサーバまたはロードバランサのIPアドレスの1つと一致する場合があります。

この場合、フィルタリングノードがリクエストの送信元アドレスとしてクライアントのIPアドレスを受け取るようにするには、プロキシサーバまたはロードバランサの[追加設定](using-proxy-or-balancer-en.md)を行う必要があります。

### Wallarm Scannerアドレスを許可リストに追加

Wallarm Scannerは、貴社のリソースの脆弱性をチェックします。スキャンは、使用しているWallarm Cloudの種類に応じて、次のいずれかのリストのIPアドレスを使用して実行されます。

* [US Cloudユーザ向けのUS Scannerアドレス](scanner-address-us-cloud.md)
* [EU Cloudユーザ向けのEU Scannerアドレス](scanner-address-eu-cloud.md)

Wallarm Scannerを使用する場合、ネットワークのセキュリティソフトウェア（ファイアウォール、侵入検知システムなど）にWallarm ScannerのIPアドレスを含むように許可リストの設定を行う必要があります。

たとえば、デフォルト設定のWallarmフィルタリングノードはブロッキングモードに配置されるため、Wallarm Scannerはフィルタリングノードの背後にあるリソースをスキャンできなくなります。

Scannerを再び動作させるには、このフィルタリングノードで[ScannerのIPアドレスを許可リストに追加](scanner-ips-allowlisting.md)してください。

### 単一リクエスト処理時間の制限

[`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) Wallarmディレクティブを使用して、フィルタリングノードが単一のリクエストを処理する期間の上限を指定します。

リクエストの処理にディレクティブで指定した時間を超える場合、エラーに関する情報がログファイルに記録され、リクエストは`overlimit_res`攻撃としてマークされます。

### サーバ応答待ち時間の制限

[`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) NGINXディレクティブを使用して、プロキシサーバの応答を読み取る際のタイムアウトを指定します。

この時間内にサーバから何も送信されない場合、接続は切断されます。

### 最大リクエストサイズの制限

[`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) NGINXディレクティブを使用して、クライアントのリクエストボディの最大サイズの上限を指定します。

この上限を超えた場合、NGINXは`413`（Payload Too Large）のコードでクライアントに応答し、`Request Entity Too Large`メッセージとしても知られます。