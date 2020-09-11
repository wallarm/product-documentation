# What is new in WAF node 2.16

Below you will find the list of updates in the WAF node 2.16. To stay up‑to‑date about all Wallarm components, you can use our [news portal](https://changelog.wallarm.com/).

## Changes in supported installation platforms

* Dropped support for the operating system CentOS 6.x
* Dropped support for the cloud platform Heroku
* Dropped support for the operating system Debian 8.x (jessie-backports)
* Added CentOS 8.x support
* Added Ubuntu 20.04 LTS (Focal Fossa) support
* Added Envoy support

All platforms available for the WAF node 2.16 installation are listed by the [link](../admin-en/supported-platforms.md).

## New features

* [Displaying versions](../user-guides/nodes/regular-node.md#viewing-details-of-waf-node) of installed WAF, NGINX-WAF, Envoy-WAF components in Wallarm Console
* New configuration directive [`wallarm_enable_libdtection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) to reduce the number of false positives using additional attacks validation with improved algorithms
* Ability to append or replace the value of the NGINX header `Server`. For setup, it is required to add an appropriate rule to the application profile. To add the rule, please contact [our technical support](mailto:support@wallarm.com)
* New WAF node statistics parameters:
    * `db_apply_time`: Unix time of the last update of the proton.db file
    * `lom_apply_time`: Unix time of the last update of the [LOM](../glossary-en.md#lom) file
    * `ts_files`: object with information about the [LOM](../glossary-en.md#lom) file
    * `db_files`: object with information about the proton.db file
    * `overlimits_time`: the number of attacks with the type [Overlimiting of computational resources](../attacks-vulns-list.md#overlimiting-of-computational-resources) detected by the WAF node

    The full list of available statistics parameters is available by the [link](../admin-en/configure-statistics-service.md#working-with-the-statistics-service).
