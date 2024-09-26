By default, the deployed Wallarm node does not analyze incoming traffic.

Depending on the selected Wallarm deployment approach ([in-line][inline-docs] or [Out-of-Band][oob-docs]), configure Wallarm to either proxy traffic or process the traffic mirror.

Perform the following configuration in the NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) on the machine with the installed node:

=== "In-line"
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
=== "Out-of-Band"
    1. For the Wallarm node to accept mirrored traffic, set the following configuration in the `server` NGINX block:

        ```
        server {
            listen 80;
            wallarm_mode monitoring;

            ...

            wallarm_force server_addr $http_x_server_addr;
            wallarm_force server_port $http_x_server_port;
            # Change 222.222.222.22 to the address of the mirroring server
            #set_real_ip_from  222.222.222.22;
            #real_ip_header    X-Forwarded-For;
            #real_ip_recursive on;
            wallarm_force response_status 0;
            wallarm_force response_time 0;
            wallarm_force response_size 0;
        }
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
