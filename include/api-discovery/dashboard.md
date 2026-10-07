The **Discovered inventory** dashboard is the home screen for Wallarm's [**API Discovery**][apid-overview]. It opens on the questions security teams ask first about their API estate:

* Which of my hosts are reachable from the internet?
* Which of my APIs are called **without authentication**?
* Which endpoints are **not in my specification** (shadow and zombie APIs)?
* Which endpoints carry **sensitive data** or have open **security issues**?
* Which endpoints are **under attack** right now?

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

The top row leads with what needs attention first:

| Widget | What it shows |
| --- | --- |
| **External hosts** | How many of your hosts are reachable from the internet versus internal-only. See [Host exposure (external vs. internal)](#host-exposure-external-vs-internal) below. |
| **APIs by authentication type** | The share of endpoints called **without authentication** versus authenticated. See [Authentication detection](#authentication-detection) below. |
| **REST APIs by rogue status** | [Shadow and zombie][apid-rogue] endpoints as a share of your REST APIs — traffic that does not match your uploaded specification. |
| **Entries with issues** | The share of endpoints with open [security issues](../api-attack-surface/security-issues.md) (vulnerabilities). |
| **APIs with sensitive data** | Endpoints broken down by the class of [sensitive data](sensitive-data.md) they carry (Technical, Personal, Credentials, Financial). |
| **APIs by protocol** | Your inventory split across REST, GraphQL, SOAP, gRPC, and MCP. |

Below the top row:

* **By change status** — a chart of new and changed endpoints over the [last 7 days][apid-track-changes].
* **Sensitive data discovered** — the specific [sensitive-data types](sensitive-data.md) found (Token, Email, JWT, Credit card number, and others), with the number of entries carrying each.
* **Assets requiring attention** — see [Assets requiring attention](#assets-requiring-attention) below.

## MCP Servers tab

When API Discovery finds [MCP servers](overview.md#supported-protocols) in your traffic, the **MCP Servers** tab gives them the same treatment, measured in MCP primitives:

![Discovered inventory — MCP Servers tab](../images/about-wallarm-waf/api-discovery-2.0/discovered-inventory-mcp.png)

* **External exposure**, **MCP primitives by authentication type**, **MCP primitives with sensitive data**, and **By change status** mirror the APIs tab.
* **MCP primitives by risk level** groups the discovered primitives into High / Medium / Low risk.
* **MCP primitives discovered** splits them by type — **Tools**, **Prompts**, and **Resources**.
* **MCP servers** lists each discovered server and the number of primitives it exposes.
* **Assets requiring attention** ranks individual MCP primitives by attack ratio, exactly as it ranks endpoints on the APIs tab.

## Authentication detection

The **APIs by authentication type** widget (and its MCP equivalent) is built on API Discovery's [authentication flow detection](authentication.md). It is worth understanding how the "no authentication" number is produced, because it drives one of the dashboard's headline metrics.

* **Automatic, no configuration.** API Discovery inspects HTTP headers and request parameters in live traffic and recognizes the common [authentication types](authentication.md#default-authentication-types) (API key, Bearer, Basic, Cookie-based, AWS Signature v4, and others) and a [curated list of default authentication parameter names](authentication.md#default-authentication-parameters) out of the box.
* **Custom parameters.** If your APIs authenticate with a non-standard header, cookie, query, or body parameter, add it to the per-tenant detection list so those requests are counted as authenticated — see [Customizing detected authentication parameters](authentication.md#customizing-detected-authentication-parameters). Until a custom parameter is registered, requests that carry only that parameter are counted as **unauthenticated**.
* **7-day sliding window.** An endpoint's authentication status reflects the **last 7 days of traffic** — the share of requests that carried a valid authentication value. Newly added authentication first appears as **Partial** and moves to **Consistent** as the 7-day window fills. The statuses are:

    | Status | Condition |
    | --- | --- |
    | **Consistent** | 95%+ of requests authenticated |
    | **Partial** | 0–95% of requests authenticated |
    | **Missing** | 0% of requests authenticated |

* **Node version requirements.** Authentication flow detection requires [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.11.0+ or [Native Node](../installation/nginx-native-node-internals.md#native-node) 0.24.0+. On older nodes, endpoints have no authentication data and are not counted as authenticated.

See [Authentication Flow Detection](authentication.md) for the full default parameter list, the per-endpoint **Authentication** tab, and the API to extend detection.

## Host exposure (external vs. internal)

The **External hosts** widget, and the **Exposure** filter in the [API inventory](exploring.md#filtering), classify every discovered host by whether it is reachable from the public internet. This is the fastest way to narrow your attention to your true attack surface — an internet-facing endpoint with no authentication matters far more than an identical endpoint that only serves a private network.

Each host is classified into one of three statuses:

| Status | Meaning |
| --- | --- |
| **External** (`public`) | Reachable from the public internet — the host is a public IP address, or a hostname that resolves to one. |
| **Internal** (`internal`) | Not reachable from the public internet — a private (RFC 1918 / RFC 4193), loopback, or link-local IP; a dot-less short name such as `srv01`; or a hostname that public DNS does not know or that resolves only to private addresses. |
| **Unknown** (`unknown`) | Could not be classified — for example, the hostname could not be resolved. |

How the classification is made:

* If the host is an **IP literal** (IPv4 or IPv6), it is classified directly by its address range — private, loopback, and link-local ranges are **Internal**; any other routable address is **External**.
* If the host is a **hostname**, Wallarm resolves it against **public DNS resolvers** (not your internal DNS) to determine what the public internet sees. This is deliberate: in a split-horizon DNS setup, internal resolvers may return private addresses for a name that is in fact publicly reachable, so Wallarm checks the public view.
* A hostname that public DNS does not know (an authoritative *no such name* answer) is treated as **Internal**, on the assumption it lives on a private network.

!!! info "Refresh and requirements"
    Host exposure is recalculated on a regular schedule (hourly), so a newly discovered host appears as **Unknown** until its first classification, and a host that moves between private and public addressing updates on the next cycle. Classification depends on API Discovery being able to reach public DNS from the Wallarm node environment; where outbound DNS is blocked, hosts stay **Unknown** and self-heal once it is restored.

To drill in, click the **External** segment of the widget (or open the inventory and set the **Exposure** filter to **External**) to list every endpoint on an internet-facing host.

## Assets requiring attention

The **Assets requiring attention** table lists the 10 endpoints (or MCP primitives) with the highest **attack ratio** — [attacks][check-attack] as a share of total requests. An endpoint where most requests are attacks ranks above a busy endpoint that sees only a few, so the list surfaces what is actually under pressure rather than what is merely high-traffic.

![Assets requiring attention, with discovered sensitive data alongside](../images/about-wallarm-waf/api-discovery-2.0/discovered-inventory-apis-attention.png)

| Column | Description |
| --- | --- |
| **Endpoints** | The endpoint path and its host. |
| **Requests** | Total requests over the period. |
| **Attacks** | Requests detected as [attacks][check-attack]. |
| **Attack ratio** | Attacks as a percentage of requests. |
| **Issues** | A flag showing why the endpoint stands out — for example a **Shadow** or **Zombie** [rogue status][apid-rogue], or an open [security issue](../api-attack-surface/security-issues.md). |

## 7-day trends

Each widget that has history shows how its value changed over the **last 7 days**, and the **By change status** chart plots new and changed endpoints over time, so you can see your inventory growing and shifting rather than only its current size. Change tracking is described in [Track API Changes][apid-track-changes].

## Everything is clickable

The dashboard is a launch point into [API Discovery](exploring.md), not a dead end. Click a number, a donut slice, a bar, or a table row to open the matching endpoint list with the filters already applied — for example, click the unauthenticated slice to open the inventory filtered to endpoints with no authentication, or click a sensitive-data type to open the endpoints carrying it.
