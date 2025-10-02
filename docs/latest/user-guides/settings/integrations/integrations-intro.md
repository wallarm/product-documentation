# Integrations Overview

Being your shield against the OWASP API Top 10 threats, API abuse, and automated threats, Wallarm takes your security a step further by seamlessly integrating with an extensive range of systems to keep you informed in real-time.

With Wallarm's integrations you will always stay informed about critical events, including:

* Instant alerts about [detected hits](../../../user-guides/events/check-attack.md), so you can take immediate action against the threats.
* Updates on system events (changes in registered [users](../../../user-guides/settings/users.md), integrations, and [applications](../../../user-guides/settings/applications.md)), ensuring you're always in control.
* Notification on important changes in your security profile, such as your [rules](../../../user-guides/rules/rules.md) and [triggers](../../../user-guides/triggers/triggers.md) changes.
* Timely warnings about potential [vulnerabilities](../../../about-wallarm/detecting-vulnerabilities.md) in your infrastructure and their risk levels, so you can proactively address the most dangerous weaknesses.

Manage the feature at the **Integrations** section of Wallarm Console, and the **Triggers** section for configuring additional alerts for your integrations.

![Integrations](../../../images/user-guides/settings/integrations/integration-panel.png)

Wallarm connects effortlessly with a number of existing tools and platforms. The number of integrations with one system is not limited.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## Email and messengers

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../email/">
            <img class="non-zoomable" src="../../../../images/integration-icons/email.svg" />
            <h3>Email</h3>
            <p>Get notifications to the email indicated upon registration and additional emails</p>
        </a>
        <a class="do-card" href="../slack/">
            <img class="non-zoomable" src="../../../../images/integration-icons/slack.png" />
            <h3>Slack</h3>
            <p>Send notifications to the selected Slack channel</p>
        </a>
        <a class="do-card" href="../telegram/">
            <img class="non-zoomable" src="../../../../images/integration-icons/telegram.png" />
            <h3>Telegram</h3>
            <p>Add Wallarm bot to Telegram and send notifications to it</p>
        </a>
        <a class="do-card" href="../microsoft-teams/">
            <img class="non-zoomable" src="../../../../images/integration-icons/msteams.svg" />
            <h3>Microsoft Teams</h3>
            <p>Send notifications to the selected Microsoft Teams channel</p>
        </a>
    </div>
</div>

## Incident and task management systems

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../opsgenie/">
            <img class="non-zoomable" src="../../../../images/integration-icons/opsgenie.png" />
            <h3>Opsgenie</h3>
            <p>Integrate via Opsgenie API</p>
        </a>
        <a class="do-card" href="../pagerduty/">
            <img class="non-zoomable" src="../../../../images/integration-icons/pagerduty.png" />
            <h3>PagerDuty</h3>
            <p>Send incidents to PagerDuty</p>
        </a>
        <a class="do-card" href="../jira/">
            <img class="non-zoomable" src="../../../../images/integration-icons/jira.png" />
            <h3>Jira</h3>
            <p>Set up Wallarm to create issues in Jira</p>
        </a>
        <a class="do-card" href="../servicenow/">
            <img class="non-zoomable" src="../../../../images/integration-icons/servicenow.svg" />
            <h3>ServiceNow</h3>
            <p>Set up Wallarm to create trouble tickets in ServiceNow</p>
        </a>
    </div>
</div>

## SIEM and SOAR systems

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../sumologic/">
            <img class="non-zoomable" src="../../../../images/integration-icons/sumologic.svg" />
            <h3>Sumo Logic</h3>
            <p>Send messages to Sumo Logic</p>
        </a>
        <a class="do-card" href="../splunk/">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk</h3>
            <p>Send alerts to Splunk</p>
        </a>
        <a class="do-card" href="../insightconnect/">
            <img class="non-zoomable" src="../../../../images/integration-icons/insightconnect.svg" />
            <h3>InsightConnect</h3>
            <p>Send notifications to InsightConnect</p>
        </a>
        <a class="do-card" href="../azure-sentinel/">
            <img class="non-zoomable" src="../../../../images/integration-icons/mssentinel.png" />
            <h3>Microsoft Sentinel</h3>
            <p>Log events in Microsoft Azure Sentinel</p>
        </a>
    </div>
</div>

## Log management systems

<div class="do-section">
    <div class="do-main">
        <div id="datadog" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Send events to Datadog Logs service directly or through intermediate data collectors</p>
        </div>
    </div>
    <div class="do-nested" data-for="datadog">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Send events to Datadog Logs service directly or through intermediate data collectors</p>
        </div>
        <a class="do-card" href="../datadog/">
            <h3>Native integration</h3>
            <p>Send logs to Datadog directly</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Send logs to Datadog via Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Send logs to Datadog via Logstash</p>
        </a>
    </div>
</div>

## Data collectors

