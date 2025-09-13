integration cardで既に設定している通知に加えて、Wallarmのトリガーでは通知対象とする追加イベントを選択できます:

* 一定の時間間隔（日、時間など）あたりの[攻撃](../../../glossary-en.md#attack)、[ヒット](../../../glossary-en.md#hit)またはインシデントの件数が設定した数を超えた場合

    !!! info "カウントに含まれないもの"
        * 攻撃の場合:
            * [カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく実験的な攻撃。
        * ヒットの場合:
            * [カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく実験的なヒット。
            * [サンプル](../../events/grouping-sampling.md#sampling-of-hits)に保存されていないヒット。

* [APIの変更](../../../api-discovery/track-changes.md)が発生した場合
* 新しい[rogue API](../../../api-discovery/rogue-api.md)（shadow、orphan、zombie）が検出された場合
* 会社アカウントに新しいユーザーが追加された場合

条件を詳細化するために、1つ以上のフィルターを追加できます。条件とフィルターの設定が完了したら、選択したアラートを送信するintegrationを選択します。複数のintegrationを同時に選択できます。

![integrationの選択](../../../images/user-guides/triggers/select-integration.png)