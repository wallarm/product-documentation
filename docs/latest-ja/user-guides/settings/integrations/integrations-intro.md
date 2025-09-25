# インテグレーションの概要

OWASP API Top 10の脅威、API悪用、および自動化された脅威に対する盾として、Wallarmは幅広いシステムとシームレスにインテグレーションし、リアルタイムにお知らせすることでセキュリティをさらに強化します。

Wallarmのインテグレーションにより、次のような重要なイベントについて常に把握できます：

* [検出されたHits](../../../user-guides/events/check-attack.md)に関する即時アラートにより、脅威に直ちに対応できます。
* システムイベント（登録済み[users](../../../user-guides/settings/users.md)、integrations、[applications](../../../user-guides/settings/applications.md)の変更）に関する更新により、常に管理できます。
* セキュリティプロファイルの重要な変更（[rules](../../../user-guides/rules/rules.md)や[triggers](../../../user-guides/triggers/triggers.md)の変更など）に関する通知を受け取ります。
* インフラ内の潜在的な[脆弱性](../../../about-wallarm/detecting-vulnerabilities.md)とそのリスクレベルに関するタイムリーな警告により、最も危険な弱点にプロアクティブに対処できます。

この機能はWallarm Consoleの**Integrations**セクションで管理し、インテグレーション向けの追加アラートは**Triggers**セクションで設定します。

![Integrations](../../../images/user-guides/settings/integrations/integration-panel.png)

Wallarmは既存の多数のツールやプラットフォームと容易に連携します。1つのシステムに対するインテグレーションの数に制限はありません。

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## メールとメッセンジャー

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../email/">
            <img class="non-zoomable" src="../../../../images/integration-icons/email.svg" />
            <h3>Email</h3>
            <p>登録時に指定したメールアドレスおよび追加のメールアドレスに通知を受け取ります</p>
        </a>
        <a class="do-card" href="../slack/">
            <img class="non-zoomable" src="../../../../images/integration-icons/slack.png" />
            <h3>Slack</h3>
            <p>選択したSlackチャンネルに通知を送信します</p>
        </a>
        <a class="do-card" href="../telegram/">
            <img class="non-zoomable" src="../../../../images/integration-icons/telegram.png" />
            <h3>Telegram</h3>
            <p>TelegramにWallarmボットを追加し、そこへ通知を送信します</p>
        </a>
        <a class="do-card" href="../microsoft-teams/">
            <img class="non-zoomable" src="../../../../images/integration-icons/msteams.svg" />
            <h3>Microsoft Teams</h3>
            <p>選択したMicrosoft Teamsチャネルに通知を送信します</p>
        </a>
    </div>
</div>

## インシデントおよびタスク管理システム

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../opsgenie/">
            <img class="non-zoomable" src="../../../../images/integration-icons/opsgenie.png" />
            <h3>Opsgenie</h3>
            <p>Opsgenie API経由で連携します</p>
        </a>
        <a class="do-card" href="../pagerduty/">
            <img class="non-zoomable" src="../../../../images/integration-icons/pagerduty.png" />
            <h3>PagerDuty</h3>
            <p>インシデントをPagerDutyに送信します</p>
        </a>
        <a class="do-card" href="../jira/">
            <img class="non-zoomable" src="../../../../images/integration-icons/jira.png" />
            <h3>Jira</h3>
            <p>WallarmがJiraに課題を作成するように設定します</p>
        </a>
        <a class="do-card" href="../servicenow/">
            <img class="non-zoomable" src="../../../../images/integration-icons/servicenow.svg" />
            <h3>ServiceNow</h3>
            <p>WallarmがServiceNowにトラブルチケットを作成するように設定します</p>
        </a>
    </div>
</div>

## SIEMおよびSOARシステム

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../sumologic/">
            <img class="non-zoomable" src="../../../../images/integration-icons/sumologic.svg" />
            <h3>Sumo Logic</h3>
            <p>Sumo Logicにメッセージを送信します</p>
        </a>
        <a class="do-card" href="../splunk/">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk</h3>
            <p>Splunkにアラートを送信します</p>
        </a>
        <a class="do-card" href="../insightconnect/">
            <img class="non-zoomable" src="../../../../images/integration-icons/insightconnect.svg" />
            <h3>InsightConnect</h3>
            <p>InsightConnectに通知を送信します</p>
        </a>
        <a class="do-card" href="../azure-sentinel/">
            <img class="non-zoomable" src="../../../../images/integration-icons/mssentinel.png" />
            <h3>Microsoft Sentinel</h3>
            <p>Microsoft Azure Sentinelにイベントを記録します</p>
        </a>
    </div>
</div>

## ログ管理システム

<div class="do-section">
    <div class="do-main">
        <div id="datadog" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>イベントをDatadog Logsサービスへ直接、または中間のデータコレクター経由で送信します</p>
        </div>
    </div>
    <div class="do-nested" data-for="datadog">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>イベントをDatadog Logsサービスへ直接、または中間のデータコレクター経由で送信します</p>
        </div>
        <a class="do-card" href="../datadog/">
            <h3>ネイティブインテグレーション</h3>
            <p>ログをDatadogに直接送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Fluentd経由でDatadogにログを送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Logstash経由でDatadogにログを送信します</p>
        </a>
    </div>
</div>

## データコレクター

