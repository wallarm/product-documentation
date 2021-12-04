Main configuration files of NGINX and Wallarm filtering node are located in the directories:

* `/etc/nginx/conf.d/default.conf` with NGINX settings
* `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings

    The file is used for settings applied to all domains. To apply different settings to different domain groups, use the file `default.conf` or create new configuration files for each domain group (for example, `example.com.conf` and `test.com.conf`). More detailed information about NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` with the Tarantool database settings

#### Request filtration mode

By default, the filtering node is in the status `off` and does not analyze incoming requests. To enable requests analysis, please follow the steps:

1. Open the file `/etc/nginx/conf.d/default.conf`:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. Add the line `wallarm_mode monitoring;` to the `https`, `server` or `location` block:

??? "Example of the file `/etc/nginx/conf.d/default.conf`"

    ```bash
    server {
        # port for which requests are filtered
        listen       80;
        # domain for which requests are filtered
        server_name  localhost;
        # Filtering node mode
        wallarm_mode monitoring;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
    ```

When operating in the `monitoring` mode, the filtering node searches attack signs in requests but does not block detected attacks. We recommend keeping the traffic flowing via the filtering node in the `monitoring` mode for several days after the filtering node deployment and only then enable the `block` mode. [Learn recommendations on the filtering node operation mode setup →][waf-mode-recommendations]

#### Memory

!!! info "Postanalytics module on the separate server"
    If you installed the postanalytics module on a separate server, then skip this step as you already have the module configured.

The Wallarm node uses the in-memory storage Tarantool. For production environments, the recommended amount of RAM allocated for Tarantool is 75% of the total server memory. If testing the Wallarm node or having a small instance size, the lower amount can be enough (e.g. 25% of the total memory).

To allocate memory for Tarantool:

1. Open the Tarantool configuration file in the editing mode:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS or Amazon Linux 2"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. Specify memory size in GB in the `SLAB_ALLOC_ARENA` directive. The value can be an integer or a float (a dot `.` is a decimal separator).

    For example:
    
    === "If testing the node"
        ```bash
        SLAB_ALLOC_ARENA=0.5
        ```
    === "If deploying the node to the production environment"
        ```bash
        SLAB_ALLOC_ARENA=24
        ```
    
    Detailed recommendations about allocating memory for Tarantool are described in these [instructions][memory-instr]. 
3. To apply changes, restart Tarantool:

    === "Debian"
        ``` bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "CentOS 6.x"
        ```bash
        sudo service wallarm-tarantool restart
        ```
    === " CentOS 7.x or Amazon Linux 2"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```

#### Address of the separate postanalytics server

!!! info "NGINX-Wallarm and postanalytics on the same server"
    If the NGINX-Wallarm and postanalytics modules are installed on the same server, then skip this step.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Other configurations

To update other NGINX and Wallarm node configurations, use the NGINX documentation and the list of [available Wallarm node directives][waf-directives-instr].
