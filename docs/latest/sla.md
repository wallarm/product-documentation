# Wallarm's Service Level Agreement

This article describes such aspects of Wallarm's service level as service availability time percentage, possible problem classification and their response and resolution time. Due to [strong dependence](#normal-functioning-characteristics) on client context, normal functioning characteristics are not described in this SLA.

## General statement

Wallarm uses commercially reasonable efforts to make the Services available at least 99.95% during each calendar month.

## Problem classification

The following classifies and prioritizes problems that can occur with Wallarm services:

| Priority level | Problem classification | Description |
| ------- | ------- | ------- |
| 1 | Urgent | The Services are completely unavailable, or performance is so poor as to render the Services unusable. |
| 2 | High | A major functionality of the Services is unusable which results in limited functionality or affects a large number of Authorized Users. |
| 3 | Medium | There is a loss of a function or resource that does not seriously affect the Services functionality. |
| 4 | Low | All other requests for service; such as general usage questions or enhancement requests. |

## Response and resolution time

The following describes Wallarm's service levels in case when problems occur:

| Problem classification | Initial response‍ (off-peak time) | Resolution/‍mitigation | Status updates |
| ------- | ------- | ------- | ------- |
| Urgent | 2 hours | 4 hours | Every 30 minutes |
| High | 3 hours | 24 hours | Every 4 hours |
| Medium | 12 hours | [Next scheduled release](updating-migrating/versioning-policy.md) | Weekly |
| Low | 36 hours | Quarterly | Twice a month |

## Normal functioning characteristics

The availability and speed of Wallarm's services and [sharing of responsibility](about-wallarm/shared-responsibility.md) strongly depends on multiple factors related to specific client context and varies from client to client. These factors include but not limited to:

* Client's network infrastructure, configuration and connectivity
* Selected Wallarm [deployment form](about-wallarm/overview.md#where-wallarm-works)
* Selected Wallarm [deployment option](installation/supported-deployment-options.md)
* Enabled Wallarm [components and functions](about-wallarm/overview.md)
* Traffic volume, characteristics, and intensity

Due to said above, normal functioning characteristics are not described in this SLA in particular numbers.

## Further details

You can find more details and related information on the [Service Level Agreement](https://www.wallarm.com/service-level-agreement) page of the Wallarm's official site.
