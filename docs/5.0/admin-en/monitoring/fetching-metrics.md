[link-network-plugin]:              https://collectd.org/wiki/index.php/Plugin:Network
[link-network-plugin-docs]:         https://www.collectd.org/documentation/manpages/collectd.conf.html
[link-collectd-networking]:         https://collectd.org/wiki/index.php/Networking_introduction
[link-influx-collectd-support]:     https://docs.influxdata.com/influxdb/v1.7/supported_protocols/collectd/
[link-plugin-table]:                https://collectd.org/wiki/index.php/Table_of_Plugins
[link-nagios-plugin-docs]:          https://www.collectd.org/documentation/manpages/collectd-nagios.html
[link-notif-common]:                https://collectd.org/wiki/index.php/Notifications_and_thresholds
[link-notif-details]:               https://www.collectd.org/documentation/manpages/collectd-threshold.html
[link-influxdb-collectd]:           https://docs.influxdata.com/influxdb/v1.7/supported_protocols/collectd/
[link-unixsock]:                    https://collectd.org/wiki/index.php/Plugin:UnixSock

[doc-network-plugin-example]:       network-plugin-influxdb.md
[doc-write-plugin-example]:         write-plugin-graphite.md
[doc-zabbix-example]:               collectd-zabbix.md
[doc-nagios-example]:               collectd-nagios.md

#   How to Fetch Metrics

These instructions describe the ways to collect metrics from a filtering node.

##  Exporting Metrics Directly From `collectd`

You can export the metrics collected by `collectd` directly to the tools that support working with `collectd` data streams.


!!! warning "Prerequisites"
    All further steps must be performed as a superuser (e.g., `root`).


### Exporting Metrics via the `collectd` Network Plugin

Configure and connect the [network plugin][link-network-plugin] to `collectd`:

=== "Docker image, cloud image, all-in-one installer"
    1.  Add the following configuration to the `/opt/wallarm/etc/collectd/wallarm-collectd.conf` file:
    
        ```
        LoadPlugin network
        
        <Plugin "network">
          Server "Server IPv4/v6 address or FQDN" "Server port"
        </Plugin>
        ```

        As stated in this configuration, the plugin will be loaded upon starting `collectd`, operate in the client mode, and send the filter node’s metrics data to the specified server.
    1.  Configure a server that will receive data from the `collectd` client. The necessary configuration steps depend on the selected server (see examples for [`collectd`][link-collectd-networking] and [InfluxDB][link-influxdb-collectd]).
    
    
        !!! info "Working with the Network Plugin"
            The network plugin works over UDP (see the [plugin documentation][link-network-plugin-docs]). Make sure that the server allows communication over UDP for metrics collection to be operational.
    1.  Restart the `wallarm` service by running the following command:

        ```bash
        sudo systemctl restart wallarm
        ```
=== "Other installations"
    1.  In the `/etc/collectd/collectd.conf.d/` directory, create a file with the `.conf` extension (e.g., `export-via-network.conf`) and the following content:

        ```
        LoadPlugin network
        
        <Plugin "network">
          Server "Server IPv4/v6 address or FQDN" "Server port"
        </Plugin>
        ```

        As stated in this file, the plugin will be loaded upon starting `collectd`, operate in the client mode, and send the filter node’s metrics data to the specified server.
    1.  Configure a server that will receive data from the `collectd` client. The necessary configuration steps depend on the selected server (see examples for [`collectd`][link-collectd-networking] and [InfluxDB][link-influxdb-collectd]).
    
    
        !!! info "Working with the Network Plugin"
            The network plugin works over UDP (see the [plugin documentation][link-network-plugin-docs]). Make sure that the server allows communication over UDP for metrics collection to be operational.
    1.  Restart the `collectd` service by executing the appropriate command:

        --8<-- "../include/monitoring/collectd-restart-2.16.md"

!!! info "Example"
    Read an [example of exporting metrics][doc-network-plugin-example] to InfluxDB via the Network plugin with subsequent visualization of the metrics in Grafana.

### Exporting Metrics via the `collectd` Write Plugins

To configure export of metrics via the `collectd` [write plugins][link-plugin-table], refer to the documentation of the corresponding plugin.


!!! info "Example"
    To get basic information about using write plugins, read an [example of exporting metrics][doc-write-plugin-example] to Graphite with subsequent visualization of the metrics in Grafana.

##  Exporting Metrics Using the `collectd-nagios` Utility

To export metrics using this method:

1.  Install the `collectd-nagios` utility on a host with a filter node by running the appropriate command (for a filter node installed on Linux):

    --8<-- "../include/monitoring/install-collectd-utils.md"

    !!! info "Docker image"
        The filter node Docker image ships with a preinstalled `collectd-nagios` utility.

2.  Make sure that you can run this utility with elevated privileges either on behalf of a superuser (for example, `root`) or as a regular user. In the latter case, add the user to the `sudoers` file with the `NOPASSWD` directive, and use the `sudo` utility.

    !!! info "Working with the Docker container"
        When executing the `collectd-nagios` utility in a Docker container with the filter node, elevation of privileges is not required.

3.  Connect and configure the [`UnixSock`][link-unixsock] plugin to transmit the `collectd` metrics via a Unix domain socket. To do this, create the file `/etc/collectd/collectd.conf.d/unixsock.conf` with the following content:

    ```
    LoadPlugin unixsock

    <Plugin unixsock>
        SocketFile "/var/run/wallarm-collectd-unixsock"
        SocketGroup "root"
        SocketPerms "0770"
        DeleteSocket true
    </Plugin>
    ```

4.  Restart the `collectd` service by executing the appropriate command:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

5.  Get the value of the necessary metric by running the appropriate command:

    --8<-- "../include/monitoring/collectd-nagios-fetch-metric.md"

    !!! info "Getting the Docker container's ID"
        You can find the value of the container identifier by running the `docker ps` command (see the “CONTAINER ID” column).

!!! info "Setting Thresholds for the `collectd-nagios` Utility"
    If necessary, you can specify a range of values for which the `collectd-nagios` utility will return the `WARNING` or `CRITICAL` status by using the corresponding `-w` and `-c` options (detailed information is available in the utility [documentation][link-nagios-plugin-docs]).
   
**Examples of using the utility:**
*   To get the value of the `wallarm_nginx/gauge-abnormal` metric (at the time `collectd-nagios` was called) on the Linux host `node.example.local` with the filter node, run the following command:
  
    ```
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```
       
*   To get the value of the `wallarm_nginx/gauge-abnormal` metric (at the time `collectd-nagios` was called) for the filter node running in the Docker container with the `wallarm-node` name and the `95d278317794` identifier, run the following command:
  
    ```
    docker exec wallarm-node /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H 95d278317794
    ```


!!! info "More examples"
    To get basic information about using the `collectd-nagios` utility, read examples of exporting metrics
    
    *   [to the Nagios monitoring system][doc-nagios-example] and
    *   [to the Zabbix monitoring system][doc-zabbix-example].


##  Sending Notifications from `collectd`

Notifications are configured in the following file:

--8<-- "../include/monitoring/notification-config-location.md"

A general description of how notifications work is available [here][link-notif-common].

More detailed information about how to set up notifications is available [here][link-notif-details].

Possible methods of sending notifications:
*   NSCA and NSCA-ng
*   SNMP TRAP
*   email messages
*   custom scripts
