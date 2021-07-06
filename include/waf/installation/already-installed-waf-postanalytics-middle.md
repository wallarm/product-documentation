!!! info "If Wallarm WAF is already installed in your environment"
    If you install Wallarm WAF instead of an already existing Wallarm WAF or need to duplicate the installation in the same environment, then please keep the same WAF version as currently used or update all installations to the latest version. For the postanalytics installed separately, versions of substite or duplicate installations must be the same as already installed postanalytics too.

    To check the installed version of WAF node and postanalytics installed on the same server:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS or Amazon Linux 2"
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
    === "CentOS or Amazon Linux 2"
        ```bash
        # run from the server with installed WAF node
        yum list wallarm-node-nginx
        # run from the server with installed postanalytics
        yum list wallarm-node-tarantool
        ```

    * If the version `3.0.x` is installed, then follow the instructions for the [WAF node 3.0][waf-installation-instr-latest] and for [separate postanalytics 3.0](/admin-en/installation-postanalytics-en/).
    * If the version `2.18.x` is installed, then follow the current instructions for the WAF node and for [separate postanalytics 2.18](/2.18/admin-en/installation-postanalytics-en/) or update [WAF node packages](/updating-migrating/nginx-modules/) and [separate postanalytics packages](/updating-migrating/separate-postanalytics/) to the latest version in all installations.
    * If the version `2.16.x` or lower is installed, then please update the [WAF node packages](/updating-migrating/nginx-modules/) and [separate postanalytics packages](/updating-migrating/separate-postanalytics/) to the latest version in all installations. Support for installed versions will be deprecated soon.

    More information about WAF node versioning is available in the [WAF node versioning policy][versioning-policy].
