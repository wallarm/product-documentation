# Control over Export to Cloud

| Where to | What for | What data | How to control |
| ----- | ----- | ----- | ----- |
| Statistics | To [see](../user-guides/dashboards/threat-prevention.md) numbers of you traffic - normal vs. malicious.| Number of requests, their sources and targets. No sensitive data ever. ||
| Attacks, Incidents || Full HTTP data of malicious request. | <ul><li>Sensitive data types</li><li>Limit data export rules</li><li>Export parameters allowlist</li><li>[Mask sensitive data](../user-guides/rules/sensitive-data-rule.md)</li></ul> |
| **API Sessions** | To see full sequence of connected actions (session). | Request metadata + what you chose (context parameters). | <ul><li>Session context parameters (with hashing)</li></ul>[Details...](#api-sessions) |
| API Discovery ||||
| Security Issues ||||

See details in the sections below.

## API Sessions

**What for**: to see full sequence of connected actions (session) targeting your applications.

**What data and how to control**

* In [API Sessions](../api-sessions/overview.md), you see all requests (both legitimate and malicious) going through Wallarm Node to your applications.
* However, for each request, only its metadata is send by default (time, source IP, target endpoint, response code).
* Additionally, parameters used for [grouping](../api-sessions/setup.md#session-grouping) request into this session along with their values, will be displayed. This creates minor risk.
* As all that info may be non-informative enough, you add [extra parameters](../api-sessions/setup.md#session-context) to be displayed. With them, you'll be able to understand what is happening. They will be sent to the Cloud along with values. This creates risk.

To minimize risk:

* [Add](../api-sessions/setup.md#session-context) only parameters you really need. Note that some **mitigation controls** rely on session data and **need** some parameter values, such controls can [themselves](../api-sessions/setup.md#mitigation-controls) add extra parameters to session.
* Use [hashing](../api-sessions/setup.md#data-protection) for the parameter values. Note that hashing will transform the actual value into unreadable - the presence of parameter and particular but unknown value will provide the limited information for the analysis.
