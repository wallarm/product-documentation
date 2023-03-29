# Slack

Wallarmを設定して、以下のイベントがトリガされたときにSlackチャンネルに通知を送ることができます。

--8<-- "../include-ja/integrations/events-for-integrations.md"

## インテグレーションの設定

1. **インテグレーション**セクションを開きます。
2. **Slack**ブロックをクリックするか、**インテグレーションを追加**ボタンをクリックして**Slack**を選択します。
3. インテグレーション名を入力します。
4. [SlackのWebhook設定](https://my.slack.com/services/new/incoming-webhook/)を開き、メッセージを投稿するチャンネルを選択して新しいWebhookを追加します。
5. 提供されたWebhook URLをコピーし、Wallarm UIの**Webhook URL**フィールドに値を貼り付けます。
6. 通知をトリガするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
7. [インテグレーションをテスト](#testing-integration)し、設定が正しいことを確認します。
8. **インテグレーションを追加**をクリックします。

      ![!Slackインテグレーション](../../../images/user-guides/settings/integrations/add-slack-integration.png)

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration.md"

ユーザー**wallarm**からのテストSlackメッセージ:

```
[テストメッセージ] [テストパートナー] ネットワークの境界が変更されました

通知タイプ: new_scope_object_ips

ネットワークの境界に新しいIPアドレスが見つかりました:
8.8.8.8

クライアント: TestCompany
クラウド: EU
```

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"