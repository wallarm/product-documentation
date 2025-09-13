| Wallarmノードの動作 | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| 受信リクエストを[入力検証](../attacks-vulns-list.md#attack-types)、[仮想パッチ](../user-guides/rules/vpatch-rule.md)、および[正規表現ベース](../user-guides/rules/regex-rule.md)の悪意のあるペイロードについて解析します | - | + | + | + |
| 悪意のあるリクエストをWallarm Cloudにアップロードし、event listに表示されるようにします | - | + | + | + |
| 悪意のあるリクエストをブロックします | - | - | [グレーリストに登録されたIP](../user-guides/ip-lists/overview.md)からのもののみです | + |
| [拒否リストに登録されたIP](../user-guides/ip-lists/overview.md)からのリクエストをブロックします<sup>例外あり</sup> <br> （手動で追加されたIP、および[複数攻撃の保護](../admin-en/configuration-guides/protecting-with-thresholds.md)とふるまいベースの保護（[API乱用対策](../api-abuse-prevention/setup.md)、[手動BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md)、[総当たり攻撃](../admin-en/configuration-guides/protecting-against-bruteforce.md)、[強制ブラウジング](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)、[汎用列挙](../api-protection/enumeration-attack-protection.md)）により自動で追加されたIP） | - | + | + | + |
| [グレーリストに登録されたIP](../user-guides/ip-lists/overview.md)からのリクエストをブロックします <br> （拒否リストの場合と同じ保護手段によって手動または自動で追加されたIP） | - | - | 悪意のあるペイロードを含むもののみです | - |
| [許可リストに登録されたIP](../user-guides/ip-lists/overview.md)からのリクエストを許可します | - | + | + | + |

!!! warning "拒否リストの例外"
    [`wallarm_acl_access_phase off`][acl-access-phase]の場合、`monitoring`モードではWallarmノードは拒否リストに登録されたIPからのリクエストをブロックしません。