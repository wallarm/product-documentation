[link-network-plugin]:              https://collectd.org/wiki/index.php/Plugin:Network
[link-network-plugin-docs]:         https://collectd.org/documentation/manpages/collectd.conf.5.shtml#plugin_network
[link-collectd-networking]:         https://collectd.org/wiki/index.php/Networking_introduction
[link-influx-collectd-support]:     https://docs.influxdata.com/influxdb/v1.7/supported_protocols/collectd/
[link-plugin-table]:                https://collectd.org/wiki/index.php/Table_of_Plugins
[link-nagios-plugin-docs]:          https://collectd.org/documentation/manpages/collectd-nagios.1.shtml
[link-notif-common]:                https://collectd.org/wiki/index.php/Notifications_and_thresholds
[link-notif-details]:               https://collectd.org/documentation/manpages/collectd-threshold.5.shtml
[link-influxdb-collectd]:           https://docs.influxdata.com/influxdb/v1.7/supported_protocols/collectd/
[link-unixsock]:                    https://collectd.org/wiki/index.php/Plugin:UnixSock

[doc-network-plugin-example]:       network-plugin-influxdb.md
[doc-write-plugin-example]:         write-plugin-graphite.md
[doc-zabbix-example]:               collectd-zabbix.md
[doc-nagios-example]:               collectd-nagios.md

#   メトリックの取得方法

これらの手順は、フィルタリングノードからメトリックを収集する方法を説明します。

##  `collectd`から直接メトリックをエクスポートする

`collectd`で収集したメトリックを、`collectd`のデータストリームで動作するツールに直接エクスポートできます。

!!! warning "前提条件"
    以降のすべてのステップは、スーパーユーザー（例：`root`）として実行する必要があります。

###  `collectd`ネットワークプラグインを介したメトリックのエクスポート

`collectd`に[ネットワークプラグイン][link-network-plugin]を設定し、接続します：
1.  `/etc/collectd/collectd.conf.d/`ディレクトリで、`.conf`拡張子のファイル（例：`export-via-network.conf`）を作成し、次の内容を入力します:

    ```
    LoadPlugin network
    
    <Plugin "network">
      Server "Server IPv4/v6 address or FQDN" "Server port"
    </Plugin>
    ```

    このファイルに記載されているように、プラグインは`collectd`が起動時にロードされ、クライアントモードで動作し、指定されたサーバーにフィルタノードのメトリックデータを送信します。
    
2.  `collectd`クライアントからデータを受信するサーバーを設定します。選択されたサーバーに応じて必要な設定ステップが異なります（[`collectd`][link-collectd-networking]および[InfluxDB][link-influxdb-collectd]の例を参照してください）。
    
    
    !!! info "ネットワークプラグインでの作業"
        ネットワークプラグインはUDPで動作します（[プラグインのドキュメント][link-network-plugin-docs]を参照）。メトリックの収集を運用するために、サーバーがUDPでの通信を許可していることを確認してください。
         
3.  適切なコマンドを実行して`collectd`サービスを再起動します:

    --8<-- "../include/monitoring/collectd-restart-2.16.ja.md"

!!! info "例"
    ネットワークプラグインを介してInfluxDBにメトリックをエクスポートし、その後Grafanaでメトリックを視覚化する[例][doc-network-plugin-example]を参照してください。

###  `collectd`ライトプラグインを介したメトリックのエクスポート

`collectd`の[ライトプラグイン][link-plugin-table]を介したメトリックのエクスポートを設定するには、対応するプラグインのドキュメントを参照してください。

!!! info "例"
    ライトプラグインの基本情報を取得するには、Grafanaでメトリックを視覚化するGraphiteにメトリックをエクスポートする[例][doc-write-plugin-example]を参照してください。

##  `collectd-nagios`ユーティリティを使用したメトリックのエクスポート

この方法でメトリックをエクスポートするには：

1.  適切なコマンドを実行して、フィルタノードのあるホストに`collectd-nagios`ユーティリティをインストールします（Linuxにインストールされたフィルタノードの場合）：

    --8<-- "../include/monitoring/install-collectd-utils.ja.md"

    !!! info "Dockerイメージ"
        フィルタノードのDockerイメージには、事前にインストールされた`collectd-nagios`ユーティリティが付属しています。

2.  スーパーユーザー（例：`root`）を代表して、または通常のユーザーとして、`collectd-nagios`ユーティリティを特権を持って実行できることを確認してください。後者の場合は、ユーザーを`NOPASSWD`ディレクティブを使用して`sudoers`ファイルに追加し、`sudo`ユーティリティを使用します。

    !!! info "Dockerコンテナでの作業"
        フィルタノードが含まれるDockerコンテナで`collectd-nagios`ユーティリティを実行する場合、特権の昇格は必要ありません。

3.  Unixドメインソケット経由で`collectd`メトリックを送信するために、[`UnixSock`][link-unixsock]プラグインを接続し、設定します。これを行うには、ファイル`/etc/collectd/collectd.conf.d/unixsock.conf`を作成し、以下の内容を記入します：

    ```
    LoadPlugin unixsock

    <Plugin unixsock>
        SocketFile "/var/run/wallarm-collectd-unixsock"
        SocketGroup "root"
        SocketPerms "0770"
        DeleteSocket true
    </Plugin>
    ```

4.  適切なコマンドを実行して`collectd`サービスを再起動します:

    --8<-- "../include/monitoring/collectd-restart-2.16.ja.md"

5.  適切なコマンドを実行して、必要なメトリックの値を取得します：

    --8<-- "../include/monitoring/collectd-nagios-fetch-metric.ja.md"

    !!! info "DockerコンテナのIDを取得する"
        コンテナ識別子の値は、`docker ps`コマンドを実行して見つけることができます（「CONTAINER ID」列を参照）。

!!! info "`collectd-nagios`ユーティリティのしきい値を設定する"
    必要に応じて、`collectd-nagios`ユーティリティが`WARNING`または`CRITICAL`のステータスを返す値の範囲を、対応する`-w`および`-c`オプションを使用して指定できます（詳細情報は、ユーティリティの[ドキュメント][link-nagios-plugin-docs]にあります）。
    
**ユーティリティの使用例：**
*   フィルターノードがあるLinuxホスト`node.example.local`の`curl_json-wallarm_nginx/gauge-abnormal`メトリックの値を（`collectd-nagios`が呼び出された時点で）取得するには、以下のコマンドを実行します:
  
    ```
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H node.example.local
    ```
       
*   `wallarm-node`名と`95d278317794`識別子のDockerコンテナで実行中のフィルタノードの`curl_json-wallarm_nginx/gauge-abnormal`メトリックの値を（`collectd-nagios`が呼び出された時点で）取得するには、以下のコマンドを実行します:
  
    ```
    docker exec wallarm-node /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n curl_json-wallarm_nginx/gauge-abnormal -H 95d278317794
    ```

!!! info "他の例"
    `collectd-nagios`ユーティリティの使用に関する基本情報を取得するには、メトリックをエクスポートする方法の例を読んでください。
    
    *   [Nagios監視システムへ][doc-nagios-example]および
    *   [Zabbix監視システムへ][doc-zabbix-example]。

##  `collectd`から通知を送信する

通知の設定は、以下のファイルで行われます：

--8<-- "../include/monitoring/notification-config-location.ja.md"

通知の動作に関する一般的な説明は[こちら][link-notif-common]にあります。

通知の設定方法に関する詳細な情報は[こちら][link-notif-details]にあります。

通知を送信する可能な方法：
*   NSCAおよびNSCA-ng
*   SNMP TRAP
*   メールメッセージ
*   カスタムスクリプト