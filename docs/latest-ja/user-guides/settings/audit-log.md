# ユーザーアクティビティログ

Wallarm Consoleの**Settings** → **Activity log**タブでは、Wallarmシステム内でのユーザー操作の履歴を確認できます。ログには、次のオブジェクトの作成、更新、削除に関する情報が含まれます：

* ネットワークペリメータのドメイン
* ネットワークペリメータのサービス（ポート）
* ネットワークペリメータのドメインおよび関連付けられたIPアドレス
* [二要素認証](account.md#enabling-two-factor-authentication)
* [APIトークン](api-tokens.md)
* [ユーザー](users.md)
* トラフィック処理[ルール](../rules/rules.md)
* [カスタムルールセットのバックアップ](../rules/rules.md#backup-and-restore)
* [Wallarmノード](../nodes/nodes.md)
* [トリガー](../triggers/triggers.md)
* [インテグレーション](integrations/integrations-intro.md)
* [ブロックされたIPアドレス](../ip-lists/overview.md)
* [Hitのサンプリング](../events/grouping-sampling.md#sampling-of-hits)

また、ログには次のアクションやオブジェクトに関する情報も含まれます：

* [誤検知としてマークされた脆弱性](../vulnerabilities.md#vulnerability-lifecycle)
* [再確認された攻撃](../../vulnerability-detection/threat-replay-testing/overview.md)

![Activity log](../../images/user-guides/settings/audit-log.png)

**Activity logのレコードをフィルタリングするには**、次のパラメータを使用できます：

* 操作を実行したユーザー（大文字と小文字を区別）

      操作がWallarmテクニカルサポートチームによって実行された場合、ユーザー名は`Technical support`です。この値はActivity logレコードの並べ替えには使用できません。
* 操作の種類
* 操作が実行されたオブジェクトの名前
* 操作が実行された日付