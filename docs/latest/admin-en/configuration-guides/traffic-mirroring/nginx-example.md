# Example of NGINX configuration for traffic mirroring

Starting with NGINX 1.13 you can mirror the traffic to an additional backend. This article provides you with the example configuration required for NGINX to [mirror the traffic](overview.md) and for the node to process mirrored traffic.

## Step 1: Configure NGINX to mirror the traffic

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

## Step 2: Configure Wallarm node to filter mirrored traffic

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"
