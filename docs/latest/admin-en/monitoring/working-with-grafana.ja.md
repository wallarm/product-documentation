[img-influxdb-query-graphical]: ../../images/monitoring/grafana-influx-1.png
[img-influxdb-query-plaintext]: ../../images/monitoring/grafana-influx-2.png
[img-query-visualization]: ../../images/monitoring/grafana-query-visualization.png
[img-grafana-0-attacks]: ../../images/monitoring/grafana-0-attacks.png
[img-grafana-16-attacks]: ../../images/monitoring/grafana-16-attacks.png

[link-grafana]: https://grafana.com/

[doc-network-plugin-influxdb]: network-plugin-influxdb.md
[doc-network-plugin-graphite]: write-plugin-graphite.md
[doc-gauge-abnormal]: available-metrics.md#number-of-requests
[doc-available-metrics]: available-metrics.md

[anchor-query]: #fetching-the-required-metrics-from-the-data-source
[anchor-verify-monitoring]: #verifying-monitoring

# Grafanaでフィルタノードメトリクスを利用する

InfluxDBまたはGraphiteでメトリクスのエクスポートを設定している場合、[Grafana][link-grafana]でメトリクスを可視化できます。

!!! info "いくつかの仮定"
    この文書では、Grafanaが[InfluxDB][doc-network-plugin-influxdb]または[Graphite][doc-network-plugin-graphite]と同じ場所にデプロイされていることを前提としています。
    
    例として、`node.example.local` フィルタノードで処理されたリクエストの数を示す [`curl_json-wallarm_nginx/gauge-abnormal`][doc-gauge-abnormal] メトリックが使用されています。
    
    ただし、[サポートされるメトリック][doc-available-metrics] のいずれかを監視できます。

ブラウザで `http://10.0.30.30:3000` にアクセスしてGrafana Webコンソールを開き、標準のユーザ名（`admin`）とパスワード（`admin`）を使ってコンソールにログインします。

Grafanaを使ってフィルタノードを監視するには、以下の操作が必要です。
1. データソースを接続する。
2. データソースから必要なメトリクスを取得する。
3. メトリックの可視化を設定する。

InfluxDBまたはGraphiteの以下のデータソースを使用していることが前提です。
* InfluxDB
* Graphite

## データソースの接続

### InfluxDB

データソースとしてInfluxDBサーバーを接続するには、次の手順を実行します。
1. Grafanaコンソールのメインページで、*データソースの追加* ボタンをクリックします。
2. データソースタイプとして “InfluxDB” を選択します。
3. 必要なパラメータを入力します：
    * 名前：InfluxDB
    * URL：`http://influxdb:8086`
    * データベース：`collectd`
    * ユーザー：`root`
    * パスワード：`root`
4. *Save & Test* ボタンをクリックします。



### Graphite

データソースとしてGraphiteサーバーを接続するには、次の手順を実行します。
1. Grafanaコンソールのメインページで、*データソースの追加* ボタンをクリックします。
2. データソースタイプとして “Graphite” を選択します。
3. 必要なパラメータを入力します：
    * 名前：Graphite
    * URL：`http://graphite:8080`。
    * バージョン：ドロップダウンリストから利用可能な最新バージョンを選択します。
4. *Save & Test* ボタンをクリックします。

!!! info "データソースのステータス確認"
    データソースが正常に接続されている場合、「データソースが動作しています」というメッセージが表示されます。

### さらなる操作

Grafanaがメトリックを監視できるようにするために、以下の操作を実行します。
1. コンソールの左上にある *Grafana* アイコンをクリックしてメインページに戻ります。
2. *ノードashboard* ボタンをクリックして新しいダッシュボードを作成します。次に、*クエリを追加* ボタンをクリックして、ダッシュボードにメトリックを取得する[クエリを追加][anchor-query]します。

## データソースから必要なメトリクスを取得する

### InfluxDB

