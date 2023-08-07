# Microsoft Teams

あなたは以下のイベントがトリガーされたときにMicrosoft Teamsチャンネルに通知を送信するようにWallarmを設定できます：

--8<-- "../include/integrations/events-for-integrations.md"

## インテグレーションの設定

1. **Integrations**セクションを開きます。
2. **Microsoft Teams**ブロックをクリックするか、**Add integration**ボタンをクリックして**Microsoft Teams**を選択します。
3. インテグレーション名を入力します。
4. 通知を投稿したいMicrosoft Teamsチャンネルの設定を開き、新しいWebhookを[これらの指示](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)を使って設定します。
5. 提供されたWebhook URLをコピーして、Wallarm Consoleの**Webhook URL**フィールドに値を貼り付けます。
6. 通知をトリガーするイベントの種類を選択します。イベントが選ばれていない場合、通知は送信されません。
7. [インテグレーションをテスト](#testing-integration)し、設定が正しいことを確認します。
8. **Add integration**をクリックします。

    ![!MS Teams integration](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-basic-data.md"

ユーザー**wallarm**からのMicrosoft Teamsメッセージをテストします：

```
[テストメッセージ] [テストパートナー] ネットワークパーコメーターが変更されました

通知タイプ：new_scope_object_ips

ネットワークパーコメーターに新しいIPアドレスが見つかりました：
8.8.8.8

クライアント名：TestCompany
クラウド：EU
```


## インテグレーションの更新

--8<-- "../include/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.md"