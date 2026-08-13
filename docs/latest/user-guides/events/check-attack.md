[link-sessions]:        ../../api-sessions/overview.md

# Attack Analysis

This article explains how to analyze attacks detected by Wallarm and respond to them.

Wallarm displays detected [attacks](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) in the **Attacks** section of Wallarm Console. There, Wallarm groups malicious requests into attacks and summarizes them with statistics, and you can open any attack to inspect its individual requests and respond to them.

In Wallarm:

* **Attack** is a group of malicious requests that share the grouping attributes you selected
* **Request** is an original malicious request plus metadata added by the node
* **Malicious payload** is a part of the request with an attack sign

Read details [here](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components).

## Attacks page

![Attacks section](../../images/user-guides/events/attacks-page.png)

The page presents attacks for the selected period and lets you shape what you see:

* **Views** are tabs above the filter. Each view stores a filter, a grouping, a time range, and a column layout, so you can switch between saved perspectives on your attack data in one click. See [Attack Search and Filters](../search-and-filters/attack-filters.md#views).
* The time range selector limits the data to a period of up to 6 months.
* **Group by** controls how requests are combined into attacks: by attack type (the default), by source IP, not at all, or by a custom combination of up to 4 attributes. See [Attack Search and Filters](../search-and-filters/attack-filters.md#grouping).
* The filter field narrows the list down to the attacks you are interested in. See [Attack Search and Filters](../search-and-filters/attack-filters.md).
* **Statistic** is a collapsible panel with charts summarizing the filtered data: requests with attacks over time, top source IPs, status code breakdown, top attacked endpoints and hosts, top attack types and subtypes. Clicking an element of a chart drills into the corresponding attacks.

The table below the panel lists the attacks themselves. Use **Table settings** to choose, reorder, resize, and pin columns; the column set is stored in the view. To get the data outside of Wallarm Console, use [**Export attacks as CSV**](../search-and-filters/custom-report.md#attacks).

## Attack details

Clicking an attack opens a resizable drawer with the attack details. The drawer stays open while you click through the table, so you can compare attacks without losing your place.

### Overview

The **Overview** tab summarizes the attack: its status, type, when it was first and last seen, the sessions, users, and source IPs involved, a timeline of its requests, and the distribution of its top hosts and response status codes.

![Attack details - Overview](../../images/user-guides/events/attack-drawer-overview.png)

The **Status** field shows what the [node did with the attack](../../admin-en/configure-wallarm-mode.md):

* **Blocked** - all requests of the attack were blocked by the filtering node.
* **Partially Blocked** - some requests of the attack were blocked and others were only registered.
* **Monitoring** - all requests of the attack were registered but not blocked.

### Requests

The **Requests** tab lists the individual malicious requests of the attack and shows the details of the selected one.

![Attack details - Requests](../../images/user-guides/events/attack-drawer-requests.png)

Request details include the source IP, user, host, URI, request and session identifiers, and, for each detected attack sign, the malicious payload, the request point it was found in, and the [CWE, OWASP, and CAPEC classifications](../../attacks-vulns-list.md). **Full request** shows the complete HTTP request, which you can copy as raw HTTP or as a cURL command.

Only unique requests are stored in the attack details. Repeated malicious requests are dropped from uploading to the Wallarm Cloud and not displayed. This process is called [hit sampling](grouping-sampling.md#sampling-of-hits). Hit sampling does not affect the quality of attack detection and Wallarm node continues to protect your applications and APIs even with hit sampling enabled.

Use the checkboxes to select several requests and apply an action to all of them at once. The filter field above the list narrows the requests down within the open attack.

## Responding to attacks

It is important to understand if your applications and APIs are properly protected from the attacks to have the possibility to adjust the protection measures if necessary. You can use information from the **Attacks** section to get this understanding and respond correspondingly.

### Actions on an attack sign

These response actions are available at the request level. Open an attack, switch to the **Requests** tab, and select a request: each detected attack sign in its details carries an action bar with the measures available for it. Wallarm decides which actions apply and shows only those:

| Action | Purpose |
| -- | -- |
| **Mark as** → **TP** / **FP** | Confirm the detection as a true positive, or mark it as a [false positive](#false-positives). |
| **FP rule** | Create a [rule](#false-positives) that skips detection of this attack sign in similar requests. |
| **Add to IP list** | Add the source IP to the [denylist or allowlist](../ip-lists/overview.md). |
| **Open Mitigation control** | Open the [mitigation control](../../about-wallarm/mitigation-controls-overview.md) that reacted to the request and adjust it. |
| **View API Abuse profile** | Open the [API Abuse Prevention](../../api-abuse-prevention/overview.md) profile that detected the bot. |
| **Add IP to exception list** | Add the source IP to the [API Abuse Prevention exception list](../../api-abuse-prevention/exceptions.md). |
| **Open Spec Enforcement Policy** | Open the violated [API specification](../../api-specification-enforcement/overview.md) and adjust its settings. |

### Adjusting protection by attack type

To respond to an attack, identify what type of attack took place, understand which Wallarm mechanism reacted to it, and adjust that mechanism if necessary. The table below maps attack types to the mechanism behind them and to the place where you tune it.

| Attack type | Detected by | Where to adjust |
| -- | -- | -- |
| **SQL Injection**, **Cross-site Scripting**, **Remote Code Execution**, **Path traversal**, **CRLF Injection**, **NoSQL Injection** and other [input validation attacks](../../attacks-vulns-list.md#attack-types) | [Standard detectors](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection) | [Rules](../rules/rules.md) and the [filtration mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) of the application, host, or endpoint |
| Attacks detected by a regexp-based rule | [Custom attack detector](../rules/regex-rule.md) | The [regexp-based rule](../rules/regex-rule.md) that matched, which you can also [partially disable](../rules/regex-rule.md#partial-disabling) |
| **Virtual patch** | [Virtual patch](../rules/vpatch-rule.md) | The virtual patch rule. Virtual patches work regardless of the filtration mode |
| **Brute force**, **Forced browsing**, **Broken Object Level Authorization**, **Enumeration**, **Custom logic abuse**, **File upload violation** | [Mitigation control](../../about-wallarm/mitigation-controls-overview.md) or [trigger](../triggers/triggers.md) | **Open Mitigation control**, or the trigger in **Triggers**. If the source was denylisted, the [IP list](../ip-lists/overview.md#requests-from-denylisted-ips) entry |
| **Blocked source** | [IP lists](../ip-lists/overview.md#requests-from-denylisted-ips) | The denylist entry for the source IP |
| **Suspicious API activity**, **Account takeover**, **Security crawlers**, **Scraping**, **Unrestricted resource consumption** ([details](../../attacks-vulns-list.md#api-abuse)) | [API Abuse Prevention](../../api-abuse-prevention/overview.md) | **View API Abuse profile** to review the [detection confidence](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works) and [change the profile](../../api-abuse-prevention/setup.md#creating-profiles), or **Add IP to exception list** to [exempt the source IP](../../api-abuse-prevention/exceptions.md) |
| **Undefined endpoint**, **Undefined parameter**, **Invalid parameter**, **Missing parameter**, **Missing authentication**, **Invalid request** ([details](../../attacks-vulns-list.md#api-specification)) | [API Specification Enforcement](../../api-specification-enforcement/overview.md) | **Open Spec Enforcement Policy** |
| **GraphQL query size**, **GraphQL value size**, **GraphQL query depth**, **GraphQL aliases**, **GraphQL batching**, **GraphQL introspection**, **GraphQL debug** ([details](../../attacks-vulns-list.md#graphql-attacks)) | [GraphQL API Protection](../../api-protection/graphql-rule.md) | The **Detect GraphQL attacks** rule |
| **Credential stuffing** | [Credential Stuffing Detection](../../about-wallarm/credential-stuffing.md) | The [Credential Stuffing configuration](../../about-wallarm/credential-stuffing.md#configuring), specifically the monitored authentication endpoints |
| **System prompt retrieval**, **Prompt injection**, **Custom AI payload inspection** | [AI Payload Inspection](../../agentic-ai/ai-payload-inspection.md) mitigation control | **Open Mitigation control** |
| **ACL violation**, **MCP request verification failure**, **Invalid tool call** | [MCP mitigation controls](../../agentic-ai/mcp-mitigation-controls.md) | **Open Mitigation control** |

Before adjusting, it is worth [investigating the full context](#full-context-of-threat-actor-activities) of the attack's requests: the session they belong to and the full sequence of requests in it. This shows all activity of the threat actor and what resources can be compromised.

## False positives

A [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) occurs when [attack signs](../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) are detected in a legitimate request.

You can handle it in two ways, depending on whether you only want to correct the data or also change what the node detects.

### Mark as false positive

Marking removes the request from the attack statistics and hides it from the attack list, so your data reflects that the detection was not real. It does **not** change detection — the node still flags identical requests in future.

In the request details, use **Mark as false positive (FP)** (select several requests first to mark them at once). The same action reverts a mark.

Wallarm hides false positives by default — to review them, filter by **Verification Status**.

### Create a false-positive rule

To stop the node from **detecting** such requests in future, use **FP rule** — a prefilled [rule](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types) where you choose how broadly to skip detection for the attacked parameter, from narrowest to broadest:

* **Ignore this stamp for this parameter** — this exact attack sign (stamp) in the parameter.
* **Ignore this attack subtype for this parameter** — this attack subtype in the parameter.
* **Ignore this attack for this parameter** — this attack type in the parameter regardless of a malicious payload.
* **Ignore all attacks for this parameter** — all attacks in the parameter.
* **Create a custom rule** — open the rule editor to define the conditions and action yourself.

![Create a false-positive rule for an attack](../../images/user-guides/events/attack-false-positive-rule.png)

## Full context of threat actor activities

Once the malicious request is detected by Wallarm and displayed in the **Attacks** section as the part of some attack, you can see the full context of this request: to which user session it belongs and what the full sequence of requests in this session is. This allows you to investigate all activity of the threat actor to understand attack vectors and what resources can be compromised.

To perform this analysis, open the attack, switch to the **Requests** tab, and select a request. In the request details, open the **Session ID** field menu and select **Investigate this attack in API Sessions**. Wallarm opens the [**API Sessions**][link-sessions] section filtered: the session that the initial request belongs to is displayed; only the initial request is displayed within this session.

![Investigating an attack request in API Sessions](../../images/user-guides/events/attack-open-request-in-sessions.png)

Remove the filter by request ID to see all other requests in the session: now you have the full picture of what was going on within the session the malicious request belongs to.

## Sharing an attack or request

To pass an attack to a colleague, use the share button in the attack details. Wallarm generates a link that opens the same attack with the same filter and time range applied, so the recipient sees exactly what you see.

You can also share an individual request. In the **Requests** tab, open the request and use its share button. Wallarm generates a link that opens the same request within its attack.

## Dashboards

Wallarm provides comprehensive dashboards to help you analyze detected attacks.

Wallarm's [Threat Prevention](../dashboards/threat-prevention.md) dashboard provides general metrics on your system's security posture, including multi-aspect information about attacks: their sources, targets, types and protocols.

![Threat Prevention dashboard](../../images/user-guides/dashboard/threat-prevention.png)

The [OWASP API Security Top 10](../dashboards/owasp-api-top-ten.md) dashboard provides detailed visibility into your system's security posture against the OWASP API Top 10 threats, including attack information.

![OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Notifications

Wallarm can send you notifications on detected attacks, hits and malicious payloads. It allows you to be aware of attempts to attack your system and analyze detected malicious traffic promptly. Analyzing malicious traffic includes reporting false positives, allowlisting IPs originating legitimate requests and denylisting IPs of attack sources.

To configure notifications:

1. Configure [native integrations](../settings/integrations/integrations-intro.md) with the systems to send notifications (e.g. PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. Set the conditions for sending notifications:

    * To get notifications on each detected hit, select the appropriate option in the integration settings.

        ??? info "See the example of the notification about detected hit in the JSON format"
            ```json
            [
                {
                    "summary": "[Wallarm] New hit detected",
                    "details": {
                    "client_name": "TestCompany",
                    "cloud": "EU",
                    "notification_type": "new_hits",
                    "hit": {
                        "domain": "www.example.com",
                        "heur_distance": 0.01111,
                        "method": "POST",
                        "parameter": "SOME_value",
                        "path": "/news/some_path",
                        "payloads": [
                            "say ni"
                        ],
                        "point": [
                            "post"
                        ],
                        "probability": 0.01,
                        "remote_country": "PL",
                        "remote_port": 0,
                        "remote_addr4": "8.8.8.8",
                        "remote_addr6": "",
                        "tor": "none",
                        "request_time": 1603834606,
                        "create_time": 1603834608,
                        "response_len": 14,
                        "response_status": 200,
                        "response_time": 5,
                        "stamps": [
                            1111
                        ],
                        "regex": [],
                        "stamps_hash": -22222,
                        "regex_hash": -33333,
                        "type": "sqli",
                        "block_status": "monitored",
                        "id": [
                            "hits_production_999_202010_v_1",
                            "c2dd33831a13be0d_AC9"
                        ],
                        "object_type": "hit",
                        "anomaly": 0
                        }
                    }
                }
            ]
            ```

    * To set the threshold of attack, hit or malicious payload number and get notifications when the threshold is exceeded, configure appropriate [triggers](../triggers/triggers.md).

## API calls

To get the attack details, you can call the Wallarm API directly besides using the Wallarm Console UI. The **Attacks** section is backed by the [Attacks API](../../api-sessions/attacks-api.md), which lets you run the same aggregation queries, drill into groups, compute widgets, mark verdicts, export results, and manage saved views from your own client.
