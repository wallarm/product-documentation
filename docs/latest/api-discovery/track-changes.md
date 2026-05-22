# Tracking changes in API and MCP <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

If changes occur in your API or MCP servers, [API Discovery](overview.md) updates the built API inventory, highlights the changes and gives you information on when and what has changed. This applies to both REST/GraphQL/SOAP/gRPC endpoints and MCP primitives (tools, resources, prompts).<!-- Additionally, you can set up notifications on all or some of the changes.-->

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-changes.png)

## Overview

The company may have several teams, disparate programming languages, and a variety of language frameworks. Thus changes can come to API at any time from different sources which make them difficult to control. For security officers it is important to detect changes as soon as possible and analyze them. If missed, such changes may hold some risks, for example:

* The development team can start using a third-party library with a separate API and they do not notify the security specialists about that. This way the company gets endpoints that are not monitored and not checked for vulnerabilities. They can be potential attack directions.
* The PII data begin to be transferred to the endpoint. An unplanned transfer of PII can lead to a violation of compliance with the requirements of regulators, as well as lead to reputational risks.
* Important for the business logic endpoint (for example, `/login`, `/order/{order_id}/payment/`) is no longer called.
* Other parameters that should not be transferred, for example `is_admin` (someone accesses the endpoint and tries to do it with administrator rights) begin to be transferred to the endpoint.
* A new MCP tool or resource appears on an MCP server without the security team's knowledge, potentially exposing sensitive data or operations to AI agents.

## Highlighting changes in API

In the **Status** column for endpoints, MCP primitives, and their parameters, API Discovery provides data about changes for the last week:

* **New** for the endpoints or MCP primitives discovered within a week.
* **Changed** for the endpoints or MCP primitives that have newly discovered parameters or parameters that obtained the `Unused` status within the period. In the details of the endpoint or primitive, such parameters will have a corresponding mark.

    * A parameter gets the `New` status if it is discovered within the last week.
    * A parameter gets the `Unused` status if it does not pass any data for a week.
    * If later the parameter in the `Unused` status passes data again it will lose the `Unused` status.

* **Unused** for the endpoints or MCP primitives not requested (with the code 200 in response) within the last week or longer.

    * If later the endpoint or primitive in the `Unused` status is requested (with the code 200 in response) again it will lose the `Unused` status.

!!! warning "Unused endpoints are removed after 30 days"
    Endpoints that receive no qualifying requests for **30 days** since their last update are automatically removed from your API inventory, together with their parameters, sensitive-data history, authentication coverage, and risk-score evolution. **Removed entries cannot be restored.** If traffic to such an endpoint resumes later, the endpoint reappears as **New** and discovery starts over from scratch — past parameter information and history are not recovered.

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-changes.png)

Use **Changed since** filter to only see endpoints or MCP primitives changed in a specific time period, for example, today.

## Notifications

API Discovery can notify you about endpoint changes in two ways:

* **Email digests** — daily or hourly summaries of new and changed endpoints, delivered to your account email and any additional addresses.
* **Per-endpoint alerts via triggers** — one notification per changed endpoint, delivered through any configured integration (Slack, webhook, SIEM, PagerDuty, Microsoft Teams, Telegram, and others) using the **Changes in API** [trigger](../user-guides/triggers/triggers.md) condition.

### Email digests

