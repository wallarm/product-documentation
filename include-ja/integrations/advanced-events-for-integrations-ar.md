* [Hits](../../../glossary-en.md#hit)は以下の場合を除き検出されます:
    * [カスタム正規表現](../../rules/regex-rule.md)に基づいて検出された実験的なHits。実験的でないHitsは通知を発生させます。
    * [サンプル](../../../user-guides/events/analyze-attack.md#sampling-of-hits)に保存されないHits。

* システム関連:
    * [User](../../../user-guides/settings/users.md)の変更（新規作成、削除、ロール変更）
    * [Integration](integrations-intro.md)の変更（無効化、削除）
    * [Application](../../../user-guides/settings/applications.md)の変更（新規作成、削除、名称変更）
* [Vulnerabilities](../../../glossary-en.md#vulnerability)が検出されます。デフォルトでは全て検出されますが、選択したリスクレベル（高・中・低）のもののみ検出することも可能です。
* [Rules](../../../user-guides/rules/rules.md)および[triggers](../../../user-guides/triggers/triggers.md)の変更（ルールまたはトリガーの作成、更新、削除）
* [Scope (exposed assets)](../../scanner.md)の変更：ホスト、サービス、ドメインの更新
* 1時間ごとに、直前の1時間に処理されたリクエスト数の通知を受け取ることが可能です。