The deployment is now complete. The filtering node may require some additional configuration after deployment.

Wallarm settings are defined using the [NGINX directives][wallarm-nginx-directives] or the Wallarm Console UI. Directives should be set in the following files on the Wallarm instance:

* `/etc/nginx/sites-enabled/default` defines the configuration of NGINX
* `/etc/nginx/conf.d/wallarm.conf` defines the global configuration of Wallarm filtering node
* `/etc/nginx/conf.d/wallarm-status.conf` defines the filtering node monitoring service configuration
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` with the Tarantool database settings

You can modify the listed files or create your own configuration files to define the operation of NGINX and Wallarm. It is recommended to create a separate configuration file with the `server` block for each group of the domains that should be processed in the same way (e.g. `example.com.conf`). To see detailed information about working with NGINX configuration files, proceed to the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).

!!! info "Creating a configuration file"
    When creating a custom configuration file, make sure that NGINX listens to the incoming connections on the free port.

Below there are a few of the typical settings that you can apply if needed:

* [Wallarm node auto-scaling][autoscaling-docs]
* [Displaying the client's real IP][real-ip-docs]
* [Allocating resources for Wallarm nodes][allocate-memory-docs]
* [Limiting the single request processing time][limiting-request-processing]
* [Limiting the server reply waiting time](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limiting the maximum request size](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Wallarm node logging][logs-docs]
