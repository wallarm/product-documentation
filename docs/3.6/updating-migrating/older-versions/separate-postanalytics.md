[docs-module-update]:   nginx-modules.md

#   Upgrading the postanalytics module 2.18 or lower

These instructions describe the steps to upgrade the postanalytics module 2.18 or lower installed on a separate server. Postanalytics module must be upgraded before [Upgrading Wallarm NGINX modules][docs-module-update].

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Step 1: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version packages. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CloudLinux OS 6.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/6/3.6/x86_64/Packages/wallarm-node-repo-1-6.el6.noarch.rpm
    ```
=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/3.6/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "Support for CentOS 8.x has been deprecated"
        Support for CentOS 8.x [has been deprecated](https://www.centos.org/centos-linux-eol/). You can [install](../../admin-en/installation-postanalytics-en.md) the postanalytics module 3.6 on the AlmaLinux, Rocky Linux or Oracle Linux 8.x operating system insted.

**Debian and Ubuntu**

1. Open the file with the Wallarm repository address in the installed text editor. In this instruction, **vim** is used.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Comment out or delete the previous repository address.
3. Add a new repository address:

    === "Debian 9.x (stretch)"
        ``` bash
        deb https://repo.wallarm.com/debian/wallarm-node stretch/3.6/
        ```
    === "Debian 9.x (stretch-backports)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node stretch/3.6/
        deb https://repo.wallarm.com/debian/wallarm-node stretch-backports/3.6/
        ```
    === "Debian 10.x (buster)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/3.6/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/3.6/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/
        ```

## Step 2: Upgrade the Tarantool packages

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

## Step 3: Restart the postanalytics module

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
