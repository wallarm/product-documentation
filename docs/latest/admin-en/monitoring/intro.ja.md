[link-collectd]:            https://collectd.org/

[av-bruteforce]:            ../../attacks-vulns-list.md#bruteforce-attack
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

# フィルタリングノード監視の概要

フィルタリングノードの状態を、ノードが提供するメトリクスを使用して監視することができます。この記事では、すべてのWallarmフィルタリングノードにインストールされている [`collectd`][link-collectd] サービスによって収集されたメトリクスを操作する方法について説明します。`collectd` サービスは、データ転送方法をいくつか提供し、多くの監視システムのメトリクスソースとして機能し、フィルタリングノードの状態を制御することができます。

`collectd`メトリクスに加えて、WallarmはPrometheusと基本的なJSONメトリクスと互換性のあるメトリクス形式を提供しています。これらの形式については、[別の記事](../configure-statistics-service.md)で説明しています。

!!! warning "CDNノード上の監視サービスのサポート"
    なお、`collectd`サービスは、[Wallarm CDNノード](../../installation/cdn-node.md)ではサポートされていません。

##  監視の必要性

Wallarmモジュールの障害や不安定な動作は、フィルタリングノードで保護されたアプリケーションへのユーザーリクエストの完全または部分的なサービス拒否につながる可能性があります。

postanalyticsモジュールの障害や不安定な動作は、以下の機能が利用できなくなる可能性があります。
*   攻撃データをWallarmクラウドにアップロードする。その結果、Wallarmポータルに攻撃が表示されなくなります。
*   行動攻撃（[ブルートフォース攻撃][av-bruteforce]など）の検出。
*   保護対象アプリケーションの構造に関する情報の取得。

ポストアナリティクスモジュールが[別途インストールされている][doc-postanalitycs]場合でも、Wallarmモジュールとポストアナリティクスモジュールの両方を監視することができます。

ณ ตามที่กำหนด "用語合意"

    Wallarmモジュールとpostanalyticsモジュールの監視には、同じツールと方法が使用されているため、このガイドでは特に断りがない限り、両方のモジュールを「フィルタリングノード」と呼んでいます。
    
    フィルタリングノードの監視を設定する方法を説明するすべてのドキュメントは、

    *   別々にデプロイされたWallarmモジュール、
    *   別々にデプロイされたポストアナリティクスモジュール、および
    *   共同してデプロイされたWallarmとポストアナリティクスモジュール。

に適用されます。

##  監視の前提条件

