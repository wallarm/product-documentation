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

#   Grafanaでフィルターノードメトリクスを操作する

InfluxDBまたはGraphiteにメトリクスのエクスポートを設定した場合、[Grafana][link-grafana]を使用してメトリクスを可視化できます。

!!! info "いくつかの前提条件"
    この文書では、Grafanaを[InfluxDB][doc-network-plugin-influxdb]または[Graphite][doc-network-plugin-graphite]と一緒にデプロイしたことを前提としています。
    
    この文書では、`node.example.local`フィルターノードが処理するリクエストの数を示す[`wallarm_nginx/gauge-abnormal`][doc-gauge-abnormal]メトリクスを例にしています。
    
    しかし、どの[サポートされているメトリクス][doc-available-metrics]でもモニタリングすることができます。

ブラウザで`http://10.0.30.30:3000`にアクセスしてGrafanaのWebコンソールを開き、標準のユーザー名（`admin`）とパスワード（`admin`）を使用してコンソールにログインします。

Grafanaを使ってフィルターノードをモニタリングするには、以下の作業が必要です。
1.  データソースを接続します。
2.  データソースから必要なメトリクスを取得します。
3.  メトリックの視覚化を設定します。

以下のデータソースのいずれかを使用していると想定しています。
*   InfluxDB
*   Graphite

##  データソースの接続

### InfluxDB

データソースとしてInfluxDBサーバーを接続するには、以下の手順を行います：
1.  Grafanaコンソールのメインページから*データソースを追加*ボタンをクリックします。
2.  データソースタイプとして“InfluxDB”を選択します。
3.  必要なパラメータを入力します：
    *   名前：InfluxDB
    *   URL：`http://influxdb:8086`
    *   データベース：`collectd`
    *   ユーザー：`root`
    *   パスワード：`root`
4.  *保存 & テスト*ボタンをクリックします。

### Graphite

データソースとしてGraphiteサーバーを接続するには、以下の手順を行います：
1.  Grafanaコンソールのメインページから*データソースを追加*ボタンをクリックします。
2.  データソースタイプとして“Graphite”を選択します。
3.  必要なパラメータを入力します：
    *   名前：Graphite
    *   URL：`http://graphite:8080`.
    *   バージョン：ドロップダウンリストから利用可能な最新のバージョンを選択します。
4.  *保存 & テスト*ボタンをクリックします。

!!! info "データソースのステータス確認"
    データソースが正常に接続された場合、"データソースが作動しています"というメッセージが表示されるはずです。

### その後の操作

Grafanaがメトリクスをモニタリングできるようにするために、以下の操作を行います：
1.  コンソールの左上隅にある*Grafana*アイコンをクリックしてメインページに戻ります。
2.  *新しいダッシュボード*ボタンをクリックして新しいダッシュボードを作成します。次に、*クエリを追加*ボタンをクリックして、ダッシュボードにメトリクスをフェッチする[クエリを追加][anchor-query]します。

##  データソースから必要なメトリクスの取得

### InfluxDB

InfluxDBデータソースからメトリクスを取得するには、以下の手順を行います：
1.  *クエリ*ドロップダウンリストから新しく作成した“InfluxDB”データソースを選択します。
2.  InfluxDBへのクエリを設計します
    *   グラフィカルなクエリ設計ツールを使用するか、

        ![Graphical query design tool][img-influxdb-query-graphical]

    *   平文のクエリを手動で入力します（これを行うには、下のスクリーンショットでハイライト表示されている*テキスト編集を切り替え*ボタンをクリックします）。

        ![Plaintext query design tool][img-influxdb-query-plaintext]



`wallarm_nginx/gauge-abnormal`メトリクスを取得するためのクエリは以下の通りです：
```
SELECT value FROM curl_json_value WHERE (host = 'node.example.local' AND instance = 'wallarm_nginx' AND type = 'gauge' AND type_instance = 'abnormal')
```

### Graphite

Graphiteデータソースからメトリクスを取得するには、以下の手順を行います：

1.  *クエリ*ドロップダウンリストから新しく作成した“Graphite”データソースを選択します。
2.  *シリーズ*行の該当メトリックの要素に対して*メトリックを選択*ボタンをクリックして、必要なメトリックの要素を順番に選択します。

    `wallarm_nginx/gauge-abnormal` メトリックの要素は以下の通りです：

    1.  ホスト名、`write_graphite` プラグイン設定ファイルに設定されたもの。
   
        このプラグインでは、デフォルトで `_` 文字がデリミタとして機能するため、`node.example.local` ドメイン名はクエリ中で `node_example_local` と表現されます。
   
    2.  特定の値を提供する `collectd` プラグインの名前。このメトリックに対しては、プラグインは `curl_json` です。
    3.  プラグイン・インスタンスの名前。このメトリックに対しては、名前は `wallarm_nginx`です。
    4.  値のタイプ。このメトリックに対しては、タイプは `gauge` です。
    5.  値の名前。このメトリックに関しては、名前は `abnormal` です。

### その後の操作

クエリを作成した後、対応するメトリックの視覚化を設定します。

##  メトリクス視覚化の設定

*クエリ*タブから*視覚化*タブに切り替え、メトリックに対して望む視覚化を選択します。

`wallarm_nginx/gauge-abnormal`メトリックに対しては、“Gauge”視覚化を推奨します：
*   現在のメトリクス値を表示するには、*Calc: Last*オプションを選択します。
*   必要に応じて、しきい値やその他のパラメータを設定できます。

![Configure visualization][img-query-visualization]

### その後の操作

視覚化を設定した後、以下の手順を行います：
*   コンソールの左上隅にある*“←”*ボタンをクリックしてクエリの設定を完了します。
*   ダッシュボードに行われた変更を保存します。
*   Grafanaがメトリックのモニタリングに成功したことを確認し、確認します。

##  モニタリングの確認

データソースの1つを接続し、`wallarm_nginx/gauge-abnormal`メトリックのクエリと視覚化を設定した後、モニタリングの動作を確認します。
1.  自動的なメトリクス更新を5秒間隔で有効にします（Grafanaコンソールの右上隅のドロップダウンリストから値を選択します）。
2.  Grafanaダッシュボード上の現在のリクエスト数がフィルターノードの`wallarm-status`の出力と一致することを確認します：

    --8<-- "../include-ja/monitoring/wallarm-status-check-latest.md"
    
    ![Checking the attack counter][img-grafana-0-attacks]
    
3.  フィルターノードで保護されたアプリケーションに対してテスト攻撃を行います。これには、`curl`ユーティリティまたはブラウザでアプリケーションに悪意のあるリクエストを送信できます。

    --8<-- "../include-ja/monitoring/sample-malicious-request.md"
    
4.  リクエストカウンターが`wallarm-status`の出力とGrafanaダッシュボードの両方で増加したことを確認します：

    --8<-- "../include-ja/monitoring/wallarm-status-output-padded-latest.md"

    ![Checking the attack counter][img-grafana-16-attacks]

Grafanaダッシュボードは現在、`node.example.local`フィルターノードの`wallarm_nginx/gauge-abnormal`メトリックの値を表示しています。