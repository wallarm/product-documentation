# InsightConnect

以下のイベントがトリガーされたときに、WallarmからInsightConnectへ通知を送るように設定することができます:

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

## インテグレーションの設定

まず、以下の通りAPIキーを生成してコピーします:

1. InsightConnectのUIを開きます → **設定** → [**APIキー** ページ](https://insight.rapid7.com/platform#/apiKeyManagement)を開き、**新規ユーザーキー** をクリックします。
2. APIキーの名前を入力します（例：`Wallarm API`）し、**生成** をクリックします。
3. 生成されたAPIキーをコピーします。
4. WallarmのUIに移動し、 [US](https://us1.my.wallarm.com/integrations/) または [EU](https://my.wallarm.com/integrations/)クラウドで **インテグレーション** をクリックし、**InsightConnect** を選択します。
5. 前にコピーしたAPIキーを **APIキー** フィールドに貼り付けます。

次に、以下のようにAPI URLを生成してコピーします:

1. InsightConnectのUIに戻り、**自動化** → **ワークフロー** ページを開き、Wallarmの通知用の新しいワークフローを作成します。
2. トリガーを選択するよう求められた場合は、**APIトリガー**を選択します。
3. 生成されたURLをコピーします。
4. WallarmのUIに戻り → **InsightConnect** 設定に移動して、先ほどコピーしたAPI URLを **API URL** フィールドに貼り付けます。

最後に、WallarmのUIで設定を完了します:

1. インテグレーションの名前を入力します。
2. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
3. [インテグレーションをテスト](#テスト-インテグレーション)し、設定が正しいことを確認します。
4. **インテグレーションを追加** をクリックします。

![!InsightConnectのインテグレーション](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration-advanced-data.md"

InsightConnectメッセージのテスト:

![!InsightConnect通知のテスト](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"