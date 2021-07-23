The following files contain NGINX and filtering node settings:

* `/etc/nginx/nginx.conf` defines the configuration of NGINX
* `/etc/nginx/conf.d/wallarm.conf` defines the global configuration of Wallarm filtering node
* `/etc/nginx/conf.d/wallarm-status.conf` defines the filtering node monitoring service configuration

You can create your own configuration files to define the operation of NGINX and Wallarm. It is recommended to create a separate configuration file with the `server` block for each group of the domains that should be processed in the same way.

To see detailed information about working with NGINX configuration files, proceed to the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).

Wallarm directives define the operation logic of the Wallarm filter node. To see the list of Wallarm directives available, proceed to the [Wallarm configuration options](configure-parameters-en.md) page.

#### A Configuration File Example

Let us suppose that you need to configure the server to work in the following conditions:
* Only HTTP traffic is processed. There are no HTTPS requests processed.
* The following domains receive the requests: `example.com` and `www.example.com`.
* All requests must be passed to the server `10.80.0.5`.
* All incoming requests are considered less than 1MB in size (default setting).
* The processing of a request takes no more than 60 seconds (default setting).
* Wallarm must operate in the monitor mode.
* Clients access the filter node directly, without an intermediate HTTP load balancer.

!!! info "Creating a configuration file"
    You can create a custom NGINX configuration file (e.g. `example.com.conf`) or modify the default NGINX configuration file (`default.conf`).
    
    When creating a custom configuration file, make sure that NGINX listens to the incoming connections on the free port.


To meet the listed conditions, the contents of the configuration file must be the following:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # the domains for which traffic is processed
      server_name example.com; 
      server_name www.example.com;

      # turn on the monitoring mode of traffic processing
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # setting the address for request forwarding
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```