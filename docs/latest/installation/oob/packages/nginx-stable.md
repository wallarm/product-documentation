[img-wl-console-users]:             ../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx

# WIP: Installing Wallarm OOB for NGINX stable on Debian/Ubuntu/CentOS

This article instructs you on installing Wallarm Out-of-Band (OOB) from DEB/RPM packages for a traffic mirror produced by NGINX stable.

Wallarm supports the following operating systems:

* Debian 11.x (bullseye)
* Ubuntu 18.04 LTS (bionic)
* Ubuntu 20.04 LTS (focal)
* Ubuntu 22.04 LTS (jammy)
* CentOS 7.x
* Amazon Linux 2.0.2021x and lower
* AlmaLinux, Rocky Linux or Oracle Linux 8.x

## Requirements

* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* SELinux disabled or configured upon the [instructions][configure-selinux-instr]
* NGINX version 1.22.1

    !!! info "Custom NGINX versions"
        If you have a different version, see [how to connect the Wallarm module to custom build of NGINX][nginx-custom]
* Executing all commands as a superuser (e.g. `root`)
* For the request processing and postanalytics on different servers: postanalytics installed on the separate server upon the [instructions][install-postanalytics-instr]
* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Installed text editor **vim**, **nano**, or any other. In the instruction, **vim** is used

## Configure NGINX to mirror the traffic

For NGINX to mirror the traffic:

1. Configure the [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) module by setting the `mirror` directive in the `location` or `server` block.

    The example below will mirror requests received at `location /` to `location /mirror-test`.
1. To send the mirrored traffic to the Wallarm node, list the headers to be mirrored and specify the IP address of the machine with the node in the `location` the `mirror` directive points.

```
location / {
        mirror /mirror-test;
        mirror_request_body on;
        root   /usr/share/nginx/html;
        index  index.html index.htm; 
    }
    
location /mirror-test {
        internal;
        #proxy_pass http://111.11.111.1$request_uri;
        proxy_pass http://222.222.222.222$request_uri;
        proxy_set_header X-SERVER-PORT $server_port;
        proxy_set_header X-SERVER-ADDR $server_addr;
        proxy_set_header HOST $http_host;
        proxy_set_header X-Forwarded-For $realip_remote_addr;
        proxy_set_header X-Forwarded-Port $realip_remote_port;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Request-ID $request_id;
    }
```

<!-- 
1. where to configure?
1. Install NGINX stable before mirroring conf or after??
1. how to mention load balancing???
1. is separate postanalytics installation supported?
 -->

## Install the Wallarm node

### 1. Install NGINX stable and dependencies

These are the following options to install NGINX `stable` from the NGINX repository:

* Installation from the built package

    === "Debian"
        ```bash
        sudo apt -y install curl gnupg2 ca-certificates lsb-release debian-archive-keyring
        echo "deb http://nginx.org/packages/debian `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
        curl -fSsL https://nginx.org/keys/nginx_signing.key | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/nginx.gpg --import
        sudo chmod 644 /etc/apt/trusted.gpg.d/nginx.gpg
        sudo apt update
        sudo apt -y install nginx
        ```
    === "Ubuntu"
        1. Install the dependencies required for NGINX stable:

            ```bash
            sudo apt -y install curl gnupg2 ca-certificates lsb-release
            ```
        1. Install NGINX stable:

            ```bash
            echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
            curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
            sudo apt update
            sudo apt -y install nginx
            ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"

        1. If an EPEL repository is added in CentOS 7.x, please disable installation of NGINX stable from this repository by adding `exclude=nginx*` to the file `/etc/yum.repos.d/epel.repo`.

            Example of the changed file `/etc/yum.repos.d/epel.repo`:

            ```bash
            [epel]
            name=Extra Packages for Enterprise Linux 7 - $basearch
            #baseurl=http://download.fedoraproject.org/pub/epel/7/$basearch
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-7&arch=$basearch
            failovermethod=priority
            enabled=1
            gpgcheck=1
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            exclude=nginx*

            [epel-debuginfo]
            name=Extra Packages for Enterprise Linux 7 - $basearch - Debug
            #baseurl=http://download.fedoraproject.org/pub/epel/7/$basearch/debug
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-debug-7&arch=$basearch
            failovermethod=priority
            enabled=0
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            gpgcheck=1

            [epel-source]
            name=Extra Packages for Enterprise Linux 7 - $basearch - Source
            #baseurl=http://download.fedoraproject.org/pub/epel/7/SRPMS
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-source-7&arch=$basearch
            failovermethod=priority
            enabled=0
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            gpgcheck=1
            ```
        
        2. Install NGINX stable from the official repository:

            ```bash
            echo -e '\n[nginx-stable] \nname=nginx stable repo \nbaseurl=http://nginx.org/packages/centos/$releasever/$basearch/ \ngpgcheck=1 \nenabled=1 \ngpgkey=https://nginx.org/keys/nginx_signing.key \nmodule_hotfixes=true' | sudo tee /etc/yum.repos.d/nginx.repo
            sudo yum install -y nginx
            ```

* Compilation of the source code from the `stable` branch of the [NGINX repository](https://hg.nginx.org/pkg-oss/branches) and installation with the same options.

    !!! info "NGINX for AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        This is the only option to install NGINX on AlmaLinux, Rocky Linux or Oracle Linux 8.x.

More detailed information about installation is available in the [official NGINX documentation](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/).

!!! info "Installing on Amazon Linux 2.0.2021x and lower"
    To install NGINX Plus on Amazon Linux 2.0.2021x and lower, use the CentOS 7 instructions.

### 2. Add Wallarm repositories

Wallarm node is installed and updated from the Wallarm repositories. To add repositories, use the commands for your platform:

--8<-- "../include/waf/installation/add-nginx-waf-repos-4.4.md"

### 3. Install Wallarm packages

The following packages are required:

* `nginx-module-wallarm` for the NGINX-Wallarm module
* `wallarm-node` for the postanalytics module, Tarantool database, and additional NGINX-Wallarm packages

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```

### 4. Connect the Wallarm module

1. Open the file `/etc/nginx/nginx.conf`:

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. Ensure that the `include /etc/nginx/conf.d/*;` line is added to the file. If there is no such line, add it.
3. Add the following directive right after the `worker_processes` directive:

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    Configuration example with the added directive:

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

4. Copy the configuration files for the system setup:

    ``` bash
    sudo cp /usr/share/doc/nginx-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

### 5. Connect the filtering node to Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.4.md"

## Configure Wallarm node to filter mirrored traffic

For the Wallarm node to process mirrored traffic:

1. Set the following configuration in the `/etc/nginx/conf.d/default.conf` file:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    #Change 222.222.222.22 to the address of the mirroring server
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    #real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * The [`real_ip_header`](../../using-proxy-or-balancer-en.md) directive is required to have Wallarm Console display the IP addresses of the attackers.
    * The `wallarm_force_response_*` directives are required to disable analysis of all requests except for copies received from the mirrored traffic.
    * Since malicious requests [cannot](overview.md#limitations-of-mirrored-traffic-filtration) be blocked, the Wallarm node always analyzes requests in the monitoring [mode](../../configure-wallarm-mode.md) even if the `wallarm_mode` directive or Wallarm Cloud sets the safe or regular blocking mode (aside from the mode set to off).
1. Restart NGINX:

    --8<-- "../include/waf/root_perm_info.md"

    --8<-- "../include/waf/restart-nginx-3.6.md"

## Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

<!-- any other configuration to be mentioned??? -->