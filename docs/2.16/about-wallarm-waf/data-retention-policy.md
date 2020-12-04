# Data retention policy

This policy outlines retention periods for different datasets collected by Wallarm WAF and stored in the Wallarm Cloud.

| Dataset                                                                                                                                                                                                                                | Retention period |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| Data on attacks, hits, and incidents detected by the WAF nodes                                                                                                                                                                         | 12 months        |
| Data on vulnerabilities detected by the WAF nodes or Attack rechecker                                                                                                                                                                  | 12 months        |
| Data on vulnerabilities detected by Vulnerability Scanner                                                                                                                                                                              | 24 months        |
| Statistics on processed and blocked requests displayed on the [dashboards](../user-guides/dashboard/intro.md)                                                                                                                          | 12 months        |
| [Network perimeter elements](../user-guides/scanner/intro.md) detected by Perimeter Scanner                                                                                                                                            | 24 months        |
| History of [blacklisted IP addresses](../user-guides/blacklist.md)                                                                                                                                                                     | 6 months         |
| Automatically generated or manually created [rules](../user-guides/rules/intro.md) for proccessing traffic by Wallarm WAF                                                                                                              | ∞                |
| WAF account configuration: [users](../user-guides/settings/users.md), [applications](../user-guides/settings/applications.md), [integrations](../user-guides/settings/integrations/integrations-intro.md), [triggers](../user-guides/triggers/triggers.md) | ∞                |
| [Activity log](../user-guides/settings/audit-log.md) records                                                                                                                                                                           | 12 month         |
