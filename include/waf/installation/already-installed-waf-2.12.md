!!! info "If Wallarm WAF is already installed in your environment"
    If you install Wallarm WAF instead of already existing Wallarm WAF or need to duplicate the installation in the same environment, please keep the same WAF version as currently used or update the version of all installations to the latest.

    To check the installed version:

    === "Debian"
        ```bash
        # if WAF node and postanalytics are installed on the same server
        apt list wallarm-node
        # if WAF node and postanalytics are installed on different servers
        apt list wallarm-node-nginx
        ```
    === "Ubuntu"
        ```bash
        # if WAF node and postanalytics are installed on the same server
        apt list wallarm-node
        # if WAF node and postanalytics are installed on different servers
        apt list wallarm-node-nginx
        ```
    === "CentOS or Amazon Linux 2"
        ```bash
        # if WAF node and postanalytics are installed on the same server
        yum list wallarm-node
        # if WAF node and postanalytics are installed on different servers
        yum list wallarm-node-nginx
        ```

    * If the version `2.14.x` is installed, follow the [instructions for 2.14][2.14-installation-instr].
    * If the version `2.12.x` is installed, follow the current instruction or [update the packages to 2.14](/updating-migrating/nginx-modules/) in all installations.
    * If the deprecated version is installed (`2.10.x` or lower), please [update the packages to 2.14](/updating-migrating/nginx-modules/) in all installations.
