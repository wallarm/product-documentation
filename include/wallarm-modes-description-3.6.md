| Wallarm node behavior | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| Analyzes whether incoming requests contain malicious payloads of the following types: [input validation attacks](../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Uploads malicious requests to the Wallarm Cloud so that they are displayed in the event list | - | + | + | + |
| Blocks malicious requests | - | - | Only those originated from [graylisted IPs](../user-guides/ip-lists/graylist.md) | + |
| Blocks requests originated from [denylisted IPs](../user-guides/ip-lists/denylist.md)<sup>see exceptions</sup> | Does not analyze the denylist | - | + | + |
| Blocks requests originated from [graylisted IPs](../user-guides/ip-lists/graylist.md) | Does not analyze the graylist | - | Only those containing malicious payloads | Does not analyze the graylist |
| Allows requests originated from [allowlisted IPs](../user-guides/ip-lists/allowlist.md) | Does not analyze the allowlist | + | + | + |

!!! warning "Exceptions"
    If [`wallarm_acl_access_phase on`][acl-access-phase], requests from denylisted IPs are blocked in any mode including `off` and `monitoring`
