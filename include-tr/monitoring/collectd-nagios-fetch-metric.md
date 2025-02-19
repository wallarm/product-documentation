=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <ana bilgisayar adı olmadan metrik adı> -H <filtre düğümüne sahip, aracın çalıştığı ana bilgisayarın FQDN>
    ```
=== "Docker"
    ```bash
    docker exec <konteyner adı> /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <ana bilgisayar adı olmadan metrik adı> -H <konteyner ID>
    ```