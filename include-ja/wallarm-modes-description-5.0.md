| Wallarmノードの動作 | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| 受信リクエストに対して、[入力検証](../attacks-vulns-list.md#attack-types)、[仮想パッチ](../user-guides/rules/vpatch-rule.md)、および[正規表現ベース](../user-guides/rules/regex-rule.md)の悪意のあるペイロードを解析します | - | + | + | + |
| 悪意のあるリクエストをWallarm Cloudにアップロードして、イベントリストに表示されるようにします | - | + | + | + |
| 悪意のあるリクエストをブロックします | - | - | [graylisted IPs](../user-guides/ip-lists/overview.md)からのもののみ | + |
| [denylisted IPs](../user-guides/ip-lists/overview.md)からのリクエストをブロックします<sup>例外を参照</sup> <br>（IPは手動で追加される場合と、[複数攻撃保護](../admin-en/configuration-guides/protecting-with-thresholds.md)や挙動ベースの保護：[API abuse prevention](../api-abuse-prevention/setup.md)、[manual BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md)、[brute force](../admin-en/configuration-guides/protecting-against-bruteforce.md)、[forced browsing](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)により自動的に追加される場合があります） | - | + | + | + |
| [graylisted IPs](../user-guides/ip-lists/overview.md)からのリクエストをブロックします <br>（denylistと同じ保護手段により手動または自動で追加されたIP） | - | - | 悪意のあるペイロードを含むもののみ | - |
| [allowlisted IPs](../user-guides/ip-lists/overview.md)からのリクエストを許可します | - | + | + | + |

!!! warning "denylistの例外"
    [`wallarm_acl_access_phase off`][acl-access-phase]の場合、Wallarmノードは`monitoring`モードでdenylisted IPsからのリクエストをブロックしません。