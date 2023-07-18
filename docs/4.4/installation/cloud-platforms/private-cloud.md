# Deployment of the filtering node to the private clouds

Private clouds are cloud environments deployed solely to your infrastructure. This document overviews the principles of deploying the filtering node to the private clouds.

## Principles of deploying the Wallarm node Docker container to the private cloud

One of the methods of deploying the filtering node to the private cloud is deploying the [Docker image of the NGINX-based Wallarm node](../../admin-en/installation-docker-en.md).

Depending on the private cloud platform architecture and your application deployment scheme, you can deploy the Docker container to the private cloud in the following ways:

* Using a separate container deployment service provided by the cloud
* Using the standard `docker run` command in the instance based on any operating system

Before deploying the Wallarm node Docker container to the private cloud, it is recommended to review the container deployment methods described in the documentation of this cloud and select the most suitable one. If you deployed a well-known cloud platform as the private cloud, you can follow the [ready-made instructions developed by Wallarm](../../installation/supported-deployment-options.md#cloud-platforms).

## Principles of installing the Wallarm node from DEB and RPM packages on the private cloud

One of the methods of installing the filtering node on the private cloud is installing from source DEB or RPM packages. Since the filtering node operates as the web server or [API gateway](https://www.wallarm.com/what/the-concept-of-an-api-gateway) module, web server or API gateway packages should be installed on the operating system along with the filtering node packages.

You can install the filtering node from DEB and RPM packages on the private cloud as follows:

1. On the private cloud, create an instance from the [supported operating system](../../installation/supported-deployment-options.md#deb-and-rpm-packages) image.
2. In the instance, install the packages of the filtering node and of the web server or API gateway suitable for your application architecture and supported by Wallarm. You can use one of the following instructions:

      * [Installing the filtering node as the NGINX Stable module](../../installation/nginx/dynamic-module.md)
      * [Installing the filtering node as the NGINX Plus module](../../installation/nginx-plus.md)

Before installing the filtering node on the private cloud, it is recommended to review the instructions on creating and managing instances on the deployed cloud. If you deployed a well-known cloud platform as the private cloud, you can follow the [ready-made instructions developed by Wallarm](../../installation/supported-deployment-options.md#cloud-platforms).