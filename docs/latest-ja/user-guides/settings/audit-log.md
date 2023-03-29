# ユーザー活動ログ

Wallarm Consoleの **設定** → **アクティビティログ** タブで、Wallarmシステム内のユーザーアクションの履歴を確認できます。ログには、以下のオブジェクトの作成、更新、および削除に関する情報が含まれています。

* [ネットワークパリメーター](../scanner/check-scope.md)からのIPアドレスまたはサブネット
* ネットワークパリメーターからのドメイン
* ネットワークパリメーターからのサービス（ポート）
* ネットワークパリメーターからのドメインと関連するIPアドレス
* [二要素認証](account.md#enabling-two-factor-authentication)
* [ユーザー](users.md)
* トラフィック処理[ルール](../rules/intro.md)
* [カスタムルールセットのバックアップ](../rules/backup.md)
* [Wallarmノード](../nodes/nodes.md)
* [CDNノード](../nodes/cdn-node.md)
* [トリガー](../triggers/triggers.md)
* [統合](integrations/integrations-intro.md)
* [ブロックされたIPアドレス](../ip-lists/denylist.md)
* [ヒットサンプリング](../events/analyze-attack.md#sampling-of-hits)

ログには、以下のアクションとオブジェクトに関する情報も含まれています。

* [偽陽性としてマークされた脆弱性](../vulnerabilities/false-vuln.md)
* [再チェックされた攻撃](../events/verify-attack.md)

![!アクティビティログ](../../images/user-guides/settings/audit-log.png)

**アクティビティログレコードをフィルタリングするには**、以下のパラメータを使用できます。

* アクションを実行したユーザーに関する大文字と小文字を区別するデータ

      アクションがWallarm技術サポートチームによって実行された場合、ユーザー名は`Technical support`です。この値はアクティビティログレコードのソートに使用できません。
* アクションタイプ
* アクションが実行されたオブジェクトの名前
* アクションが実行された日付