# Configuration Options for the Envoy‑Based Filter Node 

[link-lom]:                     ../../../glossary-en.md#lom
[link-dashboard]:               ../../../user-guides/dashboard/waf.md

[anchor-process-time-limit]:    #processtimelimit
[anchor-ts]:                    #ts
[anchor-tsets]:                 #filtering-mode-settings

Envoy uses pluggable filters defined in the Envoy configuration file to process incoming requests. These filters describe the actions to be performed on the request. For example, an `envoy.http_connection_manager` filter is used to proxy HTTP requests. This filter has its own set of HTTP filters that can be applied to the request.  

The Wallarm module is designed as an Envoy HTTP filter. The module's general settings are placed in a section dedicated to the `wallarm` HTTP filter (that filter will be referred to as “the Wallarm filter” throughout this document):

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
              <the Wallarm module configuration>
              ...  
```

!!! warning "Enable Request Body Processing"
  In order to enable the Wallarm module to process an HTTP request body, the buffer filter must be placed before the Wallarm filter in the Envoy HTTP filter chain. For example:
  
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


##  Filtering Mode Settings

The `tsets` section of the Wallarm filter contains the parameters related to the filtering mode settings:

```
tsets:
  ts0:
    pdb: /etc/wallarm/proton.db
    lom: /etc/wallarm/lom
    key: /etc/wallarm/license.key
  ...
  tsN:
    ...
```

The `ts0` ... `tsN` entries are one or more parameter groups. The groups can have any names (so that they could be referred to later via the [`ts`][anchor-ts] parameter in the `conf` section). At least one group should be present in the Wallarm filter configuration (e.g., with the name `ts0`).

This section has no default values; you need to explicitly specify values in the config file.

!!! info
    This section can be defined on the Wallarm filter level only.

### pdb

A path to the `proton.db` file. This file contains the global settings for requests filtering, which do not depend on the application structure.

!!! info
    **Default value:** `/etc/wallarm/proton.db`

### lom

A path to the [LOM][link-lom] file that contains information about the protected application and the filter node settings.

!!! info
    **Default value:** `/etc/wallarm/lom`

### key

A path to the Wallarm license key.

!!! info
    **Default value:** `/etc/wallarm/license.key`


##  Postanalytics Module Settings

The `tarantool` section of the Wallarm filter contains the parameters related to the postanalytics module:

```
tarantool:
  server:
  - uri: localhost:3313
    max_packets: 512
    max_packets_mem: 0
    reconnect_interval: 1
```

The `server` entry is a parameter group that describes the settings for the Tarantool server.

!!! info
    This section can be defined on the Wallarm filter level only.

### uri

A string with the credentials to be used in order to connect to the Tarantool server. The string format is `IP address` or `domain name:port`.

!!! info
    **Default value:** `localhost:3313`

### max_packets

This parameter limits the number of serialized requests to be sent to Tarantool.

!!! info
    **Default value:** `512`

To remove the limit, set `0` as the parameter value.

### max_packets_mem

Limits the total volume (in bytes) of serialized requests to be sent to Tarantool.

!!! info
    **Default value:** `0` (the volume is not limited).

### reconnect_interval

This parameter defines the interval (in seconds) between attempts to reconnect to the Tarantool.

!!! info
    **Default value:** `1`
    
    A value of `0` means that the filter node will try to reconnect to the server as quickly as possible if the server renders unavailable (not recommended). 


##  Basic Settings

The `conf` section of the Wallarm filter contains the parameters that influence filter node's basic operations:

```
conf:
  ts: ts0
  mode: "off"
  mode_allow_override: "off"
  process_time_limit: 1000
  process_time_limit_block: "attack"
  instance: 42
```

This section can be overridden on the route or virtual host level, which distinguishes this section from those described above.
Therefore, the protection level is flexible.

The `conf` section override follows:
*   on the route level:

    ```
    routes:
    - match:
      typed_per_filter_config:
        wallarm:
          "@type": type.googleapis.com/wallarm.WallarmConf
          <the section parameters>
    ```
    
*   on the virtual host level:    

    ```
    virtual_hosts:
    - name: <the name of the virtual host>
      typed_per_filter_config:
        wallarm:
          "@type": type.googleapis.com/wallarm.WallarmConf
          <the section parameters>
    ```

An overridden `conf` section can contain any of the parameters described below.

The parameters in the `conf` section overridden on the route level have priority over the parameters in the section defined on the virtual host level which in turn have higher priority than the parameters listed in the section on the Wallarm filter level. 

### ts

This is the name of the one of the parameter groups that are defined in the [`tsets`][anchor-tsets] section. This parameter group sets the request filtering rules to be used. 

If this parameter is omitted from the `conf` section of the Wallarm filter, then it should be present in the `conf` section overridden on the route or virtual host level. 

!!! info
    **Default value:** none.

### mode

This sets the traffic filtration mode:
*   `off`: requests are not processed.
*   `monitoring`: all requests are processed, but none of them are blocked even if an attack is detected.
*   `block`: all requests where an attack is detected are blocked.
*   `aggressive`: all non-standard requests are blocked, for example, mapping a string in the field usually used for passing a number. Use this mode with extreme caution.

The modes are listed from the most lenient to the strictest one.

!!! info
    **Default value:** `off`

### mode_allow_override

This parameter allows overriding the filtering mode that is set via the `mode` parameter with the [LOM][link-lom] rules downloaded from the Wallarm cloud:
*   `off`: the LOM rule set is ignored.
*   `strict`: LOM can only strengthen the operation mode.
*   `on`: it is possible to both strengthen and soften the operation mode.

For example, if the `mode` parameter is set to the `monitoring` value and the `mode_allow_override` parameter is set to the `strict` value, then it will be possible to block some requests (`block`) but not to fully disable the filter node (`off`).

!!! info
    **Default value:** `off`

### process_time_limit

This sets the limit on the processing time of a single request (in milliseconds).

If the request cannot be processed in the defined amount of time, then an error message is recorded to the log file and the request is marked as an `overlimit_res` attack.

!!! info
    **Default value:** `1000`

### process_time_limit_block

This parameter specifies the action to take when the request processing time exceeds the limit set via the [`process_time_limit`][anchor-process-time-limit] parameter:  

*   `on`: the requests are always blocked
*   `off`: the requests are always ignored
*   `attack`: depends on the attack blocking mode set via the `mode` parameter:
    *   `monitoring`: the requests are ignored
    *   `block` and `aggressive`: the requests are blocked

!!! info
    **Default value:** `attack`

### instance

This is an application identifier. It is used to visually separate the data of different applications on the [dashboard][link-dashboard]. Only numeric values are allowed.

The application identifiers are used solely for the convenience of data presentation. To correctly separate the data of different applications, the same application identifiers must be set in the Wallarm interface.

Any filter node will filter traffic for any number of applications without additional configuration.

!!! info
    **Default value:** none.