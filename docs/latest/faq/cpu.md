# CPU high usage troubleshooting

This troubleshooting article explains how to reduce CPU usage by Wallarm. By following the suggested steps, you can improve your environments's performance and avoid frustrating slowdowns.

You can do the following to lower the CPU load by Wallarm:

* [Enable extended logging](../../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginx‑based-filter-node) and monitor processing time to reveal the longest request processing episodes.
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

* Set the [`wallarm_acl_access_phase`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) directive to `on` to immediately block any requests from denylisted IPs in any filtration mode without searching for the attack signs in these requests.

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

* Disable [libdetection](../../about-wallarm/protecting-against-attacks.md#libdetection-overview) (enabled by default since node version 4.4) via `wallarm_enable_libdetection off`. Using libdetection increases CPU consumption by 5-10%.
* Disable mistakenly applied parsers [in rules](../../user-guides/rules/disable-request-parsers.md) or [via the NGINX configuration](../../admin-en/configure-parameters-en.md#wallarm_parser_disable) for specific elements of the requests.
* [Lower request processing time](../../user-guides/rules/configure-overlimit-res-detection.md) where data is loaded that does not imply the possibility of an attack.
* Analyze possible targets for [DDoS](../../attacks-vulns-list.md#ddos-distributed-denial-of-service-attack) and [turn on blocking triggers against brute force](../../admin-en/configuration-guides/protecting-against-bruteforce.md) and DirBuster apps.
* Check Wallarm [IP lists](../../user-guides/ip-lists/overview.md) to find IPs that were mistakenly added to the **Allowlist** or locations mistakenly not added to the **Denylist**.

A CPU load about 10-15% would be the ideal result , meaning that Wallarm nodes will be able to handle a x10 traffic spike.
