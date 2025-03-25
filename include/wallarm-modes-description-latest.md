| Wallarm node behavior | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| Analyzes incoming requests for [input validation](../attacks-vulns-list.md#attack-types), [virtual patch](../user-guides/rules/vpatch-rule.md), and [regex-based](../user-guides/rules/regex-rule.md) malicious payloads | - | + | + | + |
| Uploads malicious requests to the Wallarm Cloud so that they are displayed in the event list | - | + | + | + |
| Blocks malicious requests | - | - | Only those originated from [graylisted IPs](../user-guides/ip-lists/overview.md) | + |
| Blocks requests originated from [denylisted IPs](../user-guides/ip-lists/overview.md)<sup>see exception</sup> <br> (IPs added manually and automatically by [multi-attack protection](../admin-en/configuration-guides/protecting-with-thresholds.md) and behavioral protection: [API abuse prevention](../api-abuse-prevention/setup.md), [manual BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md), [brute force](../admin-en/configuration-guides/protecting-against-bruteforce.md) and [forced browsing](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)) | - | + | + | + |
| Blocks requests originated from [graylisted IPs](../user-guides/ip-lists/overview.md) <br> (IPs added manually and automatically by the same protection measures as for denylist) | - | - | Only those containing malicious payloads | - |
| Allows requests originated from [allowlisted IPs](../user-guides/ip-lists/overview.md) | - | + | + | + |

!!! warning "Exception for denylist"
    If [`wallarm_acl_access_phase off`][acl-access-phase], the Wallarm node does not block requests from denylisted IPs in the `monitoring` mode.