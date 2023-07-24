# Microsoftチーム

次のイベントがトリガーされたときに、WallarmからMicrosoftチームのチャンネルに通知を送信するように設定できます：

--8<-- "../include/integrations/events-for-integrations.md"

## インテグレーションの設定

1. **統合**セクションを開きます。
2. **Microsoft Teams** ブロックをクリックするか、**統合を追加** ボタンをクリックして **Microsoft Teams** を選択します。
3. 統合の名前を入力します。
4. 通知を投稿したいMicrosoft Teamsチャンネルの設定を開き、[この指示](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)に従って新しいWebhookを設定します。
5. 提供されたWebhookのURLをコピーし、Wallarmのコンソール内の**Webhook URL**フィールドにその値を貼り付けます。
6. 通知をトリガーするイベントのタイプを選択します。 イベントが選択されていなければ、通知は送信されません。
7. [インテグレーションをテスト](#integration-testing)して、設定が正しいことを確認します。
8. **統合を追加**をクリックします。

      ![!MSチーム統合](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-basic-data.md"

**wallarm**からのMicrosoft Teamsのメッセージをテストします：

```
[テストメッセージ] [テストパートナー] ネットワークの周囲が変わりました。

通知タイプ：new_scope_object_ips

新たに発見されたネットワーク内のIPアドレス：
8.8.8.8

クライアント：TestCompany
クラウド：EU
```

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.md"