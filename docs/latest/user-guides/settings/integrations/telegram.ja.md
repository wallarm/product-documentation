# Telegram

Wallarmを設定し、スケジュールに従ったレポートや即時通知をTelegramに送信することができます。

* スケジュールレポートは、毎日、毎週、または毎月の基準で送信できます。レポートには、選択した期間中にシステムで検出された脆弱性、攻撃、インシデントの詳細情報が含まれます。
* 通知は、トリガーされたイベントの簡単な詳細を含みます：
    --8<-- "../include/integrations/events-for-integrations.ja.md"

## 統合の設定

1. **統合**セクションを開きます。
2. **Telegram**ブロックをクリックするか、**統合を追加**ボタンをクリックし、**Telegram**を選択します。
3. Wallarmの通知を受け取るTelegramグループに、[@WallarmUSBot](https://t.me/WallarmUSBot)（Wallarm US Cloudを使用している場合）または[@WallarmBot](https://t.me/WallarmBot)（Wallarm EU Cloudを使用している場合）を追加し、認証リンクに従ってください。
4. Wallarm UIにリダイレクトされた後、ボットを認証します。
5. 統合名を入力します。
6. セキュリティレポートを送信する頻度を選択します。頻度が選択されていない場合、レポートは送信されません。
7. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
8. [統合をテスト](#testing-integration)し、設定が正しいことを確認します。
9. **統合を追加**をクリックします。

    ![!Telegram integration](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

また、[@WallarmUSBot](https://t.me/WallarmUSBot)または[@WallarmBot](https://t.me/WallarmBot)と直接チャットを開始することもできます。ボットはレポートと通知を送信します。

## 統合のテスト

--8<-- "../include/integrations/test-integration-basic-data.ja.md"

この統合は、すでに作成された場合にのみテストできます。テストメッセージは次のとおりです：

```
[テストメッセージ] [テストパートナー] ネットワークの境界が変更されました

通知タイプ：new_scope_object_ips

ネットワークの境界に新しいIPアドレスが見つかりました：
8.8.8.8

クライアント：TestCompany
クラウド：EU
```

## 統合の更新

--8<-- "../include/integrations/update-integration.ja.md"

## 統合の無効化

--8<-- "../include/integrations/disable-integration.ja.md"

## 統合の削除

--8<-- "../include/integrations/remove-integration.ja.md"