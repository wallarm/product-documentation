* [Hits](../../../glossary-en.md#hit)が検出されました。ただし、以下の場合は除外されます:
    * 実験的なHitsが[カスタム正規表現](../../rules/regex-rule.md)に基づいて検出されます。実験的でないHitsは通知を発します.
    * [サンプル](../../../user-guides/events/analyze-attack.md#sampling-of-hits)に保存されなかったHits.
* システム関連:
    * [User](../../../user-guides/settings/users.md)の変更（新規作成、削除、役割変更）
    * [Integration](integrations-intro.md)の変更（無効、削除）
    * [Application](../../../user-guides/settings/applications.md)の変更（新規作成、削除、名前変更）
* [脆弱性](../../../glossary-en.md#vulnerability)が検出されました（デフォルトではすべて、または選択したリスクレベル―高、中、低―のみ）.
* [Rules](../../../user-guides/rules/intro.md)および[triggers](../../../user-guides/triggers/triggers.md)が変更されました（ルールまたはトリガーの作成、更新、削除）.
* [Scope (exposed assets)](../../scanner.md)が変更されました：ホスト、サービス、ドメインの更新
* 毎時、前の1時間に処理されたリクエスト数を含む通知を受け取ることができます