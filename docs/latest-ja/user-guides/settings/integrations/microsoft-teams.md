# Microsoft Teams

[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software)は、チームワークを促進し、オフィス勤務、リモート勤務、またはその組み合わせのいずれであっても、組織が効果的にコミュニケーション、コラボレーション、プロジェクト管理を行えるよう設計されたコラボレーションおよびコミュニケーションプラットフォームです。Wallarmを設定してMicrosoft Teamsのチャネルに通知を送信できます。複数の異なるチャネルに通知を送信したい場合は、Microsoft Teamsインテグレーションを複数作成してください。

## インテグレーションの設定

1. **Integrations**セクションを開きます。
1. **Microsoft Teams**ブロックをクリックするか、**Add integration**ボタンをクリックして**Microsoft Teams**を選択します。
1. インテグレーション名を入力します。
1. 通知を投稿するMicrosoft Teamsチャネルの設定を開き、[手順](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)に従って新しいWebhookを設定します。
1. 提供されたWebhook URLをコピーし、Wallarm Consoleの**Webhook URL**フィールドに貼り付けます。
1. 通知をトリガーするイベントタイプを選択します。

      ![MS Teamsインテグレーション](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)
    
      利用可能なイベントの詳細:
      
      --8<-- "../include/integrations/events-for-integrations.md"

1. **Test integration**をクリックして、設定の正しさ、Wallarm Cloudの可用性、および通知形式を確認します。

      これにより、接頭辞`[Test message]`付きのテスト通知が送信されます:

      ```
      [Test message] [Test partner] ネットワークペリメーターが変更されました

      通知タイプ: new_scope_object_ips

      ネットワークペリメーターで新しいIPアドレスが検出されました:
      8.8.8.8

      クライアント: TestCompany
      クラウド: EU
      ```

1. **Add integration**をクリックします。

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可およびインテグレーションパラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"