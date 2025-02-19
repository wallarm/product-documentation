統合カードを通じて既に設定されている通知に加え、Wallarmトリガーでは、追加の通知イベントを選択することができます:

* 一定の時間間隔（1日、1時間など）ごとにおける[攻撃](../../../glossary-en.md#attack)、[ヒット](../../../glossary-en.md#hit)またはインシデントの数が設定値を超えた場合

    !!! info "カウント対象外のもの"
        * 攻撃:
            * 実験的な[カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく攻撃
        * ヒット:
            * 実験的な[カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づくヒット
            * [サンプル](../../events/grouping-sampling.md#sampling-of-hits)に保存されていないヒット

* [APIの変更](../../../api-discovery/track-changes.md)が発生した場合
* IPアドレスが[denylisted](../../../user-guides/ip-lists/overview.md)された場合
* 新たな[rogue API](../../../api-discovery/rogue-api.md)（shadow, orphan, zombie）が検出された場合
* 企業アカウントに新しいユーザーが追加された場合

条件の詳細化のために、1つ以上のフィルターを追加できます。条件とフィルターが設定され次第、通知を送信するための統合を選択してください。複数の統合を同時に選択できます。

![統合の選択](../../../images/user-guides/triggers/select-integration.png)