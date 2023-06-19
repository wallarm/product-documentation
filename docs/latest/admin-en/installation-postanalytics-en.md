[tarantool-status]:           ../images/tarantool-status.png
[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# Separate Postanalytics Module Installation

The processing of requests in the Wallarm node is divided into two stages:

* Primary processing in the NGINX-Wallarm module. The processing is not memory demanding and can be put on frontend servers without changing the server requirements.
* Statistical analysis of the processed requests in the postanalytics module. Postanalytics is memory demanding, which may require changes in the server configuration or installation of postanalytics on a separate server.

Depending on the system architecture, the NGINX-Wallarm and postanalytics modules can be installed on the **same server** or on **different servers**. By default, Wallarm deployment instructions cover the steps to install all modules on the same server.

These instructions provide the steps to install the postanalytics module on a separate server. This option is available only for the following Wallarm artifacts:

* [Linux packages via all-in-one Wallarm binary](../installation/nginx/all-in-one.md)
* [DEB/RPM packages for NGINX stable](../installation/nginx/dynamic-module.md)
* [DEB/RPM packages for NGINX Plus](../installation/nginx-plus.md)
* [DEB/RPM packages for distribution-provided NGINX](../installation/nginx/dynamic-module-from-distr.md)

## Requirements

* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* SELinux disabled or configured upon the [instructions][configure-selinux-instr]
* Executing all commands as a superuser (e.g. `root`)
* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://us1.api.wallarm.com` if working with US Wallarm Cloud or to `https://api.wallarm.com` if working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Access to [GCP storage addresses](https://www.gstatic.com/ipranges/goog.json) to download an actual list of IP addresses registered in [allowlisted, denylisted, or graylisted](../user-guides/ip-lists/overview.md) countries, regions or data centers
* Installed text editor **vim**, **nano**, or any other. In the instruction, **vim** is used

## All-in-one automatic installation

Starting from Wallarm node 4.6, to install postanalytics separately, it is recommended to usу the [all-in-one installation](../installation/nginx/all-in-one.md#separate-postanalytics-module-installation) which automates a lot of activities and makes node deployment much easier.

### 1. Download all-in-one Wallarm binary

To download all-in-one Wallarm installation script, execute the command:

```bash
curl -O https://meganode.wallarm.com/4.6/wallarm-4.6.11.x86_64-glibc.sh
```

### 2. Run all-in-one Wallarm binary to install postanalytics

To install postanalytics separately via all-in-one script, use:

```
sudo sh ./wallarm-4.6.11.x86_64-glibc.sh postanalytics
```

[Know the full picture of using all-in-one script for nodes installation →](../installation/nginx/all-in-one.md#separate-postanalytics-module-installation)

### 3-5. Automated

The following is automated by the all-in-one script:

* Connect the postanalytics module to Wallarm Cloud
* Update postanalytics module configuration
* Restart Wallarm services

Proceed to the [remaining steps](#remaining-steps), common for all-in-one and manual installation.

## Manual installation

### 1. Add Wallarm repositories

The postanalytics module, like the other Wallarm modules, is installed and updated from the Wallarm repositories. To add repositories, use the commands for your platform:

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
    ```

### 2. Install packages for the postanalytics module

Install the `wallarm-node-tarantool` package from the Wallarm repository for the postanalytics module and Tarantool database:

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```

### 3. Connect the postanalytics module to Wallarm Cloud

The postanalytics module interacts with the Wallarm Cloud. It is required to create the Wallarm node for the postanalytics module and connect this node to the Cloud. When connecting, you can set the postanalytics node name, under which it will be displayed in the Wallarm Console UI and put the node into the appropriate **node group** (used to logically organize nodes in UI). It is **recommended** to use the same node group for the node processing initial traffic and for the node performing postanalysis.

![!Grouped nodes](../images/user-guides/nodes/grouped-nodes.png)

To provide the node with access, you need to generate a token on the Cloud side and specify it on the machine with the node packages.

To connect the postanalytics filtering node to the Cloud:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Run the `register-node` script on a machine where you install the filtering node:

    === "API token"

        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```
        
        * `<TOKEN>` is the copied value of the API token with the `Deploy` role.
        * `--labels 'group=<GROUP>'` parameter puts your node to the `<GROUP>` node group (existing, or, if does not exist, it will be created).

    === "Node token"

        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```

        * `<TOKEN>` is the copied value of the node token.

    * Use `-H us1.api.wallarm.com` to install into US Cloud, remove this option to install to EU Cloud.
    * You may add `-n <HOST_NAME>` parameter to set a custom name for your node instance. Final instance name will be: `HOST_NAME_NodeUUID`.

### 4. Update postanalytics module configuration

The configuration files of the postanalytics module are located in the paths:

* `/etc/default/wallarm-tarantool` for Debian and Ubuntu operating systems
* `/etc/sysconfig/wallarm-tarantool` for CentOS and Amazon Linux 2.0.2021x and lower operating systems

To open the file in the editing mode, please use the command:

=== "Debian"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

#### Memory

The postanalytics module uses the in-memory storage Tarantool. For production environments, it is recommended to have larger amount of memory. If testing the Wallarm node or having a small server size, the lower amount can be enough.

The allocated memory size is set in GB via the `SLAB_ALLOC_ARENA` directive in the [`/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool`](#4-update-postanalytics-module-configuration) configuration file. The value can be an integer or a float (a dot `.` is a decimal separator).

Detailed recommendations about allocating memory for Tarantool are described in these [instructions](configuration-guides/allocate-resources-for-node.md).

#### Address of the separate postanalytics server

To set the address of the separate postanalytics server:

1. Open the Tarantool file in the editing mode:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. Uncomment the `HOST` and `PORT` variables and set them the following values:

    ```bash
    # address and port for bind
    HOST='0.0.0.0'
    PORT=3313
    ```
3. If the configuration file of Tarantool is set up to accept connections on the IP addresses different from `0.0.0.0` or `127.0.0.1`, then please provide the addresses in `/etc/wallarm/node.yaml`:

    ```bash
    hostname: <name of postanalytics node>
    uuid: <UUID of postanalytics node>
    secret: <secret key of postanalytics node>
    tarantool:
        host: '<IP address of Tarantool>'
        port: 3313
    ```

### 5. Restart Wallarm services

To apply the settings to the postanalytics module:

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

## Remaining steps

The remaining steps must be fulfilled both for [all-in-one automatic](#all-in-one-automatic-installation) and for [manual](#manual-installation) installation.

### 6. Install the NGINX-Wallarm module on a separate server

Once the postanalytics module is installed on the separate server, install the other Wallarm modules on a different server. Below are the links to the corresponding instructions and the package names to be specified for the NGINX-Wallarm module installation:

* [Linux packages via all-in-one Wallarm binary](../installation/nginx/all-in-one.md)

    To install filtering part separately, use:

    ```
    sudo sh ./wallarm-4.6.11.x86_64-glibc.sh filtering
    ```

* [NGINX stable](../installation/nginx/dynamic-module.md)

    In the package installation step, specify `wallarm-node-nginx` and `nginx-module-wallarm`.
* [NGINX Plus](../installation/nginx-plus.md)

    In the package installation step, specify `wallarm-node-nginx` and `nginx-plus-module-wallarm`.
* [Distribution-provided NGINX](../installation/nginx/dynamic-module-from-distr.md)

    In the package installation step, specify `wallarm-node-nginx` and `libnginx-mod-http-wallarm/nginx-mod-http-wallarm`.

--8<-- "../include/waf/installation/checking-compatibility-of-separate-postanalytics-and-primary-packages.md"

### 7. Connect the NGINX-Wallarm module to the postanalytics module

On the server with the NGINX-Wallarm module → the `/etc/nginx/conf.d/wallarm.conf` file, specify the postanalytics module server address:

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

### 8. Check the NGINX‑Wallarm and separate postanalytics modules interaction

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

    [Description of all parameters returned by the statistics service →](configure-statistics-service.md)

## Combining manual and automatic installation
    
When installing filtering and postanalytics module separately, you can combine manual and automatic approaches: install the filtering part (without postanalytics) manually and then postanalytics with all-in-one script and vise versa. When doing so, you need always manually [perform the step of connecting the NGINX-Wallarm module to the postanalytics module](#7-connect-the-nginx-wallarm-module-to-the-postanalytics-module).

## Postanalytics module protection

!!! warning "Protect installed postanalytics module"
    We **highly recommend** to protect a newly installed Wallarm postanalytics module with a firewall. Otherwise, there is a risk of getting unauthorized access to the service that may result in:
    
    *   Disclosure of information about processed requests
    *   Possibility of executing arbitrary Lua code and operating system commands
   
    Please note that no such risk exists if you are deploying the postanalytics module alongside with the NGINX-Wallarm module on the same server. This holds true because the postanalytics module will listen to the port `3313`.
    
    **Here are the firewall settings that should be applied to the separately installed postanalytics module:**
    
    *   Allow the HTTPS traffic to and from the Wallarm API servers, so the postanalytics module can interact with these servers:
        *   `us1.api.wallarm.com` is the API server in the US Wallarm Cloud
        *   `api.wallarm.com` is the API server in the EU Wallarm Cloud
    *   Restrict the access to the `3313` Tarantool port via TCP and UDP protocols by allowing connections only from the IP addresses of the Wallarm filtering nodes.

## Tarantool troubleshooting

[Tarantool troubleshooting](../faq/tarantool.md)
