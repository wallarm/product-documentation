1. If you have secured communications between clients and the Wallarm Node with an SSL/TLS certificate, edit the [NGINX configuration ](https://nginx.org/en/docs/http/configuring_https_servers.html) to set up [TLS termination][ssl-certificates]:

    * [`ssl_certificate`](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_certificate) - specifies the PEM-format certificate file, including the full certificate chain.
    * [`ssl_certificate_key`](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_certificate_key) - specifies the PEM-format private key file.

1. Update targets of your load balancer to send traffic to the Wallarm instance. For details, refer to the documentation on your load balancer.