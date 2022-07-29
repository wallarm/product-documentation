[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom

# Configuration of the Statistics Service

To obtain statistics about the filter node, use the `wallarm_status` directive, which is written in the NGINX configuration file.

## Configuring the Statistics Service

!!! warning "Important"

    It is highly recommended to configure the statistics service in the separate configuration file `wallarm-status.conf` and not to use the `wallarm_status` directive in other files that you use when setting up NGINX, because the latter may be insecure.
    
    Also, it is strongly advised not to alter any of the existing lines of the default `wallarm-status` configuration as it may corrupt the process of metric data upload to the Wallarm cloud.

When using the directive, statistics can be given in JSON format or in a format compatible with [Prometheus][link-prometheus]. Usage:

```
wallarm_status [on|off] [format=json|prometheus];
``` 

!!! info
    The directive can be configured in the context of `server` and/or `location`.

When configuring the `wallarm_status` directive, you can specify the IP addresses from which you can request statistics. By default, access is denied from anywhere except for the IP addresses `127.0.0.1` and `::1`, which allow executing the request only from the server where Wallarm is installed.

An example of a secure configuration of the filter node statistics service (`wallarm-status.conf`) is shown below:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;
  allow 127.0.0.0/8;   # Access is only available for loopback addresses of the filter node server  
  deny all;                  
  wallarm_mode off;
  access_log off;
  location /wallarm-status {
    wallarm_status on;
  }
}

```

!!! info "Changing the `listen` directive"
    Note that if you change the IP address of the `listen` directive (in the example above, `127.0.0.8`), you will also need to change the following settings:
    
    * Adjust the [monitoring](monitoring/intro.md) settings of the filtering node to the new IP address in the file `/etc/collectd/collectd.conf.d/nginx-wallarm.conf`
    * Add or change the `allow` directive to allow access from addresses other than loopback addresses (the above configuration file allows access only to loopback addresses)

To allow requests from another server, add the `allow` instruction with the IP address of the desired server in the configuration. For example:

```
allow 10.41.29.0;
```


##  Working with the Statistics Service

To obtain the filter node statistics, make a request from one of the allowed IP addresses (see above):

```
curl http://127.0.0.8/wallarm-status
```

As a result, you will get a response of the type:

```
{ "requests":0,"attacks":0,"blocked":0,"blocked_by_acl":0,"abnormal":0,"tnt_errors":0,
"api_errors":0,"requests_lost":0,"overlimits_time":0,"segfaults":0,"memfaults":0,
"softmemfaults":0,"proton_errors":0,"time_detect":0,"db_id":73,"lom_id":102,"custom_ruleset_id":102,
"db_apply_time":1598525865,"lom_apply_time":1598525870,"custom_ruleset_apply_time":1598525870,
"proton_instances": { "total":3,"success":3,"fallback":0,"failed":0 },"stalled_workers_count":0,
"stalled_workers":[],"ts_files":[{"id":102,"size":12624136,"mod_time":1598525870,
"fname":"\/etc\/wallarm\/custom_ruleset"}],"db_files":[{"id":73,"size":139094,"mod_time":1598525865,
"fname":"\/etc\/wallarm\/proton.db"}] }
```

The following response parameters are available:
*   `requests`: the number of requests that have been processed by the filter node.
*   `attacks`: the number of recorded attacks.
*   `blocked`: the number of blocked requests including those originated from [blacklisted](../user-guides/ip-lists/blacklist.md) IPs.
*   `blocked_by_acl`: the number of requests blocked due to [blacklisted](../user-guides/ip-lists/blacklist.md) request sources.
*   `abnormal`: the number of requests the application deems abnormal.
*   `requests_lost`: the number of requests that were not analyzed in a post-analytics module and transferred to API. For these requests, blocking parameters were applied (i.e., malicious requests were blocked if the system was operating in blocking mode); however, data on these events is not visible in the UI. This parameter is only used when the Wallarm Node works with a local post-analytics module.
*   `overlimits_time`: the number of attacks with the type [Overlimiting of computational resources](../attacks-vulns-list.md#overlimiting-of-computational-resources) detected by the filtering node.
*   `tnt_errors`: the number of requests not analyzed by a post-analytics module. For these requests, the reasons for blocking are recorded, but the requests themselves are not counted in statistics and behavior checks.
*   `api_errors`: the number of requests that were not submitted to the API for further analysis. For these requests, blocking parameters were applied (i.e., malicious requests were blocked if the system was operating in blocking mode); however, data on these events is not visible in the UI. This parameter is only used when the Wallarm Node works with a local post-analytics module.
*   `segfaults`: the number of issues that led to the emergency termination of the worker process.
*   `memfaults`: the number of issues where the virtual memory limits were reached.
*   `time_detect`: the total time of requests analysis.
*   `db_id`: proton.db version.
*   `lom_id`: will be deprecated soon, please use `custom_ruleset_id`.
*   `custom_ruleset_id` (in Wallarm node 3.4 and lower, `lom_id`): version of the [custom ruleset][gl-lom] build.
*   `db_apply_time`: Unix time of the last update of the proton.db file.
*   `lom_apply_time`: will be deprecated soon, please use `custom_ruleset_apply_time`.
*   `custom_ruleset_apply_time` (in Wallarm node 3.4 and lower, `lom_apply_time`): Unix time of the last update of the [custom ruleset](../glossary-en.md#custom-ruleset-the-former-term-is-lom) file.
*   `proton_instances`: information about proton.db + LOM pairs:
    *   `total`: the number of proton.db + LOM pairs.
    *   `success`: the number of the successfully uploaded proton.db + LOM pairs.
    *   `fallback`: the number of proton.db + LOM pairs loaded from the last saved files.
    *   `failed`: the number of proton.db + LOM pairs that were not initialized and run in the “do not analyze” mode.
*   `stalled_workers_count`: the quantity of workers that exceeded the time limit for request processing (the limit is set in the `wallarm_stalled_worker_timeout` directive).
*   `stalled_workers`: the list of the workers that exceeded the time limit for request processing (the limit is set in the `wallarm_stalled_worker_timeout` directive) and the amount of time spent on request processing.
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

The data of all counters is accumulated from the moment NGINX is started. If Wallarm has been installed in a ready-made infrastructure with NGINX, the NGINX server must be restarted to start Wallarm.
