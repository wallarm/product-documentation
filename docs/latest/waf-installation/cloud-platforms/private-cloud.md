# Deployment of the WAF node to the private clouds

Private clouds are cloud environments deployed solely to your infrastructure. This document overviews the principles of deploying the WAF node to the private clouds.

## Principles of deploying the WAF node Docker container to the private cloud

One of the methods of deploying the WAF node to the private cloud is deploying the [Docker image of the NGINX-based WAF node](../../admin-en/installation-docker-en.md).

Depending on the private cloud platform architecture and your application deployment scheme, you can deploy the Docker container to the private cloud in the following ways:

* Using a separate container deployment service provided by the cloud
* Using the standard `docker run` command in the instance based on any operating system

Before deploying the WAF node Docker container to the private cloud, it is recommended to review the container deployment methods described in the documentation of this cloud and select the most suitable one. If you deployed a well-known cloud platform as the private cloud, you can follow the [ready-made instructions developed by Wallarm](#link-to-supported-cloud-deployments).
