[docs-module-update]:   nginx-modules.md

#   Upgrading the postanalytics module  

These instructions describe the steps to update the postanalytics module installed on a separate server. Postanalytics module must be updated before [Upgrading Wallarm NGINX modules][docs-module-update].

## Step 1: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version packages. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2**

=== "CentOS 7 and Amazon Linux 2"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/2.18/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
    ```
=== "CentOS 8"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/2.18/x86_64/Packages/wallarm-node-repo-1-6.el8.noarch.rpm
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
        deb http://repo.wallarm.com/debian/wallarm-node stretch/2.18/
        ```
    === "Debian 9.x (stretch-backports)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node stretch/2.18/
        deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/2.18/
        ```
    === "Debian 10.x (buster)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node buster/2.18/
        ```
    === "Ubuntu 16.04 LTS (xenial)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node xenial/2.18/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/2.18/
        ```

## Step 2: Update the Tarantool packages

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```
=== "CentOS или Amazon Linux 2"
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
=== "CentOS 7.x или Amazon Linux 2"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
