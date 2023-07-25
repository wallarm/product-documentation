					# InsightConnect

以下のイベントがトリガーされたときにWallarmからInsightConnectへ通知を送るように設定することができます:

--8<-- "../include/integrations/advanced-events-for-integrations.ja.md"

## インテグレーションの設定

まず、次のようにAPIキーを生成し、コピーします:

1. InsightConnectのUIを開き、**設定** → [**APIキー**ページ](https://insight.rapid7.com/platform#/apiKeyManagement)を開き、**新規ユーザーキー**をクリックします。
2. APIキーの名前を入力（例：`Wallarm API`）し、**生成**をクリックします。
3. 生成したAPIキーをコピーします。
4. WallarmのUIに移動し、[US](https://us1.my.wallarm.com/integrations/) または [EU](https://my.wallarm.com/integrations/)のクラウドで**インテグレーション**を開き、**InsightConnect**をクリックします。
5. コピーしたAPIキーを**APIキー**フィールドに貼り付けます。

次に、次のようにAPI URLを生成し、コピーします:

1. InsightConnectのUIに戻り、**自動化** → **ワークフロー**ページを開き、Wallarmの通知用に新しいワークフローを作成します。
2. トリガーを選択するように求められたら、**APIトリガー**を選択します。
3. 生成したURLをコピーします。
4. WallarmのUIに戻り、**InsightConnect**設定を開き、先ほどコピーしたAPI URLを**API URL**フィールドに貼り付けます。

最後に、Wallarm UIで設定を終了します:

1. インテグレーションの名前を入力します。
2. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
3. [インテグレーションをテスト](#テスト-インテグレーション)し、設定が正しいことを確認します。
4. **インテグレーションを追加**をクリックします。

![!InsightConnect integration](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-advanced-data.ja.md"

InsightConnectメッセージをテストします:

![!Test InsightConnect notification](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.ja.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.ja.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.ja.md"