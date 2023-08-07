| Wallarmノードの振る舞い | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| 次の種類の悪意のあるペイロードを伴う受信リクエストを分析します： [入力検証攻撃](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、 [vpatch攻撃](../user-guides/rules/vpatch-rule.md)、または[正規表現に基づいて検出された攻撃](../user-guides/rules/regex-rule.md) | - | + | + | + |
| 悪意のあるリクエストをWallarmクラウドへアップロードし、イベントリストで表示されるようにします | - | + | + | + |
| 悪意のあるリクエストをブロックします | - | - | [グレーリストに登録されたIP](../user-guides/ip-lists/graylist.md)から生じたものだけ | + |
| [拒否リストに登録されたIP](../user-guides/ip-lists/denylist.md)<sup>例外あり</sup>から生じたリクエストをブロックします | 拒否リストを分析しません | - | + | + |
| [グレーリストに登録されたIP](../user-guides/ip-lists/graylist.md)から生じたリクエストをブロックします | グレーリストを分析しません | - | 悪意のあるペイロードを含むものだけ | グレーリストを分析しません |
| [許可リストに登録されたIP](../user-guides/ip-lists/allowlist.md)から生じたリクエストを許可します | 許可リストを分析しません | + | + | + |

!!! warning "例外"
    [`wallarm_acl_access_phase on`][acl-access-phase]の場合、拒否リストのIPからのリクエストは`off`および`monitoring`を含む任意のモードでもブロックされます