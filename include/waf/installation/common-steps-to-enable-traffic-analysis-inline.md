By default, the deployed Wallarm node does not analyze incoming traffic. To start analysis, configure Wallarm to proxy traffic via the `/etc/nginx/conf.d/default.conf` file on the machine with the installed node:

1. Set an IP address for Wallarm to proxy legitimate traffic to. It can be an IP of an application instance, load balancer, or DNS name, etc., depending on your architecture.

    To do so, edit the `proxy_pass` value, e.g. Wallarm should send legitimate requests to `http://10.80.0.5`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;

        ...

        location / {
            proxy_pass http://10.80.0.5; 
            ...
        }
    }
    ```
1. For the Wallarm node to analyze the incoming traffic, set the `wallarm_mode` directive to `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    The monitoring mode is the recommended one for the first deployment and solution testing. Wallarm provides safe blocking and blocking modes as well, [read more][waf-mode-instr].
