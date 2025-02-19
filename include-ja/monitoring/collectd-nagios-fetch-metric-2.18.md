=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <ホスト名を除くメトリック名> -H <ユーティリティが実行されているフィルターノードを含むホストのFQDN>
    ```
=== "Docker"
    ```bash
    docker exec <コンテナ名> /usr/bin/collectd-nagios -s /var/run/collectd-unixsock -n <ホスト名を除くメトリック名> -H <コンテナID>
    ```