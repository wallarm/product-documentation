[img-network-plugin-influxdb]:     ../../images/monitoring/network-plugin-influxdb.png

[doc-grafana]:                     working-with-grafana.md

[link-collectd-networking]:        https://collectd.org/wiki/index.php/Networking_introduction
[link-network-plugin]:             https://www.collectd.org/documentation/manpages/collectd.conf.html
[link-typesdb]:                    https://www.collectd.org/documentation/manpages/types.db.html
[link-typesdb-file]:               https://github.com/collectd/collectd/blob/master/src/types.db

# collectdのnetworkプラグインを介したInfluxDBへのメトリクスのエクスポート

本書は、networkプラグインを使用してInfluxDB時系列データベースへメトリクスをエクスポートする例を示します。また、Grafanaを使用してInfluxDBに収集されたメトリクスを可視化する方法も示します。

## 例のワークフロー

--8<-- "../include/monitoring/metric-example.md"

![Example Workflow][img-network-plugin-influxdb]

本書では、次の展開スキームを使用します:
* Wallarmフィルターノードは、IPアドレス`10.0.30.5`および完全修飾ドメイン名`node.example.local`でアクセス可能なホスト上に展開されます。
    
    フィルターノード上の`collectd`の`network`プラグインは、すべてのメトリクスを`10.0.30.30`のInfluxDBサーバーのポート`25826/UDP`へ送信するように設定されています。
    
      
    !!! info "networkプラグインの機能"
        プラグインはUDP上で動作します（`network`プラグインの[使用例][link-collectd-networking]および[ドキュメント][link-network-plugin]を参照ください）。
    
    
* `influxdb`とgrafanaの各サービスは、IPアドレス`10.0.30.30`を持つ別のホスト上でDockerコンテナとして展開されます。

    InfluxDBデータベースを持つ`influxdb`サービスは、以下のように設定されています:
    
      * InfluxDB用の`collectd`データソースが作成されており（InfluxDBの用語に従った`collectd`入力）、`25826/UDP`ポートでリッスンし、受信したメトリクスを`collectd`というデータベースに書き込みます。
      * InfluxDB APIとの通信は`8086/TCP`ポートを介して行われます。
      * サービスは`grafana`サービスと`sample-net` Dockerネットワークを共有します。
    
    Grafanaを持つ`grafana`サービスは、以下のように設定されています:
    
      * Grafanaウェブコンソールは`http://10.0.30.30:3000`で利用可能です。
      * サービスは`influxdb`サービスと`sample-net` Dockerネットワークを共有します。

## InfluxDBへのメトリクスエクスポートの設定

--8<-- "../include/monitoring/docker-prerequisites.md"

### InfluxDBとGrafanaの展開

Dockerホスト上にInfluxDBとGrafanaを展開します:
1. 作業ディレクトリ（例: `/tmp/influxdb-grafana`）を作成し、そこに移動します:
    
    ```
    mkdir /tmp/influxdb-grafana
    cd /tmp/influxdb-grafana
    ```
    
2. InfluxDBデータソースが動作するためには、`collectd`値タイプを含む`types.db`というファイルが必要です。
    
    このファイルは、`collectd`が使用するデータセット仕様を記述しています。これらのデータセットには、測定可能なタイプの定義が含まれます。このファイルの詳細については[こちら][link-typesdb]を参照ください。
    
    GitHub上の`collectd`プロジェクトから[「types.db」ファイル][link-typesdb-file]をダウンロードし、作業ディレクトリに配置します。
    
3. 次のコマンドを実行して、基本的なInfluxDB設定ファイルを取得します:
    
    ```
    docker run --rm influxdb influxd config > influxdb.conf
    ```
    
4. `influxdb.conf` InfluxDB設定ファイルの`[[collectd]]`セクションにある`enabled`パラメーターの値を`false`から`true`に変更し、`collectd`データソースを有効にします。
    
    他のパラメーターは変更しません。
   
    セクションは以下のようになります:
   
    ```
    [[collectd]]
      enabled = true
      bind-address = ":25826"
      database = "collectd"
      retention-policy = ""
      batch-size = 5000
      batch-pending = 10
      batch-timeout = "10s"
      read-buffer = 0
      typesdb = "/usr/share/collectd/types.db"
      security-level = "none"
      auth-file = "/etc/collectd/auth_file"
      parse-multivalue-plugin = "split"  
    ```
    