監視が機能するためには、次の条件が必要です。
* NGINXがフィルタリングノードに統計情報を返す（`wallarm_status on`）。
* フィルタリングモードが `monitoring`/`safe_blocking`/`block` [モード](../configure-wallarm-mode.md#available-filtration-modes) になっています。

デフォルトでは、このサービスは `http://127.0.0.8/wallarm-status` でアクセス可能です。

統計サービスを非標準アドレスで利用可能に[設定](../configure-statistics-service.md#changing-an-ip-address-of-the-statistics-service)する場合は :

1. `/etc/wallarm/node.yaml` ファイルに、新しいアドレス値を持つ `status_endpoint` パラメータを追加します。例えば :

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. オペレーティングシステムのディストリビューションの種類に応じてこのファイルの場所は、`collectd`設定ファイルの `URL`パラメータが正しく設定されていることを確認します。

    --8<-- "../include-ja/monitoring/collectd-config-location.md"

Tarantool用の非標準のIPアドレスかポートが使用されている場合、そのTarantoolの設定ファイルを適切に修正する必要があります。このファイルの場所は、オペレーティングシステムのディストリビューションのタイプによって異なります。

--8<-- "../include-ja/monitoring/tarantool-config-location.md"

フィルタリングノードのホストにSELinuxがインストールされている場合は、SELinuxが[設定または無効化][doc-selinux]されていることを確認してください。簡単のため、このドキュメントではSELinuxが無効化されていることを前提としています。

##  メトリクスの表示方法

### `collectd` メトリクスの見た目

`collectd`メトリクスの識別子は次の形式で表されます。

```
host/plugin[-plugin_instance]/type[-type_instance]
```

ここで
*   `host`: メトリクスが取得されるホストの完全修飾ドメイン名（FQDN）
*   `plugin`: メトリクスが取得されるプラグインの名前
*   `-plugin_instance`: ある場合、プラグインのインスタンス
*   `type`: メトリクス値のタイプ。許可されるタイプは
    *   `counter`
    *   `derive`
    *   `gauge`
    
    値タイプの詳しい情報は[こちら][link-data-source]にあります。

*   `-type_instance`: ある場合、タイプのインスタンス。インスタンスとしてタイプは、メトリクスを取得したい値に相当します。

メトリクスの形式の詳細な説明は[こちら][link-collectd-naming]にあります。

### Wallarm固有の `collectd` メトリクスの見た目

フィルタリングノードは `collectd` を使用して、Wallarm固有のメトリクスを収集します。

Wallarmモジュールを含むNGINXのメトリックスは、次の形式で表されます。

```
host/curl_json-wallarm_nginx/type-type_instance
```

postanalyticsモジュールのメトリクスは次の形式で表されます。

```
host/wallarm-tarantool/type-type_instance
```

！！！ info "メトリック例"
    `node.example.local` ホスト上のフィルタリングノードについて：

    * `node.example.local/curl_json-wallarm_nginx/gauge-abnormal` は、処理されたリクエストの数を表すメトリックです。
    * `node.example.local/wallarm-tarantool/gauge-export_delay` は、Tarantoolのエクスポート遅延を秒単位で表すメトリックです。
    
    監視できるメトリックの完全なリストは[こちら][doc-available-metrics]です。## メトリックの取得方法

フィルターノードからのメトリックをいくつかの方法で収集できます：
*   `collectd` サービスからデータを直接エクスポートする
    *   [`collectd` の Network プラグインを介して][doc-network-plugin]。
    
        この [プラグイン][link-network-plugin] は `collectd` がフィルターノードからメトリックを [`collectd`][link-collectd-networking] サーバまたは [InfluxDB][link-influxdb] データベースにダウンロードできるようにします。
        
        
        !!! info "InfluxDB"
            InfluxDB は、`collectd` および他のデータソースからのメトリックの集約と、後続の可視化（例：InfluxDB に格納されているメトリックを可視化する [Grafana][link-grafana] 監視システム）に使用できます。
        
    *   [`collectd` の write プラグインのいずれかを介して][doc-write-plugins]。
  
        例えば、`write_graphite` プラグインを使用して、収集されたデータを [Graphite][link-graphite] にエクスポートできます。
  
        
        !!! info "Graphite"
            Graphite は、監視および可視化システムのデータソースとして使用できます（例：[Grafana][link-grafana]）。
        
  
    この方法は、以下のフィルターノード展開タイプに適しています：

    *   クラウド内：Amazon AWS、Google Cloud;
    *   Linux 上の NGINX/NGINX Plus プラットフォーム。
  
*   [`collectd-nagios` を介してデータをエクスポートする][doc-collectd-nagios]。
  
    この [ユーティリティ][link-collectd-nagios] は、`collectd` から指定されたメトリックの値を受け取り、[Nagios 互換フォーマット][link-nagios-format] で表示します。
  
    このユーティリティを使用して、メトリックを [Nagios][link-nagios] または [Zabbix][link-zabbix] 監視システムにエクスポートできます。
  
    この方法は、どのようにデプロイされているかに関係なく、すべての Wallarm フィルターノードでサポートされています。
  
*   メトリックが所定のしきい値を達成したときに `collectd` から通知を送信する[ことにより][doc-collectd-notices]。

    この方法は、どのようにデプロイされているかに関係なく、すべての Wallarm フィルターノードでサポートされています。