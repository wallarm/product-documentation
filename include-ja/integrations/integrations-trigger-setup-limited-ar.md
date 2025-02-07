統合カードを通じて既に設定済みの通知に加え、Wallarmトリガーでは通知用に追加のイベントを選択できます。

* 時間間隔（1日、1時間など）ごとに、[attacks](../../../glossary-en.md#attack)、[hits](../../../glossary-en.md#hit)またはインシデントの数が設定した数を超えた場合

    !!! info "カウントされないもの"
        * 攻撃の場合:
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md)に基づく実験的な攻撃。
        * ヒットの場合:
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md)に基づく実験的なヒット。
            * [sample](../../../user-guides/events/analyze-attack.md#sampling-of-hits)に保存されていないヒット。

* [Changes in API](../../../api-discovery/track-changes.md)が発生した場合
* 新たな[rogue API](../../../api-discovery/rogue-api.md)（shadow、orphan、zombie）が検出された場合
* 会社アカウントに新しいユーザーが追加された場合

条件の詳細設定には、一つ以上のフィルタを追加できます。条件とフィルタが設定されると、選択したアラートを送信する統合を選択します。複数の統合を同時に選択できます。

![Choosing an integration](../../../images/user-guides/triggers/select-integration.png)