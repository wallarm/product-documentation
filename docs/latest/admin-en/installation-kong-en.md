[kong-install]:         https://konghq.com/get-started/#install
[kong-docs]:            https://getkong.org/docs/
[kong-admin-api]:       https://getkong.org/docs/0.10.x/admin-api/

[doc-wallarmblockpage]: configure-parameters-en.md#wallarm_block_page
[doc-postanalytics]:    installation-postanalytics-en.md
[doc-supported-os]:     supported-platforms.md
[waf-installation-instr-middle]:             /2.18/admin-en/installation-kong-en/
[versioning-policy]:                         ../updating-migrating/versioning-policy.md

# Installing with Kong

!!! info "Prerequisites"
    Requirements for the Kong platform:

    * Kong version 1.4.3 or lower
    * Kong installed on a platform [supported by Wallarm][doc-supported-os] according to Kong's [official instructions][kong-install]
    
    One of the following points is required for proper Kong operation:
    
    * Prepared configuration files
    * Configured database
    
    Please make sure that the installed Kong meets the prerequisites before proceeding with Wallarm installation.
    
    The official Kong documentation is available at this [link][kong-docs].

!!! warning "Known Limitations"
    * The [`wallarm_block_page`][doc-wallarmblockpage] directive is not supported.
    * Wallarm configuration via [Kong Admin API][kong-admin-api] is not supported.

## Installation

!!! warning "Installation of postanalytics on a separate server"
    If you are planning to install postanalytics on a separate server, you must install postanalytics first. 
    
    See details in [Separate postanalytics module installation][doc-postanalytics].

To install the Wallarm module with Kong, you need to:

1. Add Wallarm repositories.
2. Install Wallarm packages.
3. Configure postanalytics.
4. Set up the filtering node for using a proxy server.
5. Connect the filtering node to the Wallarm Cloud.
6. Configure the postanalytics server addresses.
7. Configure the filtration mode.
8. Configure logging.

--8<-- "../include/elevated-priveleges.md"

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
    === "CentOS"
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
    === "CentOS"
        ```bash
        # run from the server with installed Wallarm filtering node
        yum list wallarm-node-nginx
        # run from the server with installed postanalytics
        yum list wallarm-node-tarantool
        ```

    * If the version `3.4.x` is installed, then follow the current instructions for the filtering node and [these instructions for separate postanalytics](installation-postanalytics-en.md).
    * If the version `3.2.x` is installed, then follow the instructions for [Wallarm node 3.2](/3.2/admin-en/installation-kong-en/) and [separate postanalytics 3.2](/3.2/admin-en/installation-postanalytics-en/) or update the [filtering node](/updating-migrating/nginx-modules/) and [separate postanalytics](/updating-migrating/separate-postanalytics/) packages to the latest version in all deployments.
    * If the version `3.0.x` or lower is installed, then please update the [filtering node packages](/updating-migrating/nginx-modules/) and [separate postanalytics packages](/updating-migrating/separate-postanalytics/) to the latest version in all installations. Support for installed versions will be deprecated soon.

    More information about Wallarm node versioning is available in the [Wallarm node versioning policy](../updating-migrating/versioning-policy.md).

## 1. Add Wallarm repositories

The filtering node installs and updates from the Wallarm repositories.

Depending on your operating system, run one of the following commands:

=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/3.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/3.4/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
    ```

--8<-- "../include/access-repo-en.md"

## 2. Install Wallarm Packages

To install the filtering node and postanalytics on the same server, run the command:

=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo apt install --no-install-recommends wallarm-node kong-module-wallarm
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install wallarm-node kong-module-wallarm
    ```

To install the filtering node alone, run the command:

=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo apt install --no-install-recommends wallarm-node-nginx kong-module-wallarm
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install wallarm-node-nginx kong-module-wallarm
    ```

## 3. Configure postanalytics 

!!! info
    Skip this step if you installed postanalytics on a separate server as you already have your postanalytics configured.

The amount of memory determines the quality of work of the statistical algorithms.

For production environments, the recommended amount of RAM allocated for the postanalytics module is 75% of the total server memory. For example, if the server has 32 GB of memory, the recommended allocation size is 24 GB. If testing the Wallarm node or having a small server size, the lower amount can be enough (e.g. 25% of the total memory).

**Allocate the operating memory size for Tarantool:**

Open for editing the configuration file of Tarantool:

=== "Ubuntu 18.04 LTS (bionic)"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS 7.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

Set the allocated memory size in the configuration file of Tarantool via the `SLAB_ALLOC_ARENA` directive. The value can be an integer or a float (a dot `.` is a decimal separator).

For example:

=== "If testing the node"
    ```bash
    SLAB_ALLOC_ARENA=0.5
    ```
=== "If deploying the node to the production environment"
    ```bash
    SLAB_ALLOC_ARENA=24
    ```

**Restart Tarantool:**

=== "Ubuntu 18.04 LTS (bionic)"
    ``` bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x"
    ``` bash
    sudo systemctl restart wallarm-tarantool
    ```

## 4. Set up the filtering node for using a proxy server

--8<-- "../include/setup-proxy.md"

## 5. Connect the filtering node to the Wallarm Cloud

--8<-- "../include/connect-cloud-en.md"

## 6. Configure the postanalytics server addresses

!!! info
    * Skip this step if you installed postanalytics and the filtering node on the same server.
    * Do this step if you installed postanalytics and the filtering node on separate servers.

--8<-- "../include/configure-postanalytics-address-kong-en.md"

## 7. Set up the filtration mode

--8<-- "../include/setup-filter-kong-en-latest.md"

## 8. Configure logging

--8<-- "../include/installation-step-logging.md"

## Start Kong

To start Kong with the installed Wallarm module, run the command:

```
kong start --nginx-conf /etc/kong/nginx-wallarm.template
```

## The installation is complete

--8<-- "../include/check-setup-installation-en.md"

--8<-- "../include/filter-node-defaults.md"

--8<-- "../include/installation-extra-steps.md"