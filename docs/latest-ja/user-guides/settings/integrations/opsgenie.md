# Opsgenie

Wallarm を次のイベントがトリガーされたときに Opsgenie にアラートを送信するように設定できます:

--8<-- "../include-ja/integrations/events-for-integrations.md"

## インテグレーションの設定

[Opsgenie UI](https://app.opsgenie.com/teams/list)で:

1. あなたのチーム ➝ **Integrations** に進みます。
2. **Add integration** ボタンをクリックし、**API** を選択します。
3. 新しいインテグレーションに名前を入力し、**Save Integration** をクリックします。
4. 提供された API キーをコピーします。

Wallarm UIで:

1. **Integrations** セクションを開きます。
2. **Opsgenie** ブロックをクリックするか、**Add integration** ボタンをクリックして **Opsgenie** を選択します。
3. インテグレーションの名前を入力します。
4. コピーした API キーを **API key** フィールドに貼り付けます。
5. Opsgenie の[EU インスタンス](https://docs.opsgenie.com/docs/european-service-region) を使用している場合は、リストから適切な Opsgenie API エンドポイントを選択します。デフォルトでは、US インスタンスのエンドポイントが設定されています。
6. 通知をトリガするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
7. [インテグレーションをテスト](#testing-integration)し、設定が正しいことを確認してください。
8. **Add integration** をクリックします。

    ![!Opsgenie インテグレーション](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration.md"

Opsgenie 通知のテスト：

![!Test Opsgenie メッセージ](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"