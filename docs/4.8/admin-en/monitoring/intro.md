[link-collectd]:            https://collectd.org/

[av-bruteforce]:            ../../attacks-vulns-list.md#bruteforce-attack
[doc-postanalitycs]:        ../installation-postanalytics-en.md

[link-collectd-naming]:     https://collectd.org/wiki/index.php/Naming_schema
[link-data-source]:         https://collectd.org/wiki/index.php/Data_source
[link-collectd-networking]: https://collectd.org/wiki/index.php/Networking_introduction
[link-influxdb]:            https://www.influxdata.com/products/influxdb-overview/
[link-grafana]:             https://grafana.com/
[link-graphite]:            https://github.com/graphite-project/graphite-web
[link-network-plugin]:      https://collectd.org/wiki/index.php/Plugin:Network
[link-write-plugins]:       https://collectd.org/wiki/index.php/Table_of_Plugins
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios]:              https://www.nagios.org/
[link-zabbix]:              https://www.zabbix.com/
[link-nagios-format]:       https://nagios-plugins.org/doc/guidelines.html#AEN200
[link-selinux]:             https://www.redhat.com/en/topics/linux/what-is-selinux

[doc-available-metrics]:    available-metrics.md
[doc-network-plugin]:       fetching-metrics.md#exporting-metrics-via-the-collectd-network-plugin
[doc-write-plugins]:        fetching-metrics.md#exporting-metrics-via-the-collectd-write-plugins
[doc-collectd-nagios]:      fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility
[doc-collectd-notices]:     fetching-metrics.md#sending-notifications-from-collectd

[doc-selinux]:  ../configure-selinux.md

# Introduction to the filtering node monitoring

You can monitor the state of a filter node using the node-provided metrics. This article describes how to operate with the metrics gathered by the [`collectd`][link-collectd] service that is installed on every Wallarm filter node. The `collectd` service provides several ways to transfer data and can serve as a source of metrics for many monitoring systems, offering you control over the state of the filter nodes.

In addition to the `collectd` metrics, Wallarm provides you with the metric format compatible with Prometheus and basic JSON metrics. Read about these formats in the [separate article](../configure-statistics-service.md).

!!! warning "Support of the monitoring service on the CDN node"
    Please note that the `collectd` service is not supported by the [Wallarm CDN nodes](../../installation/cdn-node.md).

##  Need for Monitoring

Failure or unstable work in the Wallarm module can lead to complete or partial denial of service for user requests to an application protected by a filter node.

Failure of or unstable work in the postanalytics module can lead to inaccessibility of the following functionalities:
*   Uploading attack data to the Wallarm cloud. As a result, the attacks will not be displayed on the Wallarm portal.
*   Detecting behavioral attacks (see [brute-force attacks][av-bruteforce]).
*   Getting information about the structure of the protected application.

You can monitor both the Wallarm module and the postanalytics module even if the latter is [installed separately][doc-postanalitycs].


!!! info "Terminology agreement"

    To monitor the Wallarm module and the postanalytics module, the same tools and methods are used; therefore both modules will be referred to as a “filter node” throughout this guide, unless stated otherwise.
    
    All documents describing how to set up monitoring of a filter node are suitable for

    *   separately deployed Wallarm modules,
    *   separately deployed postanalytics modules, and
    *   jointly deployed Wallarm and postanalytics modules.


##  Prerequisites for Monitoring

For monitoring to work, it is required that:

* NGINX returns the statistics to the filter node (`wallarm_status on`),
* The filtration mode is in the `monitoring`/`safe_blocking`/`block` [mode](../configure-wallarm-mode.md#available-filtration-modes).
  
By default, this service is accessible at `http://127.0.0.8/wallarm-status`. The address may differ if you have [changed](../configure-statistics-service.md#changing-an-ip-address-andor-port-of-the-statistics-service) it.

##  How Metrics Look

### What the `collectd` Metrics Look Like

A `collectd` metric identifier has the following format:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

Where
*   `host`: the host’s Fully Qualified Domain Name (FQDN) for which the metric is obtained
*   `plugin`: the name of the plugin with which the metric is obtained,
*   `-plugin_instance`: the instance of the plugin, if one exists,
*   `type`: the type of the metric value. Allowed types:
    *   `counter`
    *   `derive`
    *   `gauge` 
    
    Detailed information about value types is available [here][link-data-source].

*   `-type_instance`: an instance of the type, if there is one. Instance type is equivalent to the value for which we want to get the metric.

A full description of metric formats is available [here][link-collectd-naming].

### What Wallarm-Specific `collectd` Metrics Look Like

The filter node uses `collectd` to collect Wallarm-specific metrics.

Metrics of NGINX with the Wallarm module have the following format:

```
host/curl_json-wallarm_nginx/type-type_instance
```

Metrics of the postanalytics module have the following format:

```
host/wallarm-tarantool/type-type_instance
```


!!! info "Metric Examples"
    For a filter node on the `node.example.local` host:

    * `node.example.local/curl_json-wallarm_nginx/gauge-abnormal` is the metric of the number of processed requests;
    * `node.example.local/wallarm-tarantool/gauge-export_delay` is the metric of the Tarantool export delay in seconds.
    
    A complete list of metrics that can be monitored is available [here][doc-available-metrics].


##  Methods of Fetching Metrics

You can collect metrics from a filter node in several ways:
*   By exporting data directly from the `collectd` service
    *   [via the Network plugin for `collectd`][doc-network-plugin].
    
        This [plugin][link-network-plugin] enables `collectd` to download metrics from a filter node to the [`collectd`][link-collectd-networking] server or to the [InfluxDB][link-influxdb] database.
        
        
        !!! info "InfluxDB"
            InfluxDB can be used for the aggregation of metrics from `collectd` and other data sources with subsequent visualization (for example, a [Grafana][link-grafana] monitoring system to visualize the metrics stored in the InfluxDB).
        
    *   [via one of the write plugins for `collectd`][doc-write-plugins].
  
        For example, you can export collected data to [Graphite][link-graphite] using the `write_graphite` plugin.
  
        
        !!! info "Graphite"
            Graphite can be used as a data source for monitoring and visualization systems (for example, [Grafana][link-grafana]).
        
  
    This method is suitable for the following filter node deployment types:

    *   in the clouds: Amazon AWS, Google Cloud;
    *   on Linux for NGINX/NGINX Plus platforms.

*   [By exporting data via `collectd-nagios`][doc-collectd-nagios].
  
    This [utility][link-collectd-nagios] receives the value of the given metric from `collectd` and presents it in a [Nagios‑compatible format][link-nagios-format].
  
    You can export metrics to [Nagios][link-nagios] or [Zabbix][link-zabbix] monitoring systems by employing this utility.
  
    This method is supported by any Wallarm filter node, no matter how that node is deployed.
  
*   [By sending notifications from `collectd`][doc-collectd-notices] when a metric has achieved a predetermined threshold value.

    This method is supported by any Wallarm filter node, no matter how that node is deployed.
