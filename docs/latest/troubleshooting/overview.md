# Wallarm Troubleshooting Overview

If you have some problem when working with Wallarm, the following tools are in your hands:

1. This documentation, explaining logic of how things work
1. This **Troubleshooting** section in the documentation

    !!! info "How to use docs"
        Use search, ask AI bot, browse topics in the left menu.

1. Wallarm [service status page](#wallarm-service-status-page)
1. Wallarm [filtering node logs](../admin-en/configure-logging.md)
1. Wallarm [filtering node statistics](../admin-en/configure-statistics-service.md)

## Wallarm service status page

Wallarm status page is available at https://status.wallarm.com. The page displays live and historical data on the availability of Wallarm Console and Wallarm API services for each Wallarm Cloud:

* **Wallarm US Cloud**
* **Wallarm EU Cloud**

![Wallarm status page](../images/status-page.png)

### Statuses

* **Degraded performance** means the service is working but is slow or otherwise impacted in a minor way.
* **Partial outage** means the services are completely broken for a subset of clients.
* **Major outage** means services are completely unavailable.

### Notifications

Yes, if you are subscribed to updates. To subscribe, please click **SUBSCRIBE TO UPDATES** and select the subscription channel:

* **Email** to receive notifications when Wallarm creates, updates, or resolves an incident.
* **SMS** to receive notifications when Wallarm creates or resolves an incident.
* **Slack** to receive incident updates and maintenance status messages.
* **Webhook** to receive notifications when Wallarm creates an incident, updates an incident, resolves an incident, or changes a service status.

### Automatic incident creation

Incidents are created when services are having downtime. During a downtime-related event, we add a page describing the issue, what we are doing about it, and when we expect the issue will be fixed.

As time goes on, the cause of the incident is identified, the identified incident is then repaired, and the incident status is updated to reflect the current status.
