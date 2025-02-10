Depending on the deployment approach being used, perform the following settings:

=== "In-line"
    Update targets of your load balancer to send traffic to the Wallarm instance. For details, please refer to the documentation on your load balancer.
=== "Out-of-Band"
    1. Configure your web or proxy server (e.g. NGINX, Envoy) to mirror incoming traffic to the Wallarm node. For configuration details, we recommend to refer to your web or proxy server documentation.

        Inside the [link][web-server-mirroring-examples], you will find the example configuration for the most popular of web and proxy servers (NGINX, Traefik, Envoy).
    1. Set the following configuration in the `/etc/nginx/sites-enabled/default` file on the machine running the Wallarm filtering node:

        ```
        location / {
            include /etc/nginx/presets.d/mirror.conf;
            
            # Change 222.222.222.22 to the address of the mirroring server
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
        }
        ```

        The `set_real_ip_from` and `real_ip_header` directives are required to have Wallarm Console [display the IP addresses of the attackers][real-ip-docs].
