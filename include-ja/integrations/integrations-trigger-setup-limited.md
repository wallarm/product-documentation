統合カードを通じて設定した通知に加えて、Wallarmのトリガーでは、通知のために追加のイベントを選択できます:

* 時間間隔（日、時など）あたりの[攻撃](../../../glossary-en.md#attack)、[ヒット](../../../glossary-en.md#hit)またはインシデントの数が設定数を超えた場合

    !!! info "カウントされないもの"
        * 攻撃の場合: 
            * [カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく実験的な攻撃。
        * ヒットの場合:
            * [カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく実験的なヒット。
            * [サンプル](../../events/analyze-attack.md#sampling-of-hits)に保存されていないヒット。

* [APIの変更](../../../api-discovery/track-changes.md)が発生した場合
* 新しい[ローグAPI](../../../api-discovery/rogue-api.md)（シャドウ、オーファン、ゾンビ）が検出された場合
* 会社アカウントに新しいユーザーが追加された場合

条件を詳細にするために、1つ以上のフィルタを追加できます。条件とフィルタが設定されたら、選択したアラートを送信するための統合を選択します。複数の統合を同時に選択することができます。

![統合の選択](../../../images/user-guides/triggers/select-integration.png)