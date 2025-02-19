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

# メトリクスの取得方法

本手順は、フィルターノードからメトリクスを収集する方法について説明いたします。

##  `collectd` から直接メトリクスをエクスポートする

`collectd` により収集されたメトリクスを、`collectd` データストリームに対応したツールへ直接エクスポートするように設定できます。

!!! warning "前提条件"
    以降のすべての手順は、スーパーユーザー（例：`root`）として実行する必要があります。

###  `collectd` ネットワークプラグインを経由したメトリクスのエクスポート

[network plugin][link-network-plugin] を `collectd` に設定して接続します。

=== "Docker image, cloud image, all-in-one installer"
    1.  `/opt/wallarm/etc/collectd/wallarm-collectd.conf` ファイルに以下の設定を追加します:
    
        ```
        LoadPlugin network
        
        <Plugin "network">
          Server "Server IPv4/v6 address or FQDN" "Server port"
        </Plugin>
        ```

        この設定により、プラグインは `collectd` 起動時にロードされ、クライアントモードで動作し、フィルターノードのメトリクスデータを指定されたサーバへ送信します。
    1.  `collectd` クライアントからデータを受け取るサーバを設定します。必要な設定手順は選択したサーバに依存します（[`collectd`][link-collectd-networking] および [InfluxDB][link-influxdb-collectd] の例をご参照ください）。
    
    
        !!! info "ネットワークプラグインの利用"
            ネットワークプラグインはUDP上で動作します（[プラグインのドキュメント][link-network-plugin-docs] をご参照ください）。メトリクス収集を正常に動作させるため、サーバがUDP通信を許可していることを確認してください。
    1.  以下のコマンドを実行し、`wallarm` サービスを再起動します:

        ```bash
        sudo systemctl restart wallarm
        ```
=== "その他のインストール"
    1.  `/etc/collectd/collectd.conf.d/` ディレクトリに、拡張子が `.conf` のファイル（例：`export-via-network.conf`）を作成し、以下の内容を記述します:

        ```
        LoadPlugin network
        
        <Plugin "network">
          Server "Server IPv4/v6 address or FQDN" "Server port"
        </Plugin>
        ```

        このファイルの記述により、プラグインは `collectd` 起動時にロードされ、クライアントモードで動作し、フィルターノードのメトリクスデータを指定されたサーバへ送信します。
    1.  `collectd` クライアントからデータを受け取るサーバを設定します。必要な設定手順は選択したサーバに依存します（[`collectd`][link-collectd-networking] および [InfluxDB][link-influxdb-collectd] の例をご参照ください）。
    
    
        !!! info "ネットワークプラグインの利用"
            ネットワークプラグインはUDP上で動作します（[プラグインのドキュメント][link-network-plugin-docs] をご参照ください）。メトリクス収集を正常に動作させるため、サーバがUDP通信を許可していることを確認してください。
    1.  適切なコマンドを実行し、`collectd` サービスを再起動します:

        --8<-- "../include/monitoring/collectd-restart-2.16.md"

!!! info "例"
    ネットワークプラグインを経由してInfluxDBへメトリクスをエクスポートし、その後Grafanaでメトリクスを可視化する[例][doc-network-plugin-example]をご参照ください。

###  `collectd` 書き込みプラグインを経由したメトリクスのエクスポート

`collectd` の[書き込みプラグイン][link-plugin-table]を経由してメトリクスをエクスポートするには、該当プラグインのドキュメントを参照します。

!!! info "例"
    書き込みプラグインを利用した基本的な使用方法については、Grafanaでメトリクスを可視化するためにGraphiteへメトリクスをエクスポートする[例][doc-write-plugin-example]をご参照ください。

##  `collectd-nagios` ユーティリティを利用したメトリクスのエクスポート

この方法でメトリクスをエクスポートするには、以下の手順を実施します：

1.  フィルターノードがインストールされたホストにおいて、適切なコマンドを実行し、`collectd-nagios` ユーティリティをインストールします（Linuxにインストールされたフィルターノードの場合）:

    --8<-- "../include/monitoring/install-collectd-utils.md"

    !!! info "Docker image"
        フィルターノードのDocker imageには、`collectd-nagios` ユーティリティがあらかじめインストールされています。
2.  このユーティリティを昇格された権限で、スーパーユーザー（例：`root`）として、もしくは通常ユーザーとして実行できるようにしてください。後者の場合、ユーザーを `sudoers` ファイルに `NOPASSWD` 指令付きで追加し、`sudo` ユーティリティを利用します。

    !!! info "Dockerコンテナでの利用"
        フィルターノードのDockerコンテナ内で `collectd-nagios` ユーティリティを実行する際には、昇格された権限は必要ありません。
3.  [`UnixSock`][link-unixsock] プラグインを接続し、Unixドメインソケット経由で `collectd` メトリクスを送信できるように設定します。そのため、以下の内容で `/etc/collectd/collectd.conf.d/unixsock.conf` ファイルを作成してください:

    ```
    LoadPlugin unixsock

    <Plugin unixsock>
        SocketFile "/var/run/wallarm-collectd-unixsock"
        SocketGroup "root"
        SocketPerms "0770"
        DeleteSocket true
    </Plugin>
    ```

4.  適切なコマンドを実行し、`collectd` サービスを再起動します:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

5.  適切なコマンドを実行し、必要なメトリクスの値を取得します:

    --8<-- "../include/monitoring/collectd-nagios-fetch-metric.md"

    !!! info "DockerコンテナのIDの取得"
        `docker ps` コマンドを実行することで、コンテナ識別子の値が確認できます（“CONTAINER ID” カラムを参照してください）。

!!! info " `collectd-nagios` ユーティリティの閾値設定"
    必要に応じ、対応する `-w` および `-c` オプションを使用して、`collectd-nagios` ユーティリティが `WARNING` または `CRITICAL` ステータスを返す値の範囲を指定できます（詳細はユーティリティの[ドキュメント][link-nagios-plugin-docs]に記載されています）。
   
**ユーティリティ使用例:**
*   フィルターノードが存在するLinuxホスト `node.example.local` 上で、`collectd-nagios` 呼び出し時の `wallarm_nginx/gauge-abnormal` メトリクスの値を取得するには、以下のコマンドを実行します:
  
    ```
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```
       
*   Dockerコンテナ上で稼働するフィルターノード（名前：`wallarm-node`、識別子：`95d278317794`）の `collectd-nagios` 呼び出し時の `wallarm_nginx/gauge-abnormal` メトリクスの値を取得するには、以下のコマンドを実行します:
  
    ```
    docker exec wallarm-node /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H 95d278317794
    ```

!!! info "その他の例"
    `collectd-nagios` ユーティリティの基本的な使用方法については、以下の例を参照してください。
    
    *   [Nagios監視システムへのエクスポート][doc-nagios-example]および
    *   [Zabbix監視システムへのエクスポート][doc-zabbix-example]。

##  `collectd` からの通知送信

通知は、以下のファイルで設定されます:

--8<-- "../include/monitoring/notification-config-location.md"

通知の仕組みの概要については、[こちら][link-notif-common]をご参照ください。

通知設定の詳細な情報については、[こちら][link-notif-details]をご参照ください。

通知を送信するための方法:
*   NSCAおよびNSCA-ng
*   SNMP TRAP
*   メールメッセージ
*   カスタムスクリプト