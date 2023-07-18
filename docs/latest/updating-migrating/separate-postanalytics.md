[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../images/tarantool-status.png

#   Upgrading the postanalytics module

These instructions describe the steps to upgrade the postanalytics module 4.x installed on a separate server. Postanalytics module must be upgraded before [Upgrading Wallarm NGINX modules][docs-module-update].

To upgrade the end‑of‑life module (3.6 or lower), please use the [different instructions](older-versions/separate-postanalytics.md).

## Upgrade methods

You can upgrade the postanalytics module 4.x installed on a separate server to version 4.6 in two different ways:

* Migrate to the [all-in-one installer](#upgrade-with-all-in-one-installer) usage during the upgrade procedure. This is the recommended approach as it automates various postanalytics module installation and upgrade activities, such as OS version identification, adding appropriate Wallarm repositories and installing packages, and others.
* Keep using the current [manual](#manual-upgrade) installation method. However, it's important to note that this approach might require additional effort and manual configuration during the upgrade process in comparison to the new all-in-one method.

## Upgrade with all-in-one installer

Use the procedure below to upgrade the postanalytics module 4.x installed on a separate server to version 4.6 using [all-in-one installer](../installation/nginx/all-in-one.md).

### Requirements for upgrade using all-in-one installer

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### Step 1: Prepare clean machine

When upgrading from postanalytics module 4.x to 4.6 with all-in-one installer, you cannot upgrade an old package installation - instead you need to use a clean machine. Thus, as step 1, prepare a machine with one of the supported OS:

* Debian 10, 11 and 12.x
* Ubuntu LTS 18.04, 20.04, 22.04
* CentOS 7, 8 Stream, 9 Stream
* Alma/Rocky Linux 9
* Oracle Linux 8.x
* Redos
* SuSe Linux
* Others (the list is constantly widening, contact [Wallarm support team](mailto:support@wallarm.com) to check if your OS is in the list)

### Step 2: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

### Step 3: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### Step 4: Run all-in-one Wallarm installer to install postanalytics

To install postanalytics separately via all-in-one script, use:

=== "API token"
    ```bash
    # If using the x86_64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.12.x86_64-glibc.sh postanalytics

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.12.aarch64-glibc.sh postanalytics
    ```        

    The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

=== "Node token"
    ```bash
    # If using the x86_64 version:
    sudo sh wallarm-4.6.12.x86_64-glibc.sh postanalytics

    # If using the ARM64 version:
    sudo sh wallarm-4.6.12.aarch64-glibc.sh postanalytics
    ```

### Step 5: Upgrade the NGINX-Wallarm module on a separate server

Once the postanalytics module is installed on the separate server, [upgrade its related NGINX-Wallarm module](nginx-modules.md) running on a different server.

!!! info "Combining upgrade methods"
    Both manual and automatic approaches can be used to upgrade the related NGINX-Wallarm module.

### Step 6: Re-connect the NGINX-Wallarm module to the postanalytics module

On the machine with the NGINX-Wallarm module, in the NGINX configuration file, specify the postanalytics module server address:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* `max_conns` value must be specified for each of the upstream Tarantool servers to prevent the creation of excessive connections.
* `keepalive` value must not be lower than the number of the Tarantool servers.
* The `# wallarm_tarantool_upstream wallarm_tarantool;` string is commented by default - please delete `#`.

Once the configuration file changed, restart NGINX/NGINX Plus on the NGINX-Wallarm module server:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

### Step 7: Check the NGINX‑Wallarm and separate postanalytics modules interaction

To check the NGINX‑Wallarm and separate postanalytics modules interaction, you can send the request with test attack to the address of the protected application:

```bash
curl http://localhost/etc/passwd
```

If the NGINX‑Wallarm and separate postanalytics modules are configured properly, the attack will be uploaded to the Wallarm Cloud and displayed in the **Events** section of Wallarm Console:

![!Attacks in the interface](../images/admin-guides/test-attacks-quickstart.png)

If the attack was not uploaded to the Cloud, please check that there are no errors in the services operation:

* Make sure that the postanalytics service `wallarm-tarantool` is in the status `active`

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![!wallarm-tarantool status][tarantool-status]
* Analyze the postanalytics module logs

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    If there is the record like `SystemError binary: failed to bind: Cannot assign requested address`, make sure that the server accepts connection on specified address and port.
* On the server with the NGINX‑Wallarm module, analyze the NGINX logs:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    If there is the record like `[error] wallarm: <address> connect() failed`, make sure that the address of separate postanalytics module is specified correctly in the NGINX‑Wallarm module configuration files and separate postanalytics server accepts connection on specified address and port.
* On the server with the NGINX‑Wallarm module, get the statistics on processed requests using the command below and make sure that the value of `tnt_errors` is 0

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [Description of all parameters returned by the statistics service →](../admin-en/configure-statistics-service.md)

### Step 8: Remove old postanalytics module

1. Delete old postanalytics module in Wallarm Console → **Nodes** by selecting your postanalytics module node and clicking **Delete**.
1. Confirm the action.
    
    When the postanalytics module node is deleted from Cloud, it will stop participation in filtration of requests to your applications. Deleting cannot be undone. The postanalytics module node will be deleted from the list of nodes permanently.

1. Delete machine with the old postanalytics module or just clean it from Wallarm postanalytics module components:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```

## Manual upgrade

Use the procedure below to manually upgrade the postanalytics module 4.x installed on a separate server to version 4.6.

### Requirements

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

### Step 1: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version packages. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
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
            Official NGINX versions (stable and Plus) and, as a result, Wallarm node 4.4 and above cannot be installed on Debian 10.x (buster). Please use this OS only if [NGINX is installed from Debian/CentOS repositories](../installation/nginx/dynamic-module-from-distr.md).

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

### Step 2: Upgrade the Tarantool packages

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

### Step 3: Update the node type

!!! info "Only for nodes installed using the `addnode` script"
    Only follow this step if a node of a previous version is connected to the Wallarm Cloud using the `addnode` script. This script has been [removed](what-is-new.md#removal-of-the-email-password-based-node-registration) and replaced by the `register-node`, which requires a token to register the node in the Cloud.

1. Make sure that your Wallarm account has the **Administrator** role by navigating to the user list in the [US Cloud](https://us1.my.wallarm.com/settings/users) or [EU Cloud](https://my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation][img-create-wallarm-node]
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

    <div class="admonition info"> <p class="admonition-title">Using one token for several installations</p> <p>You have two options for using one token for several installations:</p> <ul><li>**For all node versions**, you can use one [**node token**](../quickstart.md#deploy-the-wallarm-filtering-node) in several installations regardless of the selected [platform](../installation/supported-deployment-options.md). It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.</li><li><p>**Starting from node 4.6**, for nodes grouping, you can use one [**API token**](../user-guides/settings/api-tokens.md) with the `Deploy` role together with the `--labels 'group=<GROUP>'` flag, for example:</p>
    ```
    sudo /usr/share/wallarm-common/register-node -t <API TOKEN WITH DEPLOY ROLE> --labels 'group=<GROUP>'
    ```
    </p></li></div>

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

[Upgrade Wallarm NGINX modules][docs-module-update]