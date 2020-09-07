!!! info "If Wallarm WAF is already installed in your environment"
    If you install Wallarm WAF instead of already existing Wallarm WAF or need to duplicate the installation in the same environment, please keep the same WAF version as currently used or update the version of all installations to the latest. For the postanalytics installed separately, versions of substite or duplicate installations must be the same as already installed postanalytics too.

    To check the installed version if WAF node and postanalytics are installed on the same server:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    To check the versions of WAF node and postanalytics installed on different servers:

    === "Debian"
        ```bash
        # run from the server with installed WAF node
        apt list wallarm-node-nginx
        # run from the server with installed postanalytics
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # run from the server with installed WAF node
        apt list wallarm-node-nginx
        # run from the server with installed postanalytics
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # run from the server with installed WAF node
        yum list wallarm-node-nginx
        # run from the server with installed postanalytics
        yum list wallarm-node-tarantool
        ```

    * If the version `2.14.x` is installed, follow the current instruction for WAF node and for [separate postanalytics][install-postanalytics-instr].
    * If the version `2.12.x` is installed, follow the instruction for [WAF node 2.12][2.12-installation-instr] and for [separate postanalytics 2.12][2.12-install-postanalytics-instr] or update [WAF node packages][nginx-modules-update-docs] and [separate postanalytics packages][separate-postanalytics-update-docs] to 2.14 in all installations.
    * If the deprecated version is installed (`2.10.x` or lower), please update the [WAF node packages][nginx-modules-update-docs] and [separate postanalytics packages][separate-postanalytics-update-docs] to 2.14 in all installations.

    More information about version support is available in the [WAF node versioning policy][versioning-policy].
