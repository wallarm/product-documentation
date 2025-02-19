## 追加設定

フィルタリングノードは、インストール後に追加の設定が必要な場合があります。  
以下のドキュメントでは、必要に応じて適用できる一般的な設定例をいくつか示します。  

他の利用可能な設定に関する詳細情報については、Administrator’s guideの**Configuration**セクションに進んでください。

### クライアントの実際のIP表示の設定

フィルタリングノードがプロキシサーバまたはロードバランサの背後に追加の設定なしで配置されている場合、リクエスト元のアドレスがクライアントの実際のIPアドレスと一致しない可能性があります。代わりに、プロキシサーバまたはロードバランサのいずれかのIPアドレスになる場合があります。  

この場合、フィルタリングノードにリクエスト元アドレスとしてクライアントのIPアドレスを受信させるには、プロキシサーバまたはロードバランサの[追加の設定](using-proxy-or-balancer-en.md)を実施する必要があります。

### 単一リクエスト処理時間の制限

フィルタリングノードが単一のリクエストを処理する時間の上限を指定するには、[`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) Wallarmディレクティブを使用してください。  

リクエストの処理に指定されたよりも多くの時間がかかる場合、エラー情報がログファイルに記録され、リクエストは`overlimit_res`攻撃としてマークされます。

### サーバ応答待ち時間の制限

プロキシサーバの応答を読み取るタイムアウトを指定するには、[`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) NGINXディレクティブを使用してください。  

この時間内にサーバが何も送信しない場合、接続が終了されます。

### 最大リクエストサイズの制限

クライアントのリクエストボディの最大サイズの上限を指定するには、[`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) NGINXディレクティブを使用してください。  

この制限を超えた場合、NGINXはクライアントに`413`（`Payload Too Large`、別名`Request Entity Too Large`）コードで応答します。