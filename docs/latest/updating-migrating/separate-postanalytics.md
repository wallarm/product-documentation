[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../images/tarantool-status.png
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md

# Upgrading the postanalytics module

These instructions describe the steps to upgrade the postanalytics module 4.x installed on a separate server. Postanalytics module must be upgraded before [Upgrading Wallarm NGINX modules][docs-module-update].

To upgrade the end‑of‑life module (3.6 or lower), please use the [different instructions](older-versions/separate-postanalytics.md).

## Upgrade methods

--8<-- "../include/waf/installation/upgrade-methods.md"

## Upgrade with all-in-one installer

Use the procedure below to upgrade the postanalytics module 4.x installed on a separate server to version 4.10 using [all-in-one installer](../installation/nginx/all-in-one.md).

### Requirements for upgrade using all-in-one installer

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### Step 1: Prepare clean machine

--8<-- "../include/waf/installation/all-in-one-clean-machine.md"

### Step 2: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

### Step 3: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### Step 4: Run all-in-one Wallarm installer to install postanalytics

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

### Step 5: Upgrade the NGINX-Wallarm module on a separate server

Once the postanalytics module is installed on the separate server, [upgrade its related NGINX-Wallarm module](nginx-modules.md) running on a different server.

!!! info "Combining upgrade methods"
    Both manual and automatic approaches can be used to upgrade the related NGINX-Wallarm module.

### Step 6: Re-connect the NGINX-Wallarm module to the postanalytics module

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

### Step 7: Check the NGINX‑Wallarm and separate postanalytics modules interaction

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"

### Step 8: Remove old postanalytics module

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"

## Manual upgrade

Use the procedure below to manually upgrade the postanalytics module 4.x installed on a separate server to version 4.8.

!!! info "Support for 4.10"
    The DEB/RPM packages for manual node installation have not been updated to the 4.10 release yet.

### Requirements

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

### Step 1: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version packages. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
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
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/
        ```

### Step 2: Upgrade the Tarantool packages

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

    --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.8.md"

    --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum update
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum update
    ```

### Step 3: Update the node type

!!! info "Only for nodes installed using the `addnode` script"
    Only follow this step if a node of a previous version is connected to the Wallarm Cloud using the `addnode` script. This script has been [removed](older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens) and replaced by the `register-node`, which requires a token to register the node in the Cloud.

1. Make sure that your Wallarm account has the **Administrator** role by navigating to the user list in the [US Cloud](https://us1.my.wallarm.com/settings/users) or [EU Cloud](https://my.wallarm.com/settings/users).

    ![User list in Wallarm console][img-wl-console-users]
1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![Wallarm node creation][img-create-wallarm-node]
1. Copy the generated token.
1. Execute the `register-node` script to run the node:

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>` is the copied value of the node token or API token with the `Deploy` role.
    * The `--force` option forces rewriting of the Wallarm Cloud access credentials specified in the `/etc/wallarm/node.yaml` file.

### Step 4: Restart the postanalytics module

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
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

[Upgrade Wallarm NGINX modules][docs-module-update]