# Installation of the filtering node from DEB or RPM packages on Yandex.Cloud

This quick guide provides the steps to install the filtering node from the source packages on a separate Yandex Compute Cloud instance. By following this guide, you will create an instance from the supported operating system image and install the Wallarm filtering node on this operating system.

!!! warning "The instructions limitations"
    These instructions do not cover the configuration of load balancing and node autoscaling. If setting up these components yourself, we recommend that you review the [instructions on Yandex Network Load Balancer](https://cloud.yandex.com/en/docs/network-load-balancer/).

## Requirements

* Access to the [Yandex.Cloud management console](https://console.cloud.yandex.com/)
* Payment account in the `ACTIVE` or `TRIAL_ACTIVE` status displayed on the [billing page](https://console.cloud.yandex.com/billing)
* Folder created. By default, the folder `default` will be created. To create a new folder, please follow these [instructions](https://cloud.yandex.com/docs/resource-manager/operations/folder/create)
* Access to the account with the **Administrator** or **Deploy** role and two‑factor authentication disabled in Wallarm Console for the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)

## Filtering node installation options

Since the filtering node operates as the web server or API gateway module, web server or API gateway packages should be installed on the operating system along with the filtering node packages.

You can select the web server or API gateway that is the most suitable for your application architecture from the following list:

* [Install the filtering node as the NGINX Stable module](#installing-the-filtering-node-as-the-nginx-stable-module)
* [Install the filtering node as the NGINX Plus module](#installing-the-filtering-node-as-the-nginx-plus-module)
* [Install the filtering node as the Kong module](#installing-the-filtering-node-as-the-kong-module)

## Installing the filtering node as the NGINX Stable module

To install the filtering node as the NGINX Stable module in the Yandex Compute Cloud instance:

1. Create a Yandex.Cloud instance from the operating system image supported by Wallarm following the [Yandex.Cloud instructions](https://cloud.yandex.com/en/docs/compute/quickstart/quick-create-linux):

    * Debian 10.x Buster
    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * CloudLinux OS 6.x
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. Connect to the created instance following the [Yandex.Cloud instructions](https://cloud.yandex.com/en/docs/compute/quickstart/quick-create-linux#connect-to-vm).
3. In the instance, install the packages of NGINX Stable and Wallarm filtering node following the [Wallarm instructions](../../../waf-installation/nginx/dynamic-module.md).

To install the postanalytics module in a separate instance, please repeat steps 1-2 and install the postanalytics module following the [Wallarm instructions](../../../admin-en/installation-postanalytics-en.md).

## Installing the filtering node as the NGINX Plus module

To install the filtering node as the NGINX Plus module in the Yandex Compute Cloud instance:

1. Create a Yandex.Cloud instance from the operating system image supported by Wallarm following the [Yandex.Cloud instructions](https://cloud.yandex.com/en/docs/compute/quickstart/quick-create-linux):

    * Debian 10.x Buster
    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. Connect to the created instance following the [Yandex.Cloud instructions](https://cloud.yandex.com/en/docs/compute/quickstart/quick-create-linux#connect-to-vm).
3. In the instance, install the packages of NGINX Plus and Wallarm filtering node following the [Wallarm instructions](../../../waf-installation/nginx/dynamic-module.md).

To install the postanalytics module in a separate instance, please repeat steps 1-2 and install the postanalytics module following the [Wallarm instructions](../../../admin-en/installation-postanalytics-en.md).

## Installing the filtering node as the Kong module

To install the filtering node as the Kong module in the Yandex Compute Cloud instance:

1. Create a Yandex.Cloud instance from the operating system image supported by Wallarm following the [Yandex.Cloud instructions](https://cloud.yandex.com/en/docs/compute/quickstart/quick-create-linux):

    * Ubuntu 18.04 Bionic
    * CentOS 7.x
2. Connect to the created instance following the [Yandex.Cloud instructions](https://cloud.yandex.com/en/docs/compute/quickstart/quick-create-linux#connect-to-vm).
3. In the instance, install Kong of version 1.4.3 or lower following the [Kong instructions](https://konghq.com/get-started/#install).
4. In the instance, install the packages of Wallarm filtering node following the [Wallarm instructions](../../../admin-en/installation-kong-en.md).

To install the postanalytics module in a separate instance, please repeat steps 1-2 and install the postanalytics module following the [Wallarm instructions](../../../admin-en/installation-postanalytics-en.md).
