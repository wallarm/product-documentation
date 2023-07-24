[integration-pane-img]: ../../../images/user-guides/settings/integrations/integration-panel.png

[email-notifications]: ./email.md
[slack-notifications]: ./slack.md
[telegram-notifications]: ./telegram.md
[ms-teams-notifications]: ./microsoft-teams.md
[opsgenie-notifications]: ./opsgenie.md
[insightconnect-notifications]: ./insightconnect.md
[pagerduty-notifications]: ./pagerduty.md
[splunk-notifications]: ./splunk.md
[sumologic-notifications]: ./sumologic.md
[datadog-notifications]: ./datadog.md
[fluentd-notifications]: ./fluentd.md
[logstash-notifications]: ./logstash.md
[webhook-notifications]: ./webhook.md
[account]: ../account.md

# インテグレーションの概要

Wallarm Console の**インテグレーション**セクションでは、スケジュールされたレポートや即時通知を送信するために、さまざまなシステムとの統合が可能です：

* スケジュールされたレポートは、毎日、毎週、または毎月の基準で送信できます。レポートには、選択した期間中にシステムで検出された脆弱性、攻撃、およびインシデントに関する詳細情報が含まれます。
* 通知は、システムで脆弱性、ヒット、スコープの変更、システム関連のイベントなどが検出された場合に送信されます。通知には、検出されたアクティビティの簡単な詳細が含まれます。

!!! info "管理者アクセス"
    インテグレーションの設定は、**管理者**ロールを持つユーザーのみ利用可能です。

## インテグレーションの種類

統合可能なシステムは、以下のようにタイプ別にグループ化されています：

![!インテグレーションの概要][integration-pane-img]

### メールとメッセンジャー

* **パーソナルメール** — 登録時に指定されたメールに送信されるレポートと通知。 [**設定**→**プロフィール**][account]でこれらの通知を設定することもできます。
* [Eメールレポート][email-notifications]
* [Slack][slack-notifications]
* [Telegram][telegram-notifications]
* [マイクロソフトチームズ][ms-teams-notifications]

### インシデントおよびタスク管理システム

* [InsightConnect][insightconnect-notifications]
* [Opsgenie][opsgenie-notifications]
* [PagerDuty][pagerduty-notifications]

### SIEMおよびSOARシステム

* [Sumo Logic][sumologic-notifications]

### ログ管理システム

* [Splunk][splunk-notifications]
* [Datadog][datadog-notifications]

### データコレクター

* [Fluentd][fluentd-notifications]
* [Logstash][logstash-notifications]

### 汎用システム

* HTTPSプロトコルを介して入力Webhookを受け入れるシステムとの統合用に[Webhook][webhook-notifications]があります。たとえば：
    * [IBM QRadar](webhook-examples/fluentd-qradar.md)、[Splunk Enterprise](webhook-examples/fluentd-splunk.md)、[ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)、[Datadog](webhook-examples/fluentd-logstash-datadog.md)にログを転送するように構成されたFluentd
    * [IBM QRadar](webhook-examples/logstash-qradar.md)、[Splunk Enterprise](webhook-examples/logstash-splunk.md)、[ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)、[Datadog](webhook-examples/fluentd-logstash-datadog.md)にログを転送するように構成されたLogstash

### モニタリングシステム

Wallarmノードとともに「collectd」サービスが配布され、[処理されたトラフィックのメトリックを収集](../../../admin-en/monitoring/intro.md)します。「collectd」ユーティリティとプラグインを使用して、メトリックをサードパーティのモニタリングシステムおよびデータベースに送信できます。例：

* [InfluxDB](../../../admin-en/monitoring/network-plugin-influxdb.md) および Grafana などの他のシステムでのさらなる可視化
* [Graphite](../../../admin-en/monitoring/write-plugin-graphite.md) および Grafana などの他のシステムでのさらなる可視化
* [Nagios](../../../admin-en/monitoring/collectd-nagios.md)
* [Zabbix](../../../admin-en/monitoring/collectd-zabbix.md)

ノード側でサードパーティ監視システムおよびデータベースへのメトリクスを送信する設定が実行されます。リストされたシステムはWallarm Console UIに表示されません。

### 他のシステム

探しているシステムがない場合は、[お知らせください](mailto:support@wallarm.com)。要求されたシステムとの統合の技術的可能性を確認し、お問い合わせします。

## インテグレーションの追加

新しいインテグレーションを追加するには：

* **すべて**タブで設定されていないシステムのアイコンをクリックするか、
* 必要なシステムグループで**インテグレーションを追加**ボタンをクリックし、システムを選択します。さらなる手順は、選択したシステムの手順で説明されています。

1つのシステムとのインテグレーション数に制限はありません。 例：3つのSlackチャンネルにセキュリティレポートを送信するには、Slackとの3つの異なるインテグレーションを作成できます。

--8<-- "../include/cloud-ip-by-request.ja.md"

!!! info "高度な通知設定"
    高度な通知設定には、[トリガー](../../triggers/triggers.md)を使用できます。

## インテグレーションのフィルタリング

表示されるインテグレーションをフィルタリングするには、タブを使用できます：

* インテグレーションが有効、無効化およびまだ設定されていない**すべて**タブ
* アクティブな設定されたインテグレーションがある**有効**タブ
* 無効化された設定済みインテグレーションがある**無効**タブ

## 統合システムの利用不可および誤った統合パラメータ

システムへの通知はリクエストによって送信されます。システムが利用不可であるか、統合パラメータが誤って設定されている場合、リクエストに対する応答にエラーコードが返されます。

システムがWallarmリクエストに`2xx`以外のコードで応答した場合、Wallarmは `2xx`コードが受信されるまでリクエストを、以下の間隔で再送信します：

* 最初のサイクルの間隔：1, 3, 5, 10, 10秒
* 2番目のサイクルの間隔：0, 1, 3, 5, 30秒
* 3番目のサイクルの間隔：1, 1, 3, 5, 10, 30分

12時間で失敗したリクエストの割合が60％に達すると、統合は自動的に無効になります。 システム通知を受け取る場合、自動的に無効になった統合に関するメッセージが、 [設定済みシステム](#integration-types)に送信されます。

統合パラメータの誤りを**テスト**で特定できます。適切なボタンは、統合セットアップウィンドウで利用できます。テストリクエストが失敗した場合、Wallarm Consoleに適切なメッセージが表示されます。

<!-- ## デモビデオ

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->