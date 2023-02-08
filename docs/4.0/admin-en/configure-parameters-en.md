[doc-nginx-install]:    ../installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]: scanner-address-eu-cloud.md
[doc-us-scanner-ip-addresses]: scanner-address-us-cloud.md
[acl-access-phase]:            #wallarm_acl_access_phase

# Configuration options for the NGINX‑based Wallarm node

Learn fine-tuning options available for the Wallarm NGINX modules to get the most out of the Wallarm solution.

!!! info "NGINX official documentation"
    The Wallarm configuration is very similar to the NGINX configuration. [See the official NGINX documentation](https://www.nginx.com/resources/admin-guide/). Along with the Wallarm specific configuration options, you have the full capabilities of the NGINX configuration.

## Wallarm directives

### disable_acl

Allows disabling analysis of requests origins. If disabled (`on`), the filtering node does not download [IP lists](../user-guides/ip-lists/overview.md) from the Wallarm Cloud and skips request source IPs analysis.

!!! info
    This parameter can be set inside the http, server, and location blocks.

    Default value is `off`.

### wallarm_acl_access_phase

Setting `wallarm_acl_access_phase on` increases the Wallarm node performance by omitting the attack search stage during the analysis of requests from [denylisted](../user-guides/ip-lists/denylist.md) IPs. This configuration option is useful if there are many denylisted IPs (e.g. the whole countries) producing high traffic that heavily loads the working machine CPU.

By default, the filtering node blocks the requests from the denylisted IPs only after requests are analyzed for attack signs. Setting `wallarm_acl_access_phase on` changes the order of these stages forcing requests from denylisted IPs to be blocked immediately without attack sign search. This significantly reduces the load of the CPU of the node.

!!! info "Default value and interaction with other directives"
    **Default value**: `off`

    * With [`disable_acl on`](#disable_acl), IP lists are not processed and enabling `wallarm_acl_access_phase` does not make sense.
    * The `wallarm_acl_access_phase` directive has priority over [`wallarm_mode`](#wallarm_mode) which results in blocking requests from denylisted IPs even if the filtering node mode is `off` or `monitoring`.

### wallarm_api_conf

A path to the `node.yaml` file, which contains access requirements for the Wallarm API.

**Example**: 
```
wallarm_api_conf /etc/wallarm/node.yaml
```

Used to upload serialized requests from the filtering node directly to the Wallarm API (Cloud) instead of uploading into the postanalytics module (Tarantool).
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
  port: 443
  ca_verify: true
```

### wallarm_application

!!! warning "Predecessors and changed behavior of the directive"
    In Wallarm node 3.4 and lower, role of this directive was performed by the `wallarm_instance` directive (now deprecated).
    
    In Wallarm node 3.6 this directive was used both for its main purpose described in this section and for specifying tenants in the multi-tenant nodes. Now the second role went away and transferred to the new [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid) directive. The first role remains unchanged.

    When updating configuration you used for your filtering node of the version before 4.0:

    * If you upgrade filtering node without multitenancy feature and have any `wallarm_instance` used to set unique identifier of the protected application, just rename it to `wallarm_application`.
    * If you upgrade filtering node with multitenancy feature, consider all `wallarm_instance` to be `wallarm_application`, then rewrite the configuration as described in the [multitenancy reconfiguration instruction](../updating-migrating/multi-tenant.md#step-3-reconfigure-multitenancy).

Unique identifier of the protected application to be used in the Wallarm Cloud. The value can be a positive integer except for `0`.

Unique identifiers can be set for both the application domains and the domain paths, for example:

=== "Identifiers for domains"
    Configuration file for the domain **example.com**:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...

        wallarm_mode monitoring;
        wallarm_application 1;
        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    Configuration file for the domain **test.com**:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...

        wallarm_mode monitoring;
        wallarm_application 2;
        location / {
                proxy_pass http://test.com;
                include proxy_params;
        }
    }
    ```
=== "Identifiers for domain paths"
    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...
        
        wallarm_mode monitoring;
        location /login {
                proxy_pass http://example.com/login;
                include proxy_params;
                wallarm_application 3;
        }
        
        location /users {
                proxy_pass http://example.com/users;
                include proxy_params;
                wallarm_application 4;
        }
    }
    ```

[More details on setting up applications →](../user-guides/settings/applications.md)

!!! info
    This parameter can be set inside the http, server, and location blocks.

    **Default value**: `-1`.

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

A directory in which the backup catalog for the proton.db and custom ruleset file copy storage is created when the server starts. This directory must be writable for the client that runs NGINX.

!!! info
    This parameter is configured inside the http block only.

### wallarm_custom_ruleset_path

A path to the [custom ruleset](../user-guides/rules/intro.md) file that contains information on the protected application and the filtering node settings.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `/etc/wallarm/custom_ruleset` (in Wallarm node 3.4 and lower, `/etc/wallarm/lom`)

!!! warning "Previous name of the directive"
    In Wallarm node 3.4 and lower, this directive is named `wallarm_local_trainingset_path`. If you use this name, we recommend to change it when [upgrading the node modules](../updating-migrating/general-recommendations.md#update-process). The `wallarm_local_trainingset_path` directive will be deprecated soon. The directive logic has not changed.

### wallarm_enable_libdetection

Enables additional validation of the SQL Injection attacks via the **libdetection** library. Using **libdetection** ensures the double‑detection of attacks and reduces the number of false positives.

Analyzing of requests with the **libdetection** library is disabled by default in all [deployment options](../admin-en/supported-platforms.md) except for the [Wallarm CDN nodes](../installation/cdn-node.md). To reduce the number of false positives, we recommend to enable analysis (`wallarm_enable_libdetection on`).

[More details on **libdetection** →](../about-wallarm/protecting-against-attacks.md#library-libdetection)

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

    To enable libdetection in the Wallarm Ingress controller, it is required to [apply](configure-kubernetes-en.md#enabling-attack-analysis-with-libdetection) the `nginx.ingress.kubernetes.io/server-snippet` annotation with this parameter to the Ingress resource.

    Default value is:
    
    * `on` for the [Wallarm CDN nodes](../installation/cdn-node.md) (`proxy_request_buffering` is `on` as well).
    * `off` for all [deployment options](../admin-en/supported-platforms.md) except for the Wallarm CDN nodes.

### wallarm_fallback

With the value set to `on`, NGINX has the ability to enter an emergency mode; if proton.db or custom ruleset cannot be downloaded, this setting disables the Wallarm module for the http, server, and location blocks, for which the data fails to download. NGINX keeps functioning.

!!! info
    Default value is `on`.

    This parameter can be set inside the http, server, and location blocks.


### wallarm_force

Sets the requests' analysis and custom rules generation based on the NGINX mirrored traffic. See [Analyzing mirrored traffic with NGINX](configuration-guides/traffic-mirroring/nginx-example.md).

### wallarm_general_ruleset_memory_limit

!!! warning "Previous name of the directive"
    In Wallarm node 3.6 and lower, this directive is named `wallarm_ts_request_memory_limit`. If you use this name, we recommend to change it when [upgrading the node modules](../updating-migrating/general-recommendations.md#update-process). The `wallarm_ts_request_memory_limit` directive will be deprecated soon. The directive logic has not changed.

Set a limit for the maximum amount of memory that can be used by one instance of proton.db and custom ruleset.

If the memory limit is exceeded while processing some request, the user will get a 500 error.

The following suffixes can be used in this parameter:
* `k` or `K` for kilobytes
* `m` or `M` for megabytes
* `g` or `G` for gigabyte

Value of **0** turns the limit off.

!!! info
    This parameter can be set inside the http, server, and/or location blocks.
    
    **Default value**: `1` GB

### wallarm_global_trainingset_path

!!! warning "The directive will be deprecated soon"
    Starting with Wallarm node 3.6, please use the [`wallarm_protondb_path`](#wallarm_protondb_path) directive instead.

    The `wallarm_global_trainingset_path` directive is still supported but will be deprecated in future releases. If you use the directive, we recommend to rename it. The directive logic has not changed.

### wallarm_file_check_interval

Defines an interval between checking new data in proton.db and custom ruleset file. The unit of measure is specified in the suffix as follows:
* no suffix for minutes
* `s` for seconds
* `ms` for milliseconds

!!! info
    This parameter is configured only inside the http block.
    
    **Default value**: `1` (one minute)

### wallarm_instance

!!! warning "The directive is deprecated"
    * If the directive was used to set unique identifier of the protected application, just rename it to [`wallarm_application`](#wallarm_application).
    * To set unique identifier of the tenant for the multi-tenant nodes, instead of the `wallarm_instance`, use the [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid) directive.

    When updating configuration you used for your filtering node of the version before 4.0:

    * If you upgrade filtering node without multitenancy feature and have any `wallarm_instance` used to set unique identifier of the protected application, just rename it to `wallarm_application`.
    * If you upgrade filtering node with multitenancy feature, consider all `wallarm_instance` to be `wallarm_application`, then rewrite the configuration as described in the [multitenancy reconfiguration instruction](../updating-migrating/multi-tenant.md#step-3-reconfigure-multitenancy).

### wallarm_key_path

A path to the Wallarm private key used for encryption/decryption of proton.db and custom ruleset files.

!!! info
    **Default value**: `/etc/wallarm/private.key` (in Wallarm node 3.6 and lower, `/etc/wallarm/license.key`)


### wallarm_local_trainingset_path

!!! warning "The directive will be deprecated soon"
    Starting with Wallarm node 3.6, please use the [`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path) directive instead.

    The `wallarm_local_trainingset_path` directive is still supported but will be deprecated in future releases. If you use the directive, we recommend to rename it. The directive logic has not changed.

### wallarm_mode

Traffic processing mode:

* `off`
* `monitoring`
* `safe_blocking`
* `block`

--8<-- "../include/wallarm-modes-description-3.6.md"

Usage of `wallarm_mode` can be restricted by the `wallarm_mode_allow_override` directive.

[Detailed instructions on filtration mode configuration →](configure-wallarm-mode.md)

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value** depends on the filtering node deployment method (can be `off` or `monitoring`)

### wallarm_mode_allow_override

Manages the ability to override the [`wallarm_mode`](#wallarm_mode) values via filtering rules downloaded from the Wallarm Cloud (custom ruleset):

- `off` - the custom rules are ignored.
- `strict` - custom rules can only strengthen the operation mode.
- `on` - it is possible to both strengthen and soften the operation mode.

For example, with `wallarm_mode monitoring` and `wallarm_mode_allow_override strict` set, Wallarm Console can be used to enable blocking of some requests, but the attack analysis cannot be fully disabled.

[Detailed instructions on filtration mode configuration →](configure-wallarm-mode.md)

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `on`


### wallarm_parse_response

Whether to analyze the application responses. Response analysis is required for vulnerability detection during [passive detection](../about-wallarm/detecting-vulnerabilities.md#passive-detection) and [active threat verification](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification). 

Possible values are `on` (response analysis is enabled) and `off` (response analysis is disabled).

!!! info
    This parameter can be set inside http, server, and location blocks.
    
    **Default value**: `on`

!!! warning "Improve performance"
    You are recommended to disable processing of static files through `location` to improve performance.

### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

Wallarm provides full WebSockets support under the API Security subscription plan. By default, the WebSockets' messages are not analyzed for attacks.

To force the feature, activate the API Security subscription plan and use the `wallarm_parse_websocket` directive.

Possible values:

- `on`: message analysis is enabled.
- `off`: message analysis is disabled.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `off`

### wallarm_parser_disable

Allows to disable parsers. The directive values corresponds to the name of the parser to be disabled:

- `cookie`
- `zlib`
- `htmljs`
- `json`
- `multipart`
- `base64`
- `percent`
- `urlenc`
- `xml`

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

Whether to apply the HTML parsers to HTML code received in the application response. Possible values are `on` (HTML parser is applied) and `off` (HTML parser is not applied).

This parameter is effective only if `wallarm_parse_response on`.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `on`

### wallarm_partner_client_uuid

Unique identifier of the tenant for the [multi-tenant](../installation/multi-tenant/overview.md) Wallarm node. The value should be a string in the [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) format, for example:

* `11111111-1111-1111-1111-111111111111`
* `123e4567-e89b-12d3-a456-426614174000`

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    Know how to:
    
    * [Get the UUID of the tenant during tenant creation →](../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)
    * [Get the list of UUIDs of existing tenants →](../updating-migrating/multi-tenant.md#get-uuids-of-your-tenants)

Configuration example:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
  ...
}
...
}
```

In the configuration above:

* Tenant stands for partner's client. The partner has 2 clients.
* The traffic targeting `tenant1.com` and `tenant1-1.com` will be associated with the client `11111111-1111-1111-1111-111111111111`.
* The traffic targeting `tenant2.com` will be associated with the client `22222222-2222-2222-2222-222222222222`.
* The first client also has 3 applications, specified via the [`wallarm_application`](#wallarm_application) directive:
    * `tenant1.com/login` – `wallarm_application 21`
    * `tenant1.com/users` – `wallarm_application 22`
    * `tenant1-1.com` – `wallarm_application 23`

    The traffic targeting these 3 paths will be associated with the corresponding application, the remaining will be the generic traffic of the first client.

### wallarm_process_time_limit

!!! warning "The directive has been deprecated"
    Starting from the version 3.6, it is recommended to fine-tune the `overlimit_res` attack detection using the [rule **Fine‑tune the overlimit_res attack detection**](../user-guides/rules/configure-overlimit-res-detection.md).
    
    The `wallarm_process_time_limit` directive is temporarily supported but will be removed in future releases.

Sets the time limit of a single request processing by the Wallarm node.

If the time exceeds the limit, an error is recorded into the log and the request is marked as the [`overlimit_res`](../attacks-vulns-list.md#overlimiting-of-computational-resources) attack. Depending on the [`wallarm_process_time_limit_block`](#wallarm_process_time_limit_block) value, the attack can be either blocked, monitored or ignored.

The value is specified in milliseconds without units, e.g.:

```bash
wallarm_process_time_limit 1200; # 1200 milliseconds
wallarm_process_time_limit 2000; # 2000 milliseconds
```

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: 1000ms (one second).

### wallarm_process_time_limit_block

!!! warning "The directive has been deprecated"
    Starting from the version 3.6, it is recommended to fine-tune the `overlimit_res` attack detection using the [rule **Fine‑tune the overlimit_res attack detection**](../user-guides/rules/configure-overlimit-res-detection.md).
    
    The `wallarm_process_time_limit_block` directive is temporarily supported but will be removed in future releases.

The ability to manage the blocking of requests, which exceed the time limit set in the [`wallarm_process_time_limit`](#wallarm_process_time_limit) directive:

- `on`: the requests are always blocked unless `wallarm_mode off`
- `off`: the requests are always ignored

    !!! warning "Protection bypass risk"
        The `off` value should be used carefully as this value disables protection from the `overlimit_res` attacks.
        
        It is recommended to use the `off` value only in the strictly specific locations where it is really necessary, for example where the upload of the large files is performed, and where there is no risk of protection bypass and vulnerability exploit.
        
        **It is strongly not recommended** to set `wallarm_process_time_limit_block` to `off` globally for http or server blocks.
    
- `attack`: depends on the attack blocking mode set in the `wallarm_mode` directive:
    - `off`: the requests are not processed.
    - `monitoring`: the requests are ignored but details on the `overlimit_res` attacks are uploaded to the Wallarm Cloud and displayed in Wallarm Console.
    - `safe_blocking`: only requests originated from [graylisted](../user-guides/ip-lists/graylist.md) IP addresses are blocked and details on all `overlimit_res` attacks are uploaded to the Wallarm Cloud and displayed in Wallarm Console.
    - `block`: the requests are blocked.

Regardless of the directive value, requests of the `overlimit_res` attack type are uploaded to the Wallarm Cloud except when [`wallarm_mode off;`](#wallarm_mode).

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `wallarm_process_time_limit_block attack`

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

### wallarm_protondb_path

A path to the [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton) file that has the global settings for request filtering, which do not depend on the application structure.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `/etc/wallarm/proton.db`

!!! warning "Previous name of the directive"
    In Wallarm node 3.4 and lower, this directive is named `wallarm_global_trainingset_path`. If you use this name, we recommend to change it when [upgrading the node modules](../updating-migrating/general-recommendations.md#update-process). The `wallarm_global_trainingset_path` directive will be deprecated soon. The directive logic has not changed.

### wallarm_request_chunk_size

Limits the size of the part of the request that is processed during one iteration. You can set up a custom value of the `wallarm_request_chunk_size` directive in bytes by assigning an integer to it. The directive also supports the following postfixes:
* `k` or `K` for kilobytes
* `m` or `M` for megabytes
* `g` or `G` for gigabytes

!!! info
    This parameter can be set inside the http, server, and location blocks.
    **Default value**: `8k` (8 kilobytes).

### wallarm_request_memory_limit

Set a limit for the maximum amount of memory that can be used for processing of a single request.

If the limit is exceeded, the request processing will be interrupted and a user will get a 500 error.

The following suffixes can be used in this parameter:
* `k` or `K` for kilobytes
* `m` or `M` for megabytes
* `g` or `G` for gigabytes

Value of `0` turns the limit off.

By default, limits are off. 

!!! info
    This parameter can be set inside the http, server, and/or location blocks.


### wallarm_stalled_worker_timeout

Sets the time limit for processing a single request for an NGINX worker in seconds.

If the time exceeds the limit, data about NGINX workers is written to the `stalled_workers_count` and `stalled_workers` [statistic](configure-statistics-service.md##working-with-the-statistics-service) parameters.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    
    **Default value**: `5` (five seconds)


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

    * The value of the `keepalive` parameter must not be lower than the number of the Tarantool servers.
    * The value of the `max_conns` parameter must be specified for each of the upstream Tarantool servers to prevent the creation of excessive connections.

!!! info
    The parameter is configured inside the http block only.

### wallarm_timeslice

A limit on the time that a filtering node spends on one iteration of processing a request before it switches to the next request. Upon reaching the time limit, the filtering node proceeds to process the next request in the queue. After performing one iteration on each of the requests in the queue, the node performs the second iteration of processing on the first request in the queue.

You can use time intervals suffixes that are described in the [NGINX documentation](https://nginx.org/en/docs/syntax.html) to assign different time unit values to the directive.

!!! info
    This parameter can be set inside the http, server, and location blocks.
    **Default value**: `0` (time limit for single iteration is disabled).

-----

!!! warning
    Due to NGINX server limitations, it is necessary to disable the buffering request by assigning the `off` value to the `proxy_request_buffering` NGINX directive for the `wallarm_timeslice` directive to work.

### wallarm_ts_request_memory_limit

!!! warning "The directive will be deprecated soon"
    Starting with Wallarm node 4.0, please use the [`wallarm_general_ruleset_memory_limit`](#wallarm_general_ruleset_memory_limit) directive instead.

    The `wallarm_ts_request_memory_limit` directive is still supported but will be deprecated in future releases. If you use the directive, we recommend to rename it. The directive logic has not changed.

### wallarm_unpack_response

Whether to decompress compressed data returned in the application response. Possible values are `on` (decompression is enabled) and `off` (decompression is disabled).

This parameter is effective only if `wallarm_parse_response on`.

!!! info
    **Default value**: `on`.


### wallarm_upstream_backend

A method for sending serialized requests. Requests can be sent either to Tarantool or to the API.

Possible values of the directive:
*   `tarantool`
*   `api`

Depending on the other directives, the default value will be assigned as follows:
*   `tarantool` - if there is no `wallarm_api_conf` directive in the configuration.
*   `api` - if there is a `wallarm_api_conf` directive, but there is no `wallarm_tarantool_upstream` directive in the configuration.

    !!! note
        If the `wallarm_api_conf` and `wallarm_tarantool_upstream` directives are present simultaneously in the configuration, a configuration error of the **directive ambiguous wallarm upstream backend** form will occur.

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