5. 作業ディレクトリに次の内容の`docker-compose.yaml`ファイルを作成します:
   
    ```
    version: "3"
    
    services:
      influxdb:
        image: influxdb
        container_name: influxdb
        ports:
          - 8086:8086
          - 25826:25826/udp
        networks:
          - sample-net
        volumes:
          - ./:/var/lib/influxdb
          - ./influxdb.conf:/etc/influxdb/influxdb.conf:ro
          - ./types.db:/usr/share/collectd/types.db:ro
    
      grafana:
        image: grafana/grafana
        container_name: grafana
        restart: always
        ports:
          - 3000:3000
        networks:
          - sample-net
    
    networks:
      sample-net:
    ```

    `volumes:`の設定により、InfluxDBは以下を使用します:
    1. 作業ディレクトリをデータベースのストレージとして使用します。
    2. 作業ディレクトリにある`influxdb.conf`設定ファイルを使用します。
    3. 作業ディレクトリにある、測定可能な値のタイプを含む`types.db`ファイルを使用します。  
    
6. `docker-compose build`コマンドを実行して、サービスをビルドします。
    
7. `docker-compose up -d influxdb grafana`コマンドを実行して、サービスを起動します。
    
8. 次のコマンドを実行して、対応するInfluxDBデータソース用に`collectd`という名前のデータベースを作成します:
    
    ```
    curl -i -X POST http://10.0.30.30:8086/query --data-urlencode "q=CREATE DATABASE collectd"
    ```
    
    InfluxDBサーバーは次のような応答を返します:
    
    ```
    HTTP/1.1 200 OK
    Content-Type: application/json
    Request-Id: 23604241-b086-11e9-8001-0242ac190002
    X-Influxdb-Build: OSS
    X-Influxdb-Version: 1.7.7
    X-Request-Id: 23604241-b086-11e9-8001-0242ac190002
    Date: Sat, 27 Jul 2019 15:49:37 GMT
    Transfer-Encoding: chunked
    
    {"results":[{"statement_id":0}]}
    ```
    
この時点で、InfluxDBは動作しており、`collectd`からのメトリクスを受信する準備が整いました。また、GrafanaはInfluxDBに保存されたデータを監視および可視化する準備が整いました。

### `collectd`の設定

`collectd`を設定して、InfluxDBにメトリクスをエクスポートします:

=== "Docker image, cloud image, all-in-one installer"
    1. フィルターノードに接続します（例としてSSHプロトコルを使用します）。rootまたはスーパー権限のある別のアカウントでログインしていることを確認してください。
    1. `/opt/wallarm/etc/collectd/wallarm-collectd.conf`ファイルに次の設定を追加します:
      
        ```
        LoadPlugin network
        
        <Plugin "network">
          Server "Server IPv4/v6 address or FQDN" "Server port"
        </Plugin>
        ```
        
        ここでは以下の項目が設定されています:
        
        1. メトリクス送信先のサーバー（`10.0.30.30`）
        1. サーバーがリッスンするポート（`25826/UDP`）
        
    1. 次のコマンドを実行して`wallarm`サービスを再起動します:
    
        ```bash
        sudo systemctl restart wallarm
        ```
=== "Other installations"
    1. フィルターノードに接続します（例としてSSHプロトコルを使用します）。rootまたはスーパー権限のある別のアカウントでログインしていることを確認してください。
    1. `/etc/collectd/collectd.conf.d/export-to-influxdb.conf`という名前のファイルを、次の内容で作成します:
      
        ```
        LoadPlugin network
        
        <Plugin "network">
            Server "10.0.30.30" "25826"
        </Plugin>
        ```
        
        ここでは以下の項目が設定されています:
        
        1. メトリクス送信先のサーバー（`10.0.30.30`）
        1. サーバーがリッスンするポート（`25826/UDP`）
        
    1. 適切なコマンドを実行して`collectd`サービスを再起動します:
    
        --8<-- "../include/monitoring/collectd-restart-2.16.md"

これで、InfluxDBはフィルターノードのすべてのメトリクスを受信します。[Grafana][doc-grafana]を使用して、関心のあるメトリクスを可視化および監視できます。