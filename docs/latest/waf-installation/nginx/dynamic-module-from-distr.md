[img-wl-console-users]:             ../../images/check-users.png 
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-waf-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[sqli-attack-desc]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../../images/admin-guides/test-attacks.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../admin-en/installation-postanalytics-en/
[versioning-policy]:               ../../updating-migrating/versioning-policy.md
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[enable-libdetection-docs]:         ../../admin-en/configure-parameters-en.md#wallarm_enable_libdetection
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md

# Installing dynamic Wallarm module for NGINX from Debian/CentOS repositories

These instructions describe the steps to install Wallarm filtering node as a dynamic module for the open source version of NGINX installed from the Debian/CentOS repositories.

!!! info "If Wallarm node is already installed in your environment"
    If you install Wallarm node instead of an already existing Wallarm node or need to duplicate the installation in the same environment, then please keep the same node version as currently used or update all installations to the latest version. For the postanalytics installed separately, versions of substite or duplicate installations must be the same as already installed postanalytics too.

    To check the installed version of filtering node and postanalytics installed on the same server:

    === "Debian"
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
    === "CentOS"
        ```bash
        # run from the server with installed Wallarm filtering node
        yum list wallarm-node-nginx
        # run from the server with installed postanalytics
        yum list wallarm-node-tarantool
        ```

    * If the version `3.2.x` is installed, then follow the current instructions for the filtering node and [these instructions for separate postanalytics](/admin-en/installation-postanalytics-en/).
    * If the version `3.0.x` is installed, then please update the [filtering node](/updating-migrating/nginx-modules/) and [separate postanalytics](/updating-migrating/separate-postanalytics/) packages to the latest version in all deployments. We recommend upgrading modules 3.0 to the [latest version](/updating-migrating/what-is-new/) since it enables new features of controlling access to applications by IP addresses and simplifies the logic of some filtration modes.
    * If the version `2.18.x` or lower is installed, then please update the [filtering node packages](/updating-migrating/nginx-modules/) and [separate postanalytics packages](/updating-migrating/separate-postanalytics/) to the latest version in all installations. Support for installed versions will be deprecated soon.

    More information about Wallarm node versioning is available in the [Wallarm node versioning policy][versioning-policy].

## Requirements

--8<-- "../include/waf/installation/nginx-requirements-3.0.md"

## Installation options

--8<-- "../include/waf/installation/nginx-installation-options.md"

Installation commands for both options are described in the further instructions.

## Installation

### 1. Add Debian/CentOS repositories

=== "Debian 9.x (stretch)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/3.2/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 9.x (stretch-backports)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/3.2/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/3.2/' | sudo tee --append /etc/apt/sources.list.d/wallarm.list"
    # for correct Wallarm node operation, uncomment the following line in /etc/apt/sources.list`:
    # deb http://deb.debian.org/debian stretch-backports main contrib non-free
    sudo apt update
    ```
=== "Debian 10.x (buster)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node buster/3.2/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/3.2/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
    ```
