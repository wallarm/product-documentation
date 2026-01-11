# Custom Keepalive Settings <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Keepalive settings control how upstream connections are reused to improve performance in Edge Inline deployments.

## How it works

These settings define the behavior of idle connections between the NGINX proxy and upstream servers. By reusing TCP connections, they reduce connection overhead and improve response times for repeated requests.

The Edge Inline deployment uses the following [keepalive settings](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive):

| Setting | Description | Default |
| --------- | ----------- | ------- |
| `keepalive` | The maximum number of idle keepalive connections to upstream servers that are preserved in the cache of each worker process. [More details](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive) | `32` |
| `keepalive_requests` | The maximum number of requests that can be served through one keepalive connection. After the maximum number of requests is made, the connection is closed. [More details](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive_requests) | `1000` |
| `keepalive_time` | The maximum time during which requests can be processed through one keepalive connection. [More details](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive_time) | `1h` |
| `keepalive_timeout` | A timeout during which an idle keepalive connection to an upstream server will stay open. [More details](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive_timeout) | `60s` |

## Using custom keepalive settings

If needed, you can enable custom keepalive settings and adjust their values to fit your workload.

When configuring custom keepalive settings, it is important to choose values carefully to avoid exhausting server resources. Consider the following points:

* Reducing `keepalive_timeout` can free up resources, but it may reduce the benefits of TCP connection reuse.
* Increasing `keepalive_requests` allows more requests over the same connection but keeps connections open longer.

Keepalive may not be suitable in these cases:

* The server has limited memory resources.
* The website handles a very high number of clients with few repeat requests, where connection reuse provides little benefit.

![!](../../../images/waf-installation/security-edge/inline/keepalive.png)