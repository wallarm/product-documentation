By default, the deployed Wallarm Node does not analyze incoming traffic.

To enable traffic analysis and proxying of legitimate traffic, update the [NGINX configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/), typically located at `/etc/nginx/sites-available/default`.
    
The following minimal configuration adjustments are necessary:

1. Set the Wallarm Node to `wallarm_mode monitoring;`. This mode is recommended for initial deployments and testing.

    Wallarm also supports more modes like blocking and safe blocking, which you can [read more][waf-mode-instr].
1. Determine where the node should forward legitimate traffic by adding the `proxy_pass` directive in the required locations. This could be to the IP of an application server, a load balancer, or a DNS name.
1. If present, remove the `try_files` directive from the modified locations to ensure traffic is directed to Wallarm without local file interference.

```diff
server {
    ...
+   wallarm_mode monitoring;
    location / { 
+        proxy_pass http://example.com;
-        # try_files $uri $uri/ =404;
    }
    ...
}
```
