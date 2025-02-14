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

#   メトリクスの取得方法

これらの手順は、フィルターノードからメトリクスを収集する方法を説明します。

##  `collectd`から直接メトリクスをエクスポートする

`collectd`で収集したメトリクスを直接、`collectd`データストリームを扱うことができるツールにエクスポートできます。

!!! warning "前提条件"
    以降のすべての手順は、スーパーユーザー（例：`root`）として実行しなければなりません。

### `collectd`のネットワークプラグインを使用してメトリクスをエクスポートする

[ネットワークプラグイン][link-network-plugin]を`collectd`に設定および接続します：
1.  `/etc/collectd/collectd.conf.d/`ディレクトリで、`.conf`拡張子を持つファイル（例：`export-via-network.conf`）を作成し、以下の内容を記入します：

    ```
    LoadPlugin network
    
    <Plugin "network">
      Server "Server IPv4/v6 address or FQDN" "Server port"
    </Plugin>
    ```
    このファイルに記載されている通り、プラグインは`collectd`が起動するとロードされ、クライアントモードで動作し、指定されたサーバーにフィルターノードのメトリクスデータを送信します。
    
2.  `collectd`クライアントからデータを受信するサーバーを設定します。必要な設定ステップは、選択されたサーバーによります（[`collectd`][link-collectd-networking]と[InfluxDB][link-influxdb-collectd]の例を参照してください）。
    
    
    !!! info "ネットワークプラグインの使用"
        ネットワークプラグインはUDP上で動作します（[プラグインのドキュメンテーション][link-network-plugin-docs]を参照）。メトリクスの収集が正常に動作するためには、サーバーがUDP通信を許可していることを確認してください。
         
3.  適切なコマンドを実行して`collectd`サービスを再起動します：

    --8<-- "../include-ja/monitoring/collectd-restart-2.16.md"

!!! info "例"
    ネットワークプラグインを通じてInfluxDBへのメトリクスのエクスポートの[例][doc-network-plugin-example]を読み、Grafanaでのメトリクスの可視化を確認してください。

### `collectd`のWriteプラグインを使用してメトリクスをエクスポートする

`collectd`の[writeプラグイン][link-plugin-table]を通じてメトリクスのエクスポートを設定するには、対応するプラグインのドキュメントを参照してください。

!!! info "例"
    Writeプラグインの基本的な使用情報を得るために、Graphiteへのメトリクスのエクスポートの[例][doc-write-plugin-example]を読み、Grafanaでのメトリクスの可視化を確認してください。

##  `collectd-nagios`ユーティリティを使用してメトリクスをエクスポートする

この方法を使用してメトリクスをエクスポートするには：

1.  フィルターノードがあるホストに`collectd-nagios`ユーティリティをインストールします。適切なコマンドを実行します（以下の例では、Linux上にインストールされたフィルターノード用になっています）：

    --8<-- "../include-ja/monitoring/install-collectd-utils.md"

    !!! info "Dockerイメージ"
        フィルターノードのDockerイメージには、予め`collectd-nagios`ユーティリティがインストールされています。

2.  スーパーユーザー（例えば`root`）の権限でユーティリティを実行できることを確認します。通常のユーザーとして実行する場合は、ユーザーを`NOPASSWD`ディレクティブを持つ`sudoers`ファイルに追加し、`sudo`ユーティリティを使用します。

    !!! info "Dockerコンテナとの連携"
        フィルターノードがあるDockerコンテナで`collectd-nagios`ユーティリティを実行すると、特別な権限の昇格は必要ありません。

3.  [`UnixSock`][link-unixsock]プラグインを接続および設定して、`collectd`メトリクスをUnixドメインソケット経由で転送します。これを行うには、以下の内容を持つファイル`/etc/collectd/collectd.conf.d/unixsock.conf`を作成します：

    ```
    LoadPlugin unixsock

    <Plugin unixsock>
        SocketFile "/var/run/wallarm-collectd-unixsock"
        SocketGroup "root"
        SocketPerms "0770"
        DeleteSocket true
    </Plugin>
    ```

4.  適切なコマンドを実行して`collectd`サービスを再起動します：

    --8<-- "../include-ja/monitoring/collectd-restart-2.16.md"

5.  適切なコマンドを実行して、必要なメトリクスの値を取得します：

    --8<-- "../include-ja/monitoring/collectd-nagios-fetch-metric.md"

    !!! info "DockerコンテナのIDの取得"
        コンテナの識別子の値は`docker ps`コマンドを実行することで見つけることができます（“CONTAINER ID”カラムを参照）。

!!! info "`collectd-nagios`ユーティリティの閾値の設定"
    必要に応じて、`collectd-nagios`ユーティリティが`WARNING`または`CRITICAL`のステータスを返す値の範囲を、対応する`-w`および`-c`オプションを使用して指定できます（詳細情報はユーティリティの[ドキュメンテーション][link-nagios-plugin-docs]でご覧いただけます）。
   
**ユーティリティの使用例:**
*   フィルターノードがあるLinuxホスト`node.example.local`上で、`collectd-nagios`が呼び出された時点での`wallarm_nginx/gauge-abnormal`メトリクスの値を取得するには、次のコマンドを実行します：
  
    ```
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```
       
*   `wallarm-node`名と`95d278317794`識別子を持つDockerコンテナで動作しているフィルターノードについて、`collectd-nagios`が呼び出された時点での`wallarm_nginx/gauge-abnormal`メトリクスの値を取得するには、次のコマンドを実行します：
  
    ```
    docker exec wallarm-node /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H 95d278317794
    ```


!!! info "更なる例"
    `collectd-nagios`ユーティリティの基本的な使用情報を得るために、メトリクスのエクスポート例を読んでください。
    
    *   [Nagiosモニタリングシステムへの例][doc-nagios-example]と
    *   [Zabbixモニタリングシステムへの例][doc-zabbix-example]です。


##  `collectd`からの通知の送信

通知は以下のファイルで設定されます：

--8<-- "../include-ja/monitoring/notification-config-location.md"

通知の動作に関する一般的な説明は[こちら][link-notif-common]でご覧いただけます。

通知の設定方法に関する詳細情報は[こちら][link-notif-details]でご覧いただけます。

通知の送信方法の候補：
*   NSCA および NSCA-ng
*   SNMP TRAP
*   Eメールメッセージ
*   カスタムスクリプト