					| Wallarmノードの態度 | `off` | `監視中` | `安全ブロック` |`ブロック` |
| -------- | - | - | - | -|
| 入ってくるリクエストに次の種類の悪質な荷物が含まれているかどうかを分析します：[入力検証攻撃](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch攻撃](../user-guides/rules/vpatch-rule.md)、または[正規表現に基づいて検出された攻撃](../user-guides/rules/regex-rule.md) | - | + | + | + |
| 悪意あるリクエストをWallarmクラウドにアップロードして、イベントリストに表示されるようにします | - | + | + | + |
| 悪意あるリクエストをブロックします | - | - | [グレーリストに記載されているIP](../user-guides/ip-lists/graylist.md)から発生したもののみ | + |
| [ブラックリストに入ったIP](../user-guides/ip-lists/denylist.md)<sup>例外あり</sup>からのリクエストをブロックします | + | + | + | + |
| [グレーリストに記載されているIP](../user-guides/ip-lists/graylist.md)からのリクエストをブロックします | グレーリストを分析しない | - | 悪意のある荷物を含むモノのみ | グレーリストを分析しない |
| [ホワイトリストに記載されているIP](../user-guides/ip-lists/allowlist.md)からのリクエストを許可します | + | + | + | + |

!!! 警告 "例外"
    [`wallarm_acl_access_phase off`][acl-access-phase]の場合、Wallarmノードは`off`モードでブラックリストを分析しない＆`監視中`モードでブラックリストのIPからのリクエストをブロックしません。