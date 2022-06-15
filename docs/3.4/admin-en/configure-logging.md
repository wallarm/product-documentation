[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-monitor-node]:         monitoring/intro.md
[doc-lom]:                  ../user-guides/rules/compiling.md


#   Working with Filter Node Logs

##  Where Filter Node Logs are Stored

A filter node stores the following log files in the `/var/log/wallarm` directory:

*   `brute-detect.log`: the log of fetching the brute force attack-related counters in the filter node cluster.
*   `export-attacks.log`: the log of exporting the attacks' data from the postanalytics module to the Wallarm cloud.
*   `export-counters.log`: the log of exporting the counters' data (see [“Monitoring the Filter Node”][doc-monitor-node]).
*   `export-environment.log`: the log of collecting the installed Wallarm package versions and uploading this data to the Wallarm Cloud to be displayed in the filtering node details in Wallarm Console. These processes are run once per hour. 
*   `syncnode.log`: the log of syncing the filter node with the Wallarm cloud (this includes fetching the [LOM][doc-lom] and proton.db files from the cloud).
*   `tarantool.log`: the log of the postanalytics module operations.
*   `sync-ip-lists.log` (named as `sync-blacklist.log` in the previous node versions): the log of syncing the filtering node with IP addresses added to [IP lists](../user-guides/ip-lists/overview.md) as single objects or subnets.
*   `sync-ip-lists-source.log` (named as `sync-mmdb.log` in the previous node versions): the log of syncing the filtering node with IP addresses registered in countries, regions and data centers from [IP lists](../user-guides/ip-lists/overview.md).
*   `appstructure.log` (only in the Docker containers): the log of the [API Discovery](../about-wallarm-waf/api-discovery.md) module activity.
*   `addnode_loop.log` (only in the Docker containers): the log of activity of the wrapper script running the `addnode` script while it is succeeded.

##  Configuring Extended Logging for the NGINX‑Based Filter Node

NGINX writes logs of the processed requests (access logs) into a separate log file, using the predefined `combined` logging format by default.

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

You can define and use a custom logging format by including one or several filter node variables (as well as other NGINX variables if needed). The NGINX log file will allow for much faster filter node diagnostics.

### Filter Node Variables

You may use the following filter node variables when defining the NGINX logging format:

|Name|Type|Value|
|---|---|---|
|`request_id`|String|Request identifier<br>Has the following value form: `a79199bcea606040cc79f913325401fb`|
|`wallarm_request_time`|Float|Request execution time in seconds|
|`wallarm_serialized_size`|Integer|Size of the serialized request in bytes|
|`wallarm_is_input_valid`|Integer|Request validity<br>`0`: request is valid. The request has been checked by filter node and matches LOM rules.<br>`1`: request is invalid. The request has been checked by filter node and does not match LOM rules.|
| `wallarm_attack_type_list` | String | [Attack types][doc-vuln-list] detected in the request with the library [libproton](../about-wallarm-waf/protecting-against-attacks.md#library-libproton). Types are presented in text format:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li></ul>If several attack types are detected in a request, they are listed with the symbol `|`. For example: if XSS and SQLi attacks are detected, the variable value is `xss|sqli`. |
|`wallarm_attack_type`|Integer|[Attack types][doc-vuln-list] detected in the request with the library [libproton](../about-wallarm-waf/protecting-against-attacks.md#library-libproton). Types are presented in bit string format:<ul><li>`0x00000000`: no attack: `"0"`</li><li>`0x00000002`: xss: `"2"`</li><li>`0x00000004`: sqli: `"4"`</li><li>`0x00000008`: rce: `"8"`</li><li>`0x00000010`: xxe: `"16"`</li><li>`0x00000020`: ptrav: `"32"`</li><li>`0x00000040`: crlf: `"64"`</li><li>`0x00000080`: redir: `"128"`</li><li>`0x00000100`: nosqli: `"256"`</li><li>`0x00000200`: infoleak: `"512"`</li><li>`0x20000000`: overlimit_res: `"536870912"`</li><li>`0x40000000`: data_bomb: `"1073741824"`</li><li>`0x80000000`: vpatch: `"2147483648"`</li><li>`0x00002000`: ldapi: `"8192"`</li><li>`0x4000`: scanner: `"16384"`</li><li>`0x02000000`: ssi: `"33554432"`</li><li>`0x04000000`: mail_injection: `"67108864"`</li><li>`0x08000000`: ssti: `"134217728"`</li><li>`0x10000000`: invalid_xml: `"268435456"`</li></ul>If several attack types are detected in a request, the values are summarized. For example: if XSS and SQLi attacks are detected, the variable value is `6`. |

### Configuration Example

Let us assume that you need to specify the extended logging format named `wallarm_combined` that includes the following variables:
*   all variables used in the `combined` format
*   all filter node variables

To do this, perform the following actions:

1.  The lines below describe the desired logging format. Add them into the `http` block of the NGINX configuration file.

    ```
    log_format wallarm_combined '$remote_addr - $remote_user [$time_local] '
                                '"$request" $request_id $status $body_bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '$wallarm_request_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list';
    ```

2.  Enable the extended logging format by adding the following directive into the same block as in the first step:

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    Processed request logs will be written in the `wallarm_combined` format into the `/var/log/nginx/access.log` file.
    
    !!! info "Conditional Logging"
        With the directive listed above, all processed requests will be logged to a log file, including these that are not related to an attack.
        
        You can configure conditional logging to write logs only for the requests that are part of an attack (the `wallarm_attack_type` variable value is not zero for these requests). To do so, add a condition to the aforementioned directive: `access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`
        
        This may be useful if you want to reduce a log file size, or if you integrate a filter node with one of SIEM solutions.          
        
3.  Restart NGINX by running one of the following commands depending on the OS you are using:

    --8<-- "../include/waf/restart-nginx-2.16.md"

!!! info "Detailed information"
    To see detailed information about configuring logging in NGINX, proceed to this [link][link-nginx-logging-docs].