<div class="do-section">
    <div class="do-main">
        <div id="fluentd" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>Send notifications of detected events to Fluentd or use Fluentd as intermediate system to integrate with other systems</p>
        </div>
        <div id="logstash" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>Send notifications of detected events to Logstash or use Logstash as intermediate system to integrate with other systems</p>
        </div>
        <a class="do-card" href="../amazon-s3/">
            <img class="non-zoomable" src="../../../../images/integration-icons/awss3.svg" />
            <h3>AWS S3</h3>
            <p>Set up Wallarm to send files with the information about detected hits to your Amazon S3 bucket</p>
        </a>
        <a class="do-card" href="../minio/">
            <img class="non-zoomable" src="../../../../images/integration-icons/minio.svg" />
            <h3>MinIO</h3>
            <p>Set up Wallarm to export the data on detected malicious traffic to your MinIO S3-compatible bucket</p>
        </a>
    </div>
    <div class="do-nested" data-for="fluentd">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>Send notifications of detected events to Fluentd or use Fluentd as intermediate system to integrate with other systems</p>
        </div>
        <a class="do-card" href="../fluentd/">
            <h3>Native integration</h3>
            <p>Send notifications of detected events to Fluentd itself</p>
        </a>
        <div id="fluentd-intermediate" class="do-card">
            <h3>Fluentd as intermediate data connector</h3>
            <p>Use Fluentd as intermediate system to integrate with other systems</p>
        </div>
    </div>
    <div class="do-nested" data-for="fluentd-intermediate">
        <div class="do-card">
            <h3>Fluentd as intermediate data connector</h3>
            <p>Use Fluentd as intermediate system to integrate with other systems</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>Send logs to IBM QRadar via Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>Send logs to Splunk Enterprise via Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>Send notifications to Micro Focus ArcSight Logger via Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Send notifications to Datadog via Fluentd</p>
        </a>
    </div>
    <div class="do-nested" data-for="logstash">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>Send notifications of detected events to Logstash or use Logstash as intermediate system to integrate with other systems</p>
        </div>
        <a class="do-card" href="../logstash/">
            <h3>Native integration</h3>
            <p>Send notifications of detected events to Logstash itself</p>
        </a>
        <div id="logstash-intermediate" class="do-card">
            <h3>Logstash as intermediate data connector</h3>
            <p>Use Logstash as intermediate system to integrate with other systems</p>
        </div>
    </div>
    <div class="do-nested" data-for="logstash-intermediate">
        <div class="do-card">
            <h3>Logstash as intermediate data connector</h3>
            <p>Use Logstash as intermediate system to integrate with other systems</p>
        </div>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>Send logs to IBM QRadar via Logstash</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>Send logs to Splunk Enterprise via Logstash</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>Send notifications to Micro Focus ArcSight Logger via Logstash</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Send notifications to Datadog via Logstash</p>
        </a>
    </div>    
</div>

## Integrations via data collectors

<div class="do-section">
    <div class="do-main">
        <div id="ibm-qradar" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>Send logs to IBM QRadar via Fluentd or Logstash</p>
        </div>
        <div id="splunk-enterprise" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>Send logs to Splunk Enterprise via Fluentd or Logstash</p>
        </div>
        <div id="arcsight-logger" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>Send notifications to Micro Focus ArcSight Logger via Fluentd or Logstash</p>
        </div>
        <div id="datadogp" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Send events to Datadog Logs service via Fluentd or Logstash</p>
        </div>
    </div>
    <div class="do-nested" data-for="ibm-qradar">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>Send logs to IBM QRadar via Fluentd or Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>Send logs to IBM QRadar via Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>Send logs to IBM QRadar via Logstash</p>
        </a>
    </div>
    <div class="do-nested" data-for="splunk-enterprise">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>Send logs to Splunk Enterprise via Fluentd or Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>Send logs to Splunk Enterprise via Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>Send logs to Splunk Enterprise via Logstash</p>
        </a>
    </div>
    <div class="do-nested" data-for="arcsight-logger">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>Send notifications to Micro Focus ArcSight Logger via Fluentd or Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>Send notifications to Micro Focus ArcSight Logger via Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>Send notifications to Micro Focus ArcSight Logger via Logstash</p>
        </a>
    </div>
    <div class="do-nested" data-for="datadogp">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Send events to Datadog Logs service via Fluentd or Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Send logs to Datadog via Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Send logs to Datadog via Logstash</p>
        </a>
    </div>
</div>

## Other systems

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../webhook/">
            <img class="non-zoomable" src="../../../../images/integration-icons/webhook.svg" />
            <h3>Webhook</h3>
            <p>Universal connector: send instant notifications to any system that accepts incoming webhooks via HTTPS protocol</p>
        </a>
        <a class="do-card" href="mailto:sales@wallarm.com?subject=Request%20for%20integration%20between%20Wallarm%20and%20<SYSTEM>&body=Hello%20Wallarm%20Sales%20Team%2C%0AIn%20Wallarm%2C%20the%20integration%20with%20<SYSTEM>%20is%20not%20presented%2C%20although%20the%20ability%20to%20integrate%20with%20this%20system%20would%20be%20benefitial%20for%20us.%0A%0AWe%20would%20be%20grateful%20if%20you%20could%20consider%20the%20technical%20feasibility%20of%20this%20integration%20and%20are%20ready%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20our%20requirements%20in%20detail.%0A%0AWe%20are%20looking%20forward%20to%20your%20response.">
            <img class="non-zoomable" src="../../../../images/integration-icons/other-system.svg" />
            <h3>Request integration</h3>
            <p>If there is no system you are looking for, let us know. We will check the possibility of the integration and contact you.</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>
