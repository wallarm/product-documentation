# Wallarm Node — Version 2.12

## Breaking Change

### Custom NGINX Build with Embedded Wallarm Module Deleted

Now only a dynamic module for nginx is supported.

## Changes Highlights

* Attack grouping added.
* URL encoding recognition added to the htmljs parser.
* The possibility to limit request data processing iteration time added.
* The `wallarm_request_chunk_size` directive that allows limiting the number of bytes to be processed in one request parameter added.
* The informational pages about blocking added.
* The `time_tnt` parameter was removed from the displayed node statistics.
* The information about the data on whether the query is received completely added.
* The assessment of the `time_detect` parameter in the filter node statistics fixed.
* Query processing- and system resilience-related improvements were made.

!!! warning "Version 2.12 update sequence"
    Before updating to 2.12, ensure that wallarm-tarantool version 1.11.0 or higher is already installed. Version 1.11.0 has added support for the new format of serialized requests. 

### Attack Grouping Added
If multiple identical attack instances related to the same part of the request are created during the request processing, they are added to one group.

If one of the attacks detected by the htmljs or percent parser in the group is marked as false positive, all attacks in the group are treated by the filter node as false positive automatically.

!!! warning
    The number of false positive attacks found in the request body may increase.

### URL Encoding Recognition Added to the htmljs Parser
The htmljs parser can now process URL-encoded parts of the request.

### The Possibility to Limit Request Data Processing Iteration Time Added.
If the request parameter contains a large amount of data, its processing could be time-consuming. Now you can limit data processing iteration time by setting up the `wallarm_timeslice` directive value. 

The new `wallarm_timeslice` directive can be used together with the `wallarm_process_time_limit` directive that was added earlier. 
* The `wallarm_process_time_limit` directive sets up a limit on the total time that a filter node spends on all iterations of processing a single request.
* The `wallarm_timeslice` directive sets up a limit on the time that a filter node spends on one iteration of processing a request before it switches to the next request. Upon reaching the time limit, the filter node proceeds to process the next request in the queue. After performing one iteration on each of the requests in the queue, the node performs the second iteration of processing on the first request in the queue.

!!! info
    Due to nginx server limitations, it is necessary to disable the request buffering by assigning the `off` value to the `proxy_request_buffering` nginx directive for the `wallarm_timeslice` directive to work.

### The `wallarm_request_chunk_size` Directive that Allows Limiting the Number of Bytes to Be Processed in One Request Parameter Added
The `wallarm_request_chunk_size` allows you to limit the size of the parameter part that will be processed during a single iteration. By default this limit is 8 Kb. You can assign a desired integer value to the `wallarm_request_chunk_size` directive to set up the limit in bytes. The directive also supports the following postfixes:
* `k` or `K` for kilobytes
* `m` or `M` for megabytes
* `g` or `G` for gigabytes

### The Informational Pages about Blocking Added
You can now configure the node to display the default informational page to the blocked user. The default page contains the following list of dynamic values: the blocked IP-address, blocking date, and the identifier of request that is answered by showing the current page.

To enable the blocking page display, uncomment the `wallarm_block_page` directive in the configuration file by removing the `#` symbol at the beginning of the line. You can also replace the default informational page for blocked users with a custom one by assigning the new value to the `wallarm_block_page`.

### The `time_tnt` Parameter Removed
Due to migration to the asynchronous execution flow in one of the previous versions, the `time_tnt` parameter is always zero. Thus, it will not be displayed in the filter node statistics anymore.

### The Data on whether the Query is Received Completely Added
Previously, the query could be received only partially after an attack was detected in its header or body. Now, if the query is received and analyzed completely, this fact will be indicated in the web-interface.

### The Assessment of the `time_detect` Parameter in the Filter Node Statistics Fixed
The `time_detect` parameter of the filter node statistics now displays precise time of serialized queries analysis in seconds.

!!! warning "Memory consumption increase"
    After upgrading to version 2.12, the filter node may increase the consumption of computing resources (CPU and RAM) by NGINX processes by 15%.