[img-network-plugin-influxdb]: ../../images/monitoring/network-plugin-influxdb.png

[doc-grafana]: working-with-grafana.md

[link-collectd-networking]: https://collectd.org/wiki/index.php/Networking_introduction
[link-network-plugin]: https://collectd.org/documentation/manpages/collectd.conf.5.shtml#plugin_network
[link-typesdb]: https://collectd.org/documentation/manpages/types.db.5.shtml
[link-typesdb-file]: https://github.com/collectd/collectd/blob/master/src/types.db

# InfluxDBへの `collectd` ネットワークプラグインを介したメトリクスのエクスポート

このドキュメントでは、Networkプラグインを使用してメトリクスをInfluxDB時系列データベースにエクスポートする方法の例を提供します。また、InfluxDBで収集されたメトリクスをGrafanaを使用して可視化する方法も示します。

## 例のワークフロー

--8<-- "../include/monitoring/metric-example.ja.md"

![!Example Workflow][img-network-plugin-influxdb]

このドキュメントでは、以下のデプロイメントスキームが使用されています。
*   Wallarmフィルターノードは、`10.0.30.5` IPアドレスおよび `node.example.local`完全修飾ドメイン名でアクセスできるホストにデプロイされています。

    フィルターノード上の `collectd` の `network` プラグインは、すべてのメトリックが `25826/UDP` ポートで `10.0.30.30`のInfluxDBサーバーに送信されるように設定されています。
    

    !!! info "ネットワークプラグインの機能"
        プラグインはUDPで動作することに注意してください（`network`プラグインの[使用例][link-collectd-networking]と[ドキュメント][link-network-plugin]も参照してください）。
    
        
*   `influxdb` と grafana サービスは、 `10.0.30.30` IPアドレスを持つ別のホストでDockerコンテナとしてデプロイされています。

    InfluxDBデータベースを持つ `influxdb` サービスは次のように設定されています：

      * `collectd` データソースが作成されました（InfluxDB用語によると `collectd` 入力）。これは `25826/UDP` ポートでリッスンし、着信メトリックを `collectd` という名前のデータベースに書き込みます。
      * InfluxDB APIとの通信は `8086/TCP` ポートを介して行われます。
      * サービスは `grafana` サービスと `sample-net` Dockerネットワークを共有しています。
    
    
    
    Grafanaを持つ `grafana` サービスは次のように設定されています：

      * Grafanaウェブコンソールは `http://10.0.30.30:3000` で利用可能です。
      * サービスは `influxdb` サービスと `sample-net` Dockerネットワークを共有しています。

## InfluxDBへのメトリクスエクスポートの設定

--8<-- "../include/monitoring/docker-prerequisites.ja.md"

### InfluxDBとGrafanaのデプロイメント

Dockerホスト上にInfluxDBとGrafanaをデプロイします。
1. 作業ディレクトリを作成し、たとえば `/tmp/influxdb-grafana` に移動します。

    ```
    mkdir /tmp/influxdb-grafana
    cd /tmp/influxdb-grafana
    ```
    
2. InfluxDBデータソースを動作させるために、`collectd` の値タイプを含む `types.db` というファイルが必要です。

    このファイルは、 `collectd` で使用されるデータセット仕様を記述しています。これらのデータセットには、測定可能なタイプの定義が含まれます。このファイルに関する詳細情報は[こちら][link-typesdb]で入手できます。

    [`types.db` ファイル][link-typesdb-file] を `collectd`プロジェクトのGitHubリポジトリからダウンロードし、作業ディレクトリに配置します。
    
3. 次のコマンドを実行して、基本的なInfluxDB設定ファイルを取得します：

    ```
    docker run --rm influxdb influxd config > influxdb.conf
    ```
    
4. `influxdb.conf` InfluxDB設定ファイルの `[[collectd]]` セクションの `enabled` パラメータの値を `false` から `true` に変更して `collectd` データソースを有効にします。

    他のパラメータは変更しないでください。

    セクションは次のようになります：
   
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
    
5. 作業ディレクトリに以下の内容で `docker-compose.yaml` ファイルを作成します：

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

    `volumes:` の設定により、InfluxDBは
    1. データベースのストレージとして作業ディレクトリを使用します。
    2. 作業ディレクトリにある `influxdb.conf` 設定ファイルを使用します。
    3. 作業ディレクトリにある測定可能な値タイプの `types.db` ファイルを使用します。
        
6. `docker-compose build` コマンドを実行して、サービスをビルドします。
    
7. `docker-compose up -d influxdb grafana` コマンドを実行して、サービスを起動します。
    
8. 次のコマンドを実行して、対応するInfluxDBデータソースの `collectd` という名前のデータベースを作成します：

    ```
    curl -i -X POST http://10.0.30.30:8086/query --data-urlencode "q=CREATE DATABASE collectd"
    ```
    
    InfluxDBサーバーは、次のようなレスポンスを返すべきです：
   
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
    
この時点で、InfluxDBは `collectd` からのメトリクスを受信する準備ができており、GrafanaはInfluxDBに保存されているデータを監視および可視化する準備ができています。

### `collectd` の設定

InfluxDBにメトリクスをエクスポートするように `collectd` を設定します：
1. フィルターノードに接続します（たとえば、SSHプロトコルを使用します）。ルートまたは他のスーパーユーザー権限を持つアカウントでログインしていることを確認してください。
2. `/etc/collectd/collectd.conf.d/export-to-influxdb.conf` という名前のファイルを作成し、次の内容を記載します：
   
    ```
    LoadPlugin network
    
    <Plugin "network">
        Server "10.0.30.30" "25826"
    </Plugin>
    ```
    
   ここで次のエンティティが設定されています：
    
    1. メトリックを送信するサーバー （ `10.0.30.30` ）
    2. サーバーがリッスンするポート （ `25826/UDP` ）
    
  
3. 適切なコマンドを実行して `collectd` サービスを再起動します：

    --8<-- "../include/monitoring/collectd-restart-2.16.ja.md"

これでInfluxDBはフィルターノードのすべてのメトリックを受信します。関心のあるメトリックを可視化し、[Grafanaで監視する][doc-grafana]ことができます。