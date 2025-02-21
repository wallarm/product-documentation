| Wallarmノードの動作 | `off` | `monitoring` | `safe_blocking` | `block` |
| ---------------- | - | - | - | - |
| 受信リクエストに以下の種類の悪意のあるペイロードが含まれるかどうか解析します: [input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch attacks](../user-guides/rules/vpatch-rule.md)、または[attacks detected based on regular expressions](../user-guides/rules/regex-rule.md) | - | + | + | + |
| 悪意のあるリクエストをWallarm Cloudにアップロードして、イベント一覧に表示させます | - | + | + | + |
| 悪意のあるリクエストをブロックします | - | - | [graylist登録済みIPアドレス](../user-guides/ip-lists/graylist.md)から送信されたもののみ | + |
| [denylist登録済みIPアドレス](../user-guides/ip-lists/denylist.md)<sup>例外を参照</sup>から送信されたリクエストをブロックします | denylistを解析しません | - | + | + |
| [graylist登録済みIPアドレス](../user-guides/ip-lists/graylist.md)から送信されたリクエストをブロックします | graylistを解析しません | - | 悪意のあるペイロードを含むもののみ | graylistを解析しません |
| [allowlist登録済みIPアドレス](../user-guides/ip-lists/allowlist.md)から送信されたリクエストを許可します | allowlistを解析しません | + | + | + |

!!! warning "例外"
    [`wallarm_acl_access_phase on`][acl-access-phase]の場合、denylist登録済みIPアドレスからのリクエストは`off`および`monitoring`を含むすべてのモードでブロックされます。