# Migrating allowlists and denylists from Wallarm node 2.18 and lower to 6.x

Starting with Wallarm node 3.x, the method of IP address allowlist and denylist configuration has been changed. This document instructs how to migrate allowlists and denylists configured in Wallarm node 2.18 or lower to the latest Wallarm node.

## What has changed?

Configuration of IP address allowlist and denylist has been changed as follows:

* The `wallarm_acl_*` NGINX directives and `WALLARM_ACL_*` environment variables have been deprecated. Now, IP lists are configured as follows:

    * Additional steps to enable IP allowlisting or denylisting functionality are not required. The Wallarm node downloads IP addresses lists from the Wallarm Cloud by default and applies downloaded data when processing incoming requests.
    * Blocking page and error code returned in the response to the blocked request are configured using the [`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page) directive instead of `wallarm_acl_block_page`.
* Allowlisted and denylisted IP addresses are managed via Wallarm Console.
* [Wallarm's vulnerability scanning IPs](../admin-en/scanner-addresses.md) used for scanning company resources for vulnerabilities and launching additional security tests are allowlisted by default. Manual allowlisting of these addresses is no longer required.

## Procedure for allowlist and denylist configuration migration

1. Inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to the latest version and ask to enable new IP lists logic for your Wallarm account.

    When new IP lists logic is enabled, please open Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.
2. If updating the multi-tenant Wallarm node, please delete the scripts used to synchronize the IP address denylist and the multi-tenant node 2.18 or lower. Starting with version 3.2, manual integration of [IP lists](../user-guides/ip-lists/overview.md) is no longer required. 
3. Update the filtering node modules up to version 6.x following [appropriate instructions](general-recommendations.md#update-process).
4. Remove the allowlist of [Wallarm's vulnerability scanning IPs](../admin-en/scanner-addresses.md) used for scanning company resources for vulnerabilities and launching additional security tests from filtering node configuration files. Starting with the filtering node 3.x, these addresses are allowlisted by default.
5. If listed methods are used to allowlist other IP addresses that should not be blocked by the filtering node, please move them to the [allowlist in Wallarm Console](../user-guides/ip-lists/overview.md).
6. If you have used the directive `wallarm_acl_block_page` to configure the blocking page and error code returned when the denylisted IP originated the request, please replace the directive name by `wallarm_block_page` and update its value following the [instructions](../admin-en/configuration-guides/configure-block-page-and-code.md).
7. Remove the [NGINX](../admin-en/installation-docker-en.md) environment variables `WALLARM_ACL_*` from the `docker run` commands.
8. (Optional) Remove the NGINX directives `wallarm_acl_*` from filtering node configuration files.
