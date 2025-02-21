統合カードを通じてすでに設定済みの通知に加え、Wallarmトリガーは通知用に追加のイベントを選択することを可能にします:

* 時間間隔（例：日、時など）ごとに設定した数値を超える[attacks](../../../glossary-en.md#attack)、[hits](../../../glossary-en.md#hit)またはインシデントの数

    !!! info "計数に含まれないもの"
        * 攻撃の場合:
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md)に基づく実験的な攻撃
        * ヒットの場合:
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md)に基づく実験的なヒット
            * [sample](../../events/grouping-sampling.md#sampling-of-hits)に保存されないヒット

* [Changes in API](../../../api-discovery/track-changes.md)が発生した
* 新たな[rogue API](../../../api-discovery/rogue-api.md)（shadow、orphan、zombie）が検出された
* 会社アカウントに新しいユーザーが追加された

条件の詳細設定として、1つ以上のフィルターを追加できます。条件とフィルターが設定され次第、選択したアラートを送信する統合を選択してください。複数の統合を同時に選択できます。

![Choosing an integration](../../../images/user-guides/triggers/select-integration.png)