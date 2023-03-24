| Wallarmノードの動作 | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| 次のタイプの悪意のあるペイロードが含まれているかどうか、着信リクエストを分析します：[入力検証攻撃](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch攻撃](../user-guides/rules/vpatch-rule.md)、または[正規表現に基づいて検出された攻撃](../user-guides/rules/regex-rule.md) | - | + | + | + |
| 悪意のあるリクエストをWallarm Cloudにアップロードして、イベントリストに表示されるようにします | - | + | + | + |
| 悪意のあるリクエストをブロックする | - | - | [グレーリスト化されたIP](../user-guides/ip-lists/graylist.md)から発信されたもののみ | + |
| [denylisted IPs](../user-guides/ip-lists/denylist.md)から発信されたリクエストをブロックする<sup>例外あり</sup> | + | + | + | + |
| [graylisted IPs](../user-guides/ip-lists/graylist.md)から発信されたリクエストをブロックする | グレーリストを分析しません | - | 悪意のあるペイロードが含まれているもののみ | グレーリストを分析しません |
| [allowlisted IPs](../user-guides/ip-lists/allowlist.md)から発信されたリクエストを許可する | + | + | + | + |

!!! warning "例外"
    [`wallarm_acl_access_phase off`][acl-access-phase]の場合、Wallarmノードは`off`モードでdenylistを分析せず、`monitoring`モードではdenylisted IPからのリクエストをブロックしません。