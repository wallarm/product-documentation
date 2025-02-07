[link-collectd]:            https://collectd.org/

[av-bruteforce]:            ../../attacks-vulns-list.md#brute-force-attack
[doc-postanalitycs]:        ../installation-postanalytics-en.md

[link-collectd-naming]:     https://collectd.org/wiki/index.php/Naming_schema
[link-data-source]:         https://collectd.org/wiki/index.php/Data_source
[link-collectd-networking]: https://collectd.org/wiki/index.php/Networking_introduction
[link-influxdb]:            https://www.influxdata.com/products/influxdb-overview/
[link-grafana]:             https://grafana.com/
[link-graphite]:            https://github.com/graphite-project/graphite-web
[link-network-plugin]:      https://collectd.org/wiki/index.php/Plugin:Network
[link-write-plugins]:       https://collectd.org/wiki/index.php/Table_of_Plugins
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios]:              https://www.nagios.org/
[link-zabbix]:              https://www.zabbix.com/
[link-nagios-format]:       https://nagios-plugins.org/doc/guidelines.html#AEN200
[link-selinux]:             https://www.redhat.com/en/topics/linux/what-is-selinux

[doc-available-metrics]:    available-metrics.md
[doc-network-plugin]:       fetching-metrics.md#exporting-metrics-via-the-collectd-network-plugin
[doc-write-plugins]:        fetching-metrics.md#exporting-metrics-via-the-collectd-write-plugins
[doc-collectd-nagios]:      fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility
[doc-collectd-notices]:     fetching-metrics.md#sending-notifications-from-collectd

[doc-selinux]:  ../configure-selinux.md

# フィルタリングノードの監視

各フィルタリングノードにインストールされている[`collectd`][link-collectd]サービスで取得されたノード提供のメトリックを使用して、Wallarmフィルタリングノード（[NGINXとNative](../../installation/nginx-native-node-internals.md)）の状態を監視できます。本記事では、`collectd`サービスによって収集されたメトリックの取り扱い方法について説明します。`collectd`サービスはデータ転送のいくつかの方法を提供し、多くの監視システムのメトリックソースとして利用できるため、フィルタリングノードの状態を制御できます。

`collectd`メトリックに加えて、WallarmはPrometheus互換のメトリックフォーマット及び基本的なJSONメトリックも提供します。これらのフォーマットについては[別記事](../configure-statistics-service.md)をご参照ください。

## なぜ監視が必要なのか

Wallarmモジュールの障害または不安定な動作は、フィルタリングノードで保護されたアプリケーションへのユーザーリクエストに対して、完全または部分的なサービス拒否につながる可能性があります。

postanalyticsモジュールの障害または不安定な動作は、以下の機能へのアクセス不能につながる可能性があります：
* Wallarm Cloudへの攻撃データのアップロード。結果として、攻撃がWallarmポータルに表示されなくなります。
* 行動型攻撃の検出（[ブルートフォース攻撃][av-bruteforce]を参照）。
* 保護されたアプリケーションの構造に関する情報の取得。

postanalyticsモジュールが[別途インストールされている場合][doc-postanalitycs]でも、Wallarmモジュールとpostanalyticsモジュールの両方を監視できます。

!!! info "用語の定義"

    Wallarmモジュールとpostanalyticsモジュールの監視には同じツールと方法を使用するため、特段の記載がない限り、本ガイドでは両モジュールを“フィルタリングノード”と呼びます。

    フィルタリングノードの監視設定方法を記述したすべてのドキュメントは、以下の環境に適用できます：
    
    * 個別に展開されたWallarmモジュール、
    * 個別に展開されたpostanalyticsモジュール、
    * Wallarmモジュールとpostanalyticsモジュールが共同展開された環境。

## 前提条件

監視が機能するためには、次の条件が必要です：

