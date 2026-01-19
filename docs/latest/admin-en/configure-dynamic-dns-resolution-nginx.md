# Configuring Dynamic DNS Resolution in NGINX Open Source and NGINX Plus

This article explains the difference between static and dynamic DNS resolution in NGINX and how to configure dynamic DNS resolution.

NGINX resolves domain names when connecting to upstream servers, and the process differs depending on whether DNS resolution is static or dynamic.

## Static DNS resolution

With static DNS resolution, NGINX looks up the IP address only once when it starts. If the DNS record changes, NGINX continues using the old IP until it is reloaded or restarted.

Example configuration using static DNS resolution:

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

## Dynamic DNS resolution

With dynamic DNS resolution, NGINX periodically re-resolves hostnames at runtime, so it detects IP changes automatically without needing a restart or reload.

!!! info "Open-source NGINX availability"
    Dynamic DNS resolution is available in open-source NGINX since version 1.27.3.

To configure dynamic DNS resolution:

1. Add the `resolve` directive parameter to your upstream [`server`](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server) directive, and use a resolvable hostname as your address:

    ```bash
    server address [parameters] resolve;
    ```

1. Define the DNS server with the [`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) directive:

    ```bash
    resolver address [parameters];
    ```

1. Define the name and size of the shared memory zone using the [`zone`](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#zone) directive. This keeps configuration and runtime state between worker processes:

    ```bash
    zone name [size];
    ```

1. (Optional) Set the resolver timeout using the [`resolver_timeout`](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#resolver_timeout) directive:

    ```bash
    resolver_timeout 10s;
    ```

Below is an example configuration for dynamic DNS resolution:

```bash
http {
    resolver 192.0.2.1 valid=30s;
    resolver_timeout 10s;
    upstream backend {
        zone backend 64k;
        server backend1.example.com resolve;
        server backend2.example.com resolve;
    }
    server {
        location / {
            proxy_pass http://backend;
        }
    }
}
```

!!! warning "Impact of dynamic DNS resolution on traffic processing"
    NGINX re‑resolves domain names when the DNS TTL expires. To instruct NGINX to ignore the TTL and re‑resolve names more often, add the `valid` parameter to the [`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) directive, e.g.:

    ```bash
    resolver 127.0.0.1 [::1]:5353 valid=30s;
    ```
