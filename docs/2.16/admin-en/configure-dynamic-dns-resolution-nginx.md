# Configuring dynamic DNS resolution in NGINX

If the domain name is passed in the `proxy_pass` directive of the NGINX configuration file, then NGINX resolves the IP address of the host only once after the start. If the DNS server changes the IP address of the host, then NGINX will be still using the old IP address until NGINX will be reloaded or restarted. Before that, NGINX will send requests to the wrong IP address.

For example:

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

For dynamic DNS resolution, you can set a `proxy_pass` directive as the variable. In this case, NGINX will use the DNS address that is set in the [`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) directive when calculating the variable.

For example:

```bash
location / {
        resolver 172.43.1.2;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! info "Dynamic DNS resolution in NGINX Plus"
    NGINX Plus supports a dynamic resolution of domain names by default.
