# Wallarm service status page

This guide contains details on the Wallarm service status page.

## Does Wallarm have the page which displays the status of Wallarm service availability?

Yes, the Wallarm status page is available at https://status.wallarm.com. The page displays live and historical data on the availability of Wallarm Console and Wallarm API services for each Wallarm Cloud:

* **Wallarm US Cloud**
* **Wallarm EU Cloud**

![Wallarm status page](../images/status-page.png)

## Will I receive a notification when a service status changes?

Yes, if you are subscribed to updates. To subscribe, please click **SUBSCRIBE TO UPDATES** and select the subscription channel:

* **Email** to receive notifications when Wallarm creates, updates, or resolves an incident.
* **SMS** to receive notifications when Wallarm creates or resolves an incident.
* **Slack** to receive incident updates and maintenance status messages.
* **Webhook** to receive notifications when Wallarm creates an incident, updates an incident, resolves an incident, or changes a service status.

## What do the services statuses mean?

* **Degraded performance** means the service is working but is slow or otherwise impacted in a minor way.
* **Partial outage** means the services are completely broken for a subset of clients.
* **Major outage** means services are completely unavailable.

## When is an incident created?

Incidents are created when services are having downtime. During a downtime-related event, we add a page describing the issue, what we are doing about it, and when we expect the issue will be fixed.

As time goes on, the cause of the incident is identified, the identified incident is then repaired, and the incident status is updated to reflect the current status.
