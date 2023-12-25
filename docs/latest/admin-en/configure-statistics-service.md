[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom

# Configuration of the Statistics Service

To obtain statistics about the filter node, use the `wallarm_status` directive, which is written in the NGINX configuration file.

## Configuring the Statistics Service

!!! warning "Important"

    It is highly recommended to configure the statistics service in its own file, avoiding the `wallarm_status` directive in other NGINX setup files, because the latter may be insecure. The configuration file for `wallarm-status` is located at:

    * `/etc/nginx/wallarm-status.conf` for all-in-one installer
    * `/etc/nginx/conf.d/wallarm-status.conf` for other installations
    
    Also, it is strongly advised not to alter any of the existing lines of the default `wallarm-status` configuration as it may corrupt the process of metric data upload to the Wallarm cloud.

When using the directive, statistics can be given in JSON format or in a format compatible with [Prometheus][link-prometheus]. Usage:

```
wallarm_status [on|off] [format=json|prometheus];
``` 

!!! info
    The directive can be configured in the context of `server` and/or `location`.

    The `format` parameter has the `json` value by default in most deployment options except for the NGINX-based Docker image; when the `/wallarm-status` endpoint is called from outside the container, it returns metrics in the Prometheus format.

### Default configuration

By default, the filter node statistics service has the most secure configuration. The `/etc/nginx/conf.d/wallarm-status.conf` (`/etc/nginx/wallarm-status.conf` for all-in-one installer) configuration file looks like the following:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # Access is only available for loopback addresses of the filter node server  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # Checking request sources is disabled, denylisted IPs are allowed to request the wallarm-status service. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location /wallarm-status {
    wallarm_status on;
  }
}
```

### Limiting IP addresses allowed to request statistics

When configuring the `wallarm_status` directive, you can specify the IP addresses from which you can request statistics. By default, access is denied from anywhere except for the IP addresses `127.0.0.1` and `::1`, which allow executing the request only from the server where Wallarm is installed.

To allow requests from another server, add the `allow` instruction with the IP address of the desired server in the configuration. For example:

```diff
...
server_name localhost;

