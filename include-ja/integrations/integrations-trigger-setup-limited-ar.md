integration cardで既に設定済みの通知に加えて、Wallarm triggersでは通知対象の追加イベントを選択できます:

* 時間間隔（日、時間など）あたりの[attacks](../../../glossary-en.md#attack)、[hits](../../../glossary-en.md#hit)、またはincidentsの件数が設定値を超えた場合

    !!! info "カウントされないもの"
        * attacksの場合:
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md)に基づく実験的なattacks。
        * hitsの場合:
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md)に基づく実験的なhits。
            * [サンプル](../../../user-guides/events/analyze-attack.md#sampling-of-hits)に保存されていないhits。

* [APIの変更](../../../api-discovery/track-changes.md)が発生しました
* 新しい[rogue API](../../../api-discovery/rogue-api.md)（shadow、orphan、zombie）が検出されました
* 会社アカウントに新しいユーザーが追加されました

条件を詳細化するために、1つ以上のフィルターを追加できます。条件とフィルターを設定したら、選択したアラートの送信経路となるintegrationを選択します。同時に複数のintegrationsを選択できます。

![integrationの選択](../../../images/user-guides/triggers/select-integration.png)