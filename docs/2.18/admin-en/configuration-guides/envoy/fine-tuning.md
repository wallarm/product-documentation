# Configuration options for the Envoy‑based Wallarm node

[link-lom]:                     ../../../user-guides/rules/intro.md
[link-dashboard]:               ../../../user-guides/dashboard/waf.md

[anchor-process-time-limit]:    #processtimelimit
[anchor-ts]:                    #ts
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

The `tsets` section of the file contains the parameters related to request filtering settings:

```
tsets:
- name: ts0
  pdb: /etc/wallarm/proton.db
  lom: /etc/wallarm/lom
  key: /etc/wallarm/license.key
  ts_request_memory_limit: 0
  ...
- name: tsN:
  ...
```

The `ts0` ... `tsN` entries are one or more parameter groups. The groups can have any name (so that they can be referred to later via the [`ts`][anchor-ts] parameter in the `conf` section). At least one group should be present in the filtering node configuration (e.g., with the name `ts0`).

This section has no default values. You need to explicitly specify values in the config file.

!!! info "Definition level"
    This section can be defined on the filtering node level only.

Parameter | Description | Default value
--- | ---- | -----
`pdb` | Path to the `proton.db` file. This file contains the global settings for request filtering, which do not depend on the application structure. | `/etc/wallarm/proton.db`
`lom` | Path to the [custom ruleset][link-lom] file that contains information about the protected application and the filtering node settings. | `/etc/wallarm/lom`
`key` | Path to the file with the Wallarm license key. | `/etc/wallarm/license.key`
`ts_request_memory_limit` | Limit for the maximum amount of memory that can be used by one instance of proton.db and custom ruleset. If the memory limit is exceeded while processing some request, the user will get the 500 error. The following suffixes can be used in this parameter:<ul><li>`k` or `K` for kilobytes</li><li>`m` or `M` for megabytes</li><li>`g` or `G` for gigabyte</li></ul>Value of `0` turns the limit off. | `0`

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

## IP blacklisting settings

The `acls` section of the file contains the parameters related to the IP blacklisting settings:

```
acls:
  - name: acl0
    path: acl0
    mapsize: 1000000
    ...
  - name: aclN
...
```

The `acl0` ... `aclN` entries are one or more parameter groups. The groups can have any name (so that they can be referred to later via the `acl` parameter in the `conf` section).

Parameter | Description | Default value
--- | ---- | -----
`path` | Directory that will be used to save the state of the ACL.  | -
`mapsize` | Initial memory size to be allocated for the corresponding ACL. When the limit is reached, the memory will automatically be reallocated, but the API request that attempted to change the ACL and caused the overflow will produce an error, and should be repeated. | -

##  Basic settings

The `conf` section of the Wallarm API Security configuration contains the parameters that influence filtering node's basic operations:

```
conf:
  ts: ts0
  mode: "monitoring"
  mode_allow_override: "off"
  instance: 42
  process_time_limit: 1000
  process_time_limit_block: "attack"
  request_memory_limit: 104857600
  wallarm_status: "off"
  wallarm_status_format: "json"
  acl: acl0
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
`ts` | One of the parameter groups that is defined in the `tsets` section. This parameter group sets the request filtering rules to be used.<br>If this parameter is omitted from the `conf` section of the filtering node, then it should be present in the `conf` section overridden on the route or virtual host level.  | -
`mode` | Node mode:<ul><li>`block` - to block malicious requests.</li><li>`monitoring` - to analyze but not block requests.</li><li>`off` - to disable traffic analyzing and processing.</li></ul> | `block`
`mode_allow_override` | Allows overriding the filtering node mode that is set via the `mode` parameter with the [custom ruleset][link-lom]:<ul><li>`off` - custom ruleset is ignored.</li><li>`strict` - custom ruleset can only strengthen the operation mode.</li><li>`on` - it is possible to both strengthen and soften the operation mode.</li></ul>For example, if the `mode` parameter is set to the `monitoring` value and the `mode_allow_override` parameter is set to the `strict` value, then it will be possible to block some requests (`block`) but not to fully disable the filtering node (`off`). | `off`
`instance` | Unique identifier of the protected application to be used in the Wallarm Cloud. The value can be a positive integer except for `0`.<br><br>[More details on setting up applications →](../../../user-guides/settings/applications.md)| `-1`
`process_time_limit` | Limit on the processing time of a single request (in milliseconds). If the request cannot be processed in the defined amount of time, then an error message is recorded to the log file and the request is marked as an `overlimit_res` attack. | `1000`
`process_time_limit_block` | Action to take when the request processing time exceeds the limit set via the `process_time_limit` parameter:<ul><li>`off` - the requests are always ignored.</li><li>`on` - the requests are always blocked.</li><li>`attack` - depends on the attack blocking mode set via the `mode` parameter:<ul><li>`off` - the requests are not processed.</li><li>`monitoring` - the requests are ignored.</li><li>`block` - the requests are blocked.</li></ul></li></ul> | `attack`
`wallarm_status` | Whether to enable the [filtering node statistics service](../../configure-statistics-service.md). | `false`
`wallarm_status_format` | Format of the [filtering node statistics](../../configure-statistics-service.md): `json` or `prometheus`. | `json`
acl | One of the parameter groups that is defined in the `acls` section. This parameter group sets the IP blocking configuration.<br>If this parameter is omitted from the `conf` section of the filtering node, then it should be present in the `conf` section overridden on the route or virtual host level. | -
`parse_response` | Whether to analyze the application responses. Response analysis is required for vulnerability detection during [passive detection](../../../about-wallarm-waf/detecting-vulnerabilities.md#passive-detection) and [active threat verification](../../../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification).<br><br>Possible values are `true` (response analysis is enabled) and `false` (response analysis is disabled). | `true`
`unpack_response` | Whether to decompress compressed data returned in the application response. Possible values are `true` (decompression is enabled) and `false` (decompression is disabled).<br><br>This parameter is effective only if `parse_response true`. | `true`
`parse_html_response` | Whether to apply the HTML parsers to HTML code received in the application response. Possible values are `true` (HTML parser is applied) and `false` (HTML parser is not applied).<br><br>This parameter is effective only if `parse_response true`. | `true`
