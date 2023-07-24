[link-pagerduty-docs]: https://support.pagerduty.com/docs/services-and-integrations

#   PagerDuty

Wallarm を設定して、次のイベントがトリガーされたときに PagerDuty にインシデントを送信できます。

--8<-- "../include-ja/integrations/events-for-integrations.md"

##  インテグレーションの設定

PagerDuty UI で、既存のサービスに [インテグレーションを設定][link-pagerduty-docs] するか、Wallarm 用に新しいサービスを作成します。

1. **設定** → **サービス** に移動します。
2. 既存のサービスの設定を開くか、**新しいサービス** ボタンをクリックします。
3. 新しいインテグレーションを作成します：

    * 既存のサービスのインテグレーションを設定している場合は、**インテグレーション** タブに移動し、**新しいインテグレーション** ボタンをクリックします。
    * 新しいサービスを作成している場合は、サービス名を入力し、**インテグレーション設定** セクションに進みます。
4. インテグレーション名を入力し、**API を直接使用する** オプションをインテグレーションタイプとして選択します。
5. 設定を保存します：

    * 既存のサービスのインテグレーションを設定している場合は、**インテグレーションを追加** ボタンをクリックします。
    * 新しいサービスを作成している場合は、残りの設定セクションを設定し、**サービスを追加** ボタンをクリックします。

5. 提供された **Integration Key** をコピーします。

Wallarm UIで：

1. **インテグレーション** セクションを開きます。
2. **PagerDuty** ブロックをクリックするか、**インテグレーションを追加** ボタンをクリックして **PagerDuty** を選択します。
3. インテグレーション名を入力します。
4. **Integration Key** の値を適切なフィールドに貼り付けます。
5. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、PagerDuty インシデントは追加されません。
6. [インテグレーションをテスト](#testing-integration)して、設定が正しいことを確認してください。
7. **インテグレーションを追加** をクリックします。

    ![!PagerDuty integration](../../../images/user-guides/settings/integrations/add-pagerduty-integration.png)

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration.md"

PagerDuty 通知のテスト：

![!Test PagerDuty notification](../../../images/user-guides/settings/integrations/test-pagerduty-scope-changed.png)

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"