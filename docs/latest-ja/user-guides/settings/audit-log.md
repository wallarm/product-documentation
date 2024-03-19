# ユーザーの活動ログ

Wallarm Consoleの **設定** → **活動ログ** タブで、Wallarmシステム内のユーザーの行動の履歴を確認できます。ログには、以下のオブジェクトの作成、更新、削除に関する情報が含まれています：

* [公開アセット](../scanner.md)からのIPアドレスまたはサブネット
* ネットワークパリメータからのドメイン
* ネットワークパリメータからのサービス（ポート）
* ネットワークパリメータからのドメインと関連するIPアドレス
* [二要素認証](account.md#enabling-two-factor-authentication)
* [APIトークン](api-tokens.md)
* [ユーザー](users.md)
* トラフィック処理[ルール](../rules/rules.md)
* [カスタムルールセットのバックアップ](../rules/rules.md)
* [Wallarmノード](../nodes/nodes.md)
* [CDNノード](../nodes/cdn-node.md)
* [トリガー](../triggers/triggers.md)
* [統合](integrations/integrations-intro.md)
* [ブロックされたIPアドレス](../ip-lists/denylist.md)
* [ヒットサンプリング](../events/analyze-attack.md#sampling-of-hits)

ログには、次の行動とオブジェクトの情報も含まれています：

* [偽陽性としてマークされた脆弱性](../vulnerabilities.md#marking-vulnerabilities-as-false-positives)
* [再チェックされた攻撃](../events/verify-attack.md)

![活動ログ](../../images/user-guides/settings/audit-log.png)

**活動ログのレコードをフィルタリングするには**、次のパラメータを使用できます：

* 行動を行ったユーザーのケースセンシティブデータ

     アクションがWallarmの技術サポートチームによって実行された場合、ユーザー名は `Technical support`です。この値は活動ログのレコードをソートするために使用することはできません。
* 行動のタイプ
* 行動が実行されたオブジェクトの名前
* 行動が実行された日付