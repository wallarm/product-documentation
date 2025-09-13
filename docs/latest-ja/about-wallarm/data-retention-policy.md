# データ保持ポリシー

本ポリシーは、Wallarmが収集しWallarm Cloudに保存する各種データセットの保持期間を定めます。

| データセット                                                                                                                                                                                                                                | 有料サブスクリプション | 無料プラン |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|------------------|
| フィルタリングノードによって検出された攻撃、hits、インシデントに関するデータ                                                                                                                                                                         | 6か月        | 3か月 |
| 正当および悪意のあるリクエストが属する[ユーザーセッション](../api-sessions/overview.md)に関するデータ  | 1週間 | 1週間 |
| フィルタリングノードまたは**Threat Replay Testing**モジュールによって検出された脆弱性に関するデータ                                                                                                                                                                  | 6か月        | 3か月 |
| [Vulnerability Scanner](../api-attack-surface/api-surface.md#replacement-of-old-scanner)によって検出された脆弱性に関するデータ                                                                                                                                                                          | 6か月        | 3か月 |
| [Threat Prevention dashboard](../user-guides/dashboards/threat-prevention.md)に表示される処理済みおよびブロックされたリクエストに関する統計                                                                                                                          | 6か月        | 3か月 |
| [allowlisted, denylisted, and graylisted IP addresses](../user-guides/ip-lists/overview.md)の履歴                                                                                                                                                                     | 3か月         | 3か月 |
| Wallarmノードがトラフィックを処理するために自動生成または手動で作成された[rules](../user-guides/rules/rules.md)                                                                                                              | ∞                | ∞ |
| Wallarmアカウント構成: [users](../user-guides/settings/users.md), [applications](../user-guides/settings/applications.md), [integrations](../user-guides/settings/integrations/integrations-intro.md), [triggers](../user-guides/triggers/triggers.md) | ∞                | ∞ |
| [Audit log](../user-guides/settings/audit-log.md)の記録                                                                                                                                                                           | 6か月         | 3か月         |