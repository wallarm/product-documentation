The deployment is now complete. The filtering node may require some additional configuration after deployment.

Wallarm settings are defined using the [NGINX directives](configure-parameters-en.md) or the Wallarm Console UI. Below there are a few of the typical setups that you can apply if needed.

Directives should be set in the following files on the Wallarm instance:

* `/etc/nginx/sites-enabled/default` defines the configuration of NGINX
* `/etc/nginx/conf.d/wallarm.conf` defines the global configuration of Wallarm filtering node
* `/etc/nginx/conf.d/wallarm-status.conf` defines the filtering node monitoring service configuration
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` with the Tarantool database settings

You can modify the listed files or create your own configuration files to define the operation of NGINX and Wallarm. It is recommended to create a separate configuration file with the `server` block for each group of the domains that should be processed in the same way (e.g. `example.com.conf`).

To see detailed information about working with NGINX configuration files, proceed to the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).

!!! info "Creating a configuration file"
    When creating a custom configuration file, make sure that NGINX listens to the incoming connections on the free port.

### Configuring auto-scaling

You can set up Wallarm filtering node [auto scaling](../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md) to make sure that filtering nodes are capable of handling traffic fluctuations, if there are any. Enabling auto scaling allows processing the incoming requests to the application using the filtering nodes even when traffic soars significantly.

### Configuring the display of the client's real IP

If the filtering node is deployed behind a proxy server or load balancer without any additional configuration, the request source address may not be equal to the actual IP address of the client. Instead, it may be equal to one of the IP addresses of the proxy server or the load balancer.

In this case, if you want the filtering node to receive the client's IP address as a request source address, you need to perform an [additional configuration](using-proxy-or-balancer-en.md) of the proxy server or the load balancer.

### Allocating resources for Wallarm nodes

The amount of memory and CPU resources allocated for the filtering node determines the quality and speed of request processing. Read [our guide](../../../admin-en/configuration-guides/allocate-resources-for-node.md) to allocate the optimal memory amount for nodes.

### Limiting the single request processing time

Use the [`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) Wallarm directive to specify the limit of the duration for processing a single request by the filtering node.

If processing the request consumes more time than specified in the directive, then the information on the error is entered into the log file and the request is marked as an `overlimit_res` attack.

### Limiting the server reply waiting time

Use the [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) NGINX directive to specify the timeout for reading the proxy server reply.

If the server sends nothing during this time, the connection is closed.

### Limiting the maximum request size

Use the [`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) NGINX directive to specify the limit for the maximum size of the body of the client's request.

If this limit is exceeded, NGINX replies to the client with the `413` (`Payload Too Large`) code, also known as the `Request Entity Too Large` message.

### Configure logging

Configure the [filtering node variables logging](../../../admin-en/configure-logging.md) using NGINX. This will allow to perform a quick filtering node diagnostics with the help of the NGINX log file.
