# Slack

以下のイベントがトリガーされると、Wallarmはお客様のSlackチャンネルに通知を送るように設定できます：

--8<-- "../include-ja/integrations/events-for-integrations.md"

## 統合の設定

1. **統合**セクションを開きます。
2. **Slack** ブロックをクリックするか、**統合を追加** ボタンをクリックして **Slack** を選択します。
3. 統合名を入力します。
4. [SlackのWebhook設定](https://my.slack.com/services/new/incoming-webhook/)を開き、メッセージを投稿するチャンネルを選択して新しいWebhookを追加します。
5. 提供されたWebhook URLをコピーし、その値をWallarm UIの **Webhook URL** フィールドに貼り付けます。
6. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
7. [統合をテスト](#統合のテスト)し、設定が正しいことを確認します。
8. **統合を追加** をクリックします。

      ![!Slack統合](../../../images/user-guides/settings/integrations/add-slack-integration.png)

## 統合のテスト

--8<-- "../include-ja/integrations/test-integration-basic-data.md"

**wallarm** ユーザーからのテストSlackメッセージ：

```
[テストメッセージ] [テストパートナー] ネットワークの周辺機器が変わりました

通知タイプ：new_scope_object_ips

ネットワークの周辺に新たに発見されたIPアドレス：
8.8.8.8

クライアント：TestCompany
クラウド：EU
```

## 統合を更新

--8<-- "../include-ja/integrations/update-integration.md"

## 統合を無効にする

--8<-- "../include-ja/integrations/disable-integration.md"

## 統合を削除する

--8<-- "../include-ja/integrations/remove-integration.md"