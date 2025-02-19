| Wallarmノードの動作 | `off` | `monitoring` | `safe_blocking` | `block` |
| ------------------- | ----- | ------------ | --------------- | ------- |
| 受付したリクエストを[input validation](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[virtual patch](../user-guides/rules/vpatch-rule.md)および[regex-based](../user-guides/rules/regex-rule.md)の悪意あるペイロードについて解析します | - | + | + | + |
| Wallarm Cloudに悪意あるリクエストをアップロードし、イベントリストに表示します | - | + | + | + |
| 悪意あるリクエストをブロックします | - | - | [graylisted IPs](../user-guides/ip-lists/overview.md)から発信されたもののみ | + |
| [denylisted IPs](../user-guides/ip-lists/overview.md)から発信されたリクエストをブロックします<sup>例外参照</sup> <br>（[multi-attack protection](../admin-en/configuration-guides/protecting-with-thresholds.md)および行動ベースの防御（[API abuse prevention](../api-abuse-prevention/setup.md)、[manual BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md)、[brute force](../admin-en/configuration-guides/protecting-against-bruteforce.md)、[forced browsing](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)）により手動および自動で追加されたIP） | - | + | + | + |
| [graylisted IPs](../user-guides/ip-lists/overview.md)から発信されたリクエストをブロックします <br>（denylistの場合と同じ保護対策により手動および自動で追加されたIP） | - | - | 悪意あるペイロードを含むもののみ | - |
| [allowlisted IPs](../user-guides/ip-lists/overview.md)から発信されたリクエストを許可します | - | + | + | + |

!!! warning "denylistの例外"
    もし[`wallarm_acl_access_phase off`][acl-access-phase]の場合、Wallarmノードは`monitoring`モードではdenylisted IPsからのリクエストをブロックしません。