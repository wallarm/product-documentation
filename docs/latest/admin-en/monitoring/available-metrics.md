[doc-nagios-details]:       fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[doc-lom]:                  ../../glossary-en.md#custom-ruleset-the-former-term-is-lom

[anchor-tnt]:               #number-of-requests-not-analyzed-by-the-postanalytics-module
[anchor-api]:               #number-of-requests-not-passed-to-the-wallarm-api
[anchor-metric-1]:          #indication-that-the-postanalytics-module-drops-requests

#   Available Metrics

* [Metric Format](#metric-format)
* [Types of Wallarm Metrics](#types-of-wallarm-metrics)
* [NGINX Metrics and NGINX Wallarm Module Metrics](#nginx-metrics-and-nginx-wallarm-module-metrics)
* [Postanalytics Module Metrics](#postanalytics-module-metrics)

!!! warning "Breaking changes due to the deleted metrics"
    Starting from version 4.0, the Wallarm node does not collect the following metrics:
    
    * `curl_json-wallarm_nginx/gauge-requests` - you can use the [`curl_json-wallarm_nginx/gauge-abnormal`](#number-of-requests) metric instead
    * `curl_json-wallarm_nginx/gauge-attacks`
    * `curl_json-wallarm_nginx/gauge-blocked`
    * `curl_json-wallarm_nginx/gauge-time_detect`
    * `curl_json-wallarm_nginx/derive-requests`
    * `curl_json-wallarm_nginx/derive-attacks`
    * `curl_json-wallarm_nginx/derive-blocked`
    * `curl_json-wallarm_nginx/derive-abnormal`
    * `curl_json-wallarm_nginx/derive-requests_lost`
    * `curl_json-wallarm_nginx/derive-tnt_errors`
    * `curl_json-wallarm_nginx/derive-api_errors`
    * `curl_json-wallarm_nginx/derive-segfaults`
    * `curl_json-wallarm_nginx/derive-memfaults`
    * `curl_json-wallarm_nginx/derive-softmemfaults`
    * `curl_json-wallarm_nginx/derive-time_detect`

## Metric Format

The `collectd` metrics have the following view:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

A detailed description of the metric format is available at this [link](../monitoring/intro.md#how-metrics-look).

!!! note
    * In the list of available metrics below, the host name (the `host/` part) is omitted.
    * When using the `collectd_nagios` utility, the host name must be omitted. It is set separately using the `-H` parameter ([more about using this utility][doc-nagios-details]).

## Types of Wallarm Metrics

The allowed types of Wallarm metrics are described below. The type is stored in the `type` metric parameter.

* `gauge` is a numerical representation of the measured value. The value can both increase and decrease.

* `derive` is the rate of change of the measured value since the previous measurement (derived value). The value can both increase and decrease.

* `counter` is similar to the `gauge` metric. The value can only increase.

##  NGINX Metrics and NGINX Wallarm Module Metrics 

### Number of Requests

The number of all requests processed by the filter node since its installation.

* **Metric:** `curl_json-wallarm_nginx/gauge-abnormal`
* **Metric value:**
    * `0` for the `off` [mode](../configure-wallarm-mode.md#available-filtration-modes)
    * `>0` for the `monitoring`/`safe_blocking`/`block` [mode](../configure-wallarm-mode.md#available-filtration-modes)
* **Troubleshooting recommendations:**
    1. Check if the filter node settings are correct.
    2. Check the filter node operation as described in the [instructions](../installation-check-operation-en.md). The value should increase by `1` after sending one test attack.

### Number of Lost Requests

The number of requests not analyzed by the postanalytics module and not passed to Wallarm API. Blocking rules are applied to these requests, but requests are not visible in your Wallarm account and are not taken into account when analyzing next requests. The number is the sum of [`tnt_errors`][anchor-tnt] and [`api_errors`][anchor-api].

* **Metric:** `curl_json-wallarm_nginx/gauge-requests_lost`
* **Metric value:** `0`, the sum of [`tnt_errors`][anchor-tnt] and [`api_errors`][anchor-api]
* **Troubleshooting recommendations:** follow the instructions for [`tnt_errors`][anchor-tnt] and [`api_errors`][anchor-api]

#### Number of Requests not Analyzed by the Postanalytics Module

The number of requests not analyzed by the postanalytics module. This metric is collected if sending requests to the postanalytics module is configured ([`wallarm_upstream_backend tarantool`](../configure-parameters-en.md#wallarm_upstream_backend)). Blocking rules are applied to these requests, but requests are not visible in your Wallarm account and are not taken into account when analyzing next requests.

* **Metric:** `curl_json-wallarm_nginx/gauge-tnt_errors`
* **Metric value:** `0`
* **Troubleshooting recommendations:**
    * Get the NGINX and Tarantool logs and analyze errors if any.
    * Check if the Tarantool server address ([`wallarm_tarantool_upstream`](../configure-parameters-en.md#wallarm_tarantool_upstream)) is correct.
    * Check that enough memory is [allocated for Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Contact the [Wallarm support team](mailto:support@wallarm.com) and provide the data above if the issue is not resolved.

#### Number of Requests not Passed to the Wallarm API

The number of requests not passed to Wallarm API. This metric is collected if passing requests to Wallarm API is configured ([`wallarm_upstream_backend api`](../configure-parameters-en.md#wallarm_upstream_backend)). Blocking rules are applied to these requests, but requests are not visible in your Wallarm account and not taken into account when analyzing next requests.

* **Metric:** `curl_json-wallarm_nginx/gauge-api_errors`
* **Metric value:** `0`
* **Troubleshooting recommendations:**
    * Get the NGINX and Tarantool logs and analyze errors if any.
    * Check if the Wallarm API settings ([`wallarm_api_conf`](../configure-parameters-en.md#wallarm_api_conf)) are correct.
    * Check that enough memory is [allocated for Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Contact the [Wallarm support team](mailto:support@wallarm.com) and provide the data above if the issue was not resolved.

### Number of Issues Completed NGINX Worker Process Abnormally

A number of issues have led to abnormal completion of the NGINX worker process. The most common reason for abnormal completion is a critical error in NGINX.

* **Metric:** `curl_json-wallarm_nginx/gauge-segfaults`
* **Metric value:** `0`
* **Troubleshooting recommendations:**
    1. Collect data about the current state using the `/usr/share/wallarm-common/collect-info.sh` script.
    2. Provide the generated file to the [Wallarm support team](mailto:support@wallarm.com) for investigation.

### Number of Situations Exceeding the Virtual Memory Limit

The number of situations when the virtual memory limit was exceeded.

* **Metric:**
    * `curl_json-wallarm_nginx/gauge-memfaults` if the limit in your system was exceeded
    * `curl_json-wallarm_nginx/gauge-softmemfaults` if the limit for proton.db +lom was exceeded ([`wallarm_general_ruleset_memory_limit`](../configure-parameters-en.md#wallarm_general_ruleset_memory_limit)) 
* **Metric value:** `0`
* **Troubleshooting recommendations:**
    1. Collect data about the current state using the `/usr/share/wallarm-common/collect-info.sh` script.
    2. Provide the generated file to the [Wallarm support team](mailto:support@wallarm.com) for investigation.

### Number of the proton.db Errors

The number of the proton.db errors except for those occurred due to the situations when the [virtual memory limit was exceeded](#number-of-situations-exceeding-the-virtual-memory-limit).

* **Metric:** `curl_json-wallarm_nginx/gauge-proton_errors`
* **Metric value:** `0`
* **Troubleshooting recommendations:**
    1. Copy the error code from the NGINX logs (`wallarm: proton error: <ERROR_NUMBER>`).
    1. Collect data about the current state using the `/usr/share/wallarm-common/collect-info.sh` script.
    1. Provide the collected data to the [Wallarm support team](mailto:support@wallarm.com) for investigation.

### Version of proton.db

The version of proton.db in use.

* **Metric:** `curl_json-wallarm_nginx/gauge-db_id`
* **Metric value:** no limits

### Time of the last update of the proton.db file

Unix time of the last update of the proton.db file.

* **Metric:** `curl_json-wallarm_nginx/gauge-db_apply_time`
* **Metric value:** no limits

### Version of custom ruleset (the former term is LOM)

The version of [custom ruleset][doc-lom] in use.

* **Metric:** `curl_json-wallarm_nginx/gauge-custom_ruleset_id`

    (In Wallarm node 3.4 and lower, `curl_json-wallarm_nginx/gauge-lom_id`. The metric with the former name is still collected but will be deprecated soon.)
* **Metric value:** no limits

### Time of the last update of custom ruleset (the former term is LOM)

Unix time of the last update of [custom ruleset][doc-lom].

* **Metric:** `curl_json-wallarm_nginx/gauge-custom_ruleset_apply_time`

    (In Wallarm node 3.4 and lower, `curl_json-wallarm_nginx/gauge-lom_apply_time`. The metric with the former name is still collected but will be deprecated soon.)
* **Metric value:** no limits

### proton.db and LOM Pairs

#### Number of proton.db and LOM Pairs

The number of proton.db and [LOM][doc-lom] pairs in use.

* **Metric:** `curl_json-wallarm_nginx/gauge-proton_instances-total`
* **Metric value:** `>0`
* **Troubleshooting recommendations:**
    1. Check if the filter node settings are correct.
    2. Check if the path to the proton.db file is specified correctly ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. Check if the path to the LOM file is specified correctly ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Number of Successfully Downloaded proton.db and LOM Pairs

The number of proton.db and [LOM][doc-lom] pairs that were successfully downloaded and read.

* **Metric:** `curl_json-wallarm_nginx/gauge-proton_instances-success`
* **Metric value:** is equal to [`proton_instances-total`](#number-of-protondb-and-lom-pairs)
* **Troubleshooting recommendations:**
    1. Check if the filter node settings are correct.
    2. Check if the path to the proton.db file is specified correctly ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. Check if the path to the LOM file is specified correctly ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Number of proton.db and LOM Pairs Downloaded from the Last Saved Files

The number of proton.db and [LOM][doc-lom] pairs downloaded from the last saved files. These files store the last successfully downloaded pairs. If pairs were updated but not downloaded, the data from the last saved files is used.

* **Metric:** `curl_json-wallarm_nginx/gauge-proton_instances-fallback`
* **Metric value:** `>0`
* **Troubleshooting recommendations:**
    1. Check if the filter node settings are correct.
    2. Check if the path to the proton.db file is specified correctly ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. Check if the path to the LOM file is specified correctly ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Number of Inactive proton.db and LOM Pairs

The number of connected proton.db and [LOM][doc-lom] pairs that could not be read.

* **Metric:** `curl_json-wallarm_nginx/gauge-proton_instances-failed`
* **Metric value:** `0`
* **Troubleshooting recommendations:**
    1. Check if the filter node settings are correct.
    2. Check if the path to the proton.db file is specified correctly ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. Check if the path to the LOM file is specified correctly ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

##  Postanalytics Module Metrics

### Identifier of the Last Processed Request

ID of the last processed request. The value can both increase and decrease.

* **Metric:**
    * `wallarm-tarantool/counter-last_request_id` if the value increased
    * `wallarm-tarantool/gauge-last_request_id` if the value increased or decreased
* **Metric value:** no limits
* **Troubleshooting recommendations:** if there are incoming requests but the value does not change, check if the filter node settings are correct

### Deleted Requests

#### Indication of Deleted Requests

The flag signaling that requests with attacks have been deleted from the postanalytics module but not sent to the [cloud](../../about-wallarm/overview.md#cloud).

* **Metric:** `wallarm-tarantool/gauge-export_drops_flag`
* **Metric value:**
    * `0` if requests are not deleted
    * `1` if requests are deleted (not enough memory, please follow the instructions below)
* **Troubleshooting recommendations:**
    * [Allocate more memory for Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Install the postanalytics module in a separate server pool following these [instructions](../installation-postanalytics-en.md).

#### Number of Deleted Requests

The number of requests with attacks that were deleted from the postanalytics module but were not sent to the [cloud](../../about-wallarm/overview.md#cloud). The number of attacks in the request does not affect the value. The metric is collected if [`wallarm-tarantool/gauge-export_drops_flag: 1`](#indication-of-deleted-requests).

It is recommended to use the [`wallarm-tarantool/gauge-export_drops_flag`](#indication-of-deleted-requests) metric when configuring monitoring notifications.

* **Metric:** `wallarm-tarantool/gauge-export_drops`
* **Metric value:** `0`
* **Rate of change:** `wallarm-tarantool/derive-export_drops`
* **Troubleshooting recommendations:**
    * [Allocate more memory for Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Install the postanalytics module in a separate server pool following the [instructions](../installation-postanalytics-en.md).

### Request Export Delay (in Seconds)

The delay between the recording of a request by the postanalytics module and downloading of the information about detected attacks to the Wallarm cloud.

* **Metric:** `wallarm-tarantool/gauge-export_delay`
* **Metric value:**
    * optimal if `<60`
    * warning if `>60`
    * critical if `>300`
* **Troubleshooting recommendations:**
    * Read logs from the `/var/log/wallarm/export-attacks.log` file (for `/opt/wallarm/var/log/wallarm/export-attacks.log` for Docker NGINX-based image or all-in-one installer) and analyze errors. An increased value can be caused by low network throughput from the filter node to Wallarm’s API service.
    * Check that enough memory is [allocated for Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool). The [`tnt_errors`][anchor-tnt] metric also increases when allocated memory is exceeded.

### Time of Storing Requests in the Postanalytics Module (in Seconds)

Time that the postanalytics module stores requests. The value depends on the amount of memory allocated to the postanalytics module and on the size and properties of the processed HTTP requests. The shorter the interval, the worse the detection algorithms work—because they rely on historical data. As a result, if the intervals are too short, an attacker can perform brute force attacks faster and without being noticed. In this case, less data will be obtained on the attacker's behavior history.

* **Metric:** `wallarm-tarantool/gauge-timeframe_size`
* **Metric value:**
    * optimal if `>900`
    * warning if `<900`
    * critical if `<300`
* **Troubleshooting recommendations:**
    * [Allocate more memory for Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Install the postanalytics module in a separate server pool following the [instructions](../installation-postanalytics-en.md).
