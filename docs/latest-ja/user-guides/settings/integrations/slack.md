# Slack

[Slack](https://slack.com/)は広く使用されているクラウドベースのチームコラボレーションおよびメッセージングプラットフォームです。チームがメッセージをやり取りし、ファイルを共有し、他のツールやサービスと連携するための集中スペースを提供することで、組織内のコミュニケーションとコラボレーションを促進するよう設計されています。WallarmからSlackチャンネルに通知を送信するように設定できます。複数の異なるSlackチャンネルやアカウントに通知を送信したい場合は、Slack integrationを複数作成します。

## Integrationの設定

1. **Integrations**セクションを開きます。
1. **Slack**ブロックをクリックするか、**Add integration**ボタンをクリックして**Slack**を選択します。
1. integrationの名前を入力します。
1. [SlackのWebhook設定](https://my.slack.com/services/incoming-webhook/)を開き、メッセージを投稿するチャンネルを選択して新しいWebhookを追加します。
1. 提供されたWebhook URLをコピーし、Wallarm UIの**Webhook URL**フィールドに値を貼り付けます。
1. 通知をトリガーするイベントタイプを選択します。

    ![Slack integration](../../../images/user-guides/settings/integrations/add-slack-integration.png)

    利用可能なイベントの詳細:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. **Test integration**をクリックして、設定の正しさ、Wallarm Cloudの到達性、および通知形式を確認します。

    これにより、`[Test message]`というプレフィックス付きのテスト通知が送信されます:

    ```
    [Test message] [Test partner] Network perimeter has changed

    Notification type: new_scope_object_ips

    New IP addresses were discovered in the network perimeter:
    8.8.8.8

    Client: TestCompany
    Cloud: EU
    ```

1. **Add integration**をクリックします。

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

### 例: 1分間に2件以上のSQLi hitsが検出された場合のSlack通知

保護対象リソースに2件以上のSQLi [hits](../../../glossary-en.md#hit)が送られた場合、このイベントに関する通知がSlackチャンネルに送信されます。

![Slackに通知を送信するトリガーの例](../../../images/user-guides/triggers/trigger-example1.png)

**トリガーをテストするには:**

保護対象リソースに以下のリクエストを送信します:

```bash
curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
curl 'http://localhost/?id=1%27%20select%20version();'
```
Slackチャンネルを開き、次のとおりユーザー**wallarm**からの通知が受信されていることを確認します:

```
[Wallarm] Trigger: The number of detected hits exceeded the threshold

Notification type: attacks_exceeded

The number of detected hits exceeded 1 in 1 minute.
This notification was triggered by the "Notification about SQLi hits" trigger.

Additional trigger’s clauses:
Attack type: SQLi.

View events:
https://my.wallarm.com/attacks?q=attacks&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Client: TestCompany
Cloud: EU
```

* `Notification about SQLi hits` はトリガー名です
* `TestCompany` はWallarm Consoleにおける貴社の会社アカウント名です
* `EU` は貴社の会社アカウントが登録されているWallarm Cloudです

### 例: アカウントに新規ユーザーが追加された場合のSlackおよびメール通知

Wallarm Consoleの会社アカウントに**Administrator**または**Analyst**ロールの新しいユーザーが追加されると、このイベントに関する通知がintegrationに指定したメールアドレスとSlackチャンネルに送信されます。

![Slackおよびメールで通知を送信するトリガーの例](../../../images/user-guides/triggers/trigger-example2.png)

**トリガーをテストするには:**

1. Wallarm Consoleで**Settings** → **Users**を開き、新しいユーザーを追加します。例:

    ![追加したユーザー](../../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. メールの受信トレイを開き、次のメッセージが受信されていることを確認します:

    ![新規ユーザー追加に関するメール](../../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slackチャンネルを開き、次のとおりユーザー**wallarm**からの通知が受信されていることを確認します:

    ```
    [Wallarm] Trigger: New user was added to the company account
    
    Notification type: create_user
    
    A new user John Smith <johnsmith@example.com> with the role Analyst was added to the company account by John Doe <johndoe@example.com>.
    This notification was triggered by the "Added user" trigger.

    Client: TestCompany
    Cloud: EU
    ```

    * `John Smith` と `johnsmith@example.com` は追加されたユーザーの情報です
    * `Analyst` は追加されたユーザーのロールです
    * `John Doe` と `johndoe@example.com` は新しいユーザーを追加したユーザーの情報です
    * `Added user` はトリガー名です
    * `TestCompany` はWallarm Consoleにおける貴社の会社アカウント名です
    * `EU` は貴社の会社アカウントが登録されているWallarm Cloudです

## integrationの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可およびintegrationパラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"