| Wallarmノードの動作 | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| 受信リクエストに、次のタイプの悪意のあるペイロードが含まれているかを解析します：[入力検証攻撃](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch攻撃](../user-guides/rules/vpatch-rule.md)、または[正規表現に基づいて検出される攻撃](../user-guides/rules/regex-rule.md) | - | + | + | + |
| 悪意のあるリクエストをWallarm Cloudにアップロードし、イベント一覧に表示されるようにします | - | + | + | + |
| 悪意のあるリクエストをブロックします | - | - | [graylisted IPs](../user-guides/ip-lists/overview.md)からのもののみブロックします | + |
| [denylisted IPs](../user-guides/ip-lists/overview.md)からのリクエストをブロックします | - | - | + | + |
| [graylisted IPs](../user-guides/ip-lists/overview.md)からのリクエストをブロックします | - | - | 悪意のあるペイロードを含むもののみブロックします | - |
| [allowlisted IPs](../user-guides/ip-lists/overview.md)からのリクエストを許可します | - | + | + | + |