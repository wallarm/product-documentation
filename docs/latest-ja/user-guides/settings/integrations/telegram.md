# Telegram

[Telegram](https://telegram.org/) はクラウドベースのインスタントメッセージングプラットフォームかつソーシャルメディアアプリケーションです。Wallarmを設定することで、Telegramへ定期レポートや即時通知を送ることができます。

定期レポートは日単位、週単位、または月単位で送ることができます。レポートには、選択した期間内にシステムで検出された脆弱性、攻撃、およびインシデントに関する詳細情報が含まれます。通知にはトリガーされたイベントの簡単な詳細が含まれます。

## 統合の設定

1. **Integrations** セクションを開きます。
1. **Telegram** ブロックをクリックするか、**Add integration** ボタンをクリックして **Telegram** を選択します。
1. Wallarm通知を受信するTelegramグループに[@WallarmUSBot](https://t.me/WallarmUSBot)（Wallarm US Cloudを使用している場合）または[@WallarmBot](https://t.me/WallarmBot)（Wallarm EU Cloudを使用している場合）を追加し、認証リンクに従います。
1. Wallarm UIにリダイレクトされた後、ボットを認証します。
1. 統合名を入力します。
1. セキュリティレポートの送信頻度を選択します。頻度が選択されない場合、レポートは送信されません。
1. 通知をトリガーするイベントタイプを選択します。

    ![Telegram統合](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/events-for-integrations.md"

    この統合がすでに作成されている場合にのみ、Telegramとの統合をテストできます。

1. **Add integration** をクリックします。
1. 作成された統合カードを再度開きます。
1. 構成の正確性、Wallarm Cloudの利用可能性、および通知フォーマットを確認するために**Test integration** をクリックします。

    これにより、接頭辞 `[Test message]` を付けたテスト通知が送信されます:

    ```
    [Test message] [Test partner] Network perimeter has changed

    Notification type: new_scope_object_ips

    New IP addresses were discovered in the network perimeter:
    8.8.8.8

    Client: TestCompany
    Cloud: EU
    ```

[@WallarmUSBot](https://t.me/WallarmUSBot)または[@WallarmBot](https://t.me/WallarmBot)と直接チャットを開始することもできます。ボットはレポートや通知も送信します。

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## 統合の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および不正な統合パラメーター

--8<-- "../include/integrations/integration-not-working.md"