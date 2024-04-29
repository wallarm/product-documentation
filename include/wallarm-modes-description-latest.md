| Wallarm node behavior | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| Analyzes whether incoming requests contain malicious payloads of the following types: [input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Uploads malicious requests to the Wallarm Cloud so that they are displayed in the event list | - | + | + | + |
| Blocks malicious requests | - | - | Only those originated from [graylisted IPs](../user-guides/ip-lists/overview.md) | + |
| Blocks requests originated from [denylisted IPs](../user-guides/ip-lists/overview.md)<sup>see exception</sup> <br> (IPs added manually and automatically by [multi-attack protection](../admin-en/configuration-guides/protecting-with-thresholds.md) and behavioral protection: [API abuse prevention](../user-guides/api-abuse-prevention.md), [manual BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md), [brute force](../admin-en/configuration-guides/protecting-against-bruteforce.md) and [forced browsing](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)) | - | + | + | + |
| Blocks requests originated from [graylisted IPs](../user-guides/ip-lists/overview.md) <br> (IPs added manually and automatically by the same protection measures as for denylist) | - | - | Only those containing malicious payloads | - |
| Allows requests originated from [allowlisted IPs](../user-guides/ip-lists/overview.md) | - | + | + | + |
| Blocks requests to [virtual patched](../user-guides/rules/vpatch-rule.md) endpoints | + | + | + | + |
| Prevents excessive traffic by [rate limiting](../user-guides/rules/rate-limiting.md) | + | + | + | + |
| Secures sensitive data by [masking ](../user-guides/rules/sensitive-data-rule.md) | + | + | + | + |
| Builds and keeps up-to-date [your application REST API inventory](../api-discovery/overview.md) | + | + | + | + |
| Searches for [leaks of the credential data](../about-wallarm/api-leaks.md) and prevents their usage | + | + | + | + |
| Automatically [protects against BOLA attacks](../api-discovery/bola-protection.md) (requires API Discovery) | + | + | + | + |

!!! warning "Exception for denylist"
    If [`wallarm_acl_access_phase off`][acl-access-phase], the Wallarm node does not block requests from denylisted IPs in the `monitoring` mode.