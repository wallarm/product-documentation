| Wallarm node behavior | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| Analyzes whether incoming requests contain malicious payloads of the following types: [input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Uploads malicious requests to the Wallarm Cloud so that they are displayed in the event list | - | + | + | + |
| Blocks malicious requests | - | - | Only those originated from [graylisted IPs](../user-guides/ip-lists/overview.md) | + |
| Blocks requests originated from [denylisted IPs](../user-guides/ip-lists/overview.md)<sup>see exception</sup> <br> (used by behavioral protection: ([API abuse prevention](../user-guides/api-abuse-prevention.md), [manual BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md), [brute force](../admin-en/configuration-guides/protecting-against-bruteforce.md) and [forced browsing](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)) and [multi-attack protection](../admin-en/configuration-guides/protecting-with-thresholds.md)) | Does not analyze the denylist | + | + | + |
| Blocks requests originated from [graylisted IPs](../user-guides/ip-lists/overview.md) <br> (used by the same protection measures as for denylist) | Does not analyze the graylist | - | Only those containing malicious payloads | Does not analyze the graylist |
| Allows requests originated from [allowlisted IPs](../user-guides/ip-lists/overview.md) | Does not analyze the allowlist | + | + | + |
| [Virtual patches](../user-guides/rules/vpatch-rule.md) <br> (used by [API Leaks](../about-wallarm/api-leaks.md)) | + | + | + | + |
| [WAAP/WAF](../about-wallarm/waap-overview) components independent from IP lists ([rate limiting](../user-guides/rules/rate-limiting.md), [masking sensitive data](../user-guides/rules/sensitive-data-rule.md), [changing server response headers](../user-guides/rules/add-replace-response-header.md)) | + | + | + | + |
| API Discovery including [automatic protection against BOLA attacks](../api-discovery/bola-protection.md) | + | + | + | + |

!!! warning "Exception for denylist"
    If [`wallarm_acl_access_phase off`][acl-access-phase], the Wallarm node does not block requests from denylisted IPs in the `monitoring` mode.