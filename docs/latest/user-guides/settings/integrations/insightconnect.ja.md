# InsightConnect

次のイベントがトリガされたときに、WallarmからInsightConnectに通知を送信するように設定できます。

--8<-- "../include/integrations/advanced-events-for-integrations.ja.md"

## インテグレーションの設定

まず、以下のようにAPIキーを生成してコピーします。

1. InsightConnectのUI→ **設定** → [**APIキー** ページ](https://insight.rapid7.com/platform#/apiKeyManagement) を開いて **新規ユーザーキー** をクリック。
2. APIキー名（例： `Wallarm API`）を入力し、**生成** をクリック。
3. 生成されたAPIキーをコピー。
4. Wallarm UI → [US](https://us1.my.wallarm.com/integrations/) または [EU](https://my.wallarm.com/integrations/) クラウドの **インテグレーション** に移動し、**InsightConnect** をクリック。
4. 以前にコピーしたAPIキーを **APIキー** フィールドに貼り付け。

次に、API URLを生成してコピーします。

1. InsightConnectのUIに戻り、**オートメーション** → **ワークフロー** ページを開き、Wallarm通知の新しいワークフローを作成。
2. トリガーを選択するよう求められた場合は、**APIトリガー** を選択。
3. 生成されたURLをコピー。
4. Wallarm UI → **InsightConnect** 設定に戻り、以前にコピーしたAPI URLを **API URL** フィールドに貼り付け。

最後に、Wallarm UIで設定を完了します。

1. インテグレーション名を入力。
2. 通知をトリガするイベントタイプを選択。イベントが選択されていない場合、通知は送信されません。
3. [インテグレーションをテスト](#testing-integration)し、設定が正しいことを確認。
4. **インテグレーションを追加** をクリック。

![!InsightConnect integration](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration.ja.md"

InsightConnectメッセージのテスト：

![!Test InsightConnect notification](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.ja.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.ja.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.ja.md"