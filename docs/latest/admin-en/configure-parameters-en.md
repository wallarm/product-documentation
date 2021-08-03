[doc-nginx-install]:    ../waf-installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]: scanner-address-en.md
[doc-us-scanner-ip-addresses]: scanner-address-us-en.md

# Configuration Options for the NGINX‑Based Filter Node

!!! info "NGINX official documentation"
    The Wallarm configuration is very similar to the NGINX configuration. [See the official NGINX documentation](https://www.nginx.com/resources/admin-guide/). Along with the Wallarm specific configuration options, you have the full capabilities of the NGINX configuration.

## Wallarm Directives

### disable_acl

Allows disabling analysis of requests origins. If disabled (`on`), the filtering node does not download [IP lists](../user-guides/ip-lists/overview.md) from the Wallarm Cloud and skips request source IPs analysis.

!!! info
    This parameter can be set inside the http, server, and location blocks.

    Default value is `off`.

### wallarm_api_conf

A path to the `node.yaml` file, which contains access requirements for the Wallarm API.

**Example**: 
```
wallarm_api_conf /etc/wallarm/node.yaml
```

Used to upload serialized requests from the filtering node directly to the Wallarm API (cloud) instead of uploading into the postanalytics module (Tarantool).
**Only requests with attacks are sent to the API.** Requests without attacks are not saved.

**Example of the node.yaml file content:**
``` bash
# API connection credentials

hostname: <some name>
uuid: <some uuid>
secret: <some secret>

# API connection parameters (the parameters below are used by default)

api:
  host: api.wallarm.com
  port: 444
  ca_verify: true
```


### wallarm_block_page

Lets you set up the response to the blocked request.

[More details on the blocking page and error code configuration →](configuration-guides/configure-block-page-and-code.md)

!!! info
    This parameter can be set inside the http, server, and location blocks.

### wallarm_block_page_add_dynamic_path

This directive is used to initialize the blocking page that has NGINX variables in its code and the path to this blocking page is also set using a variable. Otherwise, the directive is not used.

[More details on the blocking page and error code configuration →](configuration-guides/configure-block-page-and-code.md)

!!! info
    The directive can be set inside the `http` block of the NGINX configuration file.

### wallarm_cache_path

A directory in which the backup catalog for the proton.db and [LOM](../glossary-en.md#lom) copy storage is created when the server starts. This directory must be writable for the client that runs NGINX.

!!! info
    This parameter is configured inside the http block only.

### wallarm_enable_libdetection

Enables additional validation of the SQL Injection attacks via the **libdetection** library. Using **libdetection** ensures the double‑detection of attacks and reduces the number of false positives.

Analyzing of requests with the **libdetection** library is disabled by default. To reduce the number of false positives, we recommend to enable analysis (`wallarm_enable_libdetection on`).

[More details on **libdetection** →](../about-wallarm-waf/protecting-against-attacks.md#library-libdetection)

To allow **libdetection** to analyze the request body, please ensure that buffering of a client request body is enabled ([`proxy_request_buffering on`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering)). 

**Example:**

```
wallarm_enable_libdetection on;
proxy_request_buffering on;
```

!!! warning "Memory consumption increase"
    When analyzing attacks using the libdetection library, the amount of memory consumed by NGINX and Wallarm processes may increase by about 10%.

!!! info
    This parameter can be set inside the http, server, and location blocks.

    To enable libdetection in the Wallarm Ingresss controller, it is required to [apply](configure-kubernetes-en.md#enabling-attack-analysis-with-libdetection) the `nginx.ingress.kubernetes.io/server-snippet` annotation with this parameter to the Ingress resource.

    Default value is `off`.

### wallarm_fallback

With the value set to **on**, NGINX has the ability to enter an emergency mode; if proton.db or LOM cannot be downloaded, this setting disables the Wallarm module for the http, server, and location blocks, for which the data fails to download. NGINX keeps functioning.

!!! info
    This parameter can be set inside the http, server, and location blocks.


### wallarm_force

Sets the requests' analysis and LOM rules generation based on the NGINX mirrored traffic. See [Analyzing mirrored traffic with NGINX](mirror-traffic-en.md).

### wallarm_global_trainingset_path

A path to the proton.db file that has the global settings for request filtering, which do not depend on the application structure.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `/etc/wallarm/proton.db`

### wallarm_file_check_interval

Defines an interval between checking new data in proton.db and [LOM](../glossary-en.md#lom). The unit of measure is specified in the suffix as follows:
* no suffix for minutes,
* `s` for seconds,
* `ms` for milliseconds.

!!! info
    This parameter is configured only inside the http block.
    
    **Default value**: `1` (one minute)

### wallarm_instance

An application identifier. The directive is used to visually separate the data of different applications on the *Dashboard*. Numeric values only.

The application identifiers are used solely for the convenience of data presentation. To correctly separate the data of different applications, the same application identifiers must be set in the Wallarm interface.

Any filter node will filter traffic for any number of applications without additional configuration.

!!! info
    This parameter can be set inside the http, server, and location blocks.


### wallarm_key_path

A path to the Wallarm license key.

!!! info
    **Default value**: `/etc/wallarm/license.key`


### wallarm_local_trainingset_path

A path to the [LOM](../glossary-en.md#lom) file that contains information on the protected application and the filter node settings.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `/etc/wallarm/lom`


### wallarm_mode

!!! warning "Changes in the `off` and `monitoring` filtration mode logic"
    Starting with version 3.2, the logic of Wallarm node filtration modes has been changed as follows:

    * Wallarm node analyzes request source only in the `safe_blocking` and `block` modes now.
    * If the Wallarm node operating in the `off` or `monitoring` mode detects the request originated from the [blacklisted](../user-guides/ip-lists/blacklist.md) IP, it does not block this request.
    * If the Wallarm node operating in the `monitoring` mode detects the attack originated from the [whitelisted](../user-guides/ip-lists/whitelist.md) IP, it uploads the attack data to the Wallarm Cloud. Uploaded data is displayed in the **Events** section of the Wallarm Console.

    During the [Wallarm module upgrade](../updating-migrating/general-recommendations.md), please ensure that the expected behavior of the `wallarm_mode` directive in version 3.2 corresponds to released changes or adjust filtration mode settings to the released changes.

    If you have already updated modules, please adjust the filtration mode settings to changes released in version 3.2 (if necessary). [Details on filtration mode configuration](configure-wallarm-mode.md)

Traffic processing mode:

* `off` → the filtering node:

    * Does not analyze whether incoming requests contain malicious payloads of the following types: [input validation attacks](../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md).
    * Does not block requests containing malicious payloads.
    * Does not analyze requests sources.
* `monitoring` → the filtering node:
    * Analyzes whether incoming requests contain malicious payloads of the following types: [input validation attacks](../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md). If malicious requests are detected, the filtering node uploads them to the Wallarm Cloud.
    * Does not block requests containing malicious payloads.
    * Does not analyze requests sources.
* `safe_blocking` → the filtering node:
    * Analyzes whether incoming requests contain malicious payloads of the following types: [input validation attacks](../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md). If malicious requests are detected, the filtering node uploads them to the Wallarm Cloud.
    * Blocks all requests originated from [blacklisted IP addresses](../user-guides/ip-lists/blacklist.md).
    * Blocks requests containing malicious payloads if they are originated from [greylisted IP addresses](../user-guides/ip-lists/greylist.md).
* `block` → the filtering node:
    * Analyzes whether incoming requests contain malicious payloads of the following types: [input validation attacks](../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md). If malicious requests are detected, the filtering node uploads them to the Wallarm Cloud.
    * Blocks requests containing malicious payloads.
    * Blocks all requests originated from [blacklisted IP addresses](../user-guides/ip-lists/blacklist.md).

Usage of `wallarm_mode` can be restricted by the `wallarm_mode_allow_override` directive.

[Detailed instructions on filtration mode configuration →](configure-wallarm-mode.md)

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value** depends on the filtering node deployment method (can be `off` or `monitoring`)

### wallarm_mode_allow_override

Manages the ability to override the [`wallarm_mode`](#wallarm_mode) values via filtering rules downloaded from the Wallarm cloud (LOM):

- **off**: the rules set in LOM are ignored.
- **strict**: LOM can only strengthen the operation mode.
- **on**: it is possible to both strengthen and soften the operation mode.

For example, with `wallarm_mode monitoring` and `wallarm_mode_allow_override strict` set, the Wallarm Console can be used to enable blocking of some requests, but the attack analysis cannot be fully disabled.

[Detailed instructions on filtration mode configuration →](configure-wallarm-mode.md)

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `on`


### wallarm_parse_response

The mode of processing web server responses; by default, only the client's request to the web server can be processed.

Possible values:

- **on**: analysis of web server responses by a passive [vulnerability](../glossary-en.md#vulnerability) scanner without sending requests from the Wallarm cloud).
- **off**: responses are not analyzed.

!!! info
    This parameter can be set inside http, server, and location blocks.
    
    **Default value**: `on`

!!! warning "Improve performance"
    You are recommended to disable processing of static files through `location` to improve performance.

### wallarm_parse_websocket

Wallarm has full WebSockets support. By default, the WebSockets' messages are not analyzed for attacks. To force the feature, use the `wallarm_parse_websocket` directive.

Possible values:
- **on**: message analyses is enabled
- **off**: message analyses is disabled.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `off`

### wallarm_parser_disable

Allows to disable parsers.

The following parsers are currently supported:

- cookie
- zlib
- htmljs
- json
- multipart
- base64
- percent
- urlenc
- xml

**Example**

```
wallarm_parser_disable base64;
wallarm_parser_disable xml;
location /ab {
    wallarm_parser_disable json;
    wallarm_parser_disable base64;
    proxy_pass http://example.com;
}
location /zy {
    wallarm_parser_disable json;
    proxy_pass http://example.com;
}
```

!!! info
    This parameter can be set inside the http, server, and location blocks.

### wallarm_parse_html_response

Lets you enable and disable an HTML parser for responses to requests. Can be:
* `on`
* `off`

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `on`

### wallarm_stalled_worker_timeout

Sets the time limit for processing a single request for an NGINX worker in seconds.

If the time exceeds the limit, data about NGINX workers is written to the `stalled_workers_count` and `stalled_workers` [statistic](configure-statistics-service.md##working-with-the-statistics-service) parameters.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `5` (five seconds)

### wallarm_process_time_limit

Sets the time limit of a single request processing in milliseconds. If the time exceeds the limit, an error is recorded into the log and the request is marked as an `overlimit_res` attack. The requests are blocked in the *blocking* mode (`wallarm_mode block;`) and ignored in the *monitoring* mode (`wallarm_mode monitoring;`).

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: 1000ms (one second).

### wallarm_process_time_limit_block

The ability to manage the blocking of requests, which exceed the time limit set in the `wallarm_process_time_limit` directive:

- **on**: the requests are always blocked
- **off**: the requests are always ignored
- **attack**: depends on the attack blocking mode set in the `wallarm-mode` directive:
    - **off**: the requests are not processed.
    - **monitoring**: the requests are ignored but details on the `overlimit_res` attacks are uploaded to the Wallarm Cloud and displayed in the Wallarm Console.
    - **safe_blocking**: only requests originated from [greylisted](../user-guides/ip-lists/greylist.md) IP addresses are blocked and details on all `overlimit_res` attacks are uploaded to the Wallarm Cloud and displayed in the Wallarm Console.
    - **block**: the requests are blocked.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `wallarm_process_time_limit_block attack`

### wallarm_request_memory_limit

Set a limit for the maximum amount of memory that can be used for processing of a single request.

If the limit is exceeded, the request processing will be interrupted and a user will get a 500 error.

The following suffixes can be used in this parameter:
* `k` or `K` for kilobytes
* `m` or `M` for megabytes
* `g` or `G` for gigabytes

Value of 0 turns the limit off.

By default, limits are off. 

!!! info
    This parameter can be set inside the http, server, and/or location blocks.

### wallarm_proton_log_mask_master

Settings for the debug logging of the NGINX master process. 

!!! warning "Using the directive"
    You need to configure the directive only if you are told to do so by the Wallarm support team member. They will provide you with the value to use with the directive.

!!! info
    The parameter can only be configured at the main level.


### wallarm_proton_log_mask_worker

Settings of the debug logging for a NGINX worker process. 

!!! warning "Using the directive"
    You need to configure the directive only if you are told to do so by the Wallarm support team member. They will provide you with the value to use with the directive.

!!! info
    The parameter can only be configured at the main level.

### wallarm_request_chunk_size

Limits the size of the part of the request that is processed during one iteration. You can set up a custom value of the `wallarm_request_chunk_size` directive in bytes by assigning an integer to it. The directive also supports the following postfixes:
* `k` or `K` for kilobytes
* `m` or `M` for megabytes
* `g` or `G` for gigabytes

!!! info
    This parameter can be set inside the http, server, and location blocks.
    **Default value**: `8k` (8 kilobytes).

### wallarm_tarantool_connect_attempts

!!! warning "Deprecated"
    Use the [`wallarm_upstream_connect_attempts`](#wallarm_upstream_connect_attempts) directive instead.


### wallarm_tarantool_connect_interval

!!! warning "Deprecated"
    Use the [`wallarm_upstream_reconnect_interval`](#wallarm_upstream_reconnect_interval) directive instead.


### wallarm_tarantool_upstream

With the `wallarm_tarantool_upstream`, you can balance the requests between several postanalytics servers.

**Example:**

```bash
upstream wallarm_tarantool {
    server 127.0.0.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

See also [Module ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html).

!!! warning "Required conditions"
    It is required that the following conditions are satisfied for the `max_conns` and the `keepalive` parameters:

    * The value of the `keepalive` parameter must not be lower than the number of the tarantool servers.
    * The value of the `max_conns` parameter must be specified for each of the upstream Tarantool servers to prevent the creation of excessive connections.

!!! info
    The parameter is configured inside the http block only.

### wallarm_timeslice

A limit on the time that a filter node spends on one iteration of processing a request before it switches to the next request. Upon reaching the time limit, the filter node proceeds to process the next request in the queue. After performing one iteration on each of the requests in the queue, the node performs the second iteration of processing on the first request in the queue.

You can use time intervals suffixes that are described in the [nginx documentation](https://nginx.org/en/docs/syntax.html) to assign different time unit values to the directive.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    **Default value**: `0` (time limit for single iteration is disabled).

-----

!!! warning
    Due to NGINX server limitations, it is necessary to disable the buffering request by assigning the `off` value to the `proxy_request_buffering` NGINX directive for the `wallarm_timeslice` directive to work.

### wallarm_ts_request_memory_limit

Set a limit for the maximum amount of memory that can be used by one instance of proton.db and LOM.

If the memory limit is exceeded while processing some request, the user will get a 500 error.

The following suffixes can be used in this parameter:
* `k` or `K` for kilobytes
* `m` or `M` for megabytes
* `g` or `G` for gigabyte

Value of **0** turns the limit off.

!!! info
    This parameter can be set inside the http, server, and/or location blocks.
    
    **Default value**: `1` GB

### wallarm_unpack_response

If the backend sends compressed data, the value `on` decompresses the data before processing. The value `off` turns off the decompressing.

!!! info
    **Default value**: `on`.


### wallarm_upstream_backend

A method for sending serialized requests. Requests can be sent either to the Tarantool or to the API.

Possible values of the directive:
*   `tarantool`
*   `api`

Depending on the other directives, the default value will be assigned as follows:
*   `tarantool`—if there is no `wallarm_api_conf` directive in the configuration.
*   `api`—if there is a `wallarm_api_conf` directive, but there is no `wallarm_tarantool_upstream` directive in the configuration.

    !!! note
        If the `wallarm_api_conf` and `wallarm_tarantool_upstream` directives are present simultaneously in the configuration, a configuration error of the *directive ambiguous wallarm upstream backend* form will occur.

!!! info
    This parameter can be set inside the http block only.


### wallarm_upstream_connect_attempts

Defines the number of immediate reconnects to the Tarantool or Wallarm API.
If a connection to the Tarantool or API is terminated, then the attempt to reconnect will not occur. However, this is not the case when there aren't anymore connections and the serialized request queue is not empty.

!!! note
    Reconnection may occur through another server, because the “upstream” subsystem is responsible for choosing the server.
    
    This parameter can be set inside the http block only.


### wallarm_upstream_reconnect_interval

Defines the interval between attempts to reconnect to the Tarantool or Wallarm API after the number of unsuccessful attempts has exceeded the `wallarm_upstream_connect_attempts` threshold.

!!! info
    This parameter can be set inside the http block only.


### wallarm_upstream_connect_timeout

Defines a timeout for connecting to the Tarantool or Wallarm API.

!!! info
    This parameter can be set inside the http block only.


### wallarm_upstream_queue_limit

Defines a limit to the number of serialized requests.
Simultaneously setting the `wallarm_upstream_queue_limit` parameter and not setting the `wallarm_upstream_queue_memory_limit` parameter means that there will be no limit on the latter.

!!! info
    This parameter can be set inside the http block only.


### wallarm_upstream_queue_memory_limit

Defines a limit to the total volume of serialized requests.
Simultaneously setting the `wallarm_upstream_queue_memory_limit` parameter and not setting the `wallarm_upstream_queue_limit` parameter means that there will be no limit on the latter.

!!! info
    **Default value:** `100m`.
    
    This parameter can be set inside the http block only.


### wallarm_worker_rlimit_vmem

!!! warning "Deprecated"
    It is now an alias for the [wallarm_ts_request_memory_limit](#wallarm_ts_request_memory_limit) directive.
