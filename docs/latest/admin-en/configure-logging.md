[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-monitor-node]:         monitoring/intro.md
[doc-lom]:                  ../user-guides/rules/rules.md#ruleset-lifecycle


#   Working with Filter Node Logs

This article guides you on how to find the log files of a Wallarm filtering node.

=== "All-in-one installer, NGINX-based Docker image, cloud images"
    For installations via the [all-in-one installer](../installation/nginx/all-in-one.md), [NGINX-based Docker image](installation-docker-en.md), [Amazon Machine Image (AMI)](../installation/cloud-platforms/aws/ami.md) and [Google Cloud Machine Image](../installation/cloud-platforms/gcp/machine-image.md), log files are located withing the `/opt/wallarm/var/log/wallarm` directory.

    Here is a breakdown of the log files you will encounter and the type of information each contains:

    *   `brute-detect-out.log`: the log of fetching the brute force attack-related counters in the filter node cluster.
    *   `export-attacks-out.log`: the log of exporting the attacks' data from the postanalytics module to the Wallarm cloud.
    *   `export-counters-out.log`: the log of exporting the counters' data (see [“Monitoring the Filter Node”][doc-monitor-node]).
    *   `export-environment-out.log`: the log of collecting the installed Wallarm package versions and uploading this data to the Wallarm Cloud to be displayed in the filtering node details in Wallarm Console. These processes are run once per hour. 
    *   `syncnode-out.log`: the log of syncing the filter node with the Wallarm cloud (this includes fetching the [LOM][doc-lom] and proton.db files from the cloud).
    *   `tarantool-out.log`: the log of the postanalytics module operations.
    *   `sync-ip-lists-out.log` (named as `sync-blacklist-out.log` in the previous node versions): the log of syncing the filtering node with IP addresses added to [IP lists](../user-guides/ip-lists/overview.md) as single objects or subnets.
    *   `sync-ip-lists-source-out.log` (named as `sync-mmdb-out.log` in the previous node versions): the log of syncing the filtering node with IP addresses registered in countries, regions and data centers from [IP lists](../user-guides/ip-lists/overview.md).
    *   `appstructure-out.log` (only in the Docker containers): the log of the [API Discovery](../api-discovery/overview.md) module activity.
    *   `registernode_loop-out.log` (only in the Docker containers): the log of activity of the wrapper script running the `register-node` script while it is succeeded.
    *   `weak-jwt-detect-out.log`: the log of the [JWT vulnerability](../attacks-vulns-list.md#weak-jwt) detection.
    *   `detect-cred-stuffing-out.log`: the log of the [credential stuffing detection](../about-wallarm/credential-stuffing.md).
=== "Other installation methods"
    For installations using other methods, such as [DEB/RPM packages](../installation/nginx/dynamic-module.md), log files are located withing the `/var/log/wallarm` directory.

    Here is a breakdown of the log files you will encounter and the type of information each contains:

    *   `brute-detect.log`: the log of fetching the brute force attack-related counters in the filter node cluster.
    *   `export-attacks.log`: the log of exporting the attacks' data from the postanalytics module to the Wallarm cloud.
    *   `export-counters.log`: the log of exporting the counters' data (see [“Monitoring the Filter Node”][doc-monitor-node]).
    *   `export-environment.log`: the log of collecting the installed Wallarm package versions and uploading this data to the Wallarm Cloud to be displayed in the filtering node details in Wallarm Console. These processes are run once per hour. 
    *   `syncnode.log`: the log of syncing the filter node with the Wallarm cloud (this includes fetching the [LOM][doc-lom] and proton.db files from the cloud).
    *   `tarantool.log`: the log of the postanalytics module operations.
    *   `sync-ip-lists.log` (named as `sync-blacklist.log` in the previous node versions): the log of syncing the filtering node with IP addresses added to [IP lists](../user-guides/ip-lists/overview.md) as single objects or subnets.
    *   `sync-ip-lists-source.log` (named as `sync-mmdb.log` in the previous node versions): the log of syncing the filtering node with IP addresses registered in countries, regions and data centers from [IP lists](../user-guides/ip-lists/overview.md).
    *   `appstructure.log` (only in the Docker containers): the log of the [API Discovery](../api-discovery/overview.md) module activity.
    *   `registernode_loop.log` (only in the Docker containers): the log of activity of the wrapper script running the `register-node` script while it is succeeded.
    *   `weak-jwt-detect.log`: the log of the [JWT vulnerability](../attacks-vulns-list.md#weak-jwt) detection.

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
|`wallarm_request_cpu_time`|Float|Time in seconds the CPU of the machine with the filtering node spent processing the request.|
|`wallarm_request_mono_time`|Float|Time in seconds the CPU spent processing the request + time in the queue. For example, if the request was in the queue for 3 seconds and processed by CPU for 1 second, then: <ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul>|
|`wallarm_serialized_size`|Integer|Size of the serialized request in bytes|
|`wallarm_is_input_valid`|Integer|Request validity<br>`0`: request is valid. The request has been checked by filter node and matches LOM rules.<br>`1`: request is invalid. The request has been checked by filter node and does not match LOM rules.|
| `wallarm_attack_type_list` | String | [Attack types][doc-vuln-list] detected in the request with the library [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton). Types are presented in text format:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li></ul>If several attack types are detected in a request, they are listed with the symbol `|`. For example: if XSS and SQLi attacks are detected, the variable value is `xss|sqli`. |
|`wallarm_attack_type`|Integer|[Attack types][doc-vuln-list] detected in the request with the library [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton). Types are presented in bit string format:<ul><li>`0x00000000`: no attack: `"0"`</li><li>`0x00000002`: xss: `"2"`</li><li>`0x00000004`: sqli: `"4"`</li><li>`0x00000008`: rce: `"8"`</li><li>`0x00000010`: xxe: `"16"`</li><li>`0x00000020`: ptrav: `"32"`</li><li>`0x00000040`: crlf: `"64"`</li><li>`0x00000080`: redir: `"128"`</li><li>`0x00000100`: nosqli: `"256"`</li><li>`0x00000200`: infoleak: `"512"`</li><li>`0x20000000`: overlimit_res: `"536870912"`</li><li>`0x40000000`: data_bomb: `"1073741824"`</li><li>`0x80000000`: vpatch: `"2147483648"`</li><li>`0x00002000`: ldapi: `"8192"`</li><li>`0x4000`: scanner: `"16384"`</li><li>`0x20000`: mass_assignment: `"131072"`</li><li>`0x80000`: ssrf: `"524288"`</li><li>`0x02000000`: ssi: `"33554432"`</li><li>`0x04000000`: mail_injection: `"67108864"`</li><li>`0x08000000`: ssti: `"134217728"`</li><li>`0x10000000`: invalid_xml: `"268435456"`</li></ul>If several attack types are detected in a request, the values are summarized. For example: if XSS and SQLi attacks are detected, the variable value is `6`. |

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
                                '$wallarm_request_cpu_time $wallarm_request_mono_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list';
    ```

2.  Enable the extended logging format by adding the following directive into the same block as in the first step:

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    Processed request logs will be written in the `wallarm_combined` format into the `/var/log/nginx/access.log` file.
    
    !!! info "Conditional Logging"
        With the directive listed above, all processed requests will be logged to a log file, including these that are not related to an attack.
        
        You can configure conditional logging to write logs only for the requests that are part of an attack (the `wallarm_attack_type` variable value is not zero for these requests). To do so, add a condition to the aforementioned directive: `access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`
        
        This may be useful if you want to reduce a log file size, or if you integrate a filter node with one of [SIEM solutions](https://www.wallarm.com/what/siem-whats-security-information-and-event-management-technology-part-1).          
        
3.  Restart NGINX by running one of the following commands depending on the OS you are using:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

!!! info "Detailed information"
    To see detailed information about configuring logging in NGINX, proceed to this [link][link-nginx-logging-docs].