=== "CentOS 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/3.2/x86_64/Packages/wallarm-node-repo-1-6.el8.noarch.rpm
    ```

### 2. Install NGINX with Wallarm API Security packages

#### Request processing and postanalytics on the same server

The command installs the following packages:

* `nginx` for NGINX
* `libnginx-mod-http-wallarm` or `nginx-mod-http-wallarm` for the NGINX-Wallarm module
* `wallarm-node` for the postanalytics module, Tarantool database, and additional NGINX-Wallarm packages

=== "Debian 9.x (stretch)"
    ```bash
    sudo apt install --no-install-recommends nginx wallarm-node libnginx-mod-http-wallarm
    ```
=== "Debian 9.x (stretch-backports)"
    ```bash
    sudo apt install --no-install-recommends nginx wallarm-node libnginx-mod-http-wallarm -t stretch-backports
    ```
=== "Debian 10.x (buster)"
    ```bash
    sudo apt install --no-install-recommends nginx wallarm-node libnginx-mod-http-wallarm
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install nginx wallarm-node nginx-mod-http-wallarm
    ```
=== "CentOS 8.x"
    ```bash
    sudo yum install nginx wallarm-node nginx-mod-http-wallarm
    ```

#### Request processing and postanalytics on different servers

To run postanalytics and process the requests on different servers, the following packages are required:

* `wallarm-node-tarantool` on the separate server for the postanalytics module and Tarantool database (installation steps are described in the [instructions](../../admin-en/installation-postanalytics-en.md))

* `wallarm-node-nginx` and `libnginx-mod-http-wallarm`/`nginx-mod-http-wallarm` for the NGINX-Wallarm module

The commands install packages for NGINX and for the NGINX-Wallarm module:

=== "Debian 9.x (stretch)"
    ```bash
    sudo apt install --no-install-recommends nginx wallarm-node-nginx libnginx-mod-http-wallarm
    ```
=== "Debian 9.x (stretch-backports)"
    ```bash
    sudo apt install --no-install-recommends nginx wallarm-node-nginx libnginx-mod-http-wallarm -t stretch-backports
    ```
=== "Debian 10.x (buster)"
    ```bash
    sudo apt install --no-install-recommends nginx wallarm-node-nginx libnginx-mod-http-wallarm
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install nginx wallarm-node-nginx nginx-mod-http-wallarm
    ```
=== "CentOS 8.x"
    ```bash
    sudo yum install nginx wallarm-node-nginx nginx-mod-http-wallarm
    ```

### 3. Connect the Wallarm API Security module

Copy the configuration files for the system setup:

=== "Debian"
    ```bash
    sudo cp /usr/share/doc/libnginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```
=== "CentOS"
    ```bash
    sudo cp /usr/share/doc/nginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```

### 4. Connect the filtering node to Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud.md"

### 5. Update Wallarm node configuration

Main configuration files of NGINX and Wallarm filtering node are located in the directories:

* `/etc/nginx/conf.d/default.conf` with NGINX settings
* `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings

    The file is used for settings applied to all domains. To apply different settings to different domain groups, use the file `default.conf` or create new configuration files for each domain group (for example, `example.com.conf` and `test.com.conf`). More detailed information about NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` with the Tarantool database settings

#### Request filtration mode

By default, the filtering node is in the status `off` and does not analyze incoming requests. To enable requests analysis, please follow the steps:

1. Open the file `/etc/nginx/conf.d/default.conf`:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. Add the line `wallarm_mode monitoring;` to the `https`, `server` or `location` block:

??? "Example of the file `/etc/nginx/conf.d/default.conf`"

    ```bash
    server {
        # port for which requests are filtered
        listen       80;
        # domain for which requests are filtered
        server_name  localhost;
        # Filtering node mode
        wallarm_mode monitoring;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
    ```

When operating in the `monitoring` mode, the filtering node searches attack signs in requests but does not block detected attacks. We recommend keeping the traffic flowing via the filtering node in the `monitoring` mode for several days after the filtering node deployment and only then enable the `block` mode. [Learn recommendations on the filtering node operation mode setup →](../../about-wallarm-waf/deployment-best-practices.md#follow-recommended-onboarding-steps)

#### Memory

!!! info "Postanalytics on the separate server"
    If you installed postanalytics on a separate server, then skip this step as you already have your postanalytics configured.

The Wallarm node uses the in-memory storage Tarantool. The recommended memory size for Tarantool is 75% of the total server memory. To allocate memory for Tarantool:

1. Open the Tarantool configuration file in the editing mode:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. Specify memory size in GB in the `SLAB_ALLOC_ARENA` directive. The value can be an integer or a float (a dot `.` is a decimal separator). For example, 24 GB:
    
    ```bash
    SLAB_ALLOC_ARENA=24
    ```

    Detailed recommendations about allocating memory for Tarantool are described in these [instructions][memory-instr]. 
3. To apply changes, restart Tarantool:

    === "Debian"
        ``` bash
        sudo systemctl restart wallarm-tarantool
        ```
    === " CentOS 7.x"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```

#### Address of the separate postanalytics server

!!! info "NGINX-Wallarm and postanalytics on the same server"
    If the NGINX-Wallarm and postanalytics modules are installed on the same server, then skip this step.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Other configurations

To update other NGINX and Wallarm node configurations, use the NGINX documentation and the list of [available Wallarm node directives][waf-directives-instr].

### 6. Restart NGINX

--8<-- "../include/waf/root_perm_info.md"

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "CentOS 7.x"
    ```bash
    sudo systemctl restart nginx
    ```

### 7. Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Settings customization

Dynamic Wallarm API Security module with default settings is installed for NGINX from the Debian/CentOS repositories. To customize Wallarm node settings, use the [available directives](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx.md"
