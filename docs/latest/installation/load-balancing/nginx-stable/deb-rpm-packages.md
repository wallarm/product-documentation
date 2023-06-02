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
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.md
[oob-docs]:                         ../../oob/overview.md
[oob-advantages-limitations]:       ../../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# Installing dynamic Wallarm module for NGINX stable from NGINX repository

These instructions describe the steps to install Wallarm filtering node as a dynamic module for the open source version of NGINX `stable` that was installed from the NGINX repository.

## Requirements

* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* SELinux disabled or configured upon the [instructions][configure-selinux-instr]
* NGINX version 1.24.0

    !!! info "Custom NGINX versions"
        If you have a different version, see [how to connect the Wallarm module to custom build of NGINX][nginx-custom]
* Executing all commands as a superuser (e.g. `root`)
* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Access to [GCP storage addresses](https://www.gstatic.com/ipranges/goog.json) to download an actual list of IP addresses registered in [allowlisted, denylisted, or graylisted][ip-lists-docs] countries, regions or data centers
* Installed text editor **vim**, **nano**, or any other. In the instruction, **vim** is used

## 1. Install NGINX stable and dependencies

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

## 2. Add Wallarm repositories

Wallarm node is installed and updated from the Wallarm repositories. To add repositories, use the commands for your platform:

--8<-- "../include/waf/installation/add-nginx-waf-repos-4.6.md"

## 3. Install Wallarm packages

The following packages are required:

* `nginx-module-wallarm` for the NGINX-Wallarm module
* `wallarm-node` for the [postanalytics](../../../admin-en/installation-postanalytics-en.md) module, Tarantool database, and additional NGINX-Wallarm packages

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

## 4. Connect the Wallarm module

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

## 5. Connect the filtering node to Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"

## 6. Enable Wallarm to analyze the traffic

By default, the deployed Wallarm node does not analyze incoming traffic.

Configure Wallarm to proxy traffic by changing the `/etc/nginx/conf.d/default.conf` file on the machine with the installed node as follows:

1. Set an IP address for Wallarm to proxy legitimate traffic to. It can be an IP of an application instance, load balancer, or DNS name, etc., depending on your architectire.

    To do so, edit the `proxy_pass` value, e.g. Wallarm should send legitimate requests to `http://10.80.0.5`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;

        ...

        location / {
            proxy_pass http://10.80.0.5; 
            ...
        }
    }
    ```
1. For the Wallarm node to analyze the incoming traffic, set the `wallarm_mode` directive to `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    The monitoring mode is the recommended one for the first deployment and solution testing. Wallarm provides safe blocking and blocking modes as well, [read more][waf-mode-instr].

## 7. Restart NGINX

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-3.6.md"

## 8. Configure sending traffic to the Wallarm instance

Update targets of your load balancer to send traffic to the Wallarm instance. For details, please refer to the documentation on your load balancer.

## 9. Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. Fine-tune the deployed solution

The dynamic Wallarm module with default settings is installed for NGINX `stable`. The filtering node may require some additional configuration after deployment.

Wallarm settings are defined using the [NGINX directives](../../../admin-en/configure-parameters-en.md) or the Wallarm Console UI. Directives should be set in the following files on the machine with the Wallarm node:

* `/etc/nginx/conf.d/default.conf` with NGINX settings
* `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings

    The file is used for settings applied to all domains. To apply different settings to different domain groups, use the file `default.conf` or create new configuration files for each domain group (for example, `example.com.conf` and `test.com.conf`). More detailed information about NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` with the Tarantool database settings

Below there are a few of the typical settings that you can apply if needed:

* [Configuration of the filtration mode][waf-mode-instr]
* [Allocating resources for Wallarm nodes][memory-instr]
* [Logging Wallarm node variables][logging-instr]
* [Using the balancer of the proxy server behind the filtering node][proxy-balancer-instr]
* [Limiting the single request processing time in the directive `wallarm_process_time_limit`][process-time-limit-instr]
* [Limiting the server reply waiting time in the NGINX directive `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limiting the maximum request size in the NGINX directive `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Configuring dynamic DNS resolution in NGINX][dynamic-dns-resolution-nginx]
