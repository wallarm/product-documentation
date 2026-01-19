# Security Edge Inline NGINX Overrides <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Security Edge Inline supports overriding NGINX directives at the host (server) and location levels. These overrides let you fine-tune performance and request handling for your application.

!!! info "Unsupported directives"
    If you require additional directives not suppported by default, contact support@wallarm.com.

## Server-level directives

The following NGINX directives can be customized for each host (server block):

| Directive | Description | Default |
| --------- | ----------- | ------- |
| `proxy_buffer_size` | Buffer size for reading the first part of the response. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size) | `8k` |
| `proxy_buffers`| Number and size of buffers for a response. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffers) | `8 8k` |
| `proxy_busy_buffers_size` | Max size of buffers for busy connections. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_busy_buffers_size) | `8k` |
| `proxy_read_timeout` | Timeout for reading response from the origin server. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) | `60s` |
| `proxy_request_buffering` | Enable/disable buffering of request body. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering) | `on` |
| `proxy_send_timeout` | Timeout for transmitting request to the origin. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_send_timeout) | `60s` |
| `client_max_body_size` | Maximum request body size. [More details](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) | `1m` |
| `large_client_header_buffers` | Number and size of buffers for large headers. [More details](https://nginx.org/en/docs/http/ngx_http_core_module.html#large_client_header_buffers) | `4 8k` |
| `proxy_ssl_name` and `proxy_ssl_server_name` | Allows to pass the host name through TLS SNI when connecting to the origin via HTTPS. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ssl_name)<br><br>Controlled by the **Proxy SSL server name** checkbox in host settings. If enabled:<br>`proxy_ssl_server_name on;`<br>`proxy_ssl_name $http_host;` | `$proxy_host` and `off` correspondingly |

## Location-level directives

The following NGINX directives can be customized for each location:

| Directive | Description | Default |
| --------- | ----------- | ------- |
| `proxy_buffer_size` | Buffer size for reading the first part of the response. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size) | `8k` |
| `proxy_buffers`| Number and size of buffers for a response. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffers) | `8 8k` |
| `proxy_busy_buffers_size` | Max size of buffers for busy connections. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_busy_buffers_size) | `8k` |
| `proxy_read_timeout` | Timeout for reading response from the origin server. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) | `60s` |
| `proxy_request_buffering` | Enable/disable buffering of request body. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering) | `on` |
| `proxy_send_timeout` | Timeout for transmitting request to the origin. [More details](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_send_timeout) | `60s` |
| `client_max_body_size` | Maximum request body size. [More details](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) | `1m` |
| `grpc_buffer_size` | Buffer size for reading responses from the gRPC server. [More details](https://nginx.org/en/docs/http/ngx_http_grpc_module.html#grpc_buffer_size) | `4k|8k` |
| `grpc_read_timeout` | Timeout for reading a response from the gRPC server. [More details](https://nginx.org/en/docs/http/ngx_http_grpc_module.html#grpc_read_timeout) | `60s` |
| `grpc_send_timeout` | Timeout for sending a request to the gRPC server. [More details](https://nginx.org/en/docs/http/ngx_http_grpc_module.html#grpc_send_timeout) | `60s` |