You can [set up](setup.md#notifications) API Discovery email notifications to be sent to your personal email (the one you use to log in) and to any additional emails:

* Daily endpoint changes
* Hourly endpoint changes

The notification includes both changed and new endpoints. By default, email notifications are disabled.

### Per-endpoint alerts via triggers

To receive a notification for every endpoint that changes — and to deliver these notifications through any integration configured in your account — configure a Wallarm [trigger](../user-guides/triggers/triggers.md) with the **Changes in API** condition.

**How it works:**

* Every hour, API Discovery evaluates endpoints that changed since the previous run against all enabled **Changes in API** triggers for your account.
* For every REST endpoint whose status matches the trigger filters (**New**, **Changed**, or **Unused** — see [Highlighting changes in API](#highlighting-changes-in-api)), one event is sent to the integrations selected in the trigger's actions.
* Each event includes the endpoint's HTTP method, host, path, application, change type, and the list of parameters with their detected sensitive data types — so the receiving system has the full context without needing to open Wallarm Console.

!!! info "REST only"
    Currently, the **Changes in API** trigger evaluates only REST endpoints. Changes in GraphQL, SOAP, gRPC, and MCP primitives are not yet delivered through this trigger.

**Filters:**

When creating the trigger, you can narrow notifications using filters specific to the **Changes in API** condition:

| Filter | Values | Purpose |
|--------|--------|---------|
| **Application** | One or more [applications](../user-guides/settings/applications.md) | Notify only about changes in selected applications. |
| **API host** | One or more hostnames | Notify only about changes on selected hosts. |
| **Endpoint change type** | `New endpoints`, `Changed endpoints`, `Unused endpoints` | Notify only about a specific kind of change. |
| **Sensitive data** | One or more [sensitive data types](sensitive-data.md) | Notify only when the changed endpoint carries the selected sensitive data types — useful for monitoring PCI- or PII-scoped APIs. |

All filters accept multiple values. If you set several filters, they are combined with AND — all conditions must match for the notification to be sent.

**Event attributes:**

Each event represents one changed endpoint. The table below lists the **maximum** set of attributes the event can carry; the actual fields that reach the receiving system depend on the integration (delivery) type selected in the trigger's action. Structured channels (webhook, SIEM) typically receive the full payload, while message-oriented channels (Slack, Microsoft Teams, Telegram, email) render a condensed summary built from the same attributes.

| Attribute | Description |
|-----------|-------------|
| `summary` | Short headline of the event, used by message-oriented integrations as the message title. |
| `description` | Human-readable summary line describing what changed. |
| `details.notification_type` | Always `api_structure_changed` for this trigger. |
| `details.client_name` | Wallarm client (account) name. |
| `details.partner_name` | Wallarm partner name. |
| `details.cloud` | Wallarm cloud — for example, `US`, `EU`, or `ME`. |
| `details.application` | Name of the [application](../user-guides/settings/applications.md) the endpoint belongs to. |
| `details.domain` | Hostname on which the endpoint was discovered. |
| `details.endpoint_path` | Path of the endpoint. |
| `details.http_method` | HTTP method — `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and so on. |
| `details.change_type` | Kind of change on the endpoint: `added`, `changed`, or `unused`. |
| `details.link` | Deep link that opens the endpoint in API Discovery in Wallarm Console. |
| `details.changed_parameters` | Array of endpoint parameters that caused or accompanied the change. |
| `details.changed_parameters[].point` | Path-like location of the parameter — for example, `["header", "ACCEPT"]` for a request header named `ACCEPT`, or `["response_header", "CONTENT-TYPE"]` for a response header. |
| `details.changed_parameters[].name` | Parameter name. |
| `details.changed_parameters[].type` | Parameter class — for example, `header`, `response_header`, `request_body`. |
| `details.changed_parameters[].change_type` | Whether the parameter itself is `new` or `changed`. |
| `details.language` | Language code of the rendered `summary` and `description` — for example, `en`. |

**Example: notify in Slack when new endpoints appear on `example.com`**

![Changes in API trigger](../images/user-guides/triggers/trigger-example-changes-in-api.png)

1. Configure a Slack [integration](../user-guides/settings/integrations/slack.md) in Wallarm Console → **Integrations** in the [US](https://us1.my.wallarm.com/integrations/), [EU](https://my.wallarm.com/integrations/), or [ME](https://me1.my.wallarm.com/integrations/) cloud.
1. Go to the **Triggers** section and create a trigger with the **Changes in API** condition. Set the **API host** filter to `example.com` and the **Endpoint change type** filter to `New endpoints`. Select the Slack integration as the action.
1. Send several requests to `example.com/users` to receive the `200` (`OK`) response.
1. In the **API Discovery** section, verify that the endpoint appears with the **New** mark.
1. Within an hour, a message summarizing the new endpoint and any sensitive data it carries arrives in your Slack channel.
