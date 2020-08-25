[kong-install]:         https://konghq.com/install/
[kong-docs]:            https://getkong.org/docs/
[kong-admin-api]:       https://getkong.org/docs/0.10.x/admin-api/

[doc-wallarmblockpage]: configure-parameters-en.md#wallarm_block_page
[doc-postanalytics]:    installation-postanalytics-en.md
[doc-supported-os]:     supported-platforms.md

# Installing with Kong

!!! info "Prerequisites"
    Requirements for the Kong platform:

    * Kong version 1.4.3 or lower
    * Kong installed on a platform [supported by Wallarm][doc-supported-os] according to Kong's [official instructions][kong-install]
    
    One of the following points is required for proper Kong operation:
    
    * prepared configuration files,
    * configured database.
    
    Please make sure that the installed Kong meets the prerequisites before proceeding with Wallarm installation.
    
    The official Kong documentation is available at this [link][kong-docs].

!!! warning "Known Limitations"
    * The [`wallarm_block_page`][doc-wallarmblockpage] directive is not supported.
    * Wallarm configuration via [Kong Admin API][kong-admin-api] is not supported.

## Installation

!!! warning "Installation of postanalytics on a separate server"
    If you are planning to install postanalytics on a separate server, you must install postanalytics first. 
    
    See details in [Separate postanalytics installation][doc-postanalytics].

To install the Wallarm module with Kong, you need to:

1. Add Wallarm repositories.
2. Install Wallarm packages.
3. Configure postanalytics.
4. Set up the filter node for using a proxy server.
5. Connect the filter node to the Wallarm cloud.
6. Configure the postanalytics server addresses.
7. Configure the filtration mode.
8. Configure logging.

--8<-- "../include/elevated-priveleges.md"

!!! info "If Wallarm WAF is already installed in your environment"
    If you install Wallarm WAF instead of already existing Wallarm WAF or need to duplicate the installation in the same environment, please keep the same WAF version as currently used or update the version of all installations to the latest.

    To check the installed version:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    * If the version `2.14.x` is installed, follow the current instruction.
    * If the version `2.12.x` is installed, follow the [instructions for 2.12](/2.12/admin-en/installation-kong-en/) or [update the packages to 2.14](../updating-migrating/nginx-modules.md) in all installations.
    * If the deprecated version is installed (`2.10.x` or lower), please [update the packages to 2.14](../updating-migrating/nginx-modules.md) in all installations.

## 1. Add Wallarm Repositories

The filter node installs and updates from the Wallarm repositories.

Depending on your operating system, run one of the following commands:

--8<-- "../include/add-repo-kong-en.md"

--8<-- "../include/access-repo-en.md"

## 2. Install Wallarm Packages

To install the filter node and postanalytics on the same server, run the command:

--8<-- "../include/install-package-kong-en.md"

To install the filter node alone, run the command:

--8<-- "../include/install-package-primary-kong-en.md"

## 3. Configure Postanalytics 

!!! info
    Skip this step if you installed postanalytics on a separate server as you already have your postanalytics configured.

--8<-- "../include/configure-postanalytics-kong-en.md"

## 4. Set up the Filter Node for Using a Proxy Server

--8<-- "../include/setup-proxy.md"

## 5. Connect the Filter Node to the Wallarm Cloud

--8<-- "../include/connect-cloud-en.md"

## 6. Configure the Postanalytics Server Addresses

!!! info
    * Skip this step if you installed postanalytics and the filter node on the same server.
    * Do this step if you installed postanalytics and the filter node on separate servers.

--8<-- "../include/configure-postanalytics-address-kong-en.md"

## 7. Set up the Filtration Mode

--8<-- "../include/setup-filter-kong-en.md"

## 8. Configure Logging

--8<-- "../include/installation-step-logging.md"

## Start Kong

To start Kong with the installed Wallarm module, run the command:

```
kong start --nginx-conf /etc/kong/nginx-wallarm.template
```

## The Installation Is Complete

--8<-- "../include/check-setup-installation-en.md"

--8<-- "../include/filter-node-defaults.md"

--8<-- "../include/installation-extra-steps.md"