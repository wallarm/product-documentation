* [ヒット](../../../glossary-en.md#hit) 検出されたものは以下を除く：

    * [カスタム正規表現](../../rules/regex-rule.md)に基づいて検出された実験的なヒット。非実験的なヒットは通知を引き起こします。
    * [サンプル](../../events/analyze-attack.md#sampling-of-hits)に保存されていないヒット。

* システム関連：
    * [ユーザー](../../../user-guides/settings/users.md)の変更（新規作成、削除、役割の変更）
    * [インテグレーション](integrations-intro.md)の変更（無効、削除）
    * [アプリケーション](../../../user-guides/settings/applications.md)の変更（新規作成、削除、名称の変更）
* 検出された[脆弱性](../../../glossary-en.md#vulnerability)、デフォルトでは全て、または選択したリスクレベル（高、中、低）についてのみ。
* [ルール](../../../user-guides/rules/intro.md)と[トリガー](../../../user-guides/triggers/triggers.md)の変更（ルールまたはトリガーの作成、更新、または削除）
* [スコープ（露出したアセット）](../../scanner.md)の変更：ホスト、サービス、ドメインの更新
* 時間単位で、前の時間に処理されたリクエストの数に関する通知を受け取ることができます。