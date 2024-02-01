[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../custom/custom-nginx-version.md
[node-token]:                       ../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../installation/supported-deployment-options.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png

# Installing as a Dynamic Module for NGINX Stable

These instructions describe the steps to install Wallarm filtering node as a dynamic module for the open source version of NGINX `stable` that was installed from the NGINX repository.

!!! info "All-in-one installation"
    Starting from Wallarm node 4.6, it is recommended to use [all-in-one installation](all-in-one.md) which automates all the activities listed in the steps below and makes node deployment much easier.

## Use cases

--8<-- "../include/waf/installation/linux-packages/nginx-stable-use-cases.md"

## Requirements

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. Enable Wallarm to analyze the traffic

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 7. Restart NGINX

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 8. Configure sending traffic to the Wallarm instance

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 10. Fine-tune the deployed solution

The dynamic Wallarm module with default settings is installed for NGINX `stable`. The filtering node may require some additional configuration after deployment.

Wallarm settings are defined using the [NGINX directives](../../admin-en/configure-parameters-en.md) or the Wallarm Console UI. Directives should be set in the following files on the machine with the Wallarm node:

* `/etc/nginx/conf.d/default.conf` with NGINX settings
* `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings

    The file is used for settings applied to all domains. To apply different settings to different domain groups, use the file `default.conf` or create new configuration files for each domain group (for example, `example.com.conf` and `test.com.conf`). More detailed information about NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` with the Tarantool database settings

Below there are a few of the typical settings that you can apply if needed:

* [Configuration of the filtration mode][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [Configuring dynamic DNS resolution in NGINX][dynamic-dns-resolution-nginx]

## Limitations

* [Credential stuffing detection][cred-stuffing-docs] is currently unsupported, as the packages has not been updated to the 4.10 release yet