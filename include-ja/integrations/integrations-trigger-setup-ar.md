インテグレーションカードで既に設定した通知に加えて、Wallarmのトリガーでは通知対象にする追加のイベントを選択できます:

* 時間間隔（例：日、時間など）ごとの[攻撃](../../../glossary-en.md#attack)、[ヒット](../../../glossary-en.md#hit)またはインシデントの件数が設定した数を超えたときです

    !!! info "カウント対象外"
        * 攻撃の場合：
            * [カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく実験的な攻撃。
        * ヒットの場合：
            * [カスタム正規表現](../../../user-guides/rules/regex-rule.md)に基づく実験的なヒット。
            * [サンプル](../../../user-guides/events/analyze-attack.md#sampling-of-hits)に保存されていないヒット。

* [APIの変更](../../../api-discovery/track-changes.md)が発生したときです
* IPアドレスが[denylistに追加された](../../../user-guides/ip-lists/overview.md)ときです
* 新しい[ローグAPI](../../../api-discovery/rogue-api.md)（shadow、orphan、zombie）が検出されたときです
* 会社アカウントに新しいユーザーが追加されたときです

条件を詳細化するために、1つ以上のフィルターを追加できます。条件とフィルターを設定したら、選択したアラートの送信に使用するインテグレーションを選択します。同時に複数のインテグレーションを選択できます。

![インテグレーションの選択](../../../images/user-guides/triggers/select-integration.png)