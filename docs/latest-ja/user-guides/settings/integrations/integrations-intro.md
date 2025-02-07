# 統合概要

OWASP API Top 10の脅威、API乱用、自動化された脅威に対する盾として、Wallarmは多数のシステムとシームレスに統合し、リアルタイムで情報を提供することで、セキュリティを一層強化します。

Wallarmの統合機能により、以下の致命的なイベントに関して常に情報を把握できます：

* 脅威に対して直ちに対応できるよう、[検出されたヒット](../../../user-guides/events/check-attack.md)に関する即時アラートを送信します。
* 登録済み[ユーザー](../../../user-guides/settings/users.md)、統合、および[アプリケーション](../../../user-guides/settings/applications.md)の変更など、システムイベントに関する更新情報を提供し、常に状況を把握できます。
* セキュリティプロファイルの重要な変更、例えば[ルール](../../../user-guides/rules/rules.md)や[トリガー](../../../user-guides/triggers/triggers.md)の変更に関する通知を行います。
* インフラストラクチャに存在する潜在的な[脆弱性](../../../about-wallarm/detecting-vulnerabilities.md)とそのリスクレベルに関する適時の警告を発し、最も危険な弱点に先手を打って対処できます。

Wallarm Consoleの**Integrations**セクションで機能を管理し、統合のための追加アラートを設定する際には**Triggers**セクションをご利用ください。

![Integrations](../../../images/user-guides/settings/integrations/integration-panel.png)

Wallarmは多数の既存ツールやプラットフォームと容易に連携し、1つのシステムとの統合数に制限はありません。

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## メールとメッセンジャー

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../email/">
            <img class="non-zoomable" src="../../../../images/integration-icons/email.svg" />
            <h3>メール</h3>
            <p>登録時に指定されたメールアドレス宛および追加メールに通知が送信されます。</p>
        </a>
        <a class="do-card" href="../slack/">
            <img class="non-zoomable" src="../../../../images/integration-icons/slack.png" />
            <h3>Slack</h3>
            <p>選択されたSlackチャンネルに通知を送信します。</p>
        </a>
        <a class="do-card" href="../telegram/">
            <img class="non-zoomable" src="../../../../images/integration-icons/telegram.png" />
            <h3>Telegram</h3>
            <p>TelegramにWallarmボットを追加し、通知を送信します。</p>
        </a>
        <a class="do-card" href="../microsoft-teams/">
            <img class="non-zoomable" src="../../../../images/integration-icons/msteams.svg" />
            <h3>Microsoft Teams</h3>
            <p>選択されたMicrosoft Teamsチャンネルに通知を送信します。</p>
        </a>
    </div>
</div>

## インシデントおよびタスク管理システム

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../opsgenie/">
            <img class="non-zoomable" src="../../../../images/integration-icons/opsgenie.png" />
            <h3>Opsgenie</h3>
            <p>Opsgenie API経由で統合します。</p>
        </a>
        <a class="do-card" href="../pagerduty/">
            <img class="non-zoomable" src="../../../../images/integration-icons/pagerduty.png" />
            <h3>PagerDuty</h3>
            <p>インシデントをPagerDutyに送信します。</p>
        </a>
        <a class="do-card" href="../jira/">
            <img class="non-zoomable" src="../../../../images/integration-icons/jira.png" />
            <h3>Jira</h3>
            <p>Wallarmを設定してJiraに課題を作成します。</p>
        </a>
        <a class="do-card" href="../servicenow/">
            <img class="non-zoomable" src="../../../../images/integration-icons/servicenow.svg" />
            <h3>ServiceNow</h3>
            <p>Wallarmを設定してServiceNowにトラブルチケットを作成します。</p>
        </a>
    </div>
</div>

## SIEMおよびSOARシステム

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../sumologic/">
            <img class="non-zoomable" src="../../../../images/integration-icons/sumologic.svg" />
            <h3>Sumo Logic</h3>
            <p>Sumo Logicにメッセージを送信します。</p>
        </a>
        <a class="do-card" href="../splunk/">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk</h3>
            <p>Splunkにアラートを送信します。</p>
        </a>
        <a class="do-card" href="../insightconnect/">
            <img class="non-zoomable" src="../../../../images/integration-icons/insightconnect.svg" />
            <h3>InsightConnect</h3>
            <p>InsightConnectに通知を送信します。</p>
        </a>
        <a class="do-card" href="../azure-sentinel/">
            <img class="non-zoomable" src="../../../../images/integration-icons/mssentinel.png" />
            <h3>Microsoft Sentinel</h3>
            <p>Microsoft Azure Sentinelにイベントを記録します。</p>
        </a>
    </div>
</div>

## ログ管理システム

<div class="do-section">
    <div class="do-main">
        <div id="datadog" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Datadog Logsサービスに直接または中間のデータ収集システムを介してイベントを送信します。</p>
        </div>
    </div>
    <div class="do-nested" data-for="datadog">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Datadogに直接ログを送信します。</p>
        </div>
        <a class="do-card" href="../datadog/">
            <h3>Native integration</h3>
            <p>Datadogに直接ログを送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Fluentdを経由してDatadogにログを送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Logstashを経由してDatadogにログを送信します。</p>
        </a>
    </div>
</div>

## データ収集システム

