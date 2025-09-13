* [Hits](../../../glossary-en.md#hit)の検出（以下を除く）：
  
    * [カスタム正規表現](../../rules/regex-rule.md)に基づき検出された実験的なHitsです。実験的でないHitsは通知が送信されます。
    * [サンプル](../../events/grouping-sampling.md#sampling-of-hits)に保存されていないHitsです。

* システム関連：
    * [User](../../../user-guides/settings/users.md)の変更（新規作成、削除、ロール変更）
    * [Integration](integrations-intro.md)の変更（無効化、削除）
    * [Application](../../../user-guides/settings/applications.md)の変更（新規作成、削除、名称変更）
    * [rogue API detection](../../../api-discovery/rogue-api.md#step-1-upload-specification)または[API仕様の適用](../../../api-specification-enforcement/setup.md#step-1-upload-specification)に使用する仕様の定期更新時のエラー
* [Vulnerabilities](../../../glossary-en.md#vulnerability)の検出です。デフォルトではすべてが対象ですが、選択したrisk level(s)（high、medium、low）のみに限定できます。
* [Rules](../../../user-guides/rules/rules.md)および[triggers](../../../user-guides/triggers/triggers.md)の変更（ルールまたはトリガーの作成、更新、削除）です。
* （[AASM Enterprise](../../../api-attack-surface/setup.md#enabling)が必要です）[Security issues](../../../api-attack-surface/security-issues.md)の検出です。すべて、または選択した[risk level(s)](../../../api-attack-surface/security-issues.md#issue-risk-level)のみを対象にできます：
    * Critical risk
    * High risk
    * Medium risk
    * Low risk
    * Info risk
* 毎時、直前の1時間に処理されたリクエスト数を通知で受け取ることができます。