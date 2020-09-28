[docs-postanalytics-update]:   separate-postanalytics.md

# Updating Linux WAF packages

These instructions describe the steps to update installed Wallarm WAF modules to teh version 2.12.

!!! warning "Updating the Postanalytics Module"
    The postanalytics module should be [updated][docs-postanalytics-update] prior to updating any other packages if it is installed on the separate server.
    
    If the postanalytics module and Wallarm NGINX module shares the same server, then no additional actions are required. Take steps described in this document to update all packages at once. 

## 1. Update the Wallarm WAF Packages

Run the command if postanalytics module and Wallarm WAF modules are installed on the same server:

--8<-- "../include/update-package-en.md"

Run the command if only Wallarm WAF module is installed on the server:

--8<-- "../include/update-package-nginx-en.md"

--8<-- "../include/access-repo-en.md"

## 2. Check the NGINX Configuration File

Check that the configuration file is correct after updating the packages using the command:

```bash
nginx-wallarm -t
```

## 3. Restart NGINX

If you installed Wallarm with NGINX Plus or as a dynamic module for NGINX, restart the `nginx` service:

--8<-- "../include/waf/restart-nginx-2.12.md"

If you installed Wallarm without NGINX Plus or not as a dynamic module for NGINX, restart the `nginx-wallarm` service:

--8<-- "../include/restart-nginx-wallarm-en.md"
