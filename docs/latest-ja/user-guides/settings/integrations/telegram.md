# Telegram

Wallarmを設定すると、スケジュールされたレポートと即時通知をTelegramに送信できます。

* スケジュールレポートは、日次、週次、または月次で送信することができます。レポートには、選択された期間内にシステムで検出された脆弱性、攻撃、インシデントに関する詳細な情報が含まれます。
* 通知には、トリガーされたイベントの簡単な詳細を含みます:
    --8<-- "../include-ja/integrations/events-for-integrations.md"

## インテグレーションの設定

1. **Integrations** セクションを開きます。
2. **Telegram** ブロックをクリックするか、**Add integration** ボタンをクリックして **Telegram** を選択します。
3. [@WallarmUSBot](https://t.me/WallarmUSBot)（Wallarm US Cloudを使用している場合）または[@WallarmBot](https://t.me/WallarmBot)（Wallarm EU Cloudを使用している場合）をTelegramグループに追加し、認証リンクをたどります。
4. Wallarm UIにリダイレクトした後、ボットを認証します。
5. インテグレーション名を入力します。
6. セキュリティレポートの送信頻度を選択します。頻度が選択されていない場合、レポートは送信されません。
7. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
8. [インテグレーションをテスト](#testing-integration)し、設定が正しいことを確認します。
9. **Add integration** をクリックします。

    ![!Telegramの統合](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

また、[@WallarmUSBot](https://t.me/WallarmUSBot) または [@WallarmBot](https://t.me/WallarmBot) と直接チャットを開始することもできます。ボットはレポートと通知を送信します。

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration-basic-data.md"

Telegramとのインテグレーションは、すでにこのインテグレーションが作成されている場合にのみテストできます。テストTelegramメッセージ:

```
[テストメッセージ] [テストパートナー] ネットワークパーメータが変更されました

通知タイプ: new_scope_object_ips

ネットワークパーメータに新たなIPアドレスが発見されました:
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