# Integrations Overview

Being your shield against the OWASP API Top 10 threats, API abuse, and automated threats, Wallarm takes your security a step further by seamlessly integrating with an extensive range of systems to keep you informed in real-time.

With Wallarm's integrations you will always stay informed about critical events, including:

* Instant alerts about [detected hits](../../../user-guides/events/check-attack.md), so you can take immediate action against the threats.
* Updates on system events (changes in registered [users](../../../user-guides/settings/users.md), integrations, and [applications](../../../user-guides/settings/applications.md)), ensuring you're always in control.
* Notification on important changes in your security profile, such as your [rules](../../../user-guides/rules/intro.md) and [triggers](../../../user-guides/triggers/triggers.md) changes.
* Timely warnings about potential [vulnerabilities](../../../about-wallarm/detecting-vulnerabilities.md) in your infrastructure and their risk levels, so you can proactively address the most dangerous weaknesses.

Manage the feature at:

* The **Integrations** section of Wallarm Console.

    !!! info "Administrator access"
        The section is available only for users with the **Administrator** role.

    ![Integrations](../../../images/user-guides/settings/integrations/integration-panel.png)

* The **Triggers** section for configuring additional alerts for your integrations via triggers. See details in the articles by system you integrate with.

Wallarm connects effortlessly with a number of existing tools and platforms. The number of integrations with one system is not limited.

<link rel="stylesheet" href="/supported-platforms.css?v=1" />

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
        <a class="do-card" href="../datadog/">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Send events to Datadog Logs service</p>
        </a>
    </div>
</div>

## Data collectors

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../fluentd/">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>Send notifications of detected events to Fluentd</p>
        </a>
        <a class="do-card" href="../logstash/">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>Send notifications of detected events to Logstash</p>
        </a>
        <a class="do-card" href="../amazon-s3/">
            <img class="non-zoomable" src="../../../../images/integration-icons/awss3.svg" />
            <h3>AWS S3</h3>
            <p>Set up Wallarm to send files with the information about detected hits to your Amazon S3 bucket</p>
        </a>
    </div>
</div>

## Universal integrations and other systems

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../webhook/">
            <img class="non-zoomable" src="../../../../images/integration-icons/webhook.svg" />
            <h3>Webhook</h3>
            <p>Send instant notifications to any system that accepts incoming webhooks via HTTPS protocol</p>
        </a>
        <a class="do-card" href="mailto: support@wallarm.com">
            <img class="non-zoomable" src="../../../../images/integration-icons/other-system.svg" />
            <h3>Other systems</h3>
            <p>If there is no system you are looking for, <b>let us know</b>. We will check the technical possibility of integration with the requested system and contact you.</p>
        </a>

    </div>
</div>

<script src="/supported-platforms.js?v=1"></script>