* [Wallarm NGINXノード](../../installation/nginx-native-node-internals.md#nginx-node)の場合、NGINXはフィルタリングノードに統計情報を返す必要があります（`wallarm_status on`）。
* フィルトレーションモードが`monitoring`/`safe_blocking`/`block`[mode](../configure-wallarm-mode.md#available-filtration-modes)になっている必要があります。
  
デフォルトでは、このサービスは`http://127.0.0.8/wallarm-status`でアクセス可能です。アドレスは[変更済みの場合](../configure-statistics-service.md#changing-an-ip-address-andor-port-of-the-statistics-service)は異なる場合があります。

## メトリックフォーマット

### `collectd`メトリックフォーマット

`collectd`メトリック識別子は次のフォーマットになっています：

```
host/plugin[-plugin_instance]/type[-type_instance]
```

各項目の意味は以下の通りです：
* `host`: メトリックを取得したホストの完全修飾ドメイン名（FQDN）
* `plugin`: メトリックを取得するプラグインの名称
* `-plugin_instance`: プラグインのインスタンス（存在する場合）
* `type`: メトリック値の型。許容される型：
    * `counter`
    * `derive`
    * `gauge`
    
    値の型の詳細については[こちら][link-data-source]をご参照ください。
    
* `-type_instance`: 型のインスタンス（存在する場合）。インスタンスタイプは、メトリックを取得する対象の値に相当します。

メトリックフォーマットの完全な説明は[こちら][link-collectd-naming]でご確認いただけます。

### Wallarm固有の`collectd`メトリックフォーマット

フィルタリングノードは`collectd`を使用してWallarm固有のメトリックを収集します。

Wallarmモジュール付きNGINXのメトリックは次のフォーマットになっています：

```
host/curl_json-wallarm_nginx/type-type_instance
```

postanalyticsモジュールのメトリックは次のフォーマットになっています：

```
host/wallarm-tarantool/type-type_instance
```

!!! info "メトリック例"
    `node.example.local`ホスト上のフィルタリングノードの場合：
    
    * `node.example.local/curl_json-wallarm_nginx/gauge-abnormal`は処理されたリクエスト数のメトリックです；
    * `node.example.local/wallarm-tarantool/gauge-export_delay`は秒単位のTarantoolエクスポート遅延のメトリックです。
    
    監視可能なメトリックの完全な一覧は[こちら][doc-available-metrics]でご確認いただけます。

## メトリック取得方法

フィルタリングノードからメトリックを取得する方法はいくつかあります：
* `collectd`サービスから直接データをエクスポートする方法
    *   [`collectd`のNetworkプラグイン経由][doc-network-plugin]。
    
        この[プラグイン][link-network-plugin]により、`collectd`はフィルタリングノードから[`collectd`][link-collectd-networking]サーバまたは[InfluxDB][link-influxdb]データベースにメトリックをダウンロードできます。
        
        
        !!! info "InfluxDBについて"
            InfluxDBは、`collectd`やその他のデータソースからのメトリックの集約および可視化に利用でき、たとえば[Grafana][link-grafana]監視システムでInfluxDBに保存されたメトリックを可視化できます。
        
    *   [`collectd`のwriteプラグインのいずれかを介してエクスポートする方法][doc-write-plugins]。
  
        たとえば、`write_graphite`プラグインを使用して収集データを[Graphite][link-graphite]にエクスポートできます。
  
        
        !!! info "Graphiteについて"
            Graphiteは監視および可視化システムのデータソースとして利用でき、たとえば[Grafana][link-grafana]で使用できます。
        
  
    この方法は以下のフィルタリングノードの展開タイプに適用できます：
    
    * クラウド環境：Amazon AWS、Google Cloud；
    * NGINX/NGINX Plusプラットフォーム向けのLinux上。

* [`collectd-nagios`経由でエクスポートする方法][doc-collectd-nagios]。
  
    この[ユーティリティ][link-collectd-nagios]は`collectd`から指定されたメトリックの値を取得し、[Nagios互換フォーマット][link-nagios-format]で表示します。
  
    このユーティリティを用いることで、[Nagios][link-nagios]または[Zabbix][link-zabbix]監視システムにメトリックをエクスポートできます。
  
    この方法は、フィルタリングノードの展開方法に関係なく、すべてのWallarmフィルタリングノードでサポートされます。
  
* 特定の閾値に達した場合に[`collectd`から通知を送信する方法][doc-collectd-notices]。

    この方法もフィルタリングノードの展開方法に関係なく、すべてのWallarmフィルタリングノードでサポートされます。