[docs-module-update]:   nginx-modules.md

#   Updating the Separately Installed Postanalytics Module  

These instructions describe the steps to update the postanalytics module installed on a separate server. Postanalytics module must be updated before [updating Linux WAF packages][docs-module-update].

!!! warning "Breaking changes and skipping partner WAF node update"
    * The WAF node 3.0 is **totally incompatible with previous WAF node versions**. Before updating the modules up to 3.0, please carefully review the list of [WAF node 3.0 changes](what-is-new.md) and consider a possible configuration change.
    * We do NOT recommend updating [partner WAF node](../partner-waf-node/overview.md) up to version 3.0, since most changes will be fully supported only in partner WAF node [3.2](versioning-policy.md#version-list).

## Step 1: Add new Wallarm WAF repository

Delete the previous Wallarm WAF repository address and add a repository with a new WAF node version packages. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2**

=== "CentOS 7 and Amazon Linux 2"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/3.0/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
    ```
=== "CentOS 8"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/3.0/x86_64/Packages/wallarm-node-repo-1-6.el8.noarch.rpm
    ```

**Debian and Ubuntu**

1. Open the file with the Wallarm WAF repository address in the installed text editor. In this instruction, **vim** is used.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Comment out or delete the previous repository address.
3. Add a new repository address:

    === "Debian 9.x (stretch)"
        ``` bash
        deb http://repo.wallarm.com/debian/wallarm-node stretch/3.0/
        ```
    === "Debian 9.x (stretch-backports)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node stretch/3.0/
        deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/3.0/
        ```
    === "Debian 10.x (buster)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node buster/3.0/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/3.0/
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
