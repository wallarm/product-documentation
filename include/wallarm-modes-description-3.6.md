| Wallarm node behavior | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| Analyzes whether incoming requests contain malicious payloads of the following types: [input validation attacks](../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Uploads malicious requests to the Wallarm Cloud so that they are displayed in the event list | - | + | + | + |
| Blocks malicious requests | - | - | Only those originated from [greylisted IPs](../user-guides/ip-lists/greylist.md) | + |
| Blocks requests originated from [blacklisted IPs](../user-guides/ip-lists/blacklist.md)<sup>see exceptions</sup> | Does not analyze the blacklist | - | + | + |
| Blocks requests originated from [greylisted IPs](../user-guides/ip-lists/greylist.md) | Does not analyze the greylist | - | Only those containing malicious payloads | Does not analyze the greylist |
| Allows requests originated from [whitelisted IPs](../user-guides/ip-lists/whitelist.md) | Does not analyze the whitelist | + | + | + |

!!! info "Exceptions"
    Blacklisted IPs are blocked in any mode including `off` and `monitoring` if [`wallarm_acl_access_phase on`][acl-access-phase].