<div class="do-section">
    <div class="do-main">
        <div id="fluentd" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>検出イベントの通知をFluentdに送信したり、他システムとの連携のための中間システムとしてFluentdを使用します</p>
        </div>
        <div id="logstash" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>検出イベントの通知をLogstashに送信したり、他システムとの連携のための中間システムとしてLogstashを使用します</p>
        </div>
        <a class="do-card" href="../amazon-s3/">
            <img class="non-zoomable" src="../../../../images/integration-icons/awss3.svg" />
            <h3>AWS S3</h3>
            <p>検出されたHitsに関する情報を含むファイルをお客様のAmazon S3バケットに送信するようにWallarmを設定します</p>
        </a>
    </div>
    <div class="do-nested" data-for="fluentd">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>検出イベントの通知をFluentdに送信したり、他システムとの連携のための中間システムとしてFluentdを使用します</p>
        </div>
        <a class="do-card" href="../fluentd/">
            <h3>ネイティブインテグレーション</h3>
            <p>検出イベントの通知をFluentdそのものに送信します</p>
        </a>
        <div id="fluentd-intermediate" class="do-card">
            <h3>中間データコネクタとしてのFluentd</h3>
            <p>他システムとの連携のための中間システムとしてFluentdを使用します</p>
        </div>
    </div>
    <div class="do-nested" data-for="fluentd-intermediate">
        <div class="do-card">
            <h3>中間データコネクタとしてのFluentd</h3>
            <p>他システムとの連携のための中間システムとしてFluentdを使用します</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>Fluentd経由でIBM QRadarにログを送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>Fluentd経由でSplunk Enterpriseにログを送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>Fluentd経由でMicro Focus ArcSight Loggerに通知を送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Fluentd経由でDatadogに通知を送信します</p>
        </a>
    </div>
    <div class="do-nested" data-for="logstash">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>検出イベントの通知をLogstashに送信したり、他システムとの連携のための中間システムとしてLogstashを使用します</p>
        </div>
        <a class="do-card" href="../logstash/">
            <h3>ネイティブインテグレーション</h3>
            <p>検出イベントの通知をLogstashそのものに送信します</p>
        </a>
        <div id="logstash-intermediate" class="do-card">
            <h3>中間データコネクタとしてのLogstash</h3>
            <p>他システムとの連携のための中間システムとしてLogstashを使用します</p>
        </div>
    </div>
    <div class="do-nested" data-for="logstash-intermediate">
        <div class="do-card">
            <h3>中間データコネクタとしてのLogstash</h3>
            <p>他システムとの連携のための中間システムとしてLogstashを使用します</p>
        </div>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>Logstash経由でIBM QRadarにログを送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>Logstash経由でSplunk Enterpriseにログを送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>Logstash経由でMicro Focus ArcSight Loggerに通知を送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Logstash経由でDatadogに通知を送信します</p>
        </a>
    </div>    
</div>

## データコレクター経由のインテグレーション

<div class="do-section">
    <div class="do-main">
        <div id="ibm-qradar" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>FluentdまたはLogstash経由でIBM QRadarにログを送信します</p>
        </div>
        <div id="splunk-enterprise" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>FluentdまたはLogstash経由でSplunk Enterpriseにログを送信します</p>
        </div>
        <div id="arcsight-logger" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>FluentdまたはLogstash経由でMicro Focus ArcSight Loggerに通知を送信します</p>
        </div>
        <div id="datadogp" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>FluentdまたはLogstash経由でDatadog Logsサービスにイベントを送信します</p>
        </div>
    </div>
    <div class="do-nested" data-for="ibm-qradar">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>FluentdまたはLogstash経由でIBM QRadarにログを送信します</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>Fluentd経由でIBM QRadarにログを送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>Logstash経由でIBM QRadarにログを送信します</p>
        </a>
    </div>
    <div class="do-nested" data-for="splunk-enterprise">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>FluentdまたはLogstash経由でSplunk Enterpriseにログを送信します</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>Fluentd経由でSplunk Enterpriseにログを送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>Logstash経由でSplunk Enterpriseにログを送信します</p>
        </a>
    </div>
    <div class="do-nested" data-for="arcsight-logger">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>FluentdまたはLogstash経由でMicro Focus ArcSight Loggerに通知を送信します</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>Fluentd経由でMicro Focus ArcSight Loggerに通知を送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>Logstash経由でMicro Focus ArcSight Loggerに通知を送信します</p>
        </a>
    </div>
    <div class="do-nested" data-for="datadogp">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>FluentdまたはLogstash経由でDatadog Logsサービスにイベントを送信します</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Fluentd経由でDatadogにログを送信します</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Logstash経由でDatadogにログを送信します</p>
        </a>
    </div>
</div>

## その他のシステム

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../webhook/">
            <img class="non-zoomable" src="../../../../images/integration-icons/webhook.svg" />
            <h3>Webhook</h3>
            <p>汎用コネクタ:HTTPSプロトコルで受信Webhookを受け付ける任意のシステムに即時通知を送信します</p>
        </a>
        <a class="do-card" href="mailto:sales@wallarm.com?subject=Request%20for%20integration%20between%20Wallarm%20and%20<SYSTEM>&body=Hello%20Wallarm%20Sales%20Team%2C%0AIn%20Wallarm%2C%20the%20integration%20with%20<SYSTEM>%20is%20not%20presented%2C%20although%20the%20ability%20to%20integrate%20with%20this%20system%20would%20be%20benefitial%20for%20us.%0A%0AWe%20would%20be%20grateful%20if%20you%20could%20consider%20the%20technical%20feasibility%20of%20this%20integration%20and%20are%20ready%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20our%20requirements%20in%20detail.%0A%0AWe%20are%20looking%20forward%20to%20your%20response.">
            <img class="non-zoomable" src="../../../../images/integration-icons/other-system.svg" />
            <h3>Request integration</h3>
            <p>お探しのシステムが見つからない場合はお知らせください。インテグレーションが可能か検討し、ご連絡します。</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>