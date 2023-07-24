# ユーザーの活動履歴ログ

Wallarmコンソールの **設定** → **アクティビティログ** タブでは、Wallarmシステム内のユーザーアクションの履歴を確認できます。ログには次のオブジェクトの作成、更新、削除についての情報が含まれます：

* [公開資産](../scanner.md)からのIPアドレスまたはサブネット
* ネットワークパリメータからのドメイン
* ネットワークパリメータからのサービス（ポート）
* ネットワークパリメータからのドメインと関連するIPアドレス
* [二要素認証](account.md#enabling-two-factor-authentication)
* [APIトークン](api-tokens.md)
* [ユーザー](users.md)
* トラフィック処理[ルール](../rules/intro.md)
* [カスタムルールセットのバックアップ](../rules/backup.md)
* [Wallarmノード](../nodes/nodes.md)
* [CDNノード](../nodes/cdn-node.md)
* [トリガー](../triggers/triggers.md)
* [インテグレーション](integrations/integrations-intro.md)
* [ブロックされたIPアドレス](../ip-lists/denylist.md)
* [ヒットのサンプリング](../events/analyze-attack.md#sampling-of-hits)

ログには以下のアクションとオブジェクトに関する情報も含まれます：

* [偽陽性とマークされた脆弱性](../vulnerabilities.md#marking-vulnerabilities-as-false-positives)
* [再チェックされた攻撃](../events/verify-attack.md)

![!アクティビティログ](../../images/user-guides/settings/audit-log.png)

**アクティビティログのレコードをフィルタリングするには**、次のパラメータを使用できます：

* アクションを実行したユーザーの大文字と小文字のデータ

      アクションがWallarmの技術サポートチームによって実行された場合、ユーザー名は `Technical support` です。この値はアクティビティログのレコードをソートするために使用することはできません。
* アクションタイプ
* アクションが実行されたオブジェクトの名前
* アクションが実行された日時
