# データ保持ポリシー

このポリシーはWallarmが収集し、Wallarm Cloudに保存されたさまざまなデータセットの保持期間を概説します。

| データセット                                                                                                                                                                                           | 有料サブスクリプション | 無料プラン |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|------------------|
| フィルタリングノードで検出された攻撃、hits、インシデントに関するデータ                                                                                                                                    | 6ヶ月           | 3ヶ月           |
| 正規および悪意のある要求に関連する[user sessions](../api-sessions/overview.md)のデータ                                                                                                                    | 1週間           | 1週間           |
| フィルタリングノードまたは**Threat Replay Testing**モジュールで検出された脆弱性に関するデータ                                                                                                           | 6ヶ月           | 3ヶ月           |
| 脆弱性スキャナーで検出された脆弱性に関するデータ                                                                                                                                                         | 6ヶ月           | 3ヶ月           |
| [Threat Prevention dashboard](../user-guides/dashboards/threat-prevention.md)に表示される処理済みおよびブロックされたリクエストの統計                                                                             | 6ヶ月           | 3ヶ月           |
| Exposed asset Scannerで検出された[企業の公開資産](../user-guides/scanner.md)                                                                                                                           | 6ヶ月           | 3ヶ月           |
| [許可リスト、拒否リスト、およびグレイリストに登録されたIPアドレス]の履歴                                                                                                                               | 3ヶ月           | 3ヶ月           |
| Wallarmノードによるトラフィック処理のために自動生成または手動で作成された[rules](../user-guides/rules/rules.md)                                                                                        | ∞                | ∞                |
| Wallarmアカウントの設定: [users](../user-guides/settings/users.md)、[applications](../user-guides/settings/applications.md)、[integrations](../user-guides/settings/integrations/integrations-intro.md)、[triggers](../user-guides/triggers/triggers.md) | ∞                | ∞                |
| [Audit log](../user-guides/settings/audit-log.md)の記録                                                                                                                                                  | 6ヶ月           | 3ヶ月           |