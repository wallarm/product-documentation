[img-write-plugin-graphite]:    ../../images/monitoring/write-plugin-graphite.png

[doc-grafana]:                  working-with-grafana.md

[link-docker-ce]:               https://docs.docker.com/install/
[link-docker-compose]:          https://docs.docker.com/compose/install/
[link-collectd-naming]:         https://collectd.org/wiki/index.php/Naming_schema
[link-write-plugin]:            https://www.collectd.org/documentation/manpages/collectd.conf.html#plugin_write_graphite

#　`collectd` Write Pluginを利用したGraphiteへのメトリクスエクスポート

本ドキュメントでは、`write_graphite`プラグインを使用してメトリクスをGraphiteへエクスポートする例を示します。

## 　例のワークフロー

--8<-- "../include/monitoring/metric-example.md"

![例のワークフロー][img-write-plugin-graphite]

本ドキュメントで使用するデプロイメントスキームは以下の通りです:
*　Wallarmフィルタノードは、`10.0.30.5`のIPアドレスおよび`node.example.local`のFQDNでアクセス可能なホスト上にデプロイされます。

　フィルタノード上の`collectd`用`write_graphite`プラグインは、以下のように設定されています:

      *　すべてのメトリクスは、`10.0.30.30`のサーバ上の`2003/TCP`ポートでリスニングしている先へ送信されます。
      *　一部のWallarm固有`collectd`プラグインは複数の[インスタンス][link-collectd-naming]をサポートしますので、`write_graphite`プラグインには`SeparateInstances`パラメータが`true`に設定されています。`true`は、プラグインが複数のインスタンスと連携できることを意味します。
    
　プラグインオプションの完全なリストは[こちら][link-write-plugin]をご参照ください。
    
*　`graphite`および`grafana`サービスは、`10.0.30.30`のIPアドレスを持つ別ホスト上でDockerコンテナとしてデプロイされます。
    
　Graphiteを含む`graphite`サービスは、以下のように設定されています:
  
      *　`collectd`がフィルタノードのメトリクスを送信するため、`2003/TCP`ポートで接続要求を受信します。
      *　Grafanaとの通信は`8080/TCP`ポートで行われます。
      *　このサービスは、`grafana`サービスと`sample-net` Dockerネットワークを共有します。
    
　Grafanaを含む`grafana`サービスは、以下のように設定されています:
  
      *　GrafanaのWebコンソールは`http://10.0.30.30:3000`で利用可能です。
      *　このサービスは、`graphite`サービスと`sample-net` Dockerネットワークを共有します。

## 　Graphiteへのメトリクスエクスポートの設定

--8<-- "../include/monitoring/docker-prerequisites.md"

### 　GraphiteとGrafanaのデプロイ

DockerホストにGraphiteとGrafanaをデプロイします:
1.　以下の内容で`docker-compose.yaml`ファイルを作成します:
    
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
    
2.　`docker-compose build`コマンドを実行してサービスをビルドします。
    
3.　`docker-compose up -d graphite grafana`コマンドを実行してサービスを起動します。
    
この時点で、Graphiteは`collectd`からのメトリクス受信の準備が整い、GrafanaはGraphiteに保存されたデータの監視および可視化が可能です。

### 　`collectd`の設定

`collectd`を設定してメトリクスをGraphiteへ送信します:

=== "Docker image, cloud image, all-in-one installer"
    1.　SSHプロトコル等を用いてフィルタノードに接続します。`root`または他のスーパーユーザ権限を持つアカウントでログインしていることをご確認ください。
    1.　`/opt/wallarm/etc/collectd/wallarm-collectd.conf`ファイルに以下の設定を追加します:

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
      
        以下の設定項目が構成されています:
        
        1.　メトリクスを収集するホスト名(`node.example.local`)。
        2.　メトリクス送信先のサーバ(`10.0.30.30`)。
        3.　サーバポート(`2003`)およびプロトコル(`tcp`)。
        4.　データ転送のロジック：プラグインの各インスタンスのデータを分離(`SeparateInstances true`)します。
    1.　次のコマンドを実行して`wallarm`サービスを再起動します:

        ```bash
        sudo systemctl restart wallarm
        ```
=== "Other installations"
    1.　SSHプロトコル等を用いてフィルタノードに接続します。`root`または他のスーパーユーザ権限を持つアカウントでログインしていることをご確認ください。
    1.　`/etc/collectd/collectd.conf.d/export-to-graphite.conf`というファイルを、以下の内容で作成します:

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
      
        以下の設定項目が構成されています:
        
        1.　メトリクスを収集するホスト名(`node.example.local`)。
        2.　メトリクス送信先のサーバ(`10.0.30.30`)。
        3.　サーバポート(`2003`)およびプロトコル(`tcp`)。
        4.　データ転送のロジック：プラグインの各インスタンスのデータを分離(`SeparateInstances true`)します。
    1.　適切なコマンドを実行して`collectd`サービスを再起動します:

        --8<-- "../include/monitoring/collectd-restart-2.16.md"

これで、Graphiteはフィルタノードのすべてのメトリクスを受信します。関心のあるメトリクスを可視化し、[with Grafana][doc-grafana]で監視してください。