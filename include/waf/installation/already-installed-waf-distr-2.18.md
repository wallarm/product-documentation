!!! info "If Wallarm WAF is already installed in your environment"
    If you install Wallarm WAF instead of an already existing Wallarm WAF or need to duplicate the installation in the same environment, then please keep the same WAF version as currently used or update all installations to the latest version. For the postanalytics installed separately, versions of substite or duplicate installations must be the same as already installed postanalytics too.

    To check the installed version of WAF node and postanalytics installed on the same server:

    === "Debian"
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
    === "CentOS"
        ```bash
        # run from the server with installed WAF node
        yum list wallarm-node-nginx
        # run from the server with installed postanalytics
        yum list wallarm-node-tarantool
        ```

    * If the version `2.18.x` is installed, then follow the current instructions for the WAF node and for [separate postanalytics][install-postanalytics-instr].
    * If the version `2.16.x` is installed, then follow the instructions for [WAF node 2.16][2.16-installation-instr] and for [separate postanalytics 2.16][2.16-install-postanalytics-instr] or update [WAF node packages][nginx-modules-update-docs] and [separate postanalytics packages][separate-postanalytics-update-docs] to 2.18 in all installations.
    * If the version `2.14.x` or lower is installed, then please update the [WAF node packages][nginx-modules-update-docs] and [separate postanalytics packages][separate-postanalytics-update-docs] to 2.18 in all installations.

    More information about WAF node versioning is available in the [WAF node versioning policy][versioning-policy].
