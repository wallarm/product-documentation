| Wallarmノードの振る舞い | `オフ` | `モニタリング` | `安全ブロッキング` |`ブロック` |
| -------- | - | - | - | -|
| 次のタイプの悪意のあるペイロードが含まれているかどうかを分析：[入力検証攻撃](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch攻撃](../user-guides/rules/vpatch-rule.md)、または[正規表現に基づいて検出された攻撃](../user-guides/rules/regex-rule.md) | - | + | + | + |
| 悪意のあるリクエストをWallarm Cloudにアップロードして、イベントリストに表示します | - | + | + | + |
| 悪意のあるリクエストをブロックします | - | - | [グレーリストIP](../user-guides/ip-lists/graylist.md)から発生したもののみ | + |
| [ブロックリストIP](../user-guides/ip-lists/denylist.md)<sup>例外参照</sup>から発生したリクエストをブロックします | ブロックリストは分析されません | - | + | + |
| [グレーリストIP](../user-guides/ip-lists/graylist.md)から発生したリクエストをブロックします | グレーリストは分析しません | - | 悪意のあるペイロードを含むもののみ | グレーリストは分析しません |
| [許可リストIP](../user-guides/ip-lists/allowlist.md)から発生したリクエストを許可します | 許可リストは分析しません | + | + | + |

!!! 警告 "例外"
    [`wallarm_acl_access_phase on`][acl-access-phase]の場合、`オフ`や`モニタリング`を含む任意のモードで、ブロックリストIPからのリクエストはブロックされます