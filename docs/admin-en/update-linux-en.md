[docs-postanalytics-update]:   update-postanalytics.md

# Updating the Wallarm Packages on Linux

To update the Wallarm packages on Linux, you must:

1. Update the Wallarm packages.
2. Check the NGINX configuration file.
3. Restart NGINX.

!!! warning "Updating the Postanalytics Module"
    The postanalytics module should be [updated][docs-postanalytics-update] prior to updating any other packages if it is installed on the separate server.
    
    If the postanalytics module and Wallarm NGINX module shares the same server, then no additional actions are required. Take steps described in this document to update all packages at once. 

## 1. Update the Wallarm Packages

Run the command if postanalytics module and Wallarm NGINX modules are installed on the same server:

--8<-- "../include/update-package-en.md"

Run the command if only Wallarm NGINX module is installed on the server:

--8<-- "../include/update-package-nginx-en.md"

--8<-- "../include/access-repo-en.md"

## 2. Check the NGINX Configuration File

!!! info "Parameters `wallarm_tarantool_host` and `wallarm_tarantool_port`"
    The `wallarm_tarantool_host` and `wallarm_tarantool_port` have been deprecated starting with version 2.6.
    If you used these parameters to set up Tarantool, you must replace them with `wallarm_tarantool_upstream`.
    See [wallarm_tarantool_upstream](configure-parameters-en.md#wallarm_tarantool_upstream).

Check that the configuration file is correct after updating the packages.

Run the command:

```bash
nginx-wallarm -t
```

## 3. Restart NGINX

If you installed Wallarm with NGINX Plus or as a dynamic module for NGINX, restart the `nginx` service.

Restart the `nginx` service:

--8<-- "../include/waf/restart-nginx.md"

If you installed Wallarm without NGINX Plus or not as a dynamic module for NGINX, restart the `nginx-wallarm` service.

Restart the `nginx-wallarm` service:

--8<-- "../include/restart-nginx-wallarm-en.md"