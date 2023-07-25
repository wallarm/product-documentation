					=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <ホスト名なしのメトリック名> -H <ユーティリティが実行されているフィルタノードのホストのFQDN>
    ```
=== "Docker"
    ```bash
    docker exec <コンテナ名> /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <ホスト名なしのメトリック名> -H <コンテナID>
    ```