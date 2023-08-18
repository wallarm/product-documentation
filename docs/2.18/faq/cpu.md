# CPU high usage troubleshooting

Recommended CPU usage by Wallarm is about 10-15%, meaning that filtering nodes will be able to handle a x10 traffic spike. If a Wallarm node consumes more CPU than it was expected and you need to reduce CPU usage, use this guide.

To reveal the longest request processing episodes and thus the primary CPU consumers, you can [enable extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginx‑based-filter-node) and monitor the processing time.

You can do the following to lower the CPU load by Wallarm:

* Add [`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) to the NGINX configuration. This may be the best way to reduce CPU load in case of brute force and other attacks.

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
* Disable [libdetection](../about-wallarm/protecting-against-attacks.md#libdetection-overview) (enabled by default since node version 4.4) via `wallarm_enable_libdetection off`. Using libdetection increases CPU consumption by 5-10%. However, it is necessary to consider that disabling libdetection may lead to increase in number of false positives for SQLi attack detection.
* If during detected attack analysis you reveal that Wallarm mistakenly uses some parsers [in rules](../user-guides/rules/disable-request-parsers.md) or [via the NGINX configuration](../admin-en/configure-parameters-en.md#wallarm_parser_disable) for specific elements of the requests, disable these parsers for what they do not apply to. Note, however, that disabling parsers in general is never recommended.
