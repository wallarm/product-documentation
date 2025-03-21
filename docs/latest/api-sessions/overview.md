# API Sessions Overview <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm's **API Sessions** provide visibility into user sessions within your traffic. For each session, Wallarm gathers detailed request and related response data, enabling a structured view of session activity. This article gives an overview of API Sessions: issues addressed by it, its purpose and main possibilities.

API Sessions require [NGINX Wallarm node](../installation/nginx-native-node-internals.md#nginx-node) 5.1.0 or [native Wallarm node](../installation/nginx-native-node-internals.md#native-node) 0.8.0. Response parsing - NGINX Wallarm node 5.3.0 or native node 0.12.0.

![!API Sessions section - monitored sessions](../images/api-sessions/api-sessions.png)

## Addressed issues

The primary challenge the API Sessions address is the lack of full context when viewing only individual attacks detected by Wallarm. By capturing the logical sequence of requests and responses within each session, API Sessions provide insights into broader attack patterns and helps identify the areas of business logic impacted by security measures.

**As there are API sessions precisely identified by Wallarm, they**:

* Make bot detection by API Abuse Prevention [more precise](#api-sessions-and-api-abuse-prevention).

**As you have the API sessions monitored by Wallarm, you can**:

* [Track user activity](exploring.md#full-context-of-threat-actor-activities) by displaying a list of requests made in a single session with an ability to view the parameters of corresponding responses, so you can identify unusual patterns of behavior or deviations from typical usage.
* Know which API flow/business logic sequences will be affected before tuning a particular [false positive](../about-wallarm/protecting-against-attacks.md#false-positives), applying the [virtual patch](../user-guides/rules/vpatch-rule.md), adding [rules](../user-guides/rules/rules.md), or enabling [API Abuse Prevention](../api-abuse-prevention/overview.md) controls.
* [Inspect endpoints](exploring.md) requested in user sessions to quickly assess their protection status, risk level, and any detected issues such as being [shadow or zombie](../api-discovery/rogue-api.md).
* [Identify performance issues](exploring.md#identifying-performance-issues) and bottlenecks to optimize the user experience.
* [Verify API abuse detection accuracy](exploring.md#verifying-api-abuse-detection-accuracy) by viewing the entire sequence of requests that were flagged as malicious bot activity along with corresponding responses.

## How API Sessions work

All traffic that Wallarm node is enabled to secure is organized into sessions and displayed in the **API Sessions** section.

You can customize how requests should be grouped into sessions based on your applications' logic. Also, you can specify which parameters of requests and corresponding responses should be displayed within session to help you to understand the session content: what and in what order the user did (context parameters). See details in [API Sessions Setup](setup.md).

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.36% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/4awxsghrjc8u?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Note that Wallarm stores and displays sessions **only for the last week**. The older sessions are deleted to provide an optimal performance and resource consumption.

## API Sessions and API Abuse Prevention

Wallarm's [API Abuse Prevention](../api-abuse-prevention/overview.md) detects malicious bots analyzing the sequences of requests in one or several related sessions, for example, sessions having the same value of the `SESSION-ID` header and only divided by time/date.

Thus, when you [customize how requests are grouped](setup.md#session-grouping) into sessions in accordance with your specific application logic, it affects the work of API Abuse Prevention making both session identification and bot detection more precise.

## GraphQL requests in API Sessions

API Sessions support working with [GraphQL requests](../user-guides/rules/request-processing.md#gql) and their specific request points, you can configure sessions to extract and display values of GraphQL request parameters.

![!API Sessions configuration - GraphQL request parameter](../images/api-sessions/api-sessions-graphql.png)

Requires NGINX Node 5.3.0 or higher or native node 0.12.0.
