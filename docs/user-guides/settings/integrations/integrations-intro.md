[integration-pane-img]:         ../../../images/user-guides/settings/integration-pane.png
[add-integration-img]:          ../../../images/user-guides/settings/add-integration-button.png
[disable-button]:               ../../../images/user-guides/settings/disable-button.png

[email-notifications]:          ./email.md
[slack-notifications]:          ./slack.md
[telegram-notifications]:       ./telegram.md
[opsgenie-notifications]:       ./opsgenie.md
[pagerduty-notifications]:      ./pagerduty.md
[splunk-notifications]:         ./splunk.md
[sumologic-notifications]:      ./sumologic.md
[account]:                      ../account.md

#   Integrations Overview

The *Integrations* tab of the *Settings* section allows you to configure reports and notifications on various events.

All integrations are divided into the following blocks:
*   **Reports**:
    *   **Personal**—the reports that are sent to your email. You can also configure these reports on the [*Profile*][account] tab of the *Settings* section.
    *   **Email reports**—[configure][email-notifications] the list of other email addresses that the reports should be sent to.
    *   **Slack**—[configure][slack-notifications] your team's Slack channel notifications.
    *   **Telegram**—[configure][telegram-notifications] the Telegram reports and notifications.
    *   **Sumo Logic** — [configure][sumologic-notifications] the Sumo Logic notifications.
*   **Incident management**:
    *   **OpsGenie** — [configure][opsgenie-notifications] the OpsGenie notifications.
    *   **PagerDuty** — [configure][pagerduty-notifications] the PagerDuty notifications.
    *   **Splunk** — [configure][splunk-notifications] the Splunk notifications.
    *   **Sumo Logic** — [configure][sumologic-notifications] the Sumo Logic notifications.

![!Integrations Overview][integration-pane-img]

You can use the *Add integration* button in the top right corner to add new integrations in addition to the displayed blocks.

![!Adding Integrations][add-integration-img]

You can use the *All*, *Enabled*, and *Disabled* buttons in the top part of the *Integrations* tab to filter the displayed integrations.

![!Filtering Integrations][disable-button]