allow 127.0.0.0/8;
+ allow 10.41.29.0;
...
```

Once the settings changed, restart NGINX to apply the changes:

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### Changing an IP address of the statistics service

To change an IP address of the statistics service:

1. Specify a new address in the `listen` directive of the `/etc/nginx/conf.d/wallarm-status.conf` file (`/etc/nginx/wallarm-status.conf` for all-in-one installer).
1. Add the `status_endpoint` parameter with the new address value to the `/etc/wallarm/node.yaml` file (`/opt/wallarm/etc/wallarm/node.yaml` for Docker NGINX-based image or all-in-one installer), e.g.:

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. Correct the `URL` parameter accordingly in the [`collectd`](monitoring/intro.md) configuration file. The location of this file depends on the type of operating system distribution you have:

    --8<-- "../include/monitoring/collectd-config-location.md"
1. Add or change the `allow` directive to allow access from addresses other than loopback addresses (the default configuration file allows access only to loopback addresses).
1. Restart NGINX to apply changes:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### Getting statistics in the Prometheus format

Most deployment options return statistics in JSON format by default. The NGINX-based Docker image is an exception; when the `/wallarm-status` endpoint is called from outside the container, it returns metrics in the Prometheus format.

To obtain statistics in the Prometheus format from node deployment options that default to JSON:

1. Add the following configuration to the `/etc/nginx/conf.d/wallarm-status.conf` file (`/etc/nginx/wallarm-status.conf` for all-in-one installer):


    ```diff
    ...

    location /wallarm-status {
      wallarm_status on;
    }

    + location /wallarm-status-prometheus {
    +   wallarm_status on format=prometheus;
    + }

    ...
    ```

    !!! warning "Do not delete or change the default `/wallarm-status` configuration"
        Please do not delete or change the default configuration of the `/wallarm-status` location. Default operation of this endpoint is crucial to upload correct data to the Wallarm Cloud.
1. Restart NGINX to apply changes:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. Call the new endpoint to get the Prometheus metrics:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

##  Working with the Statistics Service

To obtain the filter node statistics, make a request from one of the allowed IP addresses (see above):

=== "Statistics in the JSON format"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    As a result, you will get a response of the type:

    ```
    { "requests":0,"attacks":0,"blocked":0,"blocked_by_acl":0,"acl_allow_list":0,"abnormal":0,
    "tnt_errors":0,"api_errors":0,"requests_lost":0,"overlimits_time":0,"segfaults":0,"memfaults":0,
    "softmemfaults":0,"proton_errors":0,"time_detect":0,"db_id":73,"lom_id":102,"custom_ruleset_id":102,
    "custom_ruleset_ver":51,"db_apply_time":1598525865,"lom_apply_time":1598525870,
    "custom_ruleset_apply_time":1598525870,"proton_instances": { "total":3,"success":3,"fallback":0,
    "failed":0 },"stalled_workers_count":0,"stalled_workers":[],"ts_files":[{"id":102,"size":12624136,
    "mod_time":1598525870,"fname":"\/etc\/wallarm\/custom_ruleset"}],"db_files":[{"id":73,"size":139094,
    "mod_time":1598525865,"fname":"\/etc\/wallarm\/proton.db"}],"startid":1459972331756458216,
    "timestamp":1664530105.868875,"rate_limit":{"shm_zone_size":67108864,"buckets_count":4,"entries":1,
    "delayed":0,"exceeded":1,"expired":0,"removed":0,"no_free_nodes":0},"split":{"clients":[
    {"client_id":null,"requests": 78,"attacks": 0,"blocked": 0,"blocked_by_acl": 0,"overlimits_time": 0,
    "time_detect": 0,"applications":[{"app_id":4,"requests": 78,"attacks": 0,"blocked": 0,
    "blocked_by_acl": 0,"overlimits_time": 0,"time_detect": 0}]}]} }
    ```
=== "Statistics in the Prometheus format"
    ```
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

    The address can be different, please check the `/etc/nginx/conf.d/wallarm-status.conf` file (`/etc/nginx/wallarm-status.conf` for all-in-one installer) for the actual address.

    As a result, you will get a response of the type:


    ```
    # HELP wallarm_requests requests count
    # TYPE wallarm_requests gauge
    wallarm_requests 2
    # HELP wallarm_attacks attack requests count
    # TYPE wallarm_attacks gauge
    wallarm_attacks 0
    # HELP wallarm_blocked blocked requests count
    # TYPE wallarm_blocked gauge
    wallarm_blocked 0
    # HELP wallarm_blocked_by_acl blocked by acl requests count
    # TYPE wallarm_blocked_by_acl gauge
    wallarm_blocked_by_acl 0
    # HELP wallarm_acl_allow_list requests passed by allow list
    # TYPE wallarm_acl_allow_list gauge
    wallarm_acl_allow_list 0
    # HELP wallarm_abnormal abnormal requests count
    # TYPE wallarm_abnormal gauge
    wallarm_abnormal 2
    # HELP wallarm_tnt_errors tarantool write errors count
    # TYPE wallarm_tnt_errors gauge
    wallarm_tnt_errors 0
    # HELP wallarm_api_errors API write errors count
    # TYPE wallarm_api_errors gauge
    wallarm_api_errors 0
    # HELP wallarm_requests_lost lost requests count
    # TYPE wallarm_requests_lost gauge
    wallarm_requests_lost 0
    # HELP wallarm_overlimits_time overlimits_time count
    # TYPE wallarm_overlimits_time gauge
    wallarm_overlimits_time 0
    # HELP wallarm_segfaults segmentation faults count
    # TYPE wallarm_segfaults gauge
    wallarm_segfaults 0
    # HELP wallarm_memfaults vmem limit reached events count
    # TYPE wallarm_memfaults gauge
    wallarm_memfaults 0
    # HELP wallarm_softmemfaults request memory limit reached events count
    # TYPE wallarm_softmemfaults gauge
    wallarm_softmemfaults 0
    # HELP wallarm_proton_errors libproton non-memory related libproton faults events count
    # TYPE wallarm_proton_errors gauge
    wallarm_proton_errors 0
    # HELP wallarm_time_detect_seconds time spent for detection
    # TYPE wallarm_time_detect_seconds gauge
    wallarm_time_detect_seconds 0
    # HELP wallarm_db_id proton.db file id
    # TYPE wallarm_db_id gauge
    wallarm_db_id 71
    # HELP wallarm_lom_id LOM file id
    # TYPE wallarm_lom_id gauge
    wallarm_lom_id 386
    # HELP wallarm_custom_ruleset_id Custom Ruleset file id
    # TYPE wallarm_custom_ruleset_id gauge
    wallarm_custom_ruleset_id{format="51"} 386
    # HELP wallarm_custom_ruleset_ver custom ruleset file format version
    # TYPE wallarm_custom_ruleset_ver gauge
    wallarm_custom_ruleset_ver 51
    # HELP wallarm_db_apply_time proton.db file apply time id
    # TYPE wallarm_db_apply_time gauge
    wallarm_db_apply_time 1674548649
    # HELP wallarm_lom_apply_time LOM file apply time
    # TYPE wallarm_lom_apply_time gauge
    wallarm_lom_apply_time 1674153198
    # HELP wallarm_custom_ruleset_apply_time Custom Ruleset file apply time
    # TYPE wallarm_custom_ruleset_apply_time gauge
    wallarm_custom_ruleset_apply_time 1674153198
    # HELP wallarm_proton_instances proton instances count
    # TYPE wallarm_proton_instances gauge
    wallarm_proton_instances{status="success"} 5
    wallarm_proton_instances{status="fallback"} 0
    wallarm_proton_instances{status="failed"} 0
    # HELP wallarm_stalled_worker_time_seconds time a worker stalled in libproton
    # TYPE wallarm_stalled_worker_time_seconds gauge
    wallarm_stalled_worker_time_seconds{pid="3169104"} 25

    # HELP wallarm_startid unique start id
    # TYPE wallarm_startid gauge
    wallarm_startid 3226376659815907920
    ```

