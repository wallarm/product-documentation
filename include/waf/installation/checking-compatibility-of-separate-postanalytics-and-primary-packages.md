!!! info "The `wallarm-node-tarantool` package version"
    The `wallarm-node-tarantool` package must be of the same or a higher version than the primary NGINX-Wallarm module packages installed on a separate server.

    To check versions:

    === "Debian"
        ```bash
        # run from the server with primary NGINX-Wallarm module
        apt list wallarm-node-nginx
        # run from the server with the postanalytics module
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # run from the server with primary NGINX-Wallarm module
        apt list wallarm-node-nginx
        # run from the server with the postanalytics module
        apt list wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        # run from the server with primary NGINX-Wallarm module
        yum list wallarm-node-nginx
        # run from the server with the postanalytics module
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        # run from the server with primary NGINX-Wallarm module
        yum list wallarm-node-nginx
        # run from the server with the postanalytics module
        yum list wallarm-node-tarantool
        ```