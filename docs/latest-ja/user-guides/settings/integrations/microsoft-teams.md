# Microsoft Teams

[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software) は、チームワークを促進し、オフィス、リモート、またはその両方の働き方に関わらず、組織が効果的にコミュニケーション、コラボレーション、およびプロジェクト管理を行えるように設計されたコラボレーションおよびコミュニケーションプラットフォームです。Wallarmを設定してMicrosoft Teamsのチャンネルに通知を送信できます。複数の異なるチャンネルに通知を送信する場合は、複数のMicrosoft Teams統合を作成してください。

## 統合の設定

1. **Integrations** セクションを開きます。
1. **Microsoft Teams** ブロックをクリックするか、**Add integration** ボタンをクリックして **Microsoft Teams** を選択します。
1. 統合名を入力します。
1. 通知を投稿したいMicrosoft Teamsのチャンネルの設定を開き、[手順](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)を使用して新しいWebhookを設定します。
1. 表示されたWebhook URLをコピーし、Wallarm Consoleの **Webhook URL** フィールドに値を貼り付けます。
1. 通知をトリガーするイベントの種類を選択します。

      ![MS Teams integration](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)
    
      利用可能なイベントの詳細:
      
      --8<-- "../include/integrations/events-for-integrations.md"

1. **Test integration** をクリックして、設定の正確性、Wallarm Cloudの利用可能性、および通知形式を確認します。

      これにより、接頭辞 `[Test message]` の付いたテスト通知が送信されます:

      ```
      [Test message] [Test partner] Network perimeter has changed

      Notification type: new_scope_object_ips

      New IP addresses were discovered in the network perimeter:
      8.8.8.8

      Client: TestCompany
      Cloud: EU
      ```

1. **Add integration** をクリックします。

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## 統合の無効化および削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不能および統合パラメータの不正

--8<-- "../include/integrations/integration-not-working.md"