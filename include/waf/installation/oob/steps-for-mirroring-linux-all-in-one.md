By default, the deployed Wallarm node does not analyze incoming traffic.

Perform the following configuration in the NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) on the machine with the installed node to configure Wallarm to process the traffic mirror:

1. For the Wallarm node to accept mirrored traffic, set the following configuration in the `server` NGINX block:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    # Change 222.222.222.22 to the address of the mirroring server
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * The `set_real_ip_from` and `real_ip_header` directives are required to have Wallarm Console [display the IP addresses of the attackers][proxy-balancer-instr].
    * The `wallarm_force_response_*` directives are required to disable analysis of all requests except for copies received from the mirrored traffic.
1. For the Wallarm node to analyze the mirrored traffic, set the `wallarm_mode` directive to `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Since malicious requests [cannot][oob-advantages-limitations] be blocked, the only [mode][waf-mode-instr] Wallarm accepts is monitoring. For in-line deployment, there are also safe blocking and blocking modes but even if you set the `wallarm_mode` directive to a value different from monitoring, the node continues to monitor traffic and only record malicious traffic (aside from the mode set to off).
1. If present, remove the `try_files` directive from the NGINX locations to ensure traffic is directed to Wallarm without local file interference:
    
    ```diff
    server {
        ...
        location / {
    -        # try_files $uri $uri/ =404;
        }
        ...
    }
    ```
