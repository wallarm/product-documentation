[integration-pane-img]:         ../../../images/user-guides/settings/integrations/integration-panel.png

[email-notifications]:          ./email.md
[slack-notifications]:          ./slack.md
[telegram-notifications]:       ./telegram.md
[ms-teams-notifications]:       ./microsoft-teams.md
[opsgenie-notifications]:       ./opsgenie.md
[insightconnect-notifications]: ./insightconnect.md
[sentinel-notifications]:       ./azure-sentinel.md
[pagerduty-notifications]:      ./pagerduty.md
[jira-notifications]:           ./jira.md
[servicenow-notifications]:     ./servicenow.md
[splunk-notifications]:         ./splunk.md
[sumologic-notifications]:      ./sumologic.md
[datadog-notifications]:        ./datadog.md
[fluentd-notifications]:        ./fluentd.md
[logstash-notifications]:       ./logstash.md
[aws-s3-notifications]:         ./amazon-s3.md
[webhook-notifications]:        ./webhook.md
[account]:                      ../account.md

# 統合概要

Wallarm Consoleの**統合**セクションでは、定期レポートの送信や即時通知の受信について、様々なシステムとの統合が可能です：

* 定期レポートは日次、週次、月次のいずれかで送信が可能です。レポートには、選択した期間中にシステムで検出された脆弱性、攻撃、およびインシデントの詳細情報が含まれます。
* 時間ごとに、前の時間に処理されたリクエストの数の通知を受け取ることができます。
* 脆弱性、ヒット、システム関連イベント、スコープ変更ごとに、直ちに通知を受け取ることができます。

!!! info "管理者アクセス"
    統合の設定は、**管理者**ロールを持つユーザーのみが利用可能です。

## 統合タイプ

統合可能なシステムは、次のようにタイプごとに分類されています：

![Integrations Overview][integration-pane-img]

### メールとメッセンジャー

* **個人の電子メール** — 登録時に指定したメールに送信されるレポートと通知。これらの通知は、[**設定**→**プロフィール**][account]で設定することもできます。
* [メールレポート][email-notifications]
* [Slack][slack-notifications]
* [Telegram][telegram-notifications]
* [Microsoft Teams][ms-teams-notifications]

### インシデントとタスク管理システム

* [Opsgenie][opsgenie-notifications]
* [PagerDuty][pagerduty-notifications]
* [Jira][jira-notifications]
* [ServiceNow][servicenow-notifications]

### SIEMとSOARシステム

* [Sumo Logic][sumologic-notifications]
* [Splunk][splunk-notifications]
* [InsightConnect][insightconnect-notifications]
* [Microsoft Sentinel][sentinel-notifications]

### ログ管理システム

* [Datadog][datadog-notifications]

### データコレクター

* [Fluentd][fluentd-notifications]
* [Logstash][logstash-notifications]
* [AWS S3][aws-s3-notifications]

### ユニバーサルシステム

* [Webhook][webhook-notifications] はHTTPSプロトコルを介して受け入れる任意のシステムと統合するために使用できます。例えば：
    * ログを[IBM QRadar](webhook-examples/fluentd-qradar.md)、[Splunk Enterprise](webhook-examples/fluentd-splunk.md)、[ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)、[Datadog](webhook-examples/fluentd-logstash-datadog.md) に転送するように設定されたFluentd 
    * ログを[IBM QRadar](webhook-examples/logstash-qradar.md)、[Splunk Enterprise](webhook-examples/logstash-splunk.md)、[ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)、[Datadog](webhook-examples/fluentd-logstash-datadog.md) に転送するように設定されたLogstash 

### モニタリングシステム

Wallarmノードは、処理されたトラフィックのメトリックを[収集する](../../../admin-en/monitoring/intro.md) `collectd` サービスとともに配布されています。`collectd` ユーティリティとプラグインを使用して、メトリックをサードパーティのモニタリングシステムやデータベースに送信できます。例えば：

* [InfluxDB](../../../admin-en/monitoring/network-plugin-influxdb.md) と後でGrafanaなどのシステムで視覚化
* [Graphite](../../../admin-en/monitoring/write-plugin-graphite.md) と後でGrafanaなどのシステムで視覚化
* [Nagios](../../../admin-en/monitoring/collectd-nagios.md)
* [Zabbix](../../../admin-en/monitoring/collectd-zabbix.md)

メトリックをサードパーティのモニタリングシステムやデータベースに送信する設定は、ノード側で行われます。これらのシステムは Wallarm Console UIには表示されません。

### その他のシステム

求めているシステムがない場合は、[ご連絡ください](mailto:support@wallarm.com)。要求されたシステムとの統合の技術的可能性を確認し、あなたに連絡します。

## 統合の追加

新しい統合を追加するには：

* **すべて**タブの未設定システムのアイコンをクリックするか、
* 必要なシステムのグループで**統合を追加**ボタンをクリックしてシステムを選択します。その後の手順は、選択したシステムの説明書で説明されています。

一つのシステムとの統合の数に制限はありません。例えば、3つのSlackチャンネルにセキュリティレポートを送信するために、Slackとの3つの異なる統合を作成することができます。

--8<-- "../include-ja/cloud-ip-by-request.md"

!!! info "詳細な通知設定"
    詳細な通知設定には、[トリガー](../../triggers/triggers.md)を使用できます。

## 統合のフィルタリング

表示される統合をフィルタリングするには、以下のタブを使用できます：

* **すべて** は、有効化された、無効化された、およびまだ設定されていない統合を表示します。
* **有効** は、有効化している設定済みの統合を表示します。
* **無効** は、無効化された設定済みの統合を表示します。

## 統合システムの利用不可と統合パラメータの不正確さ

通知はリクエストによりシステムに送られます。システムが利用不可であるか、統合パラメータが不正確に設定されているとリクエストへのレスポンスでエラーコードが返されます。

システムがWallarmのリクエストに `2xx` 以外の任意のコードで応答すると、Wallarmは `2xx` のコードを受信するまでリクエストを再送します：

* 最初のサイクル間隔：1、3、5、10、10秒
* 2番目のサイクル間隔：0、1、3、5、30秒
* 3番目のサイクル間隔：  1、1、3、5、10、30分

過去12時間で不成功なリクエストの割合が60％に達すると、統合は自動的に無効化されます。システム通知を受けている場合、自動的に無効化した統合についてのメッセージが、[設定したシステム](#統合タイプ)に送信されます。

統合パラメータの不正確さを確認するには、統合の**テスト**が可能です。該当ボタンは、統合設定ウィンドウで利用可能です。テストリクエストが失敗した場合、Wallarm Consoleは適切なメッセージを表示します。

<!-- ## デモ動画

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->