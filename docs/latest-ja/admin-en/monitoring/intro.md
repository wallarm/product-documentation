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

# フィルタノード監視の導入

フィルタノードの状態は、ノード提供のメトリクスを使用して監視できます。本記事では、すべてのWallarmフィルタノードにインストールされている [`collectd`][link-collectd] サービスによって収集されたメトリクスの操作方法について説明します。`collectd` サービスは、データの転送方法を幾つか提供し、多くの監視システムのメトリクスソースとして機能することができ、フィルタノードの状態を制御することができます。

`collectd`メトリクスに加えて、WallarmはPrometheusと基本的なJSONメトリクスと互換性のあるメトリクス形式を提供します。これらの形式については、[別の記事](../configure-statistics-service.md)で読むことができます。

!!! warning "CDNノード上の監視サービスのサポート"
    [Wallarm CDN ノード](../../installation/cdn-node.md)では `collectd` サービスはサポートされていないことに注意してください。

##  監視の必要性

Wallarmモジュールの故障または不安定な作業は、フィルタノードに保護されたアプリケーションへのユーザーリクエストの全面的または部分的なサービス拒否を引き起こすことがあります。

postanalyticsモジュールの故障または不安定な作業により、以下の機能が利用できなくなることがあります：
*   攻撃データをWallarmクラウドにアップロードします。その結果、攻撃はWallarmポータルに表示されません。
*   行動攻撃の検出（[ブルートフォース攻撃][av-bruteforce]参照）。
*   保護されたアプリケーションの構造に関する情報の取得。

Wallarmモジュールとpostanalyticsモジュールの両方を監視できます、後者が[別途インストールされている][doc-postanalitycs]場合でも。

!!! info "使用語の合意"

    Wallarmモジュールとpostanalyticsモジュールの監視には同じツールと方法が使用されるので、このガイド全体で両方のモジュールは「フィルタノード」として参照されます、特別なことが述べられていない限り。

    フィルタノードの監視設定方法を説明するすべてのドキュメントは次に適用されます：

    *   別々にデプロイされたWallarmモジュール、
    *   別々にデプロイされたpostanalyticsモジュール、そして
    *   共 conjointly deployed Wallarm and postanalytics modules.

## 監視の前提条件

監視を行うには、以下が必要です：
*   NGINXがフィルタノードに統計情報を返すこと（`wallarm_status on`)、
*   フィルタモードが`monitoring`、`safe_blocking`、または`block`[モード](../configure-wallarm-mode.md#available-filtration-modes)になっていること。

デフォルトでは、このサービスは `http://127.0.0.8/wallarm-status` でアクセスできます。

統計サービスを非標準アドレスで利用可能に[設定](../configure-statistics-service.md#changing-an-ip-address-of-the-statistics-service)している場合：

1. 新しいアドレスの値をもった `status_endpoint` パラメーターを `/etc/wallarm/node.yaml` ファイルに追加します。例えば：

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. オペレーティングシステムの種類により、`collectd` の設定ファイルの `URL` パラメーターを適切に修正します：

    --8<-- "../include-ja/monitoring/collectd-config-location.md"

Tarantoolの非標準のIPアドレスまたはポートが使用されている場合、その設定ファイルを適切に修正する必要があります。このファイルの場所は、オペレーティングシステムの種類によります：

--8<-- "../include-ja/monitoring/tarantool-config-location.md"

SELinuxがフィルタノードホストにインストールされている場合、SELinuxが[設定または無効化][doc-selinux]されていることを確認します。簡単のため、このドキュメントではSELinuxが無効化されていることを前提としています。

## メトリクスの見え方

###  `collectd` メトリクスの見え方

`collectd` メトリック識別子は次の形式を持っています：

```
host/plugin[-plugin_instance]/type[-type_instance]
```

ここで
*   `host`: メトリックが取得されるホストの完全修飾ドメイン名(FQDN)
*   `plugin`: メトリックが取得されるプラグインの名前、
*   `-plugin_instance`: プラグインのインスタンス（存在する場合）、
*   `type`: メトリック値のタイプ。許されるタイプ：
    *   `counter`
    *   `derive`
    *   `gauge` 

    値のタイプについての詳細な情報は[ここ][link-data-source]で利用可能です。

*   `-type_instance`: タイプのインスタンス（存在する場合）。タイプのインスタンスは、メトリックを取得したい値に相当します。

メトリックの形式に関する完全な説明は[こちら][link-collectd-naming]で利用可能です。

### Wallarm特有の `collectd` メトリクスの見え方

フィルタノードは `collectd` を使用してWallarm特有のメトリクスを収集します。

Wallarmモジュール付きのNGINXのメトリクスは次の形式を持ちます：

```
host/wallarm_nginx/type-type_instance
```

postanalyticsモジュールのメトリクスは次の形式を持ちます：

```
host/wallarm-tarantool/type-type_instance
```


!!! info "メトリック例"
    ホスト `node.example.local` 上のフィルタノードについて：

    * `node.example.local/wallarm_nginx/gauge-abnormal` は、処理されたリクエストの数のメトリクです；
    * `node.example.local/wallarm-tarantool/gauge-export_delay` は、Tarantoolのエクスポート遅延（秒）のメトリクスです。

    監視可能なメトリクスの完全なリストは[こちら][doc-available-metrics]で利用可能です。

##  メトリクスの取得方法

フィルタノードからメトリクスをいくつかの方法で収集できます：
*   `collectd` サービスから直接データをエクスポートする
    * [ `collectd` のNetworkプラグインを経由して][doc-network-plugin]。
    
        この[プラグイン][link-network-plugin]は `collectd` にフィルタノードからのメトリクスを[`collectd`][link-collectd-networking] serverまたは[InfluxDB][link-influxdb] データベースにダウンロードすることを可能にします。
        
        
        !!! info "InfluxDB"
            InfluxDBは、`collectd` と他のデータソースからのメトリクスの集約およびその後の可視化（例えば、InfluxDBに格納されたメトリクスを可視化する[Grafana][link-grafana] 監視システム）に使用できます。
        
    * [`collectd` のwrite プラグインの一つを経由して][doc-write-plugins]。
  
        例えば、 `write_graphite` プラグインを使用して収集されたデータを [Graphite][link-graphite] にエクスポートできます。
  
        
        !!! info "Graphite"
            Graphiteは、監視および可視化システムのデータソースとして使用できます（例えば、[Grafana][link-grafana]）。
        
  
    この方法は次のフィルタノードのデプロイメントタイプに適用されます：

    *   クラウド中：Amazon AWS、Google Cloud；
    *   NGINX/NGINX Plus プラットフォーム向けの Linux上。

*   [`collectd-nagios` を経由してデータをエクスポートする][doc-collectd-nagios]。
  
    この[ユーティリティ][link-collectd-nagios]は `collectd` から与えられたメトリクスの値を受け取り、[Nagios互換フォーマット][link-nagios-format]でそれを表示します。
  
    このユーティリティを利用して、メトリクスを [Nagios][link-nagios] または [Zabbix][link-zabbix] 監視システムにエクスポートできます。
  
    この方法は、どのようにそのノードがデプロイされているかに関係なく、任意のWallarmフィルタノードによってサポートされています。
  
*   メトリクスが予定された閾値に達したときに `collectd` から[通知を送る][doc-collectd-notices]。

    この方法は、どのようにそのノードがデプロイされているかに関係なく、任意のWallarmフィルタノードによってサポートされています。