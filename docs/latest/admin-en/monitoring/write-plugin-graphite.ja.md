[img-write-plugin-graphite]: ../../images/monitoring/write-plugin-graphite.png

[doc-grafana]: working-with-grafana.md

[link-docker-ce]: https://docs.docker.com/install/
[link-docker-compose]: https://docs.docker.com/compose/install/
[link-collectd-naming]: https://collectd.org/wiki/index.php/Naming_schema
[link-write-plugin]: https://collectd.org/documentation/manpages/collectd.conf.5.shtml#plugin_write_graphite

# `collectd`のWriteプラグインを介してGraphiteへのメトリクスのエクスポート

このドキュメントでは、`write_graphite`ライトプラグインを使用してGraphiteにメトリクスをエクスポートする例を説明します。

## 例のワークフロー

--8<-- "../include/monitoring/metric-example.ja.md"

![!Example workflow][img-write-plugin-graphite]

このドキュメントでは、次のデプロイメントスキームが使用されています。
*   Wallarmフィルターノードは、`10.0.30.5` IPアドレスと`node.example.local`完全修飾ドメイン名でアクセスできるホストにデプロイされています。

    フィルターノードの `collectd` に対する`write_graphite`プラグインは次のように構成されています。

      *   すべてのメトリクスが、`2003/TCP`ポートでリスニングしている`10.0.30.30`サーバーに送信される。
      *   いくつかのWallarm固有の`collectd`プラグインは、複数の[インスタンス][link-collectd-naming]をサポートしているため、 `write_graphite`プラグインには`SeparateInstances`パラメータが `true`に設定されています。`true`値は、プラグインが複数のインスタンスで動作できることを意味します。

    プラグインのオプションの完全なリストは[こちら][link-write-plugin]で利用可能です。
    
*   `graphite`および`grafana`サービスは、`10.0.30.30` IPアドレスの別のホスト上のDockerコンテナとしてデプロイされています。

    Graphiteを持つ`graphite`サービスは次のように構成されています。

      *   フィルターノードのメトリクスを送信するために、`collectd`が接続を開始する`2003/TCP`ポートで接続をリッスンします。
      *   Grafanaとの通信が行われる`8080/TCP`ポートで接続をリッスンします。
      *   サービスは`grafana`サービスと`sample-net` Dockerネットワークを共有しています。
      
    Grafanaを持つ`grafana`サービスは次のように構成されています。

      *   Grafanaウェブコンソールは`http://10.0.30.30:3000`で利用可能です。
      *   サービスは`graphite`サービスと`sample-net` Dockerネットワークを共有しています。

## Graphiteへのメトリクスのエクスポート設定

--8<-- "../include/monitoring/docker-prerequisites.ja.md"

### GraphiteとGrafanaのデプロイ

Dockerホスト上にGraphiteとGrafanaをデプロイします。
1.  次の内容の `docker-compose.yaml` ファイルを作成します。

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
    
2.  `docker-compose build` コマンドを実行してサービスをビルドします。

3.  `docker-compose up -d graphite grafana` コマンドを実行してサービスを実行します。

この時点で、Graphiteが実行されており、`collectd`からのメトリクスを受信する準備ができているはずです。また、GrafanaもGraphiteで格納されたデータを監視および可視化する準備ができています。

### `collectd`の設定

Graphiteにメトリクスをダウンロードするように `collectd` を設定します。
1.  フィルターノードに接続します（SSHプロトコルを使用してアクセスするなどして）。`root`または別のスーパーユーザー権限を持つアカウントでログインしていることを確認します。
2.  次の内容のファイル `/etc/collectd/collectd.conf.d/export-to-graphite.conf` を作成します。

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
    
    ここで次のエンティティが設定されています。
    
    1.  メトリクスが収集されるホスト名（`node.example.local`）。
    2.  メトリクスを送信するサーバー（`10.0.30.30`）。
    3.  サーバーポート（`2003`）およびプロトコル（`tcp`）。
    4.  データ転送ロジック：プラグインの1つのインスタンスのデータが別のインスタンスのデータと分離されています（`SeparateInstances true`）。
    
3.  適切なコマンドを実行して `collectd` サービスを再起動します。

    --8<-- "../include/monitoring/collectd-restart-2.16.ja.md"

これでGraphiteはフィルターノードのすべてのメトリクスを受信します。関心のあるメトリクスを視覚化し、[Grafanaでそれらを監視する][doc-grafana]ことができます。