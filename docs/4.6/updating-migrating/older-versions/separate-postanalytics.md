[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../custom/custom-nginx-version.md

# Upgrading the EOL postanalytics module

These instructions describe the steps to upgrade the end‑of‑life postanalytics module (version 3.6 and lower) installed on a separate server. Postanalytics module must be upgraded before [Upgrading Wallarm NGINX modules][docs-module-update].

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Requirements

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

## Step 1: Update API port

--8<-- "../include/waf/upgrade/api-port-443.md"

## Step 2: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version packages. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "Support for CentOS 8.x has been deprecated"
        Support for CentOS 8.x [has been deprecated](https://www.centos.org/centos-linux-eol/). You can install the Wallarm node on the AlmaLinux, Rocky Linux or Oracle Linux 8.x operating system insted.

        * [Installation instructions for NGINX `stable`](../../installation/nginx/dynamic-module.md)
        * [Installation instructions for NGINX from CentOS/Debian repositories](../../installation/nginx/dynamic-module-from-distr.md)
        * [Installation instructions for NGINX Plus](../../installation/nginx-plus.md)
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
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
            Official NGINX versions (stable and Plus) and, as a result, Wallarm node 4.4 and above cannot be installed on Debian 10.x (buster). Please use this OS only if [NGINX is installed from Debian/CentOS repositories](../../installation/nginx/dynamic-module-from-distr.md).

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.6/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.6/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.6/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/
        ```

## Step 3: Upgrade the Tarantool packages

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.6.md"

    --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.6.md"

    --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum update
    ```

## Step 4: Update the node type

The deployed postanalytics node 3.6 or lower has the deprecated **regular** type that is [now replaced with the new **Wallarm node** type](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

It is recommended to install the new node type instead of the deprecated one during migration to the version 4.6. The regular node type will be removed in future releases, please migrate before.

To replace the regular postanalytics node with the Wallarm node:

1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation][img-create-wallarm-node]
1. Copy the generated token.
1. Execute the `register-node` script to run the **Wallarm node**:

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

    <div class="admonition info"> <p class="admonition-title">Using one token for several installations</p> <p>You have two options for using one token for several installations:</p> <ul><li>**For all node versions**, you can use one [**node token**](../../quickstart.md#deploy-the-wallarm-filtering-node) in several installations regardless of the selected [platform](../../installation/supported-deployment-options.md). It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.</li><li><p>**Starting from node 4.6**, for nodes grouping, you can use one [**API token**](../../user-guides/settings/api-tokens.md) with the `Deploy` role together with the `--labels 'group=<GROUP>'` flag, for example:</p>
    ```
    sudo /usr/share/wallarm-common/register-node -t <API TOKEN WITH DEPLOY ROLE> --labels 'group=<GROUP>'
    ```
    </p></li></div>

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

[Upgrade Wallarm NGINX modules][docs-module-update]