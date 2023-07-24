# Opsgenie

次のイベントがトリガーされたときに、WallarmからOpsgenieへアラートを送信するように設定することができます：

--8<-- "../include/integrations/events-for-integrations.md"

## インテグレーションの設定

[Opsgenie UI](https://app.opsgenie.com/teams/list)で:

1. あなたのチーム ➝ **インテグレーション** に進みます。
2. **インテグレーションを追加** ボタンをクリックして、**API** を選択します。
3. 新しいインテグレーションの名前を入力し、**Save Integration** をクリックします。
4. 提供されたAPIキーをコピーします。

Wallarm UIで:

1. **Integrations** セクションを開きます。
2. **Opsgenie** ブロックをクリックするか、**Add integration** ボタンをクリックして、**Opsgenie** を選択します。
3. インテグレーションの名前を入力します。
4. コピーしたAPIキーを **API key** 欄に貼り付けます。
5. Opsgenieの[EU instance](https://docs.opsgenie.com/docs/european-service-region)を使用している場合、リストから該当するOpsgenie APIエンドポイントを選択します。デフォルトでは、USインスタンスエンドポイントが設定されています。
6. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
7. [インテグレーションをテスト](#testing-integration)して設定が正しいことを確認します。
8. **インテグレーションを追加** をクリックします。

    ![!Opsgenie integration](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-basic-data.md"

Opsgenie通知のテスト:

![!Test Opsgenie message](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.md"