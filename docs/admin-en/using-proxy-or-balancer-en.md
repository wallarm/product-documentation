[img-events]:               ../images/admin-guides/using-proxy-or-balancer/events-en.png
[img-using-balancer]:       ../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png
[img-using-haproxy]:        ../images/admin-guides/using-proxy-or-balancer/using-haproxy-en.png

[link-haproxy-docs]:        http://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor
[link-nginx-directives]:    https://nginx.org/en/docs/http/ngx_http_realip_module.html
[link-test-attack]:         ../quickstart-en/qs-check-operation-en.md#2-run-a-test-attack

[anchor-configuring-proxy]: #configuring-a-proxy-server-or-load-balancer
[anchor-configuring-node]:  #configuring-the-filter-node

# Settings for Using a Balancer or Proxy in Front of the Filter Node

!!! info "Who's this document for?"
	This document contains information for users who have a proxy server or balancer installed that receives requests and proxies them to the Wallarm filter nodes. 
	
	If your system does not have such a balancer, you can skip this configuration step.

By default, the Wallarm filter node considers the IP address from which the request originated to be the IP address of the request source. If the request passed through a proxy server or load balancer before being sent to the node, the IP address of the balancer will be displayed in the web interface as the IP address of the request source.

![!Using balancer][img-using-balancer]

To correctly display the IP address of the request source in the Wallarm web interface, configure the balancer and the filter node to transmit the IP address of the source in the request header.

The figure below shows an example using the `X-Client-IP` header by the HAProxy server to send the client IP address.

![!Using HAProxy][img-using-haproxy]

To configure sending a client IP address in the request header by a proxy server or a balancer, follow the steps described in the following sections:
1.  [Configuring a proxy server or load balancer][anchor-configuring-proxy]
2.  [Configuring the filter node][anchor-configuring-node]

## Configuring a Proxy Server or Load Balancer

Configure a proxy server or load balancer to write the IP address from which the request was received to the header of this request and send the request with the header to the filter node.

To learn how to configure your proxy server or balancer, refer to its official documentation. The example below demonstrates how to configure the `X-Client-IP` header for the HAProxy balancer.

### HAProxy Balancer Setup Example

The `option forwardfor` directive tells the HAProxy balancer that a header must be added to the request with the IP address of the client. 
You can use the `X-Client-IP` header for this purpose.

In the `/etc/haproxy/haproxy.cfg` configuration file, insert the `option forwardfor` header `X-Client-IP` line into the `backend` directive block, which is responsible for connecting HAProxy to the Wallarm filter node.

!!! info "Details of the directive"
	You can find detailed information about the option forwardfor directive in the official [HAProxy documentation][link-haproxy-docs].

An example fragment of the `/etc/haproxy/haproxy.cfg` configuration file is given below:
``` bash
# Public IP address for receiving requests
frontend my_frontend
	bind <haproxy-ip>
	mode http
	default_backend my_backend

# Backend with the Wallarm filter node
backend my_backend
	mode http
option forwardfor header X-Client-IP
server wallarm-node <node-ip>
```

In the example above
*   `<haproxy-ip>` is the IP address of the HAProxy server to receive client requests;
*   `<node-ip>` is the IP address of the Wallarm filter node to receive requests from the HAProxy server.

## Configuring the Filter Node

For the Wallarm filter node to recognize the value of the `X-Client-IP` header as the request source address, add the `set_real_ip_from` and `real_ip_header` directives to the NGINX configuration file.

The `real_ip_header` directive reports that the real IP address of the client that sent the request is transmitted in the `X-Client-IP` header.

The `set_real_ip_from` directive specifies the IP address of your proxy server or a balancer from which requests with the `X-Client-IP` header are sent.  

If your system has several proxies or balancers, specify several `set_real_ip_from` directives with their IP addresses. 
You can also specify IP address ranges (for example, `1.2.3.0/24`).

!!! info "Details of the directives"
	You can find detailed information about the `set_real_ip_from` and `real_ip_header` directives in the [NGINX official documentation][link-nginx-directives].

An example fragment of the `/etc/nginx/conf.d/default.conf` configuration file is given below:
```
location / {
	# Setting of proxy and filtration mode of the node
	wallarm_mode block;
	
	# Settings of proxying requests to the protected application
	proxy_pass http://<app-ip>;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_forwarded_for;
	
     # Settings of determining the true source IP address of requests
	set_real_ip_from <proxy-ip1>;
	set_real_ip_from <proxy-ip2>;
	real_ip_header X-Client-IP;
}
```

In the example above
*   `<app-ip>` is the IP address of the protected application for requests from the filter node;
*   `<proxy-ip1>`, `<proxy-ip2>` is the IP addresses of proxies that pass requests to the Wallarm filter node.

After you save the modified NGINX configuration file, restart NGINX:
``` bash
service nginx restart
```

## Checking results

Perform a [test attack][link-test-attack] and verify that the IP address of the request source is correctly displayed in the Wallarm web interface:

![!Events][img-events]