[tarantool-status]:           ../images/tarantool-status.png

# Separate Postanalytics Installation

--8<-- "../include/installation-options-en.md"

To install postanalytics, you must:

1. Add the Wallarm repositories, which is where you will download the packages.
2. Install the Wallarm packages.
3. Configure postanalytics.
4. Connect postanalytics to the Wallarm cloud.
5. Change the Tarantool addresses for postanalytics.

--8<-- "../include/elevated-priveleges.md"

## 1. Add the Wallarm Repositories

The installation and updating of the filter node is done from the Wallarm
repositories.

Depending on your operating system, run one of the commands:

--8<-- "../include/add-repo-en.md"

--8<-- "../include/access-repo-en.md"

## 2. Install the Wallarm Packages

!!! warning "Update OpenSSL"
    Update the OpenSSL package to the latest version available from the repositories of your operating system. Make sure to do this prior to installing the Wallarm packages.

Install NGINX-Wallarm and the required scripts to interact with the
Wallarm cloud.

--8<-- "../include/install-package-postanalytics-en.md"

## 3. Configure Postanalytics

--8<-- "../include/configure-postanalytics-separate-en.md"

**Check Tarantool status**

To make sure that the postanalytics module has been installed correctly and started successfully, enter the following command:

--8<-- "../include/check-postanalytics-status.md"

The module status should be `active`:

![!wallarm-tarantool status][tarantool-status]

## 4. Connect Postanalytics to the Wallarm Cloud

Provide access to the Wallarm cloud so that postanalytics can always update the rules, upload metrics, and the attack data.

Run one of the following scripts depending on the [cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#cloud) in use: 

=== "EU cloud"
    ```bash
    /usr/share/wallarm-common/addnode --no-sync
    ```
=== "US cloud"
    ```bash
    /usr/share/wallarm-common/addnode -H us1.api.wallarm.com --no-sync
    ```

Once started, the script will prompt for the login and password. Provide the login and password that you use to access the Wallarm portal in the [EU](https://my.wallarm.com) or [US](https://us1.my.wallarm.com) cloud.

Your Wallarm account must have the **Administrator** role. If you have the **Analyst** role, the script will error out.

Accounts with 2FA enabled are not supported. Therefore, script will error out.

!!! info "API Access"
    The API choice for your filter node depends on the cloud you are using. Please, select the API accordingly:

    * If you are using [EU](https://my.wallarm.com) cloud, your node requires access to `https://api.wallarm.com:444`.
    * If you are using [US](https://us1.my.wallarm.com) cloud, your node requires access to `https://us1.api.wallarm.com:444`.
   
    Ensure the access is not blocked by a firewall.

## 5. Change the Tarantool Addresses for Postanalytics

If the configuration file of Tarantool is set up to accept connections on the IP
addresses different from `0.0.0.0` or `127.0.0.1`, then you must provide the addresses
in `/etc/wallarm/node.yaml`:

```
hostname: <node hostname>
uuid: <node uuid>
secret: <node secret>
tarantool:
   host: <IP address of Tarantool host>
   port: 3313
```

## The Installation Is Complete

This completes the installation of postanalytics.

!!! warning "Protect Installed Postanalytics Module"
    We **highly recommend** to protect a newly installed Wallarm postanalytics module with a firewall. Otherwise, there is a risk of getting unauthorized access to the service that may result in:
    
    *   disclosure of information about processed requests, and
    *   possibility of executing arbitrary Lua code and operating system commands.
         
    Please note that no such risk exists if you are deploying the postanalytics module alongside with the other Wallarm module on the same server. This holds true because the postanalytics module will listen to the `127.0.0.1:3313`.    
    
    
    **Here are the firewall settings that should be applied to the separately installed postanalytics module:**

    *   Allow the HTTPS traffic to and from the Wallarm API servers, so the postanalytics module can interact with these servers:
        *   `api.wallarm.com:444` is the API server in the EU Wallarm cloud.
        *   `us1.api.wallarm.com:444` is the API server in the US Wallarm cloud.
    *   Restrict the access to the `3313` Tarantool port via TCP and UDP protocols by allowing connections only from the IP addresses of the Wallarm filter nodes.    
