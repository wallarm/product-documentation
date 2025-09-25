=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <ホスト名を含まないメトリクス名> -H <ユーティリティが実行されているフィルタノードのあるホストのFQDN>
    ```
=== "Docker"
    ```bash
    docker exec <コンテナ名> /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <ホスト名を含まないメトリクス名> -H <コンテナID>
    ```