# Installation of the filtering node from DEB or RPM packages on AWS

!!! warning "DO WE WANT TO HAVE THIS ARTICLE IN DOCS? AND SHOULD WE REACH IT WITH SOME INFO?"

This quick guide provides the steps to install the filtering node from the source packages on a separate Amazon EC2 instance. By following this guide, you will create an instance from the supported operating system image and install the Wallarm filtering node on this operating system.

!!! warning "The instructions limitations"
    These instructions do not cover the configuration of load balancing and node autoscaling. If setting up these components yourself, we recommend that you review the [AWS instructions on the Elastic Load Balancing service](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html).

## Requirements

* AWS account and user with the **admin** permissions
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)

## Filtering node installation options

Since the filtering node operates as the web server or [API gateway](https://www.wallarm.com/what/the-concept-of-an-api-gateway) module, web server or API gateway packages should be installed on the operating system along with the filtering node packages.

You can select the web server or API gateway that is the most suitable for your application architecture from the following list:

* [Install the filtering node as the NGINX Stable module](#installing-the-filtering-node-as-the-nginx-stable-module)
* [Install the filtering node as the NGINX Plus module](#installing-the-filtering-node-as-the-nginx-plus-module)

## Installing the filtering node as the NGINX Stable module

To install the filtering node as the NGINX Stable module in the Amazon EC2 instance:

1. Create an Amazon EC2 instance from the operating system image supported by Wallarm following the [AWS instructions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance):

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
    * Amazon Linux 2.0.2021x and lower
2. Connect to the created instance following the [AWS instructions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html).
3. In the instance, install the packages of NGINX Stable and Wallarm filtering node following the [Wallarm instructions](../../../installation/nginx/dynamic-module.md).

To install the postanalytics module in a separate instance, please repeat steps 1-2 and install the postanalytics module following the [Wallarm instructions](../../../admin-en/installation-postanalytics-en.md).

## Installing the filtering node as the NGINX Plus module

To install the filtering node as the NGINX Plus module in the Amazon EC2 instance:

1. Create an Amazon EC2 instance from the operating system image supported by Wallarm following the [AWS instructions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance):

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
    * Amazon Linux 2.0.2021x and lower
2. Connect to the created instance following the [AWS instructions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html).
3. In the instance, install the packages of NGINX Plus and Wallarm filtering node following the [Wallarm instructions](../../../installation/nginx/dynamic-module.md).

To install the postanalytics module in a separate instance, please repeat steps 1-2 and install the postanalytics module following the [Wallarm instructions](../../../admin-en/installation-postanalytics-en.md).
