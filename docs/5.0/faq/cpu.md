# CPU high usage troubleshooting

Recommended CPU usage by Wallarm is about 10-15%, meaning that filtering nodes will be able to handle a x10 traffic spike. If a Wallarm node consumes more CPU than it was expected and you need to reduce CPU usage, use this guide.

To reveal the longest request processing episodes and thus the primary CPU consumers, you can [enable extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) and monitor the processing time.

You can do the following to lower the CPU load by Wallarm:

* Add [`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) to the NGINX configuration or starting from node 4.6 use Wallarm's own [rate limiting](../user-guides/rules/rate-limiting.md) functionality. This may be the best way to reduce CPU load in case of brute force and other attacks.

    ??? info "Example configuration - using `limit_req`"

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

* Check that the appropriate amount of memory [has been allocated](../admin-en/configuration-guides/allocate-resources-for-node.md) for NGINX and Tarantool.
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

* Disable [libdetection](../about-wallarm/protecting-against-attacks.md#libdetection-overview) (enabled by default since node version 4.4) via `wallarm_enable_libdetection off`. Using libdetection increases CPU consumption by 5-10%. However, it is necessary to consider that disabling libdetection may lead to increase in number of false positives for SQLi attack detection.
* If during detected attack analysis you reveal that Wallarm mistakenly uses some parsers [in rules](../user-guides/rules/request-processing.md#managing-parsers) or [via the NGINX configuration](../admin-en/configure-parameters-en.md#wallarm_parser_disable) for specific elements of the requests, disable these parsers for what they do not apply to. Note, however, that disabling parsers in general is never recommended.
* [Lower request processing time](../user-guides/rules/configure-overlimit-res-detection.md). Note that by doing this you may prevent legitimate requests from getting the server.
* Analyze possible targets for [DDoS](../admin-en/configuration-guides/protecting-against-ddos.md) and apply one of the available [protection measures](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm).
