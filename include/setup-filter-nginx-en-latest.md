Depending on the deployment [approach] being used, configure Wallarm to either proxy traffic or process the traffic mirror:

=== "In-line deployment"
    1. Update targets of your load balancer to send traffic to the Wallarm instance. For details, please refer to the AWS documentation on either [Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html) or [Network Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-network-load-balancer.html).

        Depending on the scope you are going to protect, you can also place the Wallarm solution before, or on a level with your load balancer. To choose the correct option, learn your infrastructure and needs in details, AWS knowledge is a must here. For help, you can contact [sales@wallarm.com](,ailto:sales@wallarm.com).
    1. Set an IP address for Wallarm to proxy legitimate traffic to. It can be an IP of an application instance, load balancer, DNS, etc., depending on your architectire.
    
        To do so, open the `/etc/nginx/sites-enabled/default` file on the Wallarm instance and edit the `proxy_pass` value, e.g. Wallarm should send legitimate requests to http://10.80.0.5:

        ```
        server {
          listen 80;
          listen [::]:80 ipv6only=on;
          wallarm_mode monitoring;

          ...

          location / {
            proxy_pass http://10.80.0.5; 
            ...
          }
        }
        ```
=== "Out-of-Band deployment"
    It is expected that you have already configured your web server to mirror traffic and send it to the Wallarm instance.

    For the Wallarm node to process mirrored traffic, set the following configuration in the `/etc/nginx/sites-enabled/default` file on the Wallarm instance:

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

    * The [`real_ip_header`](../../using-proxy-or-balancer-en.md) directive is required to have Wallarm Console display the IP addresses of the attackers.
    * The `wallarm_force_response_*` directives are required to disable analysis of all requests except for copies received from the mirrored traffic.
    * Since malicious requests [cannot](overview.md#limitations-of-mirrored-traffic-filtration) be blocked, the Wallarm node always analyzes requests in the monitoring [mode](../../configure-wallarm-mode.md) even if the `wallarm_mode` directive or Wallarm Cloud sets the safe or regular blocking mode (aside from the mode set to off).
