[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md

#   Upgrading the postanalytics module

These instructions describe the steps to upgrade the postanalytics module 4.x installed on a separate server. Postanalytics module must be upgraded before [Upgrading Wallarm NGINX modules][docs-module-update].

To upgrade the end‑of‑life module (3.6 or lower), please use the [different instructions](older-versions/separate-postanalytics.md).

## Requirements

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## Step 1: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version packages. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```

**Debian and Ubuntu**

1. Open the file with the Wallarm repository address in the installed text editor. In this instruction, **vim** is used.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Comment out or delete the previous repository address.
3. Add a new repository address:

    === "Debian 10.x (buster)"
        !!! warning "Unsupported by NGINX stable and NGINX Plus"
            Official NGINX versions (stable and Plus) and, as a result, Wallarm node 4.4 and above cannot be installed on Debian 10.x (buster). Please use this OS only if [NGINX is installed from Debian/CentOS repositories](../installation/nginx/dynamic-module-from-distr.md).

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.4/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.4/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.4/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/
        ```

## Step 2: Upgrade the Tarantool packages

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.4.md"

    --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.4.md"

    --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
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
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

[Upgrade Wallarm NGINX modules][docs-module-update]