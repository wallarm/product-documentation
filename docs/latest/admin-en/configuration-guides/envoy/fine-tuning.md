# Configuration options for the Envoy‑based Wallarm node

[link-lom]:                     ../../../user-guides/rules/intro.md
[link-dashboard]:               ../../../user-guides/dashboard/waf.md

[anchor-process-time-limit]:    #processtimelimit
[anchor-tsets]:                 #filtering-mode-settings

Envoy uses pluggable filters defined in the Envoy configuration file to process incoming requests. These filters describe the actions to be performed on the request. For example, an `envoy.http_connection_manager` filter is used to proxy HTTP requests. This filter has its own set of HTTP filters that can be applied to the request.  

The Wallarm API Security module is designed as an Envoy HTTP filter. The module's general settings are placed in a section dedicated to the `wallarm` HTTP filter:

```
listeners:
   - address:
     filter_chains:
     - filters:
       - name: envoy.http_connection_manager
         typed_config:
           http_filters:
           - name: wallarm
             typed_config:
              "@type": type.googleapis.com/wallarm.Wallarm
              <the Wallarm API Security module configuration>
              ...  
```

!!! warning "Enable request body processing"
    In order to enable the Wallarm module to process an HTTP request body, the buffer filter must be placed before the filtering node in the Envoy HTTP filter chain. For example:
    
    ```
    http_filters:
    - name: envoy.buffer
      typed_config:
        "@type": type.googleapis.com/envoy.config.filter.http.buffer.v2.Buffer
        max_request_bytes: <maximum request size (in bytes)>
    - name: wallarm
      typed_config:
        "@type": type.googleapis.com/wallarm.Wallarm
        <the Wallarm module configuration>
        ...
    ```
    
    If the incoming request size exceeds the value of the `max_request_bytes` parameter, then this request will be dropped and Envoy will return the `413` response code (“Payload Too Large”).

## Request filtering settings

The `rulesets` (in Wallarm node 3.6 and lower was named `tsets`) section of the file contains the parameters related to request filtering settings:

```
rulesets:
- name: rs0
  pdb: /etc/wallarm/proton.db
  custom_ruleset: /etc/wallarm/custom_ruleset
  key: /etc/wallarm/private.key
  general_ruleset_memory_limit: 0
  enable_libdetection: "on"
  ...
- name: rsN:
  ...
```

