=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <host adı olmadan metrik adı> -H <yardımcının çalıştığı filtre düğümüne sahip sunucunun FQDN'si>
    ```
=== "Docker"
    ```bash
    docker exec <container name> /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <host adı olmadan metrik adı> -H <container ID>
    ```