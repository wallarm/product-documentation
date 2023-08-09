[link-pagerduty-docs]: https://support.pagerduty.com/docs/services-and-integrations

# PagerDuty

以下のイベントがトリガーされたときに、WallarmからPagerDutyへのインシデント送信を設定することができます:

--8<-- "../include-ja/integrations/events-for-integrations.md"

##  インテグレーションの設定

PagerDuty UIで、既存のサービスに対して[Integrationを設定][link-pagerduty-docs]するか、あるいはWallarm専用の新しいサービスを作成します:

1. **Configuration** → **Services**へ進みます。
2. 既存のサービスの設定を開くか、**New Service**ボタンをクリックします。
3. 新しいIntegrationを作成します:

    *   既存のサービスのIntegrationを設定している場合は、**Integrations**タブを開き、**New Integration**ボタンをクリックします。
    *   新しいサービスを作成している場合は、サービス名を入力し、**Integration Settings**セクションに進みます。
4. Integration名を入力し、Integration typeとして**Use our API directly**オプションを選択します。
5. 設定を保存します:

    *   既存のサービスのIntegrationを設定している場合は、**Add Integration**ボタンをクリックします。
    *   新しいサービスを作成している場合は、設定セクションの残りを設定し、**Add Service**ボタンをクリックします。
    
5. 提供されている**Integration Key**をコピーします。

Wallarm UIで:

1. **Integrations**セクションを開きます。
2. **PagerDuty**ブロックをクリックするか、**Add integration**ボタンをクリックして**PagerDuty**を選択します。
3. Integration名を入力します。
4. 適切なフィールドに**Integration Key**値を貼り付けます。
5. 通知をトリガーするイベントタイプを選択します。イベントが選ばれていない場合、PagerDutyインシデントは追加されません。
6. [インテグレーションをテスト](#testing-integration)して、設定が正しいことを確認します。
7. **Add integration**をクリックします。

   ![PagerDuty integration](../../../images/user-guides/settings/integrations/add-pagerduty-integration.png)

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration-basic-data.md"

PagerDutyの通知をテストします:

![Test PagerDuty notification](../../../images/user-guides/settings/integrations/test-pagerduty-scope-changed.png)

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"