InfluxDB データソースからメトリックを取得するには、次のことを行います。
1. *クエリ* ドロップダウンリストから、新しく作成した “InfluxDB” データソースを選択します。
2. InfluxDBにクエリを設計します。
    * グラフィカルなクエリ設計ツールを使用して、

        ![!Graphical query design tool][img-influxdb-query-graphical]

    * 下のスクリーンショットにハイライトされている*テキスト編集の切り替え* ボタンをクリックして、プレーンテキストでクエリを手動で入力します。

        ![!Plaintext query design tool][img-influxdb-query-plaintext]

`curl_json-wallarm_nginx/gauge-abnormal`メトリックを取得するクエリは次のとおりです。
```
SELECT value FROM curl_json_value WHERE (host = 'node.example.local' AND instance = 'wallarm_nginx' AND type = 'gauge' AND type_instance = 'abnormal')    
```

### Graphite

Graphiteデータソースからメトリックを取得するには、次の手順を実行します。

1. *クエリ* ドロップダウンリストから、新しく作成した “Graphite” データソースを選択します。
2. *シリーズ* でリクエスト要素の *select metric* ボタンをクリックして、必要なメトリックの要素を順番に選択します。

    `curl_json-wallarm_nginx/gauge-abnormal`メトリックの要素は、以下のとおりです：

    1. `write_graphite`プラグインの設定ファイルに設定されたホスト名。
       
        このプラグインでは、デフォルトで `_` 文字を区切りとして使用するため、`node.example.local` ドメイン名はクエリ内で `node_example_local` として表されます。
       
    2. 特定の値を提供する `collectd` プラグインの名前。このメトリックの場合、プラグインは `curl_json` です。
    3. プラグインインスタンスの名前。このメトリックの名前は `wallarm_nginx` です。
    4. 値のタイプ。このメトリックのタイプは `gauge` です。
    5. 値の名前。このメトリックの名前は `abnormal` です。

### さらなる操作

クエリ作成後、対応するメトリックの可視化を設定します。

## メトリックの可視化を設定する

*Query* タブから *Visualization* タブに切り替え、メトリックに適した可視化を選択します。

`curl_json-wallarm_nginx/gauge-abnormal`メトリックでは、「Gauge」可視化を使用することをお勧めします：
* 現在のメトリック値を表示するには、*Calc: Last*オプションを選択します。
* 必要に応じて、しきい値やその他のパラメータを設定します。

![!Configure visualization][img-query-visualization]

### さらなる操作

可視化を設定した後、以下の手順を実行します。
* コンソールの左上にある *“←”* ボタンをクリックしてクエリ設定を完了します。
* ダッシュボードに行われた変更を保存します。
* Grafanaが正常にメトリックを監視していることを確認し、確認します。

## 監視の確認

データソースの1つを接続し、`curl_json-wallarm_nginx/gauge-abnormal`メトリックのクエリと可視化を設定した後、監視操作を確認します。
1. Grafanaコンソールの右上にあるドロップダウンリストから値を選択し、5秒ごとの自動メトリック更新を有効にします。
2. Grafanaダッシュボードの現在のリクエスト数が、フィルタノード上の `wallarm-status` の出力と一致していることを確認します。

    --8<-- "../include/monitoring/wallarm-status-check-latest.ja.md"
    
    ![!Checking the attack counter][img-grafana-0-attacks]
    
3. フィルタノードで保護されたアプリケーションにテストアタックを実行します。これを行うには、`curl`ユーティリティまたはブラウザを使用してアプリケーションに悪意のあるリクエストを送信します。

    --8<-- "../include/monitoring/sample-malicious-request.ja.md"
    
4. リクエストカウンターが `wallarm-status` の出力とGrafanaダッシュボードの両方で増加していることを確認します：

    -8<-- "../include/monitoring/wallarm-status-output-padded-latest.ja.md"

    ![!Checking the attack counter][img-grafana-16-attacks]

これでGrafanaダッシュボードに `node.example.local` フィルタノード用の `curl_json-wallarm_nginx/gauge-abnormal` メトリック値が表示されます。