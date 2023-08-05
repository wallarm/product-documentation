					=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <ホスト名なしのメトリック名> -H <ユーティリティが実行されているフィルターノードのホストのFQDN>
    ```
=== "Docker"
    ```bash
    docker exec <コンテナ名> /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <ホスト名なしのメトリック名> -H <コンテナID>
    ```