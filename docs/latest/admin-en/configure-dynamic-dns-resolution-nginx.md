# Configuring Dynamic DNS Resolution in NGINX

If the domain name is passed in the `proxy_pass` directive of the NGINX configuration file, then NGINX resolves the IP address of the host only once after the start. If the DNS server changes the IP address of the host, then NGINX will be still using the old IP address until NGINX will be reloaded or restarted. Before that, NGINX will send requests to the wrong IP address.

For example:

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

For dynamic DNS resolution, you can set a `proxy_pass` directive as the variable. In this case, NGINX will use the DNS address that is set in the [`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) directive when calculating the variable.

!!! warning "Impact of dynamic DNS resolution on traffic processing"
    * NGINX configuration with the `resolver` directive and variable in the `proxy_pass` directive slows down request processing since it will be the additional step of dynamic DNS resolution in the request processing.
    * NGINX re‑resolves the domain name when its time-to-life (TTL) expires. By including the `valid` parameter to the `resolver` directive, you can tell NGINX to ignore the TTL and re‑resolve names at a specified frequency instead.
    * If the DNS server is down, NGINX will not process the traffic.

For example:

```bash
location / {
        resolver 172.43.1.2 valid=10s;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! info "Dynamic DNS resolution in NGINX Plus"
    NGINX Plus supports a dynamic resolution of domain names by default.
