# Wallarm Node — Version 2.8

## Changes Highlights

* Added the function to block requests from blacklisted IP addresses via NGINX.
* Implemented memory consumption ceiling for a single request processing.
* Added support for the deflate and brotli compression formats in HTTP responses.
* Enhanced monitoring capabilities.
* Improved logging mechanism.

## Blocking of Blacklisted IP Addresses 

In addition to the previously available capability to block attackers by their IP addresses using a firewall (e.g. iptables), one can now block blacklisted IP address via the NGINX itself. 

This is a more convenient way to block requests using blacklists as it doesn’t require integration with the firewall. It’s also the only option when the filter instance is behind HTTP load balancer.

[More ...](../admin-en/configure-ip-blocking-en.md)

## Limiting Memory Consumption

Previously, the memory limit could be configured only for the entire worker process. Now you can restrict both the overall memory consumption as well as memory consumed while processing individual requests.

This can be set up with the following directives:
* [wallarm_request_memory_limit](../admin-en/configure-parameters-en.md#wallarm_request_memory_limit)
* [wallarm_ts_request_memory_limit](../admin-en/configure-parameters-en.md#wallarm_ts_request_memory_limit)

By default, the old mechanism for restricting memory consumption is used.

## Monitoring

New parameters are added to the output of wallarm-status page:

* [memfaults](../admin-en/monitoring/available-metrics.md#number-of-situations-when-the-virtual-memory-limit-was-exceeded)
* [segfaults](../admin-en/monitoring/available-metrics.md#number-of-situations-when-the-virtual-memory-limit-was-exceeded)

## Logging

The format of the error messages remained unchanged. However, you can now customise debug messages.

The logging is configured by the following directives
* [wallarm_proton_log_mask_master](../admin-en/configure-parameters-en.md#wallarm_proton_log_mask_master)
* [wallarm_proton_log_mask_worker](../admin-en/configure-parameters-en.md#wallarm_proton_log_mask_worker)
