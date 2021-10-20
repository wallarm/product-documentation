!!! info "If Wallarm node is already installed in your environment"
    If you install Wallarm node instead of an already existing Wallarm node or need to duplicate the installation in the same environment, then please keep the same node version as currently used or update all installations to the latest version. For the postanalytics installed separately, versions of substite or duplicate installations must be the same as already installed postanalytics too.

    To check the installed version of filtering node and postanalytics installed on the same server:

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

    To check the versions of filtering node and postanalytics installed on different servers:

    === "Debian"
        ```bash
        # run from the server with installed Wallarm filtering node
        apt list wallarm-node-nginx
        # run from the server with installed postanalytics
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # run from the server with installed Wallarm filtering node
        apt list wallarm-node-nginx
        # run from the server with installed postanalytics
        apt list wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2"
        ```bash
        # run from the server with installed Wallarm filtering node
        yum list wallarm-node-nginx
        # run from the server with installed postanalytics
        yum list wallarm-node-tarantool
        ```

    * If the version `3.4.x` is installed, then follow the instructions for the [Wallarm node 3.4][waf-installation-instr-latest] and for [separate postanalytics 3.4](/admin-en/installation-postanalytics-en/).
    * If the version `3.2.x` is installed, then follow the current instructions for the filtering node and [these instructions for separate postanalytics 3.2](/3.2/admin-en/installation-postanalytics-en/) or update [filtering node packages](/updating-migrating/nginx-modules/) and [separate postanalytics packages](/updating-migrating/separate-postanalytics/) to the latest version in all installations.
    * If the version `3.0.x` or lower is installed, then please update the [filtering node packages](/updating-migrating/nginx-modules/) and [separate postanalytics packages](/updating-migrating/separate-postanalytics/) to the latest version in all installations. Support for installed versions will be deprecated soon.

    More information about Wallarm node versioning is available in the [Wallarm node versioning policy][versioning-policy].
