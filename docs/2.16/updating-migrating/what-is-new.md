# What is new in WAF node 2.16

Below you will find the list of updates in the WAF node 2.16. To stay up‑to‑date about all Wallarm components, you can use our [news portal](https://changelog.wallarm.com/).

## Changes in supported installation platforms

* Dropped support for the operating system CentOS 6.x
* Dropped support for the cloud platform Heroku
* Dropped support for the operating system Debian 8.x (jessie-backports)
* Added CentOS 8.x support
* Added Envoy support
* Added Yandex.Cloud support
<!-- * Added Ubuntu 20.04 LTS (Focal Fossa) support -->

All platforms available for the WAF node 2.16 installation are listed [here](../admin-en/supported-platforms.md).

## New features

* [Displaying versions](../user-guides/nodes/regular-node.md#viewing-details-of-waf-node) of installed WAF, NGINX-WAF, and Envoy-WAF components in the Wallarm Console
* New configuration directive [`wallarm_enable_libdtection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) reduces the number of false positives using additional attack validation with improved algorithms

    !!! warning "Memory consumption increase"
        When analyzing attacks using the libdetection library, the amount of memory consumed by NGINX and Wallarm processes may increase by about 10%.

* Ability to append or replace the value of the NGINX header `Server`. For setup, it is required to add an appropriate rule to the application profile. To add the rule, please contact [our technical support](mailto:support@wallarm.com)
* New WAF node statistics parameters:
    * `db_apply_time`: Unix time of the last update of the proton.db file
    * `lom_apply_time`: Unix time of the last update of the [LOM](../glossary-en.md#lom) file
    * `ts_files`: object with information about the [LOM](../glossary-en.md#lom) file
    * `db_files`: object with information about the proton.db file
    * `overlimits_time`: the number of attacks with the type of [overlimiting of computational resources](../attacks-vulns-list.md#overlimiting-of-computational-resources) detected by the WAF node

    The full list of available statistics parameters is available [here](../admin-en/configure-statistics-service.md#working-with-the-statistics-service).
<!-- * [Example of Terraform code](../admin-en/installation-guides/amazon-cloud/deploy-waf-via-terraform/deploy-waf-via-terraform-intro.md) to deploy a cluster of Wallarm WAF node in AWS public cloud -->
* Installation of the WAF node in the form of the [Kubernetes sidecar container](../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md)
* Increased assembly speed of LOM by 5-10 times on average. A more optimized process is now used to generate security rules. You can find more details about optimization in the [post on our news portal](https://changelog.wallarm.com/security-rule-generation-5x-faster-152572)

## Update process

To update the WAF node, it is recommended to check the general recommendations for the process and follow the instructions for updating the installed modules:

* [General recommendations for a safe WAF node update process](general-recommendations.md)
* [Updating modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
* [Updating the Docker container with the modules for NGINX](docker-container.md)
* [Updating NGINX Ingress controller with integrated Wallarm WAF](ingress-controller.md)
<!-- * [Cloud WAF node image](cloud-image.md) -->
