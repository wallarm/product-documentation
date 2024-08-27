[img-network-plugin-influxdb]:     ../../images/monitoring/network-plugin-influxdb.png

[doc-grafana]:                     working-with-grafana.md

[link-collectd-networking]:        https://collectd.org/wiki/index.php/Networking_introduction
[link-network-plugin]:             https://www.collectd.org/documentation/manpages/collectd.conf.html
[link-typesdb]:                    https://www.collectd.org/documentation/manpages/types.db.html
[link-typesdb-file]:               https://github.com/collectd/collectd/blob/master/src/types.db

#   `collectd` ネットワークプラグインを経由してInfluxDBにメトリクスをエクスポートする

このドキュメントでは、ネットワークプラグインを使用してメトリクスをInfluxDB時系列データベースにエクスポートする例を提供します。また、Grafanaを使用してInfluxDBに収集されたメトリクスを視覚化する方法も示します。

##  ワークフローの例

--8<-- "../include-ja/monitoring/metric-example.md"

![ワークフローの例][img-network-plugin-influxdb]

このドキュメントでは次のデプロイメントスキームを使用します:
*   Wallarmフィルタノードは`10.0.30.5` IPアドレスと `node.example.local`フル修飾ドメイン名を介してアクセス可能なホストにデプロイされています。
    
    フィルタノード上の `collectd`の `network` プラグインは、全てのメトリクスが`10.0.30.30`のInfluxDBサーバーに`25826/UDP`ポートで送信されるように設定されています。
    
      
    !!! info "ネットワークプラグインの特性"
        プラグインがUDP経由で運用されることに注意してください（ `network`プラグインの[使用例][link-collectd-networking]と[ドキュメンテーション][link-network-plugin]を参照）。
    
    
*   `influxdb`とgrafanaの両サービスは別のホスト上で`10.0.30.30` IPアドレスのDockerコンテナとしてデプロイされています。

    InfluxDBデータベースを持つ `influxdb` サービスは以下のように設定されています：

      * `collectd` データソースが作成されました（InfluxDB用語では、 `collectd`入力）、これは `25826/UDP` ポートでリッスンしており、収入するメトリクスを `collectd`という名前のデータベースに書き込みます。
      * InfluxDB APIとの通信は `8086/TCP` ポートを介して行われます。
      * サービスは `grafana` サービスと `sample-net` Dockerネットワークを共有します。
    
    
    
    Grafanaを持つ `grafana` サービスは以下のように設定されています:
    
      * GrafanaのWebコンソールは `http://10.0.30.30:3000` で利用可能です。
      * サービスは `influxdb` サービスと `sample-net` Dockerネットワークを共有します。

##  InfluxDBへのメトリクスのエクスポートの設定

--8<-- "../include-ja/monitoring/docker-prerequisites.md"

### InfluxDBとGrafanaのデプロイ

DockerホストにInfluxDBとGrafanaをデプロイします：
1.  例えば、 `/tmp/influxdb-grafana`というワーキングディレクトリを作成し、それに移動します:

    ```
    mkdir /tmp/influxdb-grafana
    cd /tmp/influxdb-grafana
    ```
    
2.  InfluxDBデータソースを稼働させるためには、`collectd`の値タイプを含む`types.db`というファイルが必要です。
    
    このファイルは `collectd`が使用するデータセットの仕様を記述しています。このようなデータセットには、測定可能なタイプの定義が含まれます。このファイルについての詳しい情報は[こちら][link-typesdb]で確認できます。
    
    `collectd`プロジェクトのGitHubリポジトリから[ `types.db`ファイルをダウンロード][link-typesdb-file]して、それを作業ディレクトリに配置します。
    
3.  次のコマンドを実行して基本的なInfluxDB設定ファイルを取得します:

    ```
    docker run --rm influxdb influxd config > influxdb.conf
    ```
    
4.  `influxdb.conf`InfluxDB設定ファイル内の `[[collectd]]`セクションの `enabled`パラメータの値を `false`から `true`に変更して、`collectd` データソースを有効にします。

    他のパラメーターはそのままにしておきます。

    そのセクションは次のように表示されるはずです:

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
    
5.  次の内容を持つ `docker-compose.yaml`ファイルを作業ディレクトリに作成します:

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

    `volumes:`の設定に従って、InfluxDBは以下を使用します
    1.  データベースのストレージとして作業ディレクトリを使用します。
    2.  作業ディレクトリに位置する `influxdb.conf`設定ファイルを使用します。
    3.  測定可能な値のタイプを含む作業ディレクトリに位置する `types.db`ファイルを使用します。
    
6.  `docker-compose build`コマンドを実行してサービスをビルドします。

7.  `docker-compose up -d influxdb grafana`コマンドを実行してサービスを実行します。

8.  対応するInfluxDBデータソース用に`collectd`という名前のデータベースを作成します。次のコマンドを実行します:

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
    
この時点で、InfluxDBは`collectd`からのメトリクスを受け取るために稼働し、GrafanaはInfluxDBに格納されたデータを監視し視覚化する準備が整います。

### `collectd`の設定

InfluxDBにメトリクスをエクスポートするために `collectd`を設定します：
1. フィルタノードに接続します（例えば、SSHプロトコルを使用します）。あなたはrootまたは他のスーパーユーザー権限を持つアカウントとしてログインしていることを確認します。
2. 次の内容を持つ `/etc/collectd/collectd.conf.d/export-to-influxdb.conf`というファイルを作成します：

    ```
    LoadPlugin network
    
    <Plugin "network">
        Server "10.0.30.30" "25826"
    </Plugin>
    ```
    
    ここでは次のエンティティが設定されています:

    1.  メトリクスを送信するサーバー（`10.0.30.30`）
    2.  サーバーがリッスンするポート（`25826/UDP`）
    
3. 適切なコマンドを実行して `collectd`サービスを再起動します：

   --8<-- "../include-ja/monitoring/collectd-restart-2.16.md"

今ではInfluxDBはフィルタノードのすべてのメトリックスを受け取ります。興味のあるメトリクスを視覚化し[Grafanaで監視できます][doc-grafana]。