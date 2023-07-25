# データ保持ポリシー

このポリシーでは、Wallarmによって収集およびWallarm Cloudに保存される様々なデータセットの保持期間について概説しています。

| データセット                                                                                                                                                                                                                                | 有料登録 | 無料枠/無料トライアル |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------------|
| フィルタリングノードによって検出された攻撃、ヒット、事件のデータ                                                                                                                                                                            | 6ヵ月        | 3ヵ月 |
| フィルタリングノードまたは **アクティブ脅威検証** モジュールによって検出された脆弱性のデータ                                                                                                                                                           | 6ヵ月        | 3ヵ月 |
| 脆弱性スキャナによって検出された脆弱性のデータ                                                                                                                                                                                 | 6ヵ月        | 3ヵ月 |
| [Threat Preventionダッシュボード](../user-guides/dashboards/threat-prevention.ja.md) に表示された処理済みおよびブロック済み要求の統計                                                                                                         | 6ヵ月        | 3ヵ月 |
| Exposed asset Scannerによって検出された [会社の露出した資産](../user-guides/scanner.ja.md)                                                                                                                                          | 6ヵ月        | 3ヵ月 |
| [認可リスト、拒否リスト、グレーリストのIPアドレス](../user-guides/ip-lists/overview.ja.md) の履歴                                                                                                                                                                  | 3ヵ月         | 3ヵ月 |
| Wallarmノードによるトラフィック処理のために自動生成または手動作成された [ルール](../user-guides/rules/intro.ja.md)                                                                                                                    | ∞                | ∞ |
| Wallarmアカウントの設定: [ユーザー](../user-guides/settings/users.ja.md)、[アプリケーション](../user-guides/settings/applications.ja.md)、[インテグレーション](../user-guides/settings/integrations/integrations-intro.ja.md)、[トリガー](../user-guides/triggers/triggers.ja.md) | ∞                | ∞ |
| [監査ログ](../user-guides/settings/audit-log.ja.md)の記録                                                                                                                                                                               | 6ヵ月         | 3ヵ月         | 