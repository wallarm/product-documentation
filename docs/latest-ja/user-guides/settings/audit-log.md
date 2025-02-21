# ユーザーアクティビティログ

Wallarm Consoleの**Settings** → **Activity log**タブでは、Wallarmシステムにおけるユーザーのアクション履歴を確認できます。ログには、以下のオブジェクトの作成、更新および削除に関する情報が含まれます:

* [公開資産](../scanner.md)からのIPアドレスまたはサブネット
* ネットワーク境界のドメイン
* ネットワーク境界のサービス（ポート）
* ネットワーク境界のドメインと関連するIPアドレス
* [二要素認証](account.md#enabling-two-factor-authentication)
* [API tokens](api-tokens.md)
* [Users](users.md)
* トラフィック処理の[rules](../rules/rules.md)
* [Custom ruleset backups](../rules/rules.md#backup-and-restore)
* [Wallarm nodes](../nodes/nodes.md)
* [Triggers](../triggers/triggers.md)
* [Integrations](integrations/integrations-intro.md)
* [Blocked IP address](../ip-lists/overview.md)
* [Hit sampling](../events/grouping-sampling.md#sampling-of-hits)

ログには、以下のアクションおよびオブジェクトに関する情報も含まれます:

* 誤検知としてマークされた[脆弱性](../vulnerabilities.md#vulnerability-lifecycle)
* 再検証された[攻撃](../../vulnerability-detection/threat-replay-testing/overview.md)

![Activity log](../../images/user-guides/settings/audit-log.png)

**To filter the activity log records**では、以下のパラメーターを利用できます:

* アクションを実行したユーザーに関するデータ（大文字と小文字を区別）

      アクションがWallarmテクニカルサポートチームによって実行された場合、ユーザー名は`Technical support`です。この値はactivity log recordsのソートに使用できません.
* アクションタイプ
* アクションが実行されたオブジェクトの名称
* アクションが実行された日時