The following response parameters are available (Prometheus metrics have the `wallarm_` prefix):

*   `requests`: the number of requests that have been processed by the filter node.
*   `attacks`: the number of recorded attacks.
*   `blocked`: the number of blocked requests including those originated from [denylisted](../user-guides/ip-lists/overview.md) IPs.
*   `blocked_by_acl`: the number of requests blocked due to [denylisted](../user-guides/ip-lists/overview.md) request sources.
* `acl_allow_list`: the number of requests originating by [allowlisted](../user-guides/ip-lists/allowlist.md) request sources.
*   `abnormal`: the number of requests the application deems abnormal.
*   `tnt_errors`: the number of requests not analyzed by a post-analytics module. For these requests, the reasons for blocking are recorded, but the requests themselves are not counted in statistics and behavior checks.
*   `api_errors`: the number of requests that were not submitted to the API for further analysis. For these requests, blocking parameters were applied (i.e., malicious requests were blocked if the system was operating in blocking mode); however, data on these events is not visible in the UI. This parameter is only used when the Wallarm Node works with a local post-analytics module.
*   `requests_lost`: the number of requests that were not analyzed in a post-analytics module and transferred to API. For these requests, blocking parameters were applied (i.e., malicious requests were blocked if the system was operating in blocking mode); however, data on these events is not visible in the UI. This parameter is only used when the Wallarm Node works with a local post-analytics module.
*   `overlimits_time`: the number of attacks with the type [Overlimiting of computational resources](../attacks-vulns-list.md#overlimiting-of-computational-resources) detected by the filtering node.
*   `segfaults`: the number of issues that led to the emergency termination of the worker process.
*   `memfaults`: the number of issues where the virtual memory limits were reached.
* `softmemfaults`: the number of issues where the virtual memory limit for proton.db +lom was exceeded ([`wallarm_general_ruleset_memory_limit`](configure-parameters-en.md#wallarm_general_ruleset_memory_limit)).
* `proton_errors`: the number of the proton.db errors except for those occurred due to the situations when the virtual memory limit was exceeded.
*   `time_detect`: the total time of requests analysis.
*   `db_id`: proton.db version.
*   `lom_id`: will be deprecated soon, please use `custom_ruleset_id`.
*   `custom_ruleset_id`: version of the [custom ruleset][gl-lom] build.

    Starting from release 4.8, it appears as `wallarm_custom_ruleset_id{format="51"} 386` in Prometheus format, with `custom_ruleset_ver` inside the `format` attribute and the main value being the ruleset build version.
*   `custom_ruleset_ver` (available starting from the Wallarm release 4.4.3): the [custom ruleset][gl-lom] format:

    * `4x` - for Wallarm nodes 2.x which are [out-of-date](../updating-migrating/versioning-policy.md#version-list).
    * `5x` - for Wallarm nodes 4.x and 3.x (the latter are [out-of-date](../updating-migrating/versioning-policy.md#version-list)).
*   `db_apply_time`: Unix time of the last update of the proton.db file.
*   `lom_apply_time`: will be deprecated soon, please use `custom_ruleset_apply_time`.
*   `custom_ruleset_apply_time`: Unix time of the last update of the [custom ruleset](../glossary-en.md#custom-ruleset-the-former-term-is-lom) file.
*   `proton_instances`: information about proton.db + LOM pairs:
    *   `total`: the number of proton.db + LOM pairs.
    *   `success`: the number of the successfully uploaded proton.db + LOM pairs.
    *   `fallback`: the number of proton.db + LOM pairs loaded from the last saved files.
    *   `failed`: the number of proton.db + LOM pairs that were not initialized and run in the “do not analyze” mode.
*   `stalled_workers_count`: the quantity of workers that exceeded the time limit for request processing (the limit is set in the [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout) directive).
*   `stalled_workers`: the list of the workers that exceeded the time limit for request processing (the limit is set in the [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout) directive) and the amount of time spent on request processing.
*   `ts_files`: information about the [LOM](../glossary-en.md#custom-ruleset-the-former-term-is-lom) file:
    *   `id`: used LOM version.
    *   `size`: LOM file size in bytes.
    *   `mod_time`: Unix time of the last update of the LOM file.
    *   `fname`: path to the LOM file.
*   `db_files`: information about the proton.db file:
    *   `id`: used proton.db version.
    *   `size`: proton.db file size in bytes.
    *   `mod_time`: Unix time of the last update of the proton.db file.
    *   `fname`: path to the proton.db file.
* `startid`: randomly-generated unique ID of the filtering node.
* `timestamp`: time when the last incoming request was processed by the node (in the [Unix Timestamp](https://www.unixtimestamp.com/) format).
* `rate_limit`: information about the Wallarm [rate limiting](../user-guides/rules/rate-limiting.md) module:
    * `shm_zone_size`: total amount of shared memory that the Wallarm rate limiting module can consume in bytes (the value is based on the [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) directive, default is `67108864`).
    * `buckets_count`: the number of buckets (usually equal to NGINX workers count, 8 is a maximum).
    * `entries`: the number of unique request point values (aka keys) you measure limits for.
    * `delayed`: the number of requests that have been buffered by the rate limiting module due to the `burst` setting.
    * `exceeded`: the number of requests that have been rejected by the rate limiting module because they exceeded the limit.
    * `expired`: the total number of keys that are removed from the bucket on a regular 60-second basis if the rate limit for those keys was not exceeded.
    * `removed`: the number of keys abruptly removed from the backet. If the value is higher that `expired`, increase the [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) value.
    * `no_free_nodes`: the value different from `0` indicates that there is insufficient memory allocated for the rate limit module, the [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) value increase is recommended.
* `split.clients`: main statistics on each [tenant](../installation/multi-tenant/overview.md). If the multitenancy feature is not activated, the statistics is returned for the only tenant (your account) with the static value `"client_id":null`.
* `split.clients.applications`: main statistics on each [application](../user-guides/settings/applications.md). Parameters that are not included into this section returns the statistics on all applications.

The data of all counters is accumulated from the moment NGINX is started. If Wallarm has been installed in a ready-made infrastructure with NGINX, the NGINX server must be restarted to start statistics collection.
