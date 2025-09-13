* 次の場合を除き、[Hits](../../../glossary-en.md#hit)を検知します:

    * [カスタム正規表現](../../rules/regex-rule.md)に基づいて検知された実験的hitsは除外されます。非実験的hitsは通知をトリガーします。
    * [サンプル](../../../user-guides/events/analyze-attack.md#sampling-of-hits)に保存されていないhitsは除外されます。

* システム関連:
    * [User](../../../user-guides/settings/users.md)の変更（新規作成、削除、ロール変更）が対象です。
    * [Integration](integrations-intro.md)の変更（無効化、削除）が対象です。
    * [Application](../../../user-guides/settings/applications.md)の変更（新規作成、削除、名称変更）が対象です。
    * [rogue API detection](../../../api-discovery/rogue-api.md#step-1-upload-specification)または[API specification enforcement](../../../api-specification-enforcement/setup.md#step-1-upload-specification)に使用される仕様の定期更新中のエラーが対象です。
* 検知された[Vulnerabilities](../../../glossary-en.md#vulnerability)は、デフォルトではすべて、または選択したリスクレベル（高・中・低）のみが対象です。
* [Rules](../../../user-guides/rules/rules.md)と[triggers](../../../user-guides/triggers/triggers.md)の変更（ruleまたはtriggerの作成、更新、削除）が対象です。
* 毎時、直前の1時間に処理されたリクエスト数の通知を受け取ることができます。