<div class="do-section">
    <div class="do-main">
        <div id="fluentd" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>Fluentdに検出イベントの通知を送信するか、Fluentdを中間システムとして使用して他システムと統合します。</p>
        </div>
        <div id="logstash" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>Logstashに検出イベントの通知を送信するか、Logstashを中間システムとして使用して他システムと統合します。</p>
        </div>
        <a class="do-card" href="../amazon-s3/">
            <img class="non-zoomable" src="../../../../images/integration-icons/awss3.svg" />
            <h3>AWS S3</h3>
            <p>Wallarmを設定して検出されたヒットに関する情報を含むファイルをAmazon S3バケットに送信します。</p>
        </a>
    </div>
    <div class="do-nested" data-for="fluentd">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>Fluentdに検出イベントの通知を送信するか、Fluentdを中間システムとして使用して他システムと統合します。</p>
        </div>
        <a class="do-card" href="../fluentd/">
            <h3>Native integration</h3>
            <p>Fluentd自体に検出イベントの通知を送信します。</p>
        </a>
        <div id="fluentd-intermediate" class="do-card">
            <h3>Fluentd as intermediate data connector</h3>
            <p>Fluentdを中間システムとして使用し、他システムと統合します。</p>
        </div>
    </div>
    <div class="do-nested" data-for="fluentd-intermediate">
        <div class="do-card">
            <h3>Fluentd as intermediate data connector</h3>
            <p>Fluentdを中間システムとして使用し、他システムと統合します。</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>Fluentdを経由してIBM QRadarにログを送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>Fluentdを経由してSplunk Enterpriseにログを送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>Fluentdを経由してMicro Focus ArcSight Loggerに通知を送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Fluentdを経由してDatadogに通知を送信します。</p>
        </a>
    </div>
    <div class="do-nested" data-for="logstash">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>Logstashに検出イベントの通知を送信するか、Logstashを中間システムとして使用して他システムと統合します。</p>
        </div>
        <a class="do-card" href="../logstash/">
            <h3>Native integration</h3>
            <p>Logstash自体に検出イベントの通知を送信します。</p>
        </a>
        <div id="logstash-intermediate" class="do-card">
            <h3>Logstash as intermediate data connector</h3>
            <p>Logstashを中間システムとして使用し、他システムと統合します。</p>
        </div>
    </div>
    <div class="do-nested" data-for="logstash-intermediate">
        <div class="do-card">
            <h3>Logstash as intermediate data connector</h3>
            <p>Logstashを中間システムとして使用し、他システムと統合します。</p>
        </div>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>Logstashを経由してIBM QRadarにログを送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>Logstashを経由してSplunk Enterpriseにログを送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>Logstashを経由してMicro Focus ArcSight Loggerに通知を送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Logstashを経由してDatadogに通知を送信します。</p>
        </a>
    </div>    
</div>

## データ収集システムを介した統合

<div class="do-section">
    <div class="do-main">
        <div id="ibm-qradar" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>FluentdまたはLogstashを経由してIBM QRadarにログを送信します。</p>
        </div>
        <div id="splunk-enterprise" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>FluentdまたはLogstashを経由してSplunk Enterpriseにログを送信します。</p>
        </div>
        <div id="arcsight-logger" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>FluentdまたはLogstashを経由してMicro Focus ArcSight Loggerに通知を送信します。</p>
        </div>
        <div id="datadogp" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>FluentdまたはLogstashを経由してDatadog Logsサービスにイベントを送信します。</p>
        </div>
    </div>
    <div class="do-nested" data-for="ibm-qradar">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>FluentdまたはLogstashを経由してIBM QRadarにログを送信します。</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>Fluentdを経由してIBM QRadarにログを送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>Logstashを経由してIBM QRadarにログを送信します。</p>
        </a>
    </div>
    <div class="do-nested" data-for="splunk-enterprise">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>FluentdまたはLogstashを経由してSplunk Enterpriseにログを送信します。</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>Fluentdを経由してSplunk Enterpriseにログを送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>Logstashを経由してSplunk Enterpriseにログを送信します。</p>
        </a>
    </div>
    <div class="do-nested" data-for="arcsight-logger">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>FluentdまたはLogstashを経由してMicro Focus ArcSight Loggerに通知を送信します。</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>Fluentdを経由してMicro Focus ArcSight Loggerに通知を送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>Logstashを経由してMicro Focus ArcSight Loggerに通知を送信します。</p>
        </a>
    </div>
    <div class="do-nested" data-for="datadogp">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>FluentdまたはLogstashを経由してDatadog Logsサービスにイベントを送信します。</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Fluentdを経由してDatadogにログを送信します。</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Logstashを経由してDatadogにログを送信します。</p>
        </a>
    </div>
</div>

## その他のシステム

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../webhook/">
            <img class="non-zoomable" src="../../../../images/integration-icons/webhook.svg" />
            <h3>Webhook</h3>
            <p>ユニバーサルコネクタ：HTTPSプロトコルを介して受信ウェブフックを受け入れる任意のシステムに即時通知を送信します。</p>
        </a>
        <a class="do-card" href="mailto:sales@wallarm.com?subject=Request%20for%20integration%20between%20Wallarm%20and%20<SYSTEM>&body=Hello%20Wallarm%20Sales%20Team%2C%0AIn%20Wallarm%2C%20the%20integration%20with%20<SYSTEM>%20is%20not%20presented%2C%20although%20the%20ability%20to%20integrate%20with%20this%20system%20would%20be%20beneficial%20for%20us.%0A%0AWe%20would%20be%20grateful%20if%20you%20could%20consider%20the%20technical%20feasibility%20of%20this%20integration%20and%20are%20ready%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20our%20requirements%20in%20detail.%0A%0AWe%20are%20looking%20forward%20to%20your%20response.">
            <img class="non-zoomable" src="../../../../images/integration-icons/other-system.svg" />
            <h3>Request integration</h3>
            <p>お探しのシステムがない場合はお知らせください。統合の可能性を確認し、ご連絡します。</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>