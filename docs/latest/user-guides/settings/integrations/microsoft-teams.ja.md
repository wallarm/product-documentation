# Microsoft Teams

以下のイベントがトリガーされたときに、Wallarm から Microsoft Teams チャンネルへの通知を設定できます。

--8<-- "../include/integrations/events-for-integrations.ja.md"

## インテグレーションの設定

1. **インテグレーション**セクションを開きます。
2. **Microsoft Teams** ブロックをクリックするか、**インテグレーションを追加** ボタンをクリックして **Microsoft Teams** を選択します。
3. インテグレーション名を入力します。
4. 通知を投稿したい Microsoft Teams チャンネルの設定を開き、新しい Webhook を [説明書](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook) を使用して構成します。
5. 提供された Webhook URL をコピーして、Wallarm コンソールの **Webhook URL** フィールドに値を貼り付けます。
6. 通知をトリガーするイベントの種類を選択します。イベントが選択されていない場合、通知は送信されません。
7. [インテグレーションをテスト](#testing-integration)し、設定が正しいことを確認します。
8. **インテグレーションを追加** をクリックします。

      ![!MS Teams integration](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration.ja.md"

ユーザ **wallarm** からの Microsoft Teams メッセージをテスト:

```
[テストメッセージ] [テストパートナー] ネットワーク境界が変更されました

通知タイプ：new_scope_object_ips

ネットワーク境界に新しい IP アドレスが見つかりました:
8.8.8.8

クライアント：TestCompany
クラウド：EU
```

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.ja.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.ja.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.ja.md"