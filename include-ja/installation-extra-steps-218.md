##   追加設定

フィルタリングノードは、インストール後に追加の設定が必要になる場合があります。

以下のドキュメントでは、必要に応じて適用できる代表的な設定をいくつか挙げます。

利用可能なその他の設定の詳細については、[管理者ガイド](admin-intro-en.md)の**Configuration**セクションをご参照ください。

### クライアントの実IP表示の設定

フィルタリングノードがプロキシサーバーまたはロードバランサーの背後に追加設定なしでデプロイされている場合、リクエストの送信元アドレスがクライアントの実際のIPアドレスと一致しないことがあります。代わりに、プロキシサーバーまたはロードバランサーのいずれかのIPアドレスになることがあります。

この場合、フィルタリングノードがリクエストの送信元アドレスとしてクライアントのIPアドレスを受け取れるようにするには、プロキシサーバーまたはロードバランサーに対して[追加設定](using-proxy-or-balancer-en.md)を実施する必要があります。

### Wallarm Scannerアドレスの許可リストへの追加

Wallarm Scannerは、お客様の会社のリソースに脆弱性がないかを確認します。スキャンは、使用しているWallarm Cloudの種類に応じて、次のいずれかのリストのIPアドレスを使用して実行されます。

* [US Cloudユーザー向けのUS Scannerアドレス](scanner-address-us-cloud.md)
* [EU Cloudユーザー向けのEU Scannerアドレス](scanner-address-eu-cloud.md)

Wallarm Scannerを使用している場合は、ネットワーク上のセキュリティソフトウェア（ファイアウォール、侵入検知システムなど）の許可リストにWallarm ScannerのIPアドレスを含めるように設定する必要があります。

たとえば、デフォルト設定では、Wallarmフィルタリングノードはblocking modeです。そのため、Wallarm Scannerはフィルタリングノードの背後にあるリソースをスキャンできません。

再びScannerを動作させるには、このフィルタリングノードで[Wallarm ScannerのIPアドレスを許可リストに追加](scanner-ips-allowlisting.md)します。

### 単一リクエストの処理時間を制限する

フィルタリングノードが単一のリクエストを処理する時間の上限を指定するには、Wallarmディレクティブ[`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit)を使用します。

処理時間がディレクティブで指定した値を超えた場合、エラー情報がログファイルに記録され、当該リクエストは`overlimit_res`攻撃としてマークされます。

### サーバー応答待機時間の制限

プロキシサーバーの応答を読み取るタイムアウトを指定するには、NGINXディレクティブ[`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)を使用します。

この時間内にサーバーから何も送信されない場合は、接続が閉じられます。

### リクエスト最大サイズの制限

クライアントリクエストのボディの最大サイズの上限を指定するには、NGINXディレクティブ[`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)を使用します。

この上限を超えると、NGINXはクライアントに`413`（`Payload Too Large`）コード、別名`Request Entity Too Large`メッセージで応答します。