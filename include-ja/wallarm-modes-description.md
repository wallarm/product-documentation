| Wallarm ノードの動作 | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| 次の種類の悪意あるペイロードを含むかどうかを分析します: [入力検証攻撃](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch 攻撃](../user-guides/rules/vpatch-rule.md)、または[正規表現に基づいて検出された攻撃](../user-guides/rules/regex-rule.md) | - | + | + | + |
| 悪意のあるリクエストを Wallarm クラウドにアップロードし、イベントリストに表示します | - | + | + | + |
| 悪意あるリクエストをブロックします | - | - | [グレーリストIPからのもののみ](../user-guides/ip-lists/graylist.md) | + |
| [ブラックリストIPから始まるリクエスト](../user-guides/ip-lists/denylist.md)をブロックします | ブラックリストを解析しません | - | + | + |
| [グレーリストIPから始まるリクエスト](../user-guides/ip-lists/graylist.md)をブロックします | グレーリストを解析しません | - | 悪意あるペイロードを含むもののみ | グレーリストを解析しません |
| [ホワイトリストIPから始まるリクエスト](../user-guides/ip-lists/allowlist.md)を許可します | ホワイトリストを解析しません | + | + | + |