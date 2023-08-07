# Opsgenie

以下のイベントがトリガーされたときに、WallarmからOpsgenieへのアラートを設定できます：

--8<-- "../include/integrations/events-for-integrations.md"

## インテグレーションの設定

[Opsgenie UI](https://app.opsgenie.com/teams/list)で：

1. チームに移動して ➝ **インテグレーション**。
2. **インテグレーションの追加** ボタンをクリックし、**API** を選択します。
3. 新しいインテグレーションの名前を入力し、**インテグレーションを保存** をクリックします。
4. 提供されたAPIキーをコピーします。

Wallarm UIで：

1. **インテグレーション**セクションを開きます。
2. **Opsgenie** ブロックをクリックするか、**インテグレーションの追加** ボタンをクリックして **Opsgenie** を選択します。
3. インテグレーションの名前を入力します。
4. コピーしたAPIキーを **APIキー** フィールドに貼り付けます。
5. Opsgenieの[EUインスタンス](https://docs.opsgenie.com/docs/european-service-region)を使用している場合は、リストから適切なOpsgenie APIエンドポイントを選択します。デフォルトでは、USインスタンスのエンドポイントが設定されています。
6. 通知をトリガーするイベントタイプを選択します。イベントが選ばれない場合、通知は送信されません。
7. [インテグレーションをテスト](#testing-integration)し、設定が正しいことを確認します。
8. **インテグレーションの追加**をクリックします。

    ![!Opsgenieインテグレーション設定](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-basic-data.md"

Opsgenie通知のテスト：

![!Opsgenieメッセージのテスト](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.md"