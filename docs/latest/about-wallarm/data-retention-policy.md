# Data retention policy

This policy outlines retention periods for different datasets collected by Wallarm and stored in the Wallarm Cloud.

| Dataset                                                                                                                                                                                                                                | Paid subscription | Free tier |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|------------------|
| Data on attacks, hits, and incidents detected by the filtering nodes                                                                                                                                                                         | 6 months        | 3 months |
| Detailed [data on bot attacks](../api-abuse-prevention/exploring-bots.md#attacks) | 31 days        | 31 days |
| Data on [user sessions](../api-sessions/overview.md) the legitimate and malicious requests belong to  | 1 week | 1 week |
| [Security issues](../user-guides/vulnerabilities.md) (vulnerabilities) detected by [any method](../about-wallarm/detecting-vulnerabilities.md#detection-methods) | ∞<sup>*</sup> | ∞ |
| Statistics on processed and blocked requests displayed on the [Threat Prevention dashboard](../user-guides/dashboards/threat-prevention.md)                                                                                                                          | 6 months        | 3 months |
| History of [allowlisted, denylisted, and graylisted IP addresses](../user-guides/ip-lists/overview.md)                                                                                                                                                                     | 3 months         | 3 months |
| Automatically generated or manually created [rules](../user-guides/rules/rules.md) for proccessing traffic by Wallarm nodes                                                                                                              | ∞                | ∞ |
| Wallarm account configuration: [users](../user-guides/settings/users.md), [applications](../user-guides/settings/applications.md), [integrations](../user-guides/settings/integrations/integrations-intro.md), [triggers](../user-guides/triggers/triggers.md) | ∞                | ∞ |
| [Audit log](../user-guides/settings/audit-log.md) records                                                                                                                                                                           | 6 months         | 3 months         |
| [API Discovery](../api-discovery/overview.md) endpoint data | 30 days since last seen<sup>**</sup> | N/A |

<small><sup>*</sup> Storing of security issues found by [AASM](../api-attack-surface/overview.md) can be limited by the AASM's [host retention policy](../api-attack-surface/setup.md#host-retention-policy).</small>

<small><sup>**</sup> Different endpoint attributes are refreshed on their own schedule and are not all retained for the full 30 days. See [API Discovery data retention model](#api-discovery-data-retention-model) for details.</small>

## API Discovery data retention model

[API Discovery](../api-discovery/overview.md) builds a dynamic API inventory. Wallarm discovers the basic endpoint data (host, path, parameters, parameter types, application, discovered timestamp) within 5–7 minutes of the first matching request and preserves it for **30 days** since the last seen timestamp (the time of the most recent qualifying request). After 30 days without traffic, Wallarm automatically removes the endpoint together with all its associated data from the inventory. Removed entries cannot be restored — if traffic resumes later, the endpoint reappears as **New** and discovery starts over from scratch.

Some endpoint attributes are recalculated on their own schedule and have no history tracking. If no traffic is received during the corresponding window, the attribute value is lost even while the endpoint itself remains in the inventory:

| Attribute | Refresh schedule |
| --- | --- |
| Last seen timestamp | Updated instantly with every qualifying request |
| Sensitive data, authentication flows, change status, requests counter | Recalculated continuously from the last 7 days of traffic — values are lost if no traffic is received for 7 days |
| Risk score, business object, business flow | Recalculated every 4 hours from recent traffic, with no history tracking |
