統合カードを通じて既に設定されている通知に加えて、Wallarmのトリガーでは以下の追加イベントの通知を選択することができます：

* 指定された数を超える[攻撃](../../../glossary-en.md#attack)、[ヒット](../../../glossary-en.md#hit)またはインシデントの時間間隔ごとの数（日、時など）

    !!! info "カウントされないもの"
        * 攻撃について： 
            * [カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく実験的な攻撃。
        * ヒットについて：
            * [カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく実験的なヒット。
            * [サンプル](../../events/analyze-attack.md#sampling-of-hits)に保存されていないヒット。

* [APIの変更](../../../api-discovery/track-changes.md)が発生した
* IPアドレスが[ブラックリストに登録された](../../../user-guides/ip-lists/overview.md)
* 新たな[ローグAPI](../../../api-discovery/rogue-api.md)（シャドウ、オーファン、ゾンビ）が検出された
* 会社アカウントに新しいユーザーが追加された

条件の詳細を追加するために、1つまたは複数のフィルターを追加できます。条件とフィルターが設定されると、選択されたアラートを送信するための統合を選択します。同時に複数の統合を選択することができます。

![統合の選択](../../../images/user-guides/triggers/select-integration.png)