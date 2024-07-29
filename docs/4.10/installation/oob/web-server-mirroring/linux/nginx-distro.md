---
search:
  exclude: true
---

[img-wl-console-users]:             ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../custom/custom-nginx-version.md
[node-token]:                       ../../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[oob-advantages-limitations]:       ../../overview.md#limitations
[web-server-mirroring-examples]:    ../overview.md#configuration-examples-for-traffic-mirroring
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# Installing Wallarm OOB Dynamic Module for Distribution-Provided NGINX

These instructions describe the steps to install Wallarm as an [OOB](../overview.md) dynamic module using Linux packages for distribution-provided NGINX.

NGINX Open Source can be obtained from nginx.org or the default repositories of Debian/CentOS depending on your requirements, NGINX version preferences, and repository management policies. Wallarm provides packages for both [nginx.org](nginx-stable.md) and distribution‑provided versions. This guide focuses on NGINX from Debian/CentOS repositories.

The Wallarm module is compatible with distribution-provided NGINX on the following operating systems:

* Debian 10.x (buster)
* Debian 11.x (bullseye)
* CentOS 7.x
* AlmaLinux, Rocky Linux or Oracle Linux 8.x
* RHEL 8.x

## Use cases

--8<-- "../include/waf/installation/linux-packages/nginx-distro-use-cases.md"

## Requirements

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. Enable Wallarm to analyze the traffic

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux.md"

## 6. Restart NGINX

--8<-- "../include/waf/root_perm_info.md"

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## 7. Configure sending traffic to the Wallarm instance

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 8. Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 9. Fine-tune the deployed solution

The dynamic Wallarm module with default settings is installed for NGINX `stable`. The filtering node may require some additional configuration after deployment.

Wallarm settings are defined using the [NGINX directives](../../../../admin-en/configure-parameters-en.md) or the Wallarm Console UI. Directives should be set in the following files on the machine with the Wallarm node:

* `/etc/nginx/conf.d/default.conf` with NGINX settings
* `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings

    The file is used for settings applied to all domains. To apply different settings to different domain groups, use the file `default.conf` or create new configuration files for each domain group (for example, `example.com.conf` and `test.com.conf`). More detailed information about NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` with the Tarantool database settings

Below there are a few of the typical settings that you can apply if needed:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [Configuring dynamic DNS resolution in NGINX][dynamic-dns-resolution-nginx]
