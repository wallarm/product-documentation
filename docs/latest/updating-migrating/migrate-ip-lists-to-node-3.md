# Migrating whitelists and blacklists from previous WAF node versions to 3.0

Starting with WAF node 3.0, the method of IP addresses whitelist and blacklist configuration has been changed. This document instructs how to migrate whitelists ad blacklists configured in WAF node 2.18 or lower to WAF node 3.0.

## What has changed?

Configuration of IP addresses whitelist and blacklist has been changed as follows:

* The [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl) NGINX directives, [`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-blacklisting-settings) Envoy parameters, and `WALLARM_ACL_*` environment variables have been deprecated. Now, IP lists are configured as follows:

    * Additional steps to enable IP whitelisting or blacklisting functionality are not required. The WAF node downloads IP addresses lists from the Wallarm Cloud by default and applies downloaded data when processing incoming requests.
    * Blocking page and error code returned in the response to the blocked request are configured using the [`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page) directive instead of `wallarm_acl_block_page`.
* Whitelisted and blacklisted IP addresses are managed via the Wallarm Console.
* IP addresses of [Wallarm Vulnerability Scanner](../about-wallarm-waf/detecting-vulnerabilities.md#vulnerability-scanner) are whitelisted by default. Manual whitelisting of Scanner IP addresses is no longer required.

## Procedure for whitelists and blacklists configuration migration

1. Inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating WAF node modules up to 3.0 and ask to enable new IP lists logic for your Wallarm account. When new IP lists logic is enabled, please open the Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.
2. Update the WAF node modules up to version 3.0 following [appropriate instructions](general-recommendations.md#update-process).
3. Remove the whitelist of Wallarm Scanner IP addresses from WAF node configuration files. Starting with the WAF node 3.0, Scanner IP addresses are whitelisted by default. In previous WAF node versions, the whitelist could be configured by the following methods:

    * Disabled filtration mode for Scanner IP addresses (for example: [NGINX configuration](/2.18/admin-en/scanner-ips-whitelisting/), [K8s sidecar container](/2.18/admin-en/installation-guides/kubernetes/wallarm-sidecar-container-helm/#шаг-1-создание-configmap-валарм), [K8s Ingress controller](/2.18/admin-en/configuration-guides/wallarm-ingress-controller/best-practices/whitelist-wallarm-ip-addresses/)).
    * NGINX directive [`allow`](http://nginx.org/ru/docs/http/ngx_http_access_module.html#allow).
4. If listed methods are used to whitelist other IP addresses that should not be blocked by the WAF node, please move them to the [whitelist in the Wallarm Console](../user-guides/ip-lists/whitelist.md).
5. If you have used the directive `wallarm_acl_block_page` to configure the blocking page and error code returned when the blacklisted IP originated the request, please replace the directive name by `wallarm_block_page` and update its value following the [instructions](../admin-en/configuration-guides/configure-block-page-and-code.md).
6. Remove the [NGINX](../admin-en/installation-docker-en.md) and [Envoy](../admin-en/installation-guides/envoy/envoy-docker.md) environment variables `WALLARM_ACL_*` from the `docker run` commands.
7. (Optional) Remove the NGINX directives [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl) and [`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-blacklisting-settings) Envoy parameters from WAF node configuration files.
