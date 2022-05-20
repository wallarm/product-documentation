[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png

#   Upgrading the postanalytics module 2.18 or lower

These instructions describe the steps to upgrade the postanalytics module 2.18 or lower installed on a separate server. Postanalytics module must be upgraded before [Upgrading Wallarm NGINX modules][docs-module-update].

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Requirements

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

## Step 1: Update API port

--8<-- "../include/waf/upgrade/api-port-443.md"

## Step 2: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version packages. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CloudLinux OS 6.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/6/4.0/x86_64/wallarm-node-repo-4-0.el6.noarch.rpm
    ```
=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.0/x86_64/wallarm-node-repo-4-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "Support for CentOS 8.x has been deprecated"
        Support for CentOS 8.x [has been deprecated](https://www.centos.org/centos-linux-eol/). You can install the Wallarm node on the AlmaLinux, Rocky Linux or Oracle Linux 8.x operating system insted.

        * [Installation instructions for NGINX `stable`](../../waf-installation/nginx/dynamic-module.md)
        * [Installation instructions for NGINX from CentOS/Debian repositories](../../waf-installation/nginx/dynamic-module-from-distr.md)
        * [Installation instructions for NGINX Plus](../../waf-installation/nginx-plus.md)
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.0/x86_64/wallarm-node-repo-4-0.el8.noarch.rpm
    ```

**Debian and Ubuntu**

1. Open the file with the Wallarm repository address in the installed text editor. In this instruction, **vim** is used.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Comment out or delete the previous repository address.
3. Add a new repository address:

    === "Debian 9.x (stretch)"
        ``` bash
        deb http://repo.wallarm.com/debian/wallarm-node stretch/4.0/
        ```
    === "Debian 9.x (stretch-backports)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node stretch/4.0/
        deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/4.0/
        ```
    === "Debian 10.x (buster)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node buster/4.0/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/4.0/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/
        ```

## Step 3: Upgrade the Tarantool packages

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys.md"
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys.md"
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum update
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys.md"

## Step 4: Update the node type

The deployed postanalytics node 3.6 or lower has the deprecated **regular** type that is [now replaced with the new **Wallarm node** type](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

It is recommended to install the new node type instead of the deprecated one during migration to the version 4.0. The regular node type will be removed in future releases, please migrate before.

To replace the regular postanalytics node with the Wallarm node:

1. Make sure that your Wallarm account has the **Administrator** role enabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the user list in the [EU Cloud](https://my.wallarm.com/settings/users) or [US Cloud](https://us1.my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation][img-create-wallarm-node]
1. Copy the generated token.
1. Execute the `register-node` script to run the **Wallarm node**:

    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> --force
        ```
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com --force
        ```
    
    * `<NODE_TOKEN>` is the Wallarm node token.
    * The `--force` option forces rewriting of the Wallarm Cloud access credentials specified in the `/etc/wallarm/node.yaml` file.

## Step 5: Restart the postanalytics module

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
