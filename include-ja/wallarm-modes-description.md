```markdown
| Wallarmノードの動作 | `off` | `monitoring` | `safe_blocking` | `block` |
| ---------------- | --- | --- | --- | --- |
| 到着リクエストに[入力検証攻撃](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch攻撃](../user-guides/rules/vpatch-rule.md)、または[正規表現に基づく攻撃](../user-guides/rules/regex-rule.md)による悪意あるペイロードが含まれているかどうかを解析します | - | + | + | + |
| 悪意あるリクエストをWallarm Cloudにアップロードし、イベントリストに表示されるようにします | - | + | + | + |
| 悪意あるリクエストをブロックします | - | - | [graylisted IPs](../user-guides/ip-lists/overview.md)から発信されたリクエストに限る | + |
| [denylisted IPs](../user-guides/ip-lists/overview.md)から発信されたリクエストをブロックします | - | - | + | + |
| [graylisted IPs](../user-guides/ip-lists/overview.md)から発信されたリクエストをブロックします | - | - | 悪意あるペイロードを含むものに限る | - |
| [allowlisted IPs](../user-guides/ip-lists/overview.md)から発信されたリクエストを許可します | - | + | + | + |
```