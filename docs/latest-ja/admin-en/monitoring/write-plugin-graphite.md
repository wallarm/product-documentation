[img-write-plugin-graphite]:    ../../images/monitoring/write-plugin-graphite.png

[doc-grafana]:                  working-with-grafana.md

[link-docker-ce]:               https://docs.docker.com/install/
[link-docker-compose]:          https://docs.docker.com/compose/install/
[link-collectd-naming]:         https://collectd.org/wiki/index.php/Naming_schema
[link-write-plugin]:            https://www.collectd.org/documentation/manpages/collectd.conf.html#plugin_write_graphite

#   `collectd` Write Pluginを経由してGraphiteにメトリクスをエクスポートする

このドキュメントは、`write_graphite`ライトプラグインを使用してGraphiteにメトリクスをエクスポートする例を提供します。

##  サンプルワークフロー

--8<-- "../include-ja/monitoring/metric-example.md"

![サンプルワークフロー][img-write-plugin-graphite]

このドキュメントでは、以下のデプロイメントスキームが使用されます:
*   Wallarmフィルターノードは、`10.0.30.5` IPアドレスと`node.example.local`完全修飾ドメイン名を介してアクセス可能なホストにデプロイされています。

    フィルターノードの`collectd`に対する`write_graphite`プラグインは次のように設定されています：

      *   すべてのメトリクスは、`2003/TCP`ポートでリッスンしている`10.0.30.30`サーバーに送信されます。
      *   特定のWallarm固有の`collectd`プラグインは複数の[インスタンス][link-collectd-naming]をサポートしているため、`write_graphite`プラグインには`SeparateInstances`パラメーターが`true`に設定されています。`true`値は、プラグインが複数のインスタンスで動作できることを意味します。
    
    プラグインのオプションの完全なリストは[こちら][link-write-plugin]で利用できます。
    
*   `graphite`サービスと`grafana`サービスは、`10.0.30.30` IPアドレスの別のホスト上でDockerコンテナとしてデプロイされています。
    
    Graphite付きの`graphite`サービスは次のように構成されています：

      *   `collectd`がフィルターノードのメトリクスを送信する`2003/TCP`ポートへの接続をリッスンします。
      *   Grafanaとの通信が行われる`8080/TCP`ポートで接続をリッスンします。
      *   このサービスは`grafana`サービスと`sample-net` Dockerネットワークを共有しています。

    Grafana付きの`grafana`サービスは次のように構成されています：

      *   Grafanaウェブコンソールは`http://10.0.30.30:3000`で利用できます。
      *   このサービスは`graphite`サービスと`sample-net` Dockerネットワークを共有しています。

##  Graphiteへのメトリクスエクスポートの設定

--8<-- "../include-ja/monitoring/docker-prerequisites.md"

### GraphiteとGrafanaのデプロイ

DockerホストにGraphiteとGrafanaをデプロイします：
1.  次の内容を持つ`docker-compose.yaml`ファイルを作成します：
    
    ```
    version: "3"
    
    services:
      grafana:
        image: grafana/grafana
        container_name: grafana
        restart: always
        ports:
          - 3000:3000
        networks:
          - sample-net
    
      graphite:
        image: graphiteapp/graphite-statsd
        container_name: graphite
        restart: always
        ports:
          - 8080:8080
          - 2003:2003
        networks:
          - sample-net
    
    networks:
      sample-net:
    ```
    
2.  `docker-compose build`コマンドを実行してサービスを構築します。
    
3.  `docker-compose up -d graphite grafana`コマンドを実行してサービスを起動します。
    
この時点で、Graphiteは実行中であり、`collectd`からのメトリクスを受け取る準備ができているはずです。また、GrafanaもGraphiteに保存されているデータを監視し、可視化する準備ができています。

### `collectd`の設定

Graphiteにメトリクスをダウンロードするために`collectd`を設定します：
1.  フィルターノードに接続します（たとえば、SSHプロトコルを使用して）。`root`または他のスーパーユーザー権限を持つアカウントとしてログインしていることを確認します。
2.  次の内容を持つ名前`/etc/collectd/collectd.conf.d/export-to-graphite.conf`のファイルを作成します：
    
    ```
    LoadPlugin write_graphite
    
    <Plugin write_graphite>
     <Node "node.example.local">
       Host "10.0.30.30"
       Port "2003"
       Protocol "tcp"
       SeparateInstances true
     </Node>
    </Plugin>
    ```
    
    以下のエンティティがここで構成されています：
    
    1.  メトリクスが収集されるホスト名（`node.example.local`）。
    2.  メトリクスを送信するべきサーバー（`10.0.30.30`）。
    3.  サーバーポート（`2003`）及びプロトコル（`tcp`）。
    4.  データ転送のロジック：プラグインのインスタンスのデータが別のインスタンスのデータから分離されます（`SeparateInstances true`）。
    
3.  適切なコマンドを実行して`collectd`サービスを再起動します：

    --8<-- "../include-ja/monitoring/collectd-restart-2.16.md"

これで、Graphiteはフィルターノードのすべてのメトリクスを受け取るようになりました。興味のあるメトリクスを視覚化し、[Grafanaでモニタリングする][doc-grafana]ことができます。