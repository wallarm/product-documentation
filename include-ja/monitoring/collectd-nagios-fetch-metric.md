					=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <ホスト名なしのメトリック名> -H <フィルターノードが稼働しているホストのFQDN>
    ```
=== "Docker"
    ```bash
    docker exec <コンテナー名> /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <ホスト名なしのメトリック名> -H <コンテナID>
    ```