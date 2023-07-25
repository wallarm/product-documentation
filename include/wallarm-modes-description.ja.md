| Wallarm node の挙動 | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| 次のタイプの悪意のあるペイロードが含まれているかどうかを分析: [入力検証攻撃](../about-wallarm/protecting-against-attacks.ja.md#input-validation-attacks), [vpatch 攻撃](../user-guides/rules/vpatch-rule.ja.md), or [正規表現に基づいて検出される攻撃](../user-guides/rules/regex-rule.ja.md) | - | + | + | + |
| 悪意のあるリクエストを Wallarm Cloud にアップロードして、イベントリストに表示されるようにする | - | + | + | + |
| 悪意のあるリクエストをブロックする | - | - | [グレーリストに登録された IP](../user-guides/ip-lists/graylist.ja.md) からのみ | + |
| [denylisted IPs](../user-guides/ip-lists/denylist.ja.md)からのリクエストをブロックする | denylist を解析しない | - | + | + |
| [graylisted IPs](../user-guides/ip-lists/graylist.ja.md)からのリクエストをブロックする | graylist を解析しない | - | 悪意のあるペイロードを含むもののみ | graylist を解析しない |
| [allowlisted IPs](../user-guides/ip-lists/allowlist.ja.md)からのリクエストを許可する | allowlist を解析しない | + | + | + |