The `rs0` ... `rsN` entries are one or more parameter groups. The groups can have any name (so that they can be referred to later via the [`ruleset`](#ruleset_param) parameter in the `conf` section). At least one group should be present in the filtering node configuration (e.g., with the name `rs0`).

This section has no default values. You need to explicitly specify values in the config file.

!!! info "Definition level"
    This section can be defined on the filtering node level only.

Parameter | Description | Default value
--- | ---- | -----
`pdb` | Path to the `proton.db` file. This file contains the global settings for request filtering, which do not depend on the application structure. | `/etc/wallarm/proton.db`
`custom_ruleset` | Path to the [custom ruleset][link-lom] file that contains information about the protected application and the filtering node settings. <div class="admonition warning"> <p class="admonition-title">Previous name of the parameter</p> <p>In Wallarm node 3.4 and lower, this parameter is named `lom`. If you use this name, we recommend to change it when <a href="/updating-migrating/general-recommendations/#update-process">upgrading the node modules</a>. The `lom` parameter will be deprecated soon. The parameter logic has not changed.</div> | `/etc/wallarm/custom_ruleset`<br><br>(in Wallarm node 3.4 and lower, `/etc/wallarm/lom`)
`key` | Path to the file with the Wallarm private key used for encryption/decryption of proton.db and custom ruleset files. | `/etc/wallarm/private.key`<br><br>(in Wallarm node 3.6 and lower, `/etc/wallarm/license.key`)
`general_ruleset_memory_limit` | Limit for the maximum amount of memory that can be used by one instance of proton.db and custom ruleset. If the memory limit is exceeded while processing some request, the user will get the 500 error. The following suffixes can be used in this parameter:<ul><li>`k` or `K` for kilobytes</li><li>`m` or `M` for megabytes</li><li>`g` or `G` for gigabyte</li></ul>Value of `0` turns the limit off. <div class="admonition warning"> <p class="admonition-title">Previous name of the parameter</p> <p>In Wallarm node 3.6 and lower, this parameter is named `ts_request_memory_limit`. If you use this name, we recommend to change it when <a href="/updating-migrating/general-recommendations/#update-process">upgrading the node modules</a>. The `ts_request_memory_limit` parameter will be deprecated soon. The parameter logic has not changed.</div> | `0`
`enable_libdetection` | Whether to enable additional validation of the SQL Injection attacks with the [**libdetection** library](../../../about-wallarm-waf/protecting-against-attacks.md#library-libdetection). If the library does not confirm the malicious payload, the request is considered to be legitimate. Using the **libdetection** library allows reducing the number of false positives among the SQL Injection attacks.<br><br>By default, the library **libdetection** is disabled. To improve the attack detection, we recommend enabling the library by specifying `on` in the parameter value.<br><br>Please note, for **libdetection** to operate correctly, buffering of a client request body should be enabled by adding the filter `envoy.buffer` to the Envoy configuration.<br><br>When analyzing attacks using the **libdetection** library, the amount of memory consumed by NGINX and Wallarm processes may increase by about 10%. | `off`

##  Postanalytics module settings

The `tarantool` section of the filtering node contains the parameters related to the postanalytics module:

```
tarantool:
  server:
  - uri: localhost:3313
    max_packets: 512
    max_packets_mem: 0
    reconnect_interval: 1
```

The `server` entry is a parameter group that describes the settings for the Tarantool server.

!!! info "Definition level"
    This section can be defined on the filtering node level only.

Parameter | Description | Default value
--- | ---- | -----
`uri` | String with the credentials used to connect to the Tarantool server. The string format is `IP address` or `domain name:port`. | `localhost:3313`
`max_packets` | Limit of the number of serialized requests to be sent to Tarantool. To remove the limit, set `0` as the parameter value. | `512`
`max_packets_mem` | Limit of the total volume (in bytes) of serialized requests to be sent to Tarantool. | `0` (the volume is not limited)
`reconnect_interval` | Interval (in seconds) between attempts to reconnect to the Tarantool. A value of `0` means that the filtering node will try to reconnect to the server as quickly as possible if the server renders unavailable (not recommended). | `1`

##  Basic settings

The `conf` section of the Wallarm API Security configuration contains the parameters that influence filtering node's basic operations:

```
conf:
  ruleset: rs0
  mode: "monitoring"
  mode_allow_override: "off"
  application: 42
  process_time_limit: 1000
  process_time_limit_block: "attack"
  request_memory_limit: 104857600
  wallarm_status: "off"
  wallarm_status_format: "json"
  parse_response: true
  unpack_response: true
  parse_html_response: true
```

!!! info "Definition level"
    For more flexible protection level, this section can be overridden on the route or virtual host level:

    * On the route level:

        ```
        routes:
        - match:
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <the section parameters>
        ```
        
    * On the virtual host level:
        ```
        virtual_hosts:
        - name: <the name of the virtual host>
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <the section parameters>
        ```
    The parameters in the `conf` section overridden on the route level have priority over the parameters in the section defined on the virtual host level which in turn have higher priority than the parameters listed in the section on the filtering node level.

Parameter | Description | Default value
--- | ---- | -----
<a name="ruleset_param"></a>`ruleset` | One of the parameter groups that is defined in the `rulesets` section. This parameter group sets the request filtering rules to be used.<br>If this parameter is omitted from the `conf` section of the filtering node, then it should be present in the `conf` section overridden on the route or virtual host level. <div class="admonition warning"> <p class="admonition-title">Previous name of the parameter</p> <p>In Wallarm node 3.6 and lower, this parameter is named `ts`. If you use this name, we recommend to change it when <a href="/updating-migrating/general-recommendations/#update-process">upgrading the node modules</a>. The `ts` parameter will be deprecated soon. The parameter logic has not changed.</div> | -
`mode` | Node mode:<ul><li>`block` - to block malicious requests.</li><li>`monitoring` - to analyze but not block requests.</li><li>`safe_blocking` - to block only those malicious requests originated from [greylisted IP addresses](../../../user-guides/ip-lists/greylist.md).</li><li>`monitoring` - to analyze but not block requests.</li><li>`off` - to disable traffic analyzing and processing.</li></ul><br>[Detailed description of filtration modes →](../../configure-wallarm-mode.md) | `block`
`mode_allow_override` | Allows overriding the filtering node mode that is set via the `mode` parameter with the [custom ruleset][link-lom]:<ul><li>`off` - custom ruleset is ignored.</li><li>`strict` - custom ruleset can only strengthen the operation mode.</li><li>`on` - it is possible to both strengthen and soften the operation mode.</li></ul>For example, if the `mode` parameter is set to the `monitoring` value and the `mode_allow_override` parameter is set to the `strict` value, then it will be possible to block some requests (`block`) but not to fully disable the filtering node (`off`). | `off`
`application` | Unique identifier of the protected application to be used in the Wallarm Cloud. The value can be a positive integer except for `0`.<br><br>[More details on setting up applications →](../../../user-guides/settings/applications.md) <div class="admonition warning"> <p class="admonition-title">Previous name of the parameter</p> <p>In Wallarm node 3.4 and lower, this parameter is named `instance`. If you use this name, we recommend to change it when <a href="/updating-migrating/general-recommendations/#update-process">upgrading the node modules</a>. The `instance` parameter will be deprecated soon. The parameter logic has not changed.</div> | `-1`
`process_time_limit` | Limit on the processing time of a single request (in milliseconds). If the request cannot be processed in the defined amount of time, then an error message is recorded to the log file and the request is marked as an `overlimit_res` attack. | `1000`
`process_time_limit_block` | Action to take when the request processing time exceeds the limit set via the `process_time_limit` parameter:<ul><li>`off` - the requests are always ignored.</li><li>`on` - the requests are always blocked unless `mode: "off"`.</li><li>`attack` - depends on the attack blocking mode set via the `mode` parameter:<ul><li>`off` - the requests are not processed.</li><li>`monitoring` - the requests are ignored.</li><li>`block` - the requests are blocked.</li></ul></li></ul> | `attack`
`wallarm_status` | Whether to enable the [filtering node statistics service](../../configure-statistics-service.md). | `false`
`wallarm_status_format` | Format of the [filtering node statistics](../../configure-statistics-service.md): `json` or `prometheus`. | `json`
`disable_acl` | Allows disabling analysis of requests origins. If disabled (`on`), the filtering node does not download [IP lists](../../../user-guides/ip-lists/overview.md) from the Wallarm Cloud and skips request source IPs analysis. | `off`
`parse_response` | Whether to analyze the application responses. Response analysis is required for vulnerability detection during [passive detection](../../../about-wallarm-waf/detecting-vulnerabilities.md#passive-detection) and [active threat verification](../../../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification).<br><br>Possible values are `true` (response analysis is enabled) and `false` (response analysis is disabled). | `true`
`unpack_response` | Whether to decompress compressed data returned in the application response. Possible values are `true` (decompression is enabled) and `false` (decompression is disabled).<br><br>This parameter is effective only if `parse_response true`. | `true`
`parse_html_response` | Whether to apply the HTML parsers to HTML code received in the application response. Possible values are `true` (HTML parser is applied) and `false` (HTML parser is not applied).<br><br>This parameter is effective only if `parse_response true`. | `true`
