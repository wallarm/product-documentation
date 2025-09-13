integration cardで既に設定済みの通知に加えて、Wallarm triggersでは通知対象とする追加イベントを選択できます:

* 時間間隔（日、時間など）ごとの[攻撃](../../../glossary-en.md#attack)、[ヒット](../../../glossary-en.md#hit)またはインシデントの数が、設定した数を超えます。

    !!! info "カウントに含まれないもの"
        * 攻撃の場合:
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md)に基づく実験的な攻撃はカウントされません。
        * ヒットの場合:
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md)に基づく実験的なヒットはカウントされません。
            * [サンプル](../../events/grouping-sampling.md#sampling-of-hits)に保存されていないヒットはカウントされません。

* [APIの変更](../../../api-discovery/track-changes.md)が発生しました
* IPアドレスが[denylist](../../../user-guides/ip-lists/overview.md)に追加されました
* 新しい[rogue API](../../../api-discovery/rogue-api.md)（shadow、orphan、zombie）が検出されました
* 新しいユーザーが会社アカウントに追加されました

条件を詳細化するために、1つ以上のフィルターを追加できます。条件とフィルターを設定したら、選択したアラートの送信に使用するintegrationを選択します。複数のintegrationを同時に選択できます。

![integrationの選択](../../../images/user-guides/triggers/select-integration.png)