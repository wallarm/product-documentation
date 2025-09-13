# Security Edge Inline NGINXディレクティブのオーバーライド <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Security Edge Inlineは、ホスト(server)およびlocationレベルでNGINXディレクティブのオーバーライドをサポートします。これらのオーバーライドにより、アプリケーションのパフォーマンスやリクエスト処理をきめ細かく調整できます。

!!! info "サポート対象外のディレクティブ"
    既定でサポートされていないディレクティブが追加で必要な場合は、support@wallarm.comまでご連絡ください。

## サーバーレベルのディレクティブ

以下のNGINXディレクティブはホスト(serverブロック)ごとにカスタマイズできます。

| ディレクティブ | 説明 | 既定値 |
| --------- | ----------- | ------- |
| `proxy_buffer_size` | レスポンス先頭部分の読み取りに使用するバッファサイズです。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size) | `8k` |
| `proxy_buffers`| レスポンス用バッファの個数とサイズです。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffers) | `8 8k` |
| `proxy_busy_buffers_size` | ビジーな接続に使用されるバッファの最大サイズです。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_busy_buffers_size) | `8k` |
| `proxy_read_timeout` | オリジンサーバーからレスポンスを読み取る際のタイムアウトです。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) | `60s` |
| `proxy_request_buffering` | リクエストボディのバッファリングを有効/無効にします。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering) | `on` |
| `proxy_send_timeout` | オリジンへのリクエスト送信時のタイムアウトです。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_send_timeout) | `60s` |
| `client_max_body_size` | リクエストボディの最大サイズです。 [詳細](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) | `1m` |
| `large_client_header_buffers` | 大きなヘッダー用バッファの個数とサイズです。 [詳細](https://nginx.org/en/docs/http/ngx_http_core_module.html#large_client_header_buffers) | `4 8k` |
| `proxy_ssl_name` および `proxy_ssl_server_name` | HTTPS経由でオリジンに接続する際に、TLS SNIを介してホスト名を渡せます。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ssl_name)<br><br>これはhost settingsの**Proxy SSL server name**チェックボックスで制御されます。有効にすると:<br>`proxy_ssl_server_name on;`<br>`proxy_ssl_name $http_host;` | それぞれ`$proxy_host`および`off`です |

## ロケーションレベルのディレクティブ

以下のNGINXディレクティブはlocationごとにカスタマイズできます。

| ディレクティブ | 説明 | 既定値 |
| --------- | ----------- | ------- |
| `proxy_buffer_size` | レスポンス先頭部分の読み取りに使用するバッファサイズです。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size) | `8k` |
| `proxy_buffers`| レスポンス用バッファの個数とサイズです。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffers) | `8 8k` |
| `proxy_busy_buffers_size` | ビジーな接続に使用されるバッファの最大サイズです。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_busy_buffers_size) | `8k` |
| `proxy_read_timeout` | オリジンサーバーからレスポンスを読み取る際のタイムアウトです。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) | `60s` |
| `proxy_request_buffering` | リクエストボディのバッファリングを有効/無効にします。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering) | `on` |
| `proxy_send_timeout` | オリジンへのリクエスト送信時のタイムアウトです。 [詳細](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_send_timeout) | `60s` |
| `client_max_body_size` | リクエストボディの最大サイズです。 [詳細](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) | `1m` |