[img-influxdb-query-graphical]:     ../../images/monitoring/grafana-influx-1.png
[img-influxdb-query-plaintext]:     ../../images/monitoring/grafana-influx-2.png
[img-query-visualization]:          ../../images/monitoring/grafana-query-visualization.png
[img-grafana-0-attacks]:            ../../images/monitoring/grafana-0-attacks.png
[img-grafana-16-attacks]:           ../../images/monitoring/grafana-16-attacks.png

[link-grafana]:                     https://grafana.com/

[doc-network-plugin-influxdb]:      network-plugin-influxdb.md
[doc-network-plugin-graphite]:      write-plugin-graphite.md
[doc-gauge-abnormal]:                available-metrics.md#number-of-requests
[doc-available-metrics]:            available-metrics.md

[anchor-query]:                     #fetching-the-required-metrics-from-the-data-source
[anchor-verify-monitoring]:         #verifying-monitoring

# Grafanaにおけるフィルターノードメトリクスの操作

InfluxDBまたはGraphiteでメトリクスのエクスポートを設定している場合、[Grafana][link-grafana]でメトリクスを可視化できます。

!!! info "いくつかの前提"
    本ドキュメントは、[InfluxDB][doc-network-plugin-influxdb]または[Graphite][doc-network-plugin-graphite]と併設してGrafanaをデプロイしていることを前提としています。
    
    `node.example.local`フィルターノードで処理されたリクエスト数を示す[`curl_json-wallarm_nginx/gauge-abnormal`][doc-gauge-abnormal]メトリクスを例として使用しています。
    
    ただし、任意の[対応メトリクス][doc-available-metrics]を監視することも可能です。

ブラウザで`http://10.0.30.30:3000`にアクセスしてGrafanaのWebコンソールを開き、標準のユーザー名（`admin`）およびパスワード（`admin`）でログインしてください。

Grafanaでフィルターノードを監視するためには、以下の手順を実施する必要があります。
1.  データソースに接続します。
2.  データソースから必要なメトリクスを取得します。
3.  メトリクスの可視化を設定します。

以下のいずれかのデータソースを使用しているものとします:
*   InfluxDB
*   Graphite

## データソースへの接続

### InfluxDB

InfluxDBサーバーをデータソースとして接続するには、以下の手順に従ってください:
1.  Grafanaコンソールのメインページで、*Add data source*ボタンをクリックします。
2.  データソースタイプとして「InfluxDB」を選択します。
3.  必要なパラメーターを入力します:
    *   Name: InfluxDB
    *   URL: `http://influxdb:8086`
    *   Database: `collectd`
    *   User: `root`
    *   Password: `root`
4.  *Save & Test*ボタンをクリックします。

### Graphite

Graphiteサーバーをデータソースとして接続するには、以下の手順に従ってください:
1.  Grafanaコンソールのメインページで、*Add data source*ボタンをクリックします。
2.  データソースタイプとして「Graphite」を選択します。
3.  必要なパラメーターを入力します:
    *   Name: Graphite
    *   URL: `http://graphite:8080`
    *   Version: ドロップダウンリストから最新のバージョンを選択します。
4.  *Save & Test*ボタンをクリックします。

!!! info "データソースのステータス確認"
    データソースが正常に接続されている場合、”Data source is working”のメッセージが表示されます。

### さらなる操作

Grafanaでメトリクスの監視を有効にするため、以下の操作を実施してください:
1.  コンソール左上の*Grafana*アイコンをクリックしてメインページに戻ります。
2.  *New Dashboard*ボタンをクリックして新しいダッシュボードを作成します。続いて、*Add Query*ボタンをクリックし、[クエリの追加][anchor-query]によりダッシュボードにメトリクスを取得するクエリを追加します。

## データソースから必要なメトリクスの取得

### InfluxDB

