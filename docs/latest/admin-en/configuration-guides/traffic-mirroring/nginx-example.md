# Example of NGINX configuration for traffic mirroring

Starting with NGINX 1.13 you can mirror the traffic to an additional backend. This article provides you with the example configuration required for NGINX to [mirror the traffic](overview.md) and for the node to process mirrored traffic.

## NGINX configuration to mirror the traffic

For NGINX to mirror the traffic:

1. Configure the [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) module by setting the `mirror` directive in the `location` or `server` block.

    The example below will mirror requests received at `location /` to `location /mirror-test`.
1. To send the mirrored traffic to the Wallarm node, list the headers to be mirrored and specify the IP address of the machine with the node in the `location` the `mirror` directive points.

```
location / {
        mirror /mirror-test;
        mirror_request_body on;
        root   /usr/share/nginx/html;
        index  index.html index.htm; 
    }
    
location /mirror-test {
        internal;
        #proxy_pass http://111.11.111.1$request_uri;
        proxy_pass http://222.222.222.222$request_uri;
        proxy_set_header X-SERVER-PORT $server_port;
        proxy_set_header X-SERVER-ADDR $server_addr;
        proxy_set_header HOST $http_host;
        proxy_set_header X-Forwarded-For $realip_remote_addr;
        proxy_set_header X-Forwarded-Port $realip_remote_port;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Request-ID $request_id;
    }
```

## Wallarm node configuration to filter mirrored traffic

For the Wallarm node to process mirrored traffic, set the following configuration:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#Change 222.222.222.22 to the address of the mirroring server
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

The [`real_ip_header`](../../using-proxy-or-balancer-en.md) directive is required to have Wallarm Console display the IP addresses of the attackers and the `wallarm_force_response_*` directives to disable analysis of all requests except for copies received from the mirroring traffic.
