# CPU high usage troubleshooting

Recommended CPU usage by Wallarm is about 10-15%, meaning that filtering nodes will be able to handle a x10 traffic spike. If a Wallarm node consumes more CPU than it was expected and you need to reduce CPU usage, use this guide.

Before taking any measures for lowering CPU usage, you can [enable extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginx‑based-filter-node) and monitor processing time to reveal the longest request processing episodes.

You can do the following to lower the CPU load by Wallarm:

* Add `limit_req` to the NGINX configuration. This may be the best way to reduce CPU load in case of brute force and other attacks.

    ??? info "Example configuration" - using `limit_req`"

        ```bash
        http {
            map $request_uri $binary_remote_addr_map {
            ~^/get $binary_remote_addr;
            ~^/post $binary_remote_addr;
            ~^/wp-login.php $binary_remote_addr;
            }
            limit_req_zone $binary_remote_addr_map zone=urls:10m rate=3r/s;
            limit_req_zone $binary_remote_addr$request_uri zone=allurl:10m rate=5r/s;
                        
            limit_req_status 444;

            server {
                location {
                limit_req zone=urls nodelay;
                limit_req zone=allurl burst=30;
                }
              }
            }
        ```

* Make sure that the [`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) directive is set to `on` which immediately blocks any requests from denylisted IPs in any filtration mode without searching for the attack signs in these requests. Along with enabling the directive, check Wallarm [IP lists](../user-guides/ip-lists/overview.md) to find IPs that were mistakenly added to the **Allowlist** or locations mistakenly not added to the **Denylist**.

    Note that this method of lowering CPU usage may lead to skipping requests from search engines. This problem, however, can also be solved through the use of the `map` module in the NGINX configuration.

    ??? info "Example configuration - `map` module solving search engines problem"

        ```bash
        http {
        wallarm_acl_access_phase on;
        map $http_user_agent $wallarm_mode{
            default monitoring;
            ~*(google|bing|yandex|msnbot) off;
        }
        server {
            server_name mos.ru;
            wallarm_mode $wallarm_mode;
        }
        }
        ```

* Disable [libdetection](../about-wallarm/protecting-against-attacks.md#libdetection-overview) (enabled by default since node version 4.4) via `wallarm_enable_libdetection off`. Using libdetection increases CPU consumption by 5-10%.
* If during detected attack analysis you reveal that Wallarm mistakenly uses some parsers [in rules](../user-guides/rules/disable-request-parsers.md) or [via the NGINX configuration](../admin-en/configure-parameters-en.md#wallarm_parser_disable) for specific elements of the requests, disable these parsers usage.
* [Lower request processing time](../user-guides/rules/configure-overlimit-res-detection.md).
* Analyze possible targets for [DDoS](../admin-en/configuration-guides/protecting-against-ddos.md) and apply one of the available [protection measures](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm).
