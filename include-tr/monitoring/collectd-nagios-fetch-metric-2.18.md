=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <metric name without host name> -H <FQDN of the host with the filter node on which the utility is running>
    ```
=== "Docker"
    ```bash
    docker exec <container name> /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <metric name without host name> -H <container ID>
    ```