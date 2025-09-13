# Telegram

[Telegram](https://telegram.org/)はクラウドベースのインスタントメッセージングプラットフォーム兼ソーシャルメディアアプリケーションです。WallarmからTelegramへ定期レポートおよびインスタント通知を送信するように設定できます。

定期レポートは日次・週次・月次のいずれかで送信できます。レポートには、選択した期間にお使いのシステムで検出された脆弱性、攻撃、インシデントに関する詳細情報が含まれます。通知には、トリガーされたイベントの概要が含まれます。

## 連携の設定

1. **Integrations**セクションを開きます。
1. **Telegram**ブロックをクリックするか、**Add integration**ボタンをクリックして**Telegram**を選択します。
1. Wallarmの通知を受信するTelegramグループに[@WallarmUSBot](https://t.me/WallarmUSBot)（Wallarm US Cloudを使用している場合）または[@WallarmBot](https://t.me/WallarmBot)（Wallarm EU Cloudを使用している場合）を追加し、認証用リンクを開きます。
1. Wallarm UIにリダイレクトされたら、ボットを認証します。
1. 連携名を入力します。
1. セキュリティレポートの送信頻度を選択します。頻度を選択しない場合、レポートは送信されません。
1. 通知をトリガーするイベントタイプを選択します。

    ![Telegram連携](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

    利用可能なイベントの詳細：

    --8<-- "../include/integrations/events-for-integrations.md"

    Telegramとの連携は、この連携が既に作成されている場合にのみテストできます。

1. **Add integration**をクリックします。
1. 作成したintegrationのカードを再度開きます。
1. 構成が正しいこと、Wallarm Cloudが利用可能であること、および通知のフォーマットを確認するために**Test integration**をクリックします。

    これにより、プレフィックス`[Test message]`付きのテスト通知が送信されます：

    ```
    [Test message] [Test partner] ネットワークペリメータが変更されました

    通知タイプ: new_scope_object_ips

    ネットワークペリメータで新しいIPアドレスが検出されました:
    8.8.8.8

    クライアント: TestCompany
    クラウド: EU
    ```

[@WallarmUSBot](https://t.me/WallarmUSBot)または[@WallarmBot](https://t.me/WallarmBot)とのチャットを直接開始することもできます。ボットはレポートや通知も送信します。

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## 連携の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および連携パラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"