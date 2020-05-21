# Installing as a Dynamic Module for NGINX

!!! warning "Commercial NGINX Plus and Open Source NGINX"
    This instruction addresses the filter node installation as a dynamic module for the open-source `stable` NGINX.
    Wallarm module for NGINX does not work with the `mainline` version of open-source NGINX.

    If you are running the commercial NGINX Plus, you need a different set of instructions. See [Installing with NGINX Plus](installation-nginxplus-en.md).

If you have a running NGINX installed in your network infrastructure, you can install Wallarm as a dynamic module for NGINX.

## Use with Official vs. Custom Builds of NGINX

Wallarm is compatible with NGINX installed from [official NGINX repositories](https://nginx.org/en/linux_packages.html).

If you are planning to install a custom build of NGINX, the dynamic module from the Wallarm repository might be incompatible and not load. To rebuild the dynamic module, contact [Wallarm Support](mailto:support@wallarm.com).

With your support request, provide the following information provided by the output of the given commands:

* Linux kernel version: `uname -a`
* Linux distributive: `cat /etc/*release`
* NGINX version:

  * [NGINX official build](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
  * NGINX custom build: `<path to nginx>/nginx -V`

* Compatibility signature:

  * [NGINX official build](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
  * NGINX custom build: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* The user (and the user's group) who is running the NGINX worker processes: `grep -w 'user' <path to the NGINX configuration files/nginx.conf>`

## Installation Options

--8<-- "../include/installation-options-nginx-en.md"

!!! warning "Installation of postanalytics on a separate server"
    If you are planning to install postanalytics on a separate server, you must install postanalytics first. See details in [Separate postanalytics installation](installation-postanalytics-en.md).

To install as a dynamic module for NGINX, you must:

1. Install NGINX.
2. Add the Wallarm repositories, from which you will download packages.
3. Install the Wallarm packages.
4. Configure postanalytics.
5. Connect the Wallarm module.
6. Set up the filter node for using a proxy server.
7. Connect the filter node to the Wallarm cloud.
8. Configure the server addresses of postanalytics.
9. Configure the filtration mode.
10. Configure logging.
11. Restart NGINX.
    
--8<-- "../include/elevated-priveleges.md"
    
## 1. Install NGINX

!!! warning "Stable version of NGINX module"
    Please note that the `stable` NGINX version should be installed because its `mainline` version is not compatible with the Wallarm NGINX module.

You can:

* Use [the official build](https://nginx.org/en/linux_packages.html).

    The instructions on how to install the `stable` NGINX for the [distributions supported by Wallarm](supported-platforms.md) are listed below:

    === "Debian"
        ```bash
        apt install curl gnupg2 ca-certificates lsb-release
        echo "deb http://nginx.org/packages/debian `lsb_release -cs` nginx" | tee /etc/apt/sources.list.d/nginx.list
        curl -fsSL https://nginx.org/keys/nginx_signing.key | apt-key add -
        apt update
        apt install nginx
        ```
    === "Ubuntu"
        ```bash
        apt install curl gnupg2 ca-certificates lsb-release
        echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | tee /etc/apt/sources.list.d/nginx.list
        curl -fsSL https://nginx.org/keys/nginx_signing.key | apt-key add -
        apt update
        apt install nginx
        ```
    === "CentOS or Amazon Linux 2"
        ```bash
        echo '[nginx-stable] name=nginx stable repo baseurl=http://nginx.org/packages/centos/$releasever/$basearch/ gpgcheck=1 enabled=1 gpgkey=https://nginx.org/keys/nginx_signing.key module_hotfixes=true' > /etc/yum.repos.d/nginx.repo
        yum install nginx
        ```

* Prepare a custom build with the similar compilation options. To do that, use the source code from the `stable` branch of the [NGINX repository](http://hg.nginx.org/pkg-oss/branches).

[See the official NGINX installation instructions](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/) for extra information.

!!! info "Installing on Amazon Linux 2"
    To install NGINX on Amazon Linux 2, use the CentOS 7 instruction.

## 2. Add the Wallarm Repositories

The installation and updating of the filter node is done from the Wallarm
repositories.

Depending on your operating system, run one of the commands:

--8<-- "../include/add-repo-en.md"

--8<-- "../include/access-repo-en.md"

--8<-- "../include/issue-with-gpg-keys.md"

## 3. Install the Wallarm Packages

### Install the Requests Processing and Postanalytics on the Same Server

To run postanalytics and process the requests on the same server, you need to
install the following packages:

* Wallarm module
* In-memory storage Tarantool.
* Postanalytics.

Run the following command to install the required packages:

--8<-- "../include/install-nginx-postanalytics-en.md"

### Install Only the Requests Processing on the Server

To only process the requests on the server, you need to install the following
package:

* Wallarm module

Run the following command to install the required package:

--8<-- "../include/install-nginx-en.md"

## 4. Configure Postanalytics

!!! info
    Skip this step if you installed postanalytics on a separate server as you already have your postanalytics configured.

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory.md"

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-others.md"

To get more information about memory allocation, please use this [documentation](../admin-en/configuration-guides/allocate-resources-for-waf-node.md).

## 5. Connect the Wallarm Module

Open the `/etc/nginx/nginx.conf` file.

Ensure that you have the `include /etc/nginx/conf.d/*` line in the file. If you do not, add it.

Add the following directive right after the `worker_processes` directive:

```
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

Copy the configuration files for the system setup:

```
cp /usr/share/doc/nginx-module-wallarm/examples/*.conf /etc/nginx/conf.d/
```

## 6. Set up the Filter Node for Using a Proxy Server

--8<-- "../include/setup-proxy.md"

## 7. Connect the Filter Node to the Wallarm Cloud

--8<-- "../include/connect-cloud-en.md"

## 8. Configure the Server Addresses of Postanalytics

!!! info
    * Skip this step if you installed postanalytics and the filter node on the same server.
    * Do this step if you installed postanalytics and the filter node on separate servers.

--8<-- "../include/configure-postanalytics-address-nginx-en.md"

## 9. Configure the Filtration Mode

--8<-- "../include/setup-filter-nginx-en.md"

## 10. Configure Logging

--8<-- "../include/installation-step-logging.md"

## 11. Restart NGINX

--8<-- "../include/root_perm_info.md"

--8<-- "../include/restart-nginx-en.md"

## The Installation Is Complete

--8<-- "../include/check-setup-installation-en.md"

--8<-- "../include/filter-node-defaults.md"

--8<-- "../include/installation-extra-steps.md"