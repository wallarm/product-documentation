既に統合カードで設定済みの通知に加えて、Wallarmのトリガーは通知用の追加イベントを選択可能です:

* 指定された時間間隔（日、時など）あたりの[攻撃](../../../glossary-en.md#attack)、[ヒット](../../../glossary-en.md#hit)またはインシデントの数が設定された数を超える

    !!! info "カウントされないもの"
        * 攻撃の場合:
            * [カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく実験的攻撃
        * ヒットの場合:
            * [カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく実験的ヒット
            * [サンプル](../../../user-guides/events/analyze-attack.md#sampling-of-hits)に保存されなかったヒット

* [APIの変更](../../../api-discovery/track-changes.md)が発生する
* IPアドレスが[denylisted](../../../user-guides/ip-lists/overview.md)された
* 新しい[rogue API](../../../api-discovery/rogue-api.md)（shadow、orphan、zombie）が検出された
* 会社アカウントに新しいユーザーが追加された

条件の詳細設定のために、１つ以上のフィルタを追加できます。条件とフィルタが設定され次第、通知を送信するための統合を選択してください。複数の統合を同時に選択できます。

![統合の選択](../../../images/user-guides/triggers/select-integration.png)