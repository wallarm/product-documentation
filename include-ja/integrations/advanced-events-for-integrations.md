* [ヒット](../../../glossary-en.md#hit)が検出された場合を除く：

    * [カスタム正規表現](../../rules/regex-rule.md)に基づいて検出された実験的なヒット。非実験的なヒットは通知を引き起こします。
    * [サンプル](../../events/analyze-attack.md#sampling-of-hits)に保存されていないヒット。
* システム関連：
    * [ユーザー](../../../user-guides/settings/users.md)の変更（新規作成、削除、役割の変更）
    * [統合](integrations-intro.md)の変更（無効化、削除）
    * [アプリケーション](../../../user-guides/settings/applications.md)の変更（新規作成、削除、名前の変更）
* [脆弱性](../../../glossary-en.md#vulnerability)が検出され、すべてがデフォルトまたは選択したリスクレベルのみ：
    * 高リスク
    * 中リスク
    * 低リスク
* [ルール](../../../user-guides/rules/rules.md)と[トリガー](../../../user-guides/triggers/triggers.md)の変更（ルールやトリガーの作成、更新、または削除）
* [対象範囲（公開資産）](../../scanner.md)の変更：ホスト、サービス、ドメインの更新
* 時間ごとに、前の時間に処理されたリクエストの数に関する通知を受けることができます