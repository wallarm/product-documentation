* [Hits](../../../glossary-en.md#hit)は次を除いて検出されます:
  
    * [カスタム正規表現](../../rules/regex-rule.md)に基づいて検出される実験的なHits。実験的ではないHitsは通知をトリガーします。
    * [サンプル](../../../user-guides/events/analyze-attack.md#sampling-of-hits)に保存されないHits。

* システム関連:
    * [User](../../../user-guides/settings/users.md)の変更（新規作成、削除、ロール変更）
    * [Integration](integrations-intro.md)の変更（無効化、削除）
    * [Application](../../../user-guides/settings/applications.md)の変更（新規作成、削除、名称変更）
* [Vulnerabilities](../../../glossary-en.md#vulnerability)が検出されます。デフォルトではすべてが対象ですが、選択したリスクレベル - high, mediumまたはlowのみを対象にすることもできます。
* [Rules](../../../user-guides/rules/intro.md)および[triggers](../../../user-guides/triggers/triggers.md)が変更されます（ルールまたはトリガーの作成、更新、削除）。
* 毎時、直前の1時間に処理されたリクエスト数を含む通知を受け取ることができます。