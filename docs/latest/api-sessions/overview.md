# API Sessions Overview <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm's **API Sessions** provide visibility into user sessions within your traffic. For each session, Wallarm gathers detailed request data, enabling a structured view of session activity. This article gives an overview of API Sessions: issues addressed by it, its purpose and main possibilities.

API Sessions require [NGINX Wallarm node](../installation/nginx-native-node-internals.md#nginx-node) 5.1.0 or [native Wallarm node](../installation/nginx-native-node-internals.md#native-node) 0.8.0.

![!API Sessions section - monitored sessions](../images/api-sessions/api-sessions.png)

## Addressed issues

The primary challenge the API Sessions address is the lack of full context when viewing only individual attacks detected by Wallarm. By capturing the logical sequence of requests within each session, API Sessions provide insights into broader attack patterns and helps identify the areas of business logic impacted by security measures.

**As you have the API sessions monitored by Wallarm, you can**:

* [Track user activity](exploring.md#full-context-of-threat-actor-activities) by displaying a list of requests made in a single session, so you can identify unusual patterns of behavior or deviations from typical usage.
* Know which API flow/business logic sequences will be affected before tuning a particular [false positive](../about-wallarm/protecting-against-attacks.md#false-positives), applying the [virtual patch](../user-guides/rules/vpatch-rule.md), adding [rules](../user-guides/rules/rules.md), or enabling [API Abuse Prevention](../api-abuse-prevention/overview.md) controls.
* [Inspect endpoints](exploring.md) requested in user sessions to quickly assess their protection status, risk level, and any detected issues such as being [shadow or zombie](../api-discovery/rogue-api.md).
* [Identify performance issues](exploring.md#identifying-performance-issues) and bottlenecks to optimize the user experience.
* [Verify API abuse detection accuracy](exploring.md#verifying-api-abuse-detection-accuracy) by viewing the entire sequence of requests that were flagged as malicious bot activity.

## How API Sessions work

All traffic that Wallarm node is enabled to secure is organized into sessions and displayed in the **API Sessions** section.

You can customize how requests should be grouped into sessions based on your applications' logic. Also, you can specify which parameters should be displayed within session to help you to understand the session content: what and in what order the actor did (context parameters). See details in [API Sessions Setup](setup.md).

Note that Wallarm stores and displays sessions **only for the last week**. The older sessions are deleted to provide an optimal performance and resource consumption.
