##   Additional Settings

The filter node may require some additional configuration after installation.

The document below lists a few of the typical setups that you can apply if needed.

To get more information about other available settings, proceed to the “Configuration” section of the [Administrator’s Guide](admin-intro-en.md).

### Configuring the Display of the Client's Real IP

If the filter node is deployed behind a proxy server or load balancer without any additional configuration, the request source address may not be equal to the actual IP address of the client. Instead, it may be equal to one of the IP addresses of the proxy server or the load balancer.

In this case, if you want the filter node to receive the client's IP address as a request source address, you need to perform an [additional configuration](using-proxy-or-balancer-en.md) of the proxy server or the load balancer.

### Adding Wallarm Scanner Addresses to the Whitelist

The Wallarm scanner checks the resources of your company for vulnerabilities. Scanning is conducted using IP addresses from one of the following lists (depending on the type of Wallarm Cloud you are using):
* [EU scanner addresses for EU Cloud users](scanner-address-eu-cloud.md)
* [US scanner addresses for US Cloud users](scanner-address-us-cloud.md)

If you are using the Wallarm scanner, you need to configure the whitelists on your network scope security software (such as firewalls, intrusion detection systems, etc.) to contain Wallarm scanner IP addresses.

For example, a Wallarm filter node with default settings is placed in the blocking mode, thus rendering the Wallarm scanner unable to scan the resources behind the filter node.

To make the scanner operational again, [whitelist the scanner's IP addresses](scanner-ips-whitelisting.md) on this filter node.

### Limiting the Single Request Processing Time

Use the [`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) Wallarm directive to specify the limit of the duration for processing a single request by the filter node.

If processing the request consumes more time than specified in the directive, then the information on the error is entered into the log file and the request is marked as an `overlimit_res` attack.

### Limiting the Server Reply Waiting Time

Use the [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) NGINX directive to specify the timeout for reading the proxy server reply.

If the server sends nothing during this time, the connection is closed.

### Limiting the Maximum Request Size

Use the [`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) NGINX directive to specify the limit for the maximum size of the body of the client's request.

If this limit is exceeded, NGINX replies to the client with the `413` (`Payload Too Large`) code, also known as the `Request Entity Too Large` message.