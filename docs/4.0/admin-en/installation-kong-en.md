[kong-install]:         https://konghq.com/get-started/#install
[kong-docs]:            https://getkong.org/docs/
[kong-admin-api]:       https://getkong.org/docs/0.10.x/admin-api/

[doc-wallarmblockpage]: configure-parameters-en.md#wallarm_block_page
[doc-postanalytics]:    installation-postanalytics-en.md
[doc-supported-os]:     supported-platforms.md
[versioning-policy]:                         ../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../images/check-user-no-2fa.png

# Installing Wallarm from DEB/RPM packages for Kong

These instructions provide you with the steps to install the Wallarm module for Kong using DEB/RPM packages.

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

## 1. Add Wallarm repositories

The filtering node installs and updates from the Wallarm repositories.

Depending on your operating system, run one of the following commands:

=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.0/x86_64/wallarm-node-repo-4-0.el7.noarch.rpm
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

The amount of memory determines the quality of work of the statistical algorithms. Learn more about amount of required resources [here](../admin-en/configuration-guides/allocate-resources-for-node.md). Note that for testing environments you can allocate lower resources than for the production ones.

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

!!! info "API Access"
    The API choice for your filtering node depends on the Cloud you are using. Please, select the API accordingly:
    
    * If you are using <https://my.wallarm.com/>, your node requires access to `https://api.wallarm.com`.
    * If you are using <https://us1.my.wallarm.com/>, your node requires access to `https://us1.api.wallarm.com`.
    
    Ensure the access is not blocked by a firewall.

!!! info "If the postanalytics module is installed on a separate server"
    If the initial traffic processing and postanalytics modules are installed on separate servers, it is recommended to connect these modules to the Wallarm Cloud using the same node token. The Wallarm Console UI will display each module as a separate node instance, e.g.:

    ![!Node with several instances](../images/user-guides/nodes/wallarm-node-with-two-instances.png)

    The Wallarm node has already been created during the [separate postanalytics module installation](installation-postanalytics-en.md). To connect the initial traffic processing module to the Cloud using the same node credentials:

    1. Copy the node token generated during the separate postanalytics module installation.
    1. Proceed to the 4th step in the list below.

The filtering node interacts with the Wallarm Cloud. To connect the node to the Cloud:

1. Make sure that your Wallarm account has the **Administrator** role enabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [EU Cloud](https://my.wallarm.com/settings/users) or [US Cloud](https://us1.my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.
1. Run the `register-node` script in a system with the filtering node:
    
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    
    `<NODE_TOKEN>` is the copied token value.
    
    !!! info "If the postanalytics module is installed on a separate server"
        If the postanalytics module is installed on a separate server, it is recommended to use the node token generated during the [separate postanalytics module installation](installation-postanalytics-en.md).

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