[tarantool-status]:           ../images/tarantool-status.png

# Separate Postanalytics Installation

--8<-- "../include/installation-options-en.md"

To install postanalytics, you must:

1. Add the Wallarm repositories, from which you will download packages.
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

Provide access to the Wallarm cloud so that postanalytics can always update the rules, upload metrics and the attack data.

Run one of the following scripts depending on the [cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#cloud) in use: 

=== "EU cloud"
    ```bash
    /usr/share/wallarm-common/addnode --no-sync
    ```
=== "US cloud"
    ```bash
    /usr/share/wallarm-common/addnode -H us1.api.wallarm.com --no-sync
    ```

When started, the script will prompt for the login and password. Provide the login and password that you use to access the Wallarm portal in the [EU](https://my.wallarm.com) or [US](https://us1.my.wallarm.com) cloud.

Your Wallarm account must have the **Administrator** role. If you have the **Analyst** role, the script will error out.

Accounts with 2FA enabled are not supported. Script will error out in a such case.

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
