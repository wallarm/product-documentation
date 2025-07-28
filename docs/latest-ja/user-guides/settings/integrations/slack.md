# Slack

[Slack](https://slack.com/) は幅広く使用されているクラウドベースのチーム共同作業およびメッセージングプラットフォームです．組織内のコミュニケーションと共同作業を促進するため，チームがメッセージを交換し，ファイルを共有し，その他のツールやサービスと統合するための集中管理スペースを提供します．Wallarmを使用してSlackチャンネルに通知を送信するよう設定できます．複数の異なるSlackチャンネルまたはアカウントに通知を送信する場合は，複数のSlack統合を作成してください．

## 統合のセットアップ

1. **Integrations**セクションを開きます．
2. **Slack**ブロックをクリックするか，**Add integration**ボタンをクリックして**Slack**を選びます．
3. 統合名を入力します．
4. [Webhook settings in Slack](https://my.slack.com/services/incoming-webhook/) を開き，メッセージを投稿するチャンネルを選択して新しいWebhookを追加します．
5. 指定されたWebhook URLをコピーし，Wallarm UI内の**Webhook URL**フィールドに貼り付けます．
6. 通知をトリガーするイベントタイプを選択します．

    ![Slack integration](../../../images/user-guides/settings/integrations/add-slack-integration.png)

    利用可能なイベントの詳細:
      
    --8<-- "../include/integrations/events-for-integrations.md"

7. **Test integration**をクリックして，設定の正確性，Wallarm Cloudの利用状況，および通知形式を確認します．

    これにより，プレフィックス `[Test message]` を付けたテスト通知が送信されます．

    ```
    [Test message] [Test partner] Network perimeter has changed

    Notification type: new_scope_object_ips

    New IP addresses were discovered in the network perimeter:
    8.8.8.8

    Client: TestCompany
    Cloud: EU
    ```

8. **Add integration**をクリックします．

## 追加アラートのセットアップ

--8<-- "../include/integrations/integrations-trigger-setup.md"

### 例: 1分間に2つ以上のSQLiヒットが検出された場合のSlack通知

保護対象リソースに対して2つ以上のSQLi[ヒット](../../../glossary-en.md#hit)が送信された場合，このイベントに関する通知がSlackチャンネルに送信されます．

![Example of a trigger sending the notification to Slack](../../../images/user-guides/triggers/trigger-example1.png)

**トリガーをテストするには:**

保護対象リソースに対して以下のリクエストを送信します．

```bash
curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
curl 'http://localhost/?id=1%27%20select%20version();'
```

Slackチャンネルを開き，ユーザー**wallarm**から以下の通知が受信されたことを確認します．

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

* 「Notification about SQLi hits」はトリガー名です．
* 「TestCompany」はWallarm Consoleでの会社アカウント名です．
* 「EU」は会社アカウントが登録されているWallarm Cloudです．

### 例: アカウントに新ユーザーが追加された場合のSlackおよびメール通知

Wallarm Consoleで会社アカウントに**Administrator**または**Analyst**ロールの新ユーザーが追加された場合，統合で指定されたメールアドレスおよびSlackチャンネルにこのイベントに関する通知が送信されます．

![Example of a trigger sending the notification to Slack and by email](../../../images/user-guides/triggers/trigger-example2.png)

**トリガーをテストするには:**

1. Wallarm Consoleの → **Settings** → **Users** を開き，新しいユーザーを追加します．例:

    ![Added user](../../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. メールの受信トレイを開き，以下のメッセージが受信されていることを確認します．

    ![Email about new user added](../../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slackチャンネルを開き，ユーザー**wallarm**から以下の通知が受信されていることを確認します．

    ```
    [Wallarm] Trigger: New user was added to the company account
    
    Notification type: create_user
    
    A new user John Smith <johnsmith@example.com> with the role Analyst was added to the company account by John Doe <johndoe@example.com>.
    This notification was triggered by the "Added user" trigger.

    Client: TestCompany
    Cloud: EU
    ```

    * 「John Smith」と「johnsmith@example.com」は追加されたユーザーの情報です．
    * 「Analyst」は追加されたユーザーのロールです．
    * 「John Doe」と「johndoe@example.com」は新ユーザーを追加したユーザーの情報です．
    * 「Added user」はトリガー名です．
    * 「TestCompany」はWallarm Consoleでの会社アカウント名です．
    * 「EU」は会社アカウントが登録されているWallarm Cloudです．

## 統合の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および統合パラメータの不正

--8<-- "../include/integrations/integration-not-working.md"