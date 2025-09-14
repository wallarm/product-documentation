# Security Edge Inline NGINX Geçersiz Kılmaları <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Security Edge Inline, ana makine (server) ve location seviyelerinde NGINX yönergelerinin geçersiz kılınmasını destekler. Bu geçersiz kılmalar, uygulamanızın performansını ve istek işleme davranışını ince ayar yapmanıza olanak tanır.

!!! info "Desteklenmeyen yönergeler"
    Varsayılan olarak desteklenmeyen ek yönergelere ihtiyaç duyuyorsanız, support@wallarm.com adresiyle iletişime geçin.

## Sunucu düzeyi yönergeler

Aşağıdaki NGINX yönergeleri her ana makine (server bloğu) için özelleştirilebilir:

| Yönerge | Açıklama | Varsayılan |
| --------- | ----------- | ------- |
| `proxy_buffer_size` | Yanıtın ilk bölümünü okumak için arabellek boyutu. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size) | `8k` |
| `proxy_buffers`| Bir yanıt için arabelleklerin sayısı ve boyutu. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffers) | `8 8k` |
| `proxy_busy_buffers_size` | Meşgul bağlantılar için azami arabellek boyutu. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_busy_buffers_size) | `8k` |
| `proxy_read_timeout` | Kaynak sunucudan yanıt okuma zaman aşımı. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) | `60s` |
| `proxy_request_buffering` | İstek gövdesinin arabelleğe alınmasını etkinleştir/devre dışı bırak. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering) | `on` |
| `proxy_send_timeout` | İsteğin kaynağa iletilmesi için zaman aşımı. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_send_timeout) | `60s` |
| `client_max_body_size` | Azami istek gövdesi boyutu. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) | `1m` |
| `large_client_header_buffers` | Büyük başlıklar için arabelleklerin sayısı ve boyutu. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_core_module.html#large_client_header_buffers) | `4 8k` |
| `proxy_ssl_name` ve `proxy_ssl_server_name` | HTTPS üzerinden kaynağa bağlanırken ana makine adının TLS SNI üzerinden iletilmesine izin verir. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ssl_name)<br><br>Controlled by the **Proxy SSL server name** checkbox in host settings. If enabled:<br>`proxy_ssl_server_name on;`<br>`proxy_ssl_name $http_host;` | Sırasıyla `$proxy_host` ve `off` |

## Location düzeyi yönergeler

Aşağıdaki NGINX yönergeleri her location için özelleştirilebilir:

| Yönerge | Açıklama | Varsayılan |
| --------- | ----------- | ------- |
| `proxy_buffer_size` | Yanıtın ilk bölümünü okumak için arabellek boyutu. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size) | `8k` |
| `proxy_buffers`| Bir yanıt için arabelleklerin sayısı ve boyutu. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffers) | `8 8k` |
| `proxy_busy_buffers_size` | Meşgul bağlantılar için azami arabellek boyutu. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_busy_buffers_size) | `8k` |
| `proxy_read_timeout` | Kaynak sunucudan yanıt okuma zaman aşımı. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) | `60s` |
| `proxy_request_buffering` | İstek gövdesinin arabelleğe alınmasını etkinleştir/devre dışı bırak. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering) | `on` |
| `proxy_send_timeout` | İsteğin kaynağa iletilmesi için zaman aşımı. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_send_timeout) | `60s` |
| `client_max_body_size` | Azami istek gövdesi boyutu. [Daha fazla bilgi](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) | `1m` |