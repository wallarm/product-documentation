| Wallarmノードの動作 | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| 受信リクエストに次の種類の悪意のあるペイロードが含まれているかを解析します：[入力検証攻撃](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch攻撃](../user-guides/rules/vpatch-rule.md)、または[正規表現に基づき検出された攻撃](../user-guides/rules/regex-rule.md) | - | + | + | + |
| 悪意のあるリクエストをWallarm Cloudにアップロードし、event listに表示されるようにします | - | + | + | + |
| 悪意のあるリクエストをブロックします | - | - | [graylistに登録されたIP](../user-guides/ip-lists/graylist.md)からのもののみ | + |
| [denylistに登録されたIP](../user-guides/ip-lists/denylist.md)からのリクエストをブロックします<sup>例外を参照</sup> | denylistを参照しません | - | + | + |
| [graylistに登録されたIP](../user-guides/ip-lists/graylist.md)からのリクエストをブロックします | graylistを参照しません | - | 悪意のあるペイロードを含むもののみ | graylistを参照しません |
| [allowlistに登録されたIP](../user-guides/ip-lists/allowlist.md)からのリクエストを許可します | allowlistを参照しません | + | + | + |

!!! warning "例外"
    [`wallarm_acl_access_phase on`][acl-access-phase]が有効な場合、`off`および`monitoring`を含むいずれのモードでも、denylistに登録されたIPからのリクエストはブロックされます