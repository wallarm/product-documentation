The **Discovered inventory** dashboard is the home screen for Wallarm's [**API Discovery**][apid-overview]. It opens on the questions security teams ask first about their API estate:

* Which of my hosts are reachable from the internet?
* Which of my APIs are called **without authentication**?
* Which endpoints are **not in my specification** (shadow and zombie APIs)?
* Which endpoints carry **sensitive data** or have open **security issues**?
* Which endpoints are **attacked the most**?

Everything on the dashboard is built from the same traffic analysis that produces your [API inventory][apid-overview] — there is nothing extra to install or enable.

## Opening the dashboard

In Wallarm Console, go to **Dashboards → Discovered inventory**.

The dashboard has two tabs:

* **APIs** — your REST, GraphQL, SOAP, and gRPC endpoints.
* **MCP Servers** — appears only when API Discovery finds [MCP servers](overview.md#supported-protocols) in your traffic. It carries the same widgets, described for MCP primitives (tools, prompts, and resources).

!!! info "No empty cards"
    A widget with nothing to report is hidden. If a tenant has no MCP traffic, the **MCP Servers** tab does not appear; if no sensitive data is found, the sensitive-data widgets are not shown.

## APIs tab

![Discovered inventory — APIs tab](../images/about-wallarm-waf/api-discovery-2.0/discovered-inventory-apis.png)

The tab leads with what needs attention first:

| Widget | What it shows |
| --- | --- |
| **External hosts** | How many of your hosts are reachable from the internet versus internal-only. See [Host exposure (external vs. internal)](#host-exposure-external-vs-internal) below. |
| **APIs by authentication type** | The share of endpoints called **without authentication** versus authenticated. See [Authentication detection](#authentication-detection) below. |
| **REST APIs by rogue status** | [Shadow and zombie][apid-rogue] endpoints as a share of your REST APIs — traffic that does not match your uploaded specification. |
| **Entries with issues** | The share of endpoints with open [security issues](../api-attack-surface/security-issues.md) (vulnerabilities). |
| **APIs with sensitive data** | Endpoints broken down by the class of [sensitive data](sensitive-data.md) they carry (Technical, Personal, Credentials, Financial). |
| **APIs by protocol** | Your inventory split across REST, GraphQL, SOAP, gRPC, and MCP. |
| **By change status** | A chart of new and changed endpoints over the [last 7 days][apid-track-changes]. |
| **Sensitive data discovered** | The specific [sensitive-data types](sensitive-data.md) found (Token, Email, JWT, Credit card number, and others), with the number of entries carrying each. |
| **Assets requiring attention** | The endpoints to look at first — see [Assets requiring attention](#assets-requiring-attention) below. |

## MCP Servers tab

When API Discovery finds [MCP servers](overview.md#supported-protocols) in your traffic, the **MCP Servers** tab gives them the same treatment, measured in MCP primitives:

![Discovered inventory — MCP Servers tab](../images/about-wallarm-waf/api-discovery-2.0/discovered-inventory-mcp.png)

* **External exposure**, **MCP primitives by authentication type**, **MCP primitives with sensitive data**, and **By change status** mirror the APIs tab.
* **MCP primitives by risk level** groups the discovered primitives into High / Medium / Low risk.
* **MCP primitives discovered** splits them by type — **Tools**, **Prompts**, and **Resources**.
* **MCP servers** lists each discovered server and the number of primitives it exposes.
* **Assets requiring attention** ranks individual MCP primitives by attack ratio, exactly as it ranks endpoints on the APIs tab.

## Authentication detection

The **APIs by authentication type** widget (and its MCP equivalent) is built on API Discovery's [authentication flow detection](authentication.md), which reads live traffic to separate authenticated endpoints from those called **without authentication** — the metric this widget leads with.

See [Authentication Flow Detection](authentication.md) for how it works: the authentication types and default parameters detected automatically, the 7-day observation window, the node-version requirements, and how to register custom authentication parameters.

## Host exposure (external vs. internal)

The **External hosts** widget, and the **Exposure** filter in the [API inventory](exploring.md#filtering), classify every discovered host as **External** (reachable from the public internet), **Internal**, or **Unknown**. This is the fastest way to narrow your attention to your true attack surface — an internet-facing endpoint with no authentication matters far more than an identical endpoint that only serves a private network.

See [Host exposure (external vs. internal)](exploring.md#host-exposure-external-vs-internal) for how each host is classified and how often it is refreshed. Click the **External** segment of the widget to list every endpoint on an internet-facing host.

## Assets requiring attention

The **Assets requiring attention** table lists the 10 endpoints (or MCP primitives) with the highest **attack ratio** — [attack requests][check-attack] as a share of total requests. An endpoint where most requests are attacks ranks above a busy endpoint that sees only a few, so the list surfaces what is actually under pressure rather than what is merely high-traffic.

![Assets requiring attention, with discovered sensitive data alongside](../images/about-wallarm-waf/api-discovery-2.0/discovered-inventory-apis-attention.png)

| Column | Description |
| --- | --- |
| **Endpoints** | The endpoint path and its host. |
| **Requests** | Total requests over the period. |
| **Attacks** | Requests detected as [attacks][check-attack]. |
| **Attack ratio** | Attack requests as a percentage of total requests. |
| **Issues** | A flag showing why the endpoint stands out — for example a **Shadow** or **Zombie** [rogue status][apid-rogue], or an open [security issue](../api-attack-surface/security-issues.md). |

## 7-day trends

The **APIs by authentication type**, **REST APIs by rogue status**, **Entries with issues**, and **APIs with sensitive data** widgets each show how their value changed over the **last 7 days**, and the **By change status** chart plots new and changed endpoints over time, so you can see your inventory growing and shifting rather than only its current size. Change tracking is described in [Track API Changes][apid-track-changes].

## Drilling down to endpoints

Every widget is a launch point into the [API inventory](exploring.md). Click a number, a donut slice, a bar, or a table row to open the matching endpoint list with the filters already applied — for example, click the unauthenticated slice to open the inventory filtered to endpoints with no authentication, or click a sensitive-data type to open the endpoints carrying it.