InfluxDBデータソースからメトリクスを取得するには、以下の手順に従ってください:
1.  *Query*ドロップダウンリストから新たに作成した「InfluxDB」データソースを選択します。
2.  InfluxDBへのクエリを設計します。
    *   グラフィカルクエリデザインツールを使用する方法

        ![Graphical query design tool][img-influxdb-query-graphical]

    *   または、プレーンテキストでクエリを手動で入力する方法（下記のスクリーンショットでハイライトされた*Toggle text edit*ボタンをクリックします）。

        ![Plaintext query design tool][img-influxdb-query-plaintext]

`curl_json-wallarm_nginx/gauge-abnormal`メトリクスを取得するためのクエリは以下の通りです:
```
SELECT value FROM curl_json_value WHERE (host = 'node.example.local' AND instance = 'wallarm_nginx' AND type = 'gauge' AND type_instance = 'abnormal')    
```

### Graphite

Graphiteデータソースからメトリクスを取得するには、以下の手順に従ってください:

1.  *Query*ドロップダウンリストから新たに作成した「Graphite」データソースを選択します。
2.  *Series*行で対象のメトリクス要素に対応する*select metric*ボタンをクリックし、必要なメトリクスの要素を順次選択します。

    `curl_json-wallarm_nginx/gauge-abnormal`メトリクスの要素は以下の通りです:

    1.  ホスト名。これは`write_graphite`プラグイン設定ファイルで設定されたものです。
   
        このプラグインでは`_`文字がデリミタとして機能するため、`node.example.local`のドメイン名はクエリ内で`node_example_local`として表されます。
   
    2.  特定の値を提供する`collectd`プラグインの名称。このメトリクスではプラグインは`curl_json`です。
    3.  プラグインインスタンスの名称。このメトリクスでは名称は`wallarm_nginx`です。
    4.  値のタイプ。このメトリクスではタイプは`gauge`です。
    5.  値の名称。このメトリクスでは名称は`abnormal`です。

### さらなる操作

クエリ作成後、該当メトリクスの可視化を設定してください。

## メトリクスの可視化設定

*Query*タブから*Visualization*タブに切り替え、目的のメトリクスに適した可視化を選択します。

`curl_json-wallarm_nginx/gauge-abnormal`メトリクスについては、「Gauge」可視化の使用を推奨します:
*   現在のメトリクス値を表示するために*Calc: Last*オプションを選択してください。
*   必要に応じ、しきい値その他のパラメーターを設定することが可能です。

![Configure visualization][img-query-visualization]

### さらなる操作

可視化の設定完了後、以下の操作を実施してください:
*   コンソール左上の*“←”*ボタンをクリックしてクエリの設定を完了します。  
*   ダッシュボードに対して行った変更を保存します。
*   Grafanaが該当メトリクスを正常に監視していることを確認してください。

## 監視の検証

データソースの接続、`curl_json-wallarm_nginx/gauge-abnormal`メトリクスのクエリおよび可視化の設定が完了したら、監視動作を確認してください:
1.  Grafanaコンソール右上のドロップダウンリストから5秒間隔の自動メトリクス更新を有効にします。
2.  Grafanaダッシュボード上の現在のリクエスト数がフィルターノード上での`wallarm-status`出力と一致していることを確認します:

    --8<-- "../include/monitoring/wallarm-status-check-latest.md"
    
    ![Checking the attack counter][img-grafana-0-attacks]
    
3.  フィルターノードで保護されたアプリケーションに対してテスト攻撃を実施します。これを行うには、`curl`ユーティリティまたはブラウザを使用してアプリケーションに悪意あるリクエストを送信してください。

    --8<-- "../include/monitoring/sample-malicious-request.md"
    
4.  `wallarm-status`の出力とGrafanaダッシュボードの双方でリクエストカウンターが増加していることを確認してください:

    --8<-- "../include/monitoring/wallarm-status-output-padded-latest.md"

    ![Checking the attack counter][img-grafana-16-attacks]

Grafanaダッシュボードには、`node.example.local`フィルターノードの`curl_json-wallarm_nginx/gauge-abnormal`メトリクスの値が表示されます。