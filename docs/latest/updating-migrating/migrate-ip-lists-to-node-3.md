# Migrating whitelists and blacklists from Wallarm node 2.18 and lower to 3.x

Starting with Wallarm node 3.x, the method of IP address whitelist and blacklist configuration has been changed. This document instructs how to migrate whitelists and blacklists configured in Wallarm node 2.18 or lower to Wallarm node 3.x.

## What has changed?

Configuration of IP address whitelist and blacklist has been changed as follows:

* The [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl) NGINX directives, [`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-blacklisting-settings) Envoy parameters, and `WALLARM_ACL_*` environment variables have been deprecated. Now, IP lists are configured as follows:

    * Additional steps to enable IP whitelisting or blacklisting functionality are not required. The Wallarm node downloads IP addresses lists from the Wallarm Cloud by default and applies downloaded data when processing incoming requests.
    * Blocking page and error code returned in the response to the blocked request are configured using the [`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page) directive instead of `wallarm_acl_block_page`.
* Whitelisted and blacklisted IP addresses are managed via Wallarm Console.
* IP addresses of [Wallarm Vulnerability Scanner](../about-wallarm-waf/detecting-vulnerabilities.md#vulnerability-scanner) are whitelisted by default. Manual whitelisting of Scanner IP addresses is no longer required.

## Procedure for whitelist and blacklist configuration migration

1. Inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to 3.6 and ask to enable new IP lists logic for your Wallarm account.

    When new IP lists logic is enabled, please open Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.
2. If updating the partner Wallarm node, please delete the scripts used to synchronize the IP address blacklist and the partner node 2.18 or lower. Starting with version 3.2, manual integration of [IP lists](../user-guides/ip-lists/overview.md) is no longer required. 
3. Update the filtering node modules up to version 3.6 following [appropriate instructions](general-recommendations.md#update-process).
4. Remove the whitelist of Wallarm Scanner IP addresses from filtering node configuration files. Starting with the filtering node 3.x, Scanner IP addresses are whitelisted by default. In previous Wallarm node versions, the whitelist could be configured by the following methods:

    * Disabled filtration mode for Scanner IP addresses (for example: [NGINX configuration](/2.18/admin-en/scanner-ips-whitelisting/), [K8s sidecar container](/2.18/admin-en/installation-guides/kubernetes/wallarm-sidecar-container-helm/#шаг-1-создание-configmap-валарм), [K8s Ingress controller](/2.18/admin-en/configuration-guides/wallarm-ingress-controller/best-practices/whitelist-wallarm-ip-addresses/)).
    * NGINX directive [`allow`](http://nginx.org/ru/docs/http/ngx_http_access_module.html#allow).
5. If listed methods are used to whitelist other IP addresses that should not be blocked by the filtering node, please move them to the [whitelist in Wallarm Console](../user-guides/ip-lists/whitelist.md).
6. If you have used the directive `wallarm_acl_block_page` to configure the blocking page and error code returned when the blacklisted IP originated the request, please replace the directive name by `wallarm_block_page` and update its value following the [instructions](../admin-en/configuration-guides/configure-block-page-and-code.md).
7. Remove the [NGINX](../admin-en/installation-docker-en.md) and [Envoy](../admin-en/installation-guides/envoy/envoy-docker.md) environment variables `WALLARM_ACL_*` from the `docker run` commands.
8. (Optional) Remove the NGINX directives [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl) and [`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-blacklisting-settings) Envoy parameters from filtering